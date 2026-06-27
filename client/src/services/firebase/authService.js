import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig.js";

export const registerUser = async (name, email, password, role, schedule) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "users", user.uid), {
    name,
    email,
    role: role || "employee",
    schedule: schedule || { start: "09:00", end: "18:00" },
    createdAt: new Date(),
  });

  return user;
};

export const loginUser = async (email, password) => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
};

export const logoutUser = async () => {
  await signOut(auth);
};
