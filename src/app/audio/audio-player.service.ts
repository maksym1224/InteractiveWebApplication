import { Injectable, Inject } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { AppState } from '../model/app-state.model';
import { Player } from '../model/player.model';
import { PlayerState } from '../model/player-state.model';
import { PULSE } from '../core/actions';
import { SamplesService, Sample } from './samples.service';

const GRACENOTE_OFFSET = 0.07;

@Injectable()
export class AudioPlayerService {
  private subscription: Subscription;
  private compressor: DynamicsCompressorNode;
  private convolver: ConvolverNode;
  private convolverDry: GainNode;
  private convolverWet: GainNode;
  private playerPipelines = new Map<string, {gain: GainNode, pan: StereoPannerNode}>();

  @Effect({dispatch: false}) play$ = this.actions$
    .ofType(PULSE)
    .withLatestFrom(this.store$)
    .filter(([action, state]) => state.playing)
    .do(([action, state]) => this.playState(state, action.payload));

  constructor(private actions$: Actions,
              private store$: Store<AppState>,
              private samples: SamplesService,
              @Inject('audioCtx') private audioCtx: AudioContext) {
    this.compressor = audioCtx.createDynamicsCompressor();
    this.convolver = audioCtx.createConvolver();
    this.convolverDry = audioCtx.createGain();
    this.convolverWet = audioCtx.createGain();
    this.convolverDry.gain.value = 0.8;
    this.convolverWet.gain.value = 0.2;

    this.compressor.connect(this.convolverDry);
    this.compressor.connect(this.convolver);
    this.convolver.connect(this.convolverWet);
    this.convolverDry.connect(audioCtx.destination);
    this.convolverWet.connect(audioCtx.destination);

    samples.samplesLoaded.then(() => {
      this.convolver.buffer = samples.getSampleBuffer('convolution');
    });
  }
  enableAudioContext() {
    const buffer = this.audioCtx.createBuffer(1, 1, 44100);
    const bufferSource = this.audioCtx.createBufferSource();
    bufferSource.buffer = buffer;
    bufferSource.connect(this.audioCtx.destination);
    bufferSource.start();
  }

  private playState(state: AppState, {time, bpm}: {time: number, bpm: number}) {
    this.playBeat(time, bpm);
    state.nowPlaying.forEach(({instrument, note, attackAt, releaseAt, fromPlayer}) => {
      const sample = this.samples.getNoteSample(instrument, note.note, note.velocity);
      const pipelineNode = this.getPlayerPipeline(instrument, fromPlayer.gain, fromPlayer.pan);
      this.playSample(sample, attackAt, releaseAt, pipelineNode);
    });
  }

  private playBeat(time: number, bpm: number) {
    const duration = 0.15;
    const maxGain = 0.05;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.frequency.value = 440 * Math.pow(2, 3/12);

    osc.connect(gain);
    this.connect(gain)

    osc.start(time);
    osc.stop(time + duration);

    gain.gain.setValueAtTime(maxGain, time);
    gain.gain.linearRampToValueAtTime(0, time + duration);
  }

  private playSample(sample: Sample, attackAt: number, releaseAt: number, next: AudioNode) {
    if (!sample) {
      return;
    }
    const src = this.audioCtx.createBufferSource();
    const gain = this.audioCtx.createGain();

    src.buffer = sample.buffer;
    gain.gain.value = 1;
    gain.gain.setValueAtTime(0, attackAt);
    gain.gain.linearRampToValueAtTime(1, attackAt + 0.003);
    gain.gain.setTargetAtTime(0, releaseAt, 0.3);

    src.connect(gain);
    gain.connect(next);

    src.start(attackAt, sample.startPosition);
    src.stop(attackAt + (sample.endPosition - sample.startPosition));
  }

  private connect(node: AudioNode) {
    node.connect(this.compressor);
  }

  private getPlayerPipeline(instrument: string, gainVal: number, panVal: number) {
    if (!this.playerPipelines.has(instrument)) {
      const gain = this.audioCtx.createGain();
      const pan = this.audioCtx.createStereoPanner();
      gain.gain.value = gainVal;
      pan.pan.value = panVal;
      gain.connect(pan);
      this.connect(pan);
      this.playerPipelines.set(instrument, {gain, pan});
      return gain;
    } else {
      return this.playerPipelines.get(instrument).gain;
    }
  }

}