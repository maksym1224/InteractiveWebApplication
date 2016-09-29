import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { Store } from '@ngrx/store'; 

import { AppState } from '../model/app-state.model';
import { PlayerState } from '../model/player-state.model';
import { PlayerStats } from '../model/player-stats.model';
import { ADVANCE } from '../core/actions';

@Component({
  selector: 'in-c-player',
  template: `
    <div class="progress-controls">
      <in-c-progress-circle [progress]="playerState.progress" [hue]="playerState.playlist?.fromModule.hue">
      </in-c-progress-circle>
      <in-c-advance-button [playerState]="playerState"
                           [playerStats]="playerStats"
                           (advance)="advance.next()">
      </in-c-advance-button>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
    }
    .progress-controls {
      flex: 1;
      position: relative;
    }
    in-c-progress-circle, in-c-advance-button {
      position: absolute;
      left: 50%;
      top: 50%;
    }
    in-c-progress-circle {
      margin-left: -50px;
      margin-top: -50px;
    }
    in-c-advance-button {
      margin-left: -27px;
      margin-top: -27px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerComponent {
  @Input() playerState: PlayerState;
  @Input() playerStats: PlayerStats;
  @Output() advance = new EventEmitter();
}
