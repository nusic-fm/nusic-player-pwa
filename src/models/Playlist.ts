export interface PlayListSong {
  songId: string;
}
export interface Playlist {
  id: string;
  songs: PlayListSong[];
  name: string;
  likedUsers?: string[];
  totalLikes?: number;
}
