import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  increment,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { Playlist, PlayListSong } from "../../models/Playlist";
import { db } from "../firebase.service";

const getPlaylist = async (id: string): Promise<Playlist | null> => {
  const d = doc(db, "playlists", id);
  const snapshot = await getDoc(d);
  if (snapshot.exists()) {
    return { ...snapshot.data(), id: snapshot.id } as Playlist;
  }
  return null;
};

const savePlaylist = async (
  account: string,
  playlistSongs: PlayListSong[],
  name: string
): Promise<void> => {
  const d = doc(db, "playlists", account);
  const ss = await getDoc(d);
  if (ss.exists()) {
    await updateDoc(d, { songs: arrayUnion(...playlistSongs), name });
  } else {
    await setDoc(d, { songs: arrayUnion(...playlistSongs), name });
  }
};

const changePlaylistName = async (
  account: string,
  name: string
): Promise<void> => {
  const d = doc(db, "playlists", account);
  const ss = await getDoc(d);
  if (ss.exists()) {
    await updateDoc(d, { name });
  } else {
    await setDoc(d, { name });
  }
};
const addToPlaylistDb = async (
  account: string,
  playlistSong: PlayListSong
): Promise<void> => {
  const d = doc(db, "playlists", account);
  const ss = await getDoc(d);
  if (ss.exists()) {
    await updateDoc(d, { songs: arrayUnion(playlistSong) });
  } else {
    await setDoc(d, { songs: arrayUnion(playlistSong) });
  }
};

const removeToPlaylistDb = async (
  account: string,
  playlistSong: PlayListSong
): Promise<void> => {
  const d = doc(db, "playlists", account);
  const ss = await getDoc(d);
  if (ss.exists()) {
    await updateDoc(d, { songs: arrayRemove(playlistSong) });
  } else {
  }
};

const addLikeDb = async (playlistAddress: string, userAddress: string) => {
  const d = doc(db, "playlists", playlistAddress);
  await updateDoc(d, {
    totalLikes: increment(1),
    likedUsers: arrayUnion(userAddress),
  });
};

export {
  getPlaylist,
  savePlaylist,
  addToPlaylistDb,
  changePlaylistName,
  addLikeDb,
  removeToPlaylistDb,
};
