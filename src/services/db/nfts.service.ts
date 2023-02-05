import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
} from "firebase/firestore";
import {
  NftCollectionDoc,
  NftCollection,
  NftTokenDoc,
} from "../../models/NftCollection";
import { db } from "../firebase.service";

const getNftCollections = async (): Promise<NftCollectionDoc[]> => {
  const q = query(collection(db, "nfts"), limit(10));
  const nftsSnap = await getDocs(q);
  const nftCollections = nftsSnap.docs.map(
    (doc) =>
      ({ ...(doc.data() as NftCollection), id: doc.id } as NftCollectionDoc)
  );

  return nftCollections;
};

const getNftCollectionsToken = async (): Promise<NftTokenDoc[]> => {
  const q = query(collection(db, "nfts"), limit(10));
  const nftsSnap = await getDocs(q);
  const docIds = nftsSnap.docs.map((doc) => doc.id);
  const docs = await Promise.all(
    docIds.map((docId) => {
      const collectionSnap = query(
        collection(db, "nfts", docId, "tokens"),
        limit(1)
      );
      return getDocs(collectionSnap);
    })
  );
  const nftCollectionItems = docs
    .map((d) => d.docs[0])
    .map((d) => ({ ...d.data(), id: d.id } as NftTokenDoc));

  return nftCollectionItems;
};

const getNftCollectionToken = async (
  address: string,
  tokenId: string
): Promise<NftTokenDoc> => {
  const d = doc(db, "nfts", address, "tokens", tokenId);
  const snap = await getDoc(d);
  return { ...snap.data(), id: snap.id } as NftTokenDoc;
};

export { getNftCollections, getNftCollectionsToken, getNftCollectionToken };
