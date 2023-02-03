export interface Song {
  // audioFileUrl: string;
  // artworkUrl: string;
  name: string;
  tokenAddress: string;
  tokenId: string;
  artist?: string;
  bpm?: string;
  key?: string;
  // type?: string;
  // format?: "audio" | "video";
  // tokenUri?: string;
}

export interface SongDoc extends Song {
  id: string;
  idx: number;
}
