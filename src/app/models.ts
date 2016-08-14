import { List } from 'immutable';
import { TypedRecord, makeTypedFactory } from 'typed-immutable-record';

export interface AppState {
  score: List<ModuleRecord>,
  beat: number;
  players: List<PlayerStateRecord>
}

export interface Module {
  number: number,
  score: List<NoteRecord>
}

export interface Note {
  note?: string,
  duration: number,
  gracenote?: string
}

export interface PlayerState {
  moduleIndex?: number;
  moduleRepeat?: number;
  playlist?: PlaylistRecord,
  nowPlaying?: List<PlaylistItemRecord>
}

export interface Playlist {
  items: List<PlaylistItemRecord>,
  lastBeat: number
}

export interface PlaylistItem {
  note: string,
  attackAt: number,
  releaseAt: number
}


export interface ModuleRecord extends TypedRecord<ModuleRecord>, Module {}
export const moduleFactory = makeTypedFactory<Module, ModuleRecord>({
  number: -1,
  score: <List<NoteRecord>>List.of()
});

export interface NoteRecord extends TypedRecord<NoteRecord>, Note {}
export const noteFactory = makeTypedFactory<Note, NoteRecord>({
  note: null,
  duration: 1,
  gracenote: null
});

export interface PlaylistRecord extends TypedRecord<PlaylistRecord>, Playlist {}
export const playlistFactory = makeTypedFactory<Playlist, PlaylistRecord>({
  items: <List<PlaylistItemRecord>>List.of(),
  lastBeat: 0
});

export interface PlaylistItemRecord extends TypedRecord<PlaylistItemRecord>, PlaylistItem {}
export const playlistItemFactory = makeTypedFactory<PlaylistItem, PlaylistItemRecord>({
  note: null,
  attackAt: 0,
  releaseAt: 0
});

export interface PlayerStateRecord extends TypedRecord<PlayerStateRecord>, PlayerState {}
export const playerStateFactory = makeTypedFactory<PlayerState, PlayerStateRecord>({
  moduleIndex: null,
  moduleRepeat: null,
  playlist: null,
  nowPlaying: <List<PlaylistItemRecord>>List.of()
});

export interface AppStateRecord extends TypedRecord<AppStateRecord>, AppState {}
export const appStateFactory = makeTypedFactory<AppState, AppStateRecord>({
  score: null,
  beat: -1,
  players: null
});
