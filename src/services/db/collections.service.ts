import {
  collection,
  getCountFromServer,
  getDocs,
  limit,
  query,
} from "firebase/firestore";
import { NftCollectionDoc, NftCollection } from "../../models/NftCollection";
import { db } from "../firebase.service";

const DB_NAME = "collections";

const getCollectionsLength = async (): Promise<number> => {
  const col = collection(db, DB_NAME);
  const snapshot = await getCountFromServer(col);
  console.log("count: ", snapshot.data().count);
  return snapshot.data().count;
};

const getNftCollections = async (): Promise<NftCollectionDoc[]> => {
  const q = query(collection(db, DB_NAME), limit(10));
  const nftsSnap = await getDocs(q);
  const nftCollections = nftsSnap.docs.map(
    (doc) =>
      ({ ...(doc.data() as NftCollection), id: doc.id } as NftCollectionDoc)
  );

  return nftCollections;
};

export { getCollectionsLength, getNftCollections };
