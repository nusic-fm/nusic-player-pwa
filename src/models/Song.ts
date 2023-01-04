import { ReactJkMusicPlayerAudioListProps } from "react-jinke-music-player";

export interface Song {
  audioFileUrl: string;
  artworkUrl: string;
  name: string;
  address: string;
  tokenId: string;
  type?: string;
  format?: "audio" | "video";
  tokenUri?: string;
}

export interface SongDoc extends Song {
  id: string;
  idx?: number;
}

export interface PlayerSong extends ReactJkMusicPlayerAudioListProps {
  id: string;
  idx: number;
}
