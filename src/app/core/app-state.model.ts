import { List } from 'immutable';
import { TypedRecord, makeTypedFactory } from 'typed-immutable-record';

import { ModuleRecord } from './module.model';
import { PlayerStateRecord } from './player-state.model';
import { PlayerStatsRecord } from './player-stats.model';

export interface AppState {
  score: List<ModuleRecord>,
  beat: number;
  players: List<PlayerStateRecord>,
  stats: PlayerStatsRecord
}

export interface AppStateRecord extends TypedRecord<AppStateRecord>, AppState {}
export const appStateFactory = makeTypedFactory<AppState, AppStateRecord>({
  score: null,
  beat: -1,
  players: null,
  stats: null
});

