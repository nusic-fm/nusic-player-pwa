import {
  collection,
  doc,
  documentId,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import { NftTokenDoc, NftToken } from "../../models/NftCollection";
import { db } from "../firebase.service";

const DB_NAME = "tokens";

const getTokensLength = async (): Promise<number> => {
  const col = collection(db, DB_NAME);
  const snapshot = await getCountFromServer(col);
  console.log("count: ", snapshot.data().count);
  return snapshot.data().count;
};

const getNftCollectionsToken = async (): Promise<NftTokenDoc[]> => {
  const q = query(collection(db, DB_NAME), limit(10));
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
  const d = doc(db, DB_NAME, id);
  const snap = await getDoc(d);
  const token = snap.data() as NftToken;
  return {
    ...token,
    id: snap.id,
  };
};

const getNftRecommendedTokens = async () => {
  const q = query(
    collection(db, DB_NAME),
    where(documentId(), "in", [
      "0x00ce2bdcea2dfbf66b082ad2119e893d407fb567-1",
      "0x01ab7d30525e4f3010af27a003180463a6c811a6-1020847100762815390390123822295304634400",
      "0x01b3892660a844ca9f8606a149787fd394d4094d-0",
      "0x09d6e0f30cfdf2f62c1179516b1f980c5d96571e-14",
      "0x03b821f51add4234e50ca60e527850ec33f17192-23",
      "0x0403fa561ec9fd1847992d859cc81c165500b890-1",
      "0x042ded29a884f488d2d45e6e67a36ae15ddb17a6-34",
      "0x0e809fb748abd5b48fcf4b7327a20fafe2b54681-5",
      "0x04ce96504b124822957bc2cba6d9c9e1824683d5-11",
      "0x068aacdcdb3b30060f194f7532d40db5e78a91f8-4",
    ])
  );
  const nftsSnap = await getDocs(q);
  const docs = nftsSnap.docs.map((d) => {
    const token = d.data() as NftToken;
    return {
      ...token,
      id: d.id,
    } as NftTokenDoc;
  });
  return docs;
};

export {
  getNftCollectionsToken,
  getNftCollectionToken,
  getTokensLength,
  getNftRecommendedTokens,
};
