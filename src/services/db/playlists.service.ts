import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { Playlist, PlayListSong } from "../../models/Playlist";
import { SongDoc, Song } from "../../models/Song";
import { db } from "../firebase.service";

const getTopPlaylists = async (): Promise<Playlist[]> => {
  const q = query(
    collection(db, "playlists"),
    // where("totalLikes", ">", 0),
    orderBy("totalLikes", "desc"),
    limit(5)
  );
  const querySnapshots = await getDocs(q);
  const playlists: Playlist[] = [];
  querySnapshots.forEach((doc) => {
    playlists.push({ ...(doc.data() as Playlist), id: doc.id });
  });
  return playlists;
};

const getPlaylist = async (id: string): Promise<Playlist | null> => {
  const d = doc(db, "playlists", id);
  const snapshot = await getDoc(d);
  if (snapshot.exists()) {
    return { ...snapshot.data(), id: snapshot.id } as Playlist;
  }
  return null;
};

const createPlaylistDb = async (
  name: string,
  userId: string,
  playlistSong: PlayListSong
): Promise<string> => {
  const c = collection(db, "playlists");
  const ss = await addDoc(c, { name, songs: arrayUnion(playlistSong), userId });
  return ss.id;
};

const saveToPlaylistDb = async (
  id: string,
  playlistSongs: PlayListSong[]
): Promise<void> => {
  const d = doc(db, "playlists", id);
  const ss = await getDoc(d);
  if (ss.exists()) {
    await updateDoc(d, { songs: arrayUnion(...playlistSongs) });
  } else {
    alert("Playlist doesn't exists");
    // await setDoc(d, { songs: arrayUnion(...playlistSongs), name });
  }
};

const changePlaylistName = async (id: string, name: string): Promise<void> => {
  const d = doc(db, "playlists", id);
  const ss = await getDoc(d);
  if (ss.exists()) {
    await updateDoc(d, { name });
  } else {
    alert("Playlist doesn't exists");
    // await setDoc(d, { name });
  }
};

const removeToPlaylistDb = async (
  id: string,
  playlistSong: PlayListSong
): Promise<void> => {
  const d = doc(db, "playlists", id);
  const ss = await getDoc(d);
  if (ss.exists()) {
    await updateDoc(d, { songs: arrayRemove(playlistSong) });
  } else {
    alert("Playlist doesn't exists");
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
  getTopPlaylists,
  getPlaylist,
  saveToPlaylistDb,
  createPlaylistDb,
  changePlaylistName,
  addLikeDb,
  removeToPlaylistDb,
};
