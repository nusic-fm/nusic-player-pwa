import { doc, getDoc, updateDoc } from "firebase/firestore";
import { UserDoc } from "../../models/User";
import { db } from "../firebase.service";

const DB_NAME = "users";

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

export { getUserDoc, updateUserProfile };
