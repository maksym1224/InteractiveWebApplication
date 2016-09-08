import { List } from 'immutable';
import { TypedRecord, makeTypedFactory } from 'typed-immutable-record';

export interface PlaylistItem {
  note: string,
  gracenote: string,
  fromBeat: number,
  toBeat: number,
  hue: number
}

export interface PlaylistItemRecord extends TypedRecord<PlaylistItemRecord>, PlaylistItem {}
export const playlistItemFactory = makeTypedFactory<PlaylistItem, PlaylistItemRecord>({
  note: null,
  gracenote: null,
  fromBeat: 0,
  toBeat: 0,
  hue: 0
});