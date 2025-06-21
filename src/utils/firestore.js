import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function saveScore(uid, score) {
  await setDoc(doc(db, "users", uid), { score }, { merge: true });
}

export async function loadScore(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data().score : 0;
}


// Sentences CRUD
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export async function fetchSentencesList() {
  const snap = await getDocs(collection(db, "sentences"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function createSentence(sentence) {
  return await addDoc(collection(db, "sentences"), sentence);
}

export async function updateSentence(id, data) {
  await updateDoc(doc(db, "sentences", id), data);
}

export async function deleteSentenceById(id) {
  await deleteDoc(doc(db, "sentences", id));
}
