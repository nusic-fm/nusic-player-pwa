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
  NftToken,
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
  const q = query(collection(db, "tokens"), limit(10));
  const nftsSnap = await getDocs(q);
  const docs = nftsSnap.docs.map((d) => {
    const token = d.data() as NftToken;
    return {
      ...token,
      id: d.id,
    } as NftTokenDoc;
  });
  // const docs = await Promise.all(
  //   docIds.map((docId) => {
  //     const collectionSnap = query(
  //       collection(db, "nfts", docId, "tokens"),
  //       limit(1)
  //     );
  //     return getDocs(collectionSnap);
  //   })
  // );
  // const nftCollectionItems = docs
  //   .map((d) => d.docs[0])
  //   .map((d) => ({ ...d.data(), id: d.id } as NftTokenDoc));

  return docs;
};

const getNftCollectionToken = async (
  address: string,
  tokenId: string
): Promise<NftTokenDoc> => {
  const id = `${address}-${tokenId}`;
  const d = doc(db, "tokens", id);
  const snap = await getDoc(d);
  const token = snap.data() as NftToken;
  return {
    ...token,
    id: snap.id,
  };
};

export { getNftCollections, getNftCollectionsToken, getNftCollectionToken };
