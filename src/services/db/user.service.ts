import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { Playlist } from "../../models/Playlist";
import { UserDoc } from "../../models/User";
import { db } from "../firebase.service";

const DB_NAME = "users";
const PLAYLIST_SUB_COLLECTION = "playlists";

const getUserDoc = async (id: string): Promise<UserDoc> => {
  const d = doc(db, DB_NAME, id);
  const ss = await getDoc(d);
  const userDoc = { ...ss.data(), id: ss.id } as UserDoc;
  return userDoc;
};

const updateUserProfile = async (id: string, profileObj: any) => {
  const d = doc(db, DB_NAME, id);
  await updateDoc(d, profileObj);
};

const getUserPlaylists = async (id: string): Promise<Playlist[]> => {
  const d = doc(db, DB_NAME, id);
  const docRef = await getDoc(d);
  if (docRef.exists()) {
    const q = query(collection(db, DB_NAME, id, "playlists"), limit(10));
    const docsRef = await getDocs(q);
    if (docsRef.empty) return [];
    const userPlaylists = docsRef.docs.map((doc) => ({
      ...(doc.data() as Playlist),
      id: doc.id,
    }));
    return userPlaylists;
  }
  return [];
};

const addToUserPlaylist = async (
  uid: string,
  playlistId: string,
  songObj: any
) => {
  const d = doc(db, DB_NAME, uid, PLAYLIST_SUB_COLLECTION, playlistId);
  await setDoc(d, songObj);
};

export { getUserDoc, updateUserProfile, getUserPlaylists, addToUserPlaylist };
