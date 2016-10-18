import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { PlayerState, canPlayerAdvance, isPlayerPlayingLast } from '../../model/player-state.model';
import { PlayerStats } from '../../model/player-stats.model';

@Component({
  selector: 'in-c-advance-button',
  template: require('./advance-button.component.html'),
  styles: [require('./advance-button.component.css')],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdvanceButtonComponent {
  @Input() playerState: PlayerState;
  @Input() playerStats: PlayerStats;
  @Output() advance = new EventEmitter();

  getState(): 'notStarted' | 'playing' | 'playingLast' {
    if (isPlayerPlayingLast(this.playerState)) {
      return 'playingLast';
    } else if (this.playerState.moduleIndex >= 0) {
      return 'playing';
    } else {
      return 'notStarted';
    }
  }

  canPlayerAdvance() {
    return canPlayerAdvance(this.playerState, this.playerStats);
  }

}