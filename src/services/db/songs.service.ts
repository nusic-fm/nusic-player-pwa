import {
  collection,
  query,
  getDocs,
  limit,
  where,
  documentId,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { Song, SongDoc } from "../../models/Song";
import { db } from "../firebase.service";

const getSongs = async (): Promise<SongDoc[]> => {
  const q = query(
    collection(db, "songs"),
    where("type", "==", "general"),
    // orderBy("audioFileUrl", "asc"),
    limit(10)
  );
  const querySnapshots = await getDocs(q);
  const songs: SongDoc[] = [];
  querySnapshots.forEach((doc) => {
    songs.push({ ...(doc.data() as Song), id: doc.id });
  });
  const sortArray = [
    "mmmCherry - Wildest Dreams (NUSIC Intro V1)",
    "GYU: PREQUEL",
    "Push Me Too Far",
    "Ether (ft. MNDR)",
    "Slickmau5 by deadmau5 x OG Slick",
    "Ultraviolet Vinyl Collection by 3LAU",
    "Don Diablo",
    `Spottie WiFi x Bun B: "All Time High"`,
    "Golden Ticket: Bandit",
    "Crypto Boy",
  ];
  return songs.sort(
    (a, b) => sortArray.indexOf(a.name) - sortArray.indexOf(b.name)
  );
};

const getSongsByIds = async (songIds: string[]): Promise<SongDoc[]> => {
  const q = query(
    collection(db, "songs"),
    where(documentId(), "in", songIds)
    // orderBy("audioFileUrl", "asc"),
    // limit(15)
  );
  const querySnapshots = await getDocs(q);
  const songs: SongDoc[] = [];
  querySnapshots.forEach((doc) => {
    songs.push({ ...(doc.data() as Song), id: doc.id });
  });
  return songs.sort((a, b) => songIds.indexOf(a.id) - songIds.indexOf(b.id));
};

const addSongToDb = async (song: Song) => {
  const songId = `${song.address}-${song.tokenId}`;
  const d = doc(db, "songs", songId);
  const ss = await getDoc(d);
  if (ss.exists()) {
  } else {
    await setDoc(d, {
      ...song,
    });
  }
};

const incrementStreamCount = async (songId: string) => {
  const d = doc(db, "songs", songId);
  const ss = await getDoc(d);
  if (ss.exists()) {
    updateDoc(d, { streams: increment(1) });
  }
};

export { getSongs, getSongsByIds, addSongToDb, incrementStreamCount };
