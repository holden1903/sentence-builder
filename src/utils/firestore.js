import { db } from "../firebase";
import { 
  doc, setDoc, getDoc, 
  collection, addDoc, getDocs, 
  updateDoc, deleteDoc, 
  query, orderBy 
} from "firebase/firestore";

// User score functions
export async function saveScore(uid, score) {
  await setDoc(doc(db, "users", uid), { score }, { merge: true });
}

export async function loadScore(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data().score : 0;
}

// History recording
export async function recordHistory(uid) {
  const colRef = collection(db, "users", uid, "history");
  await addDoc(colRef, { timestamp: Date.now() });
}

export async function fetchHistory(uid) {
  const colRef = collection(db, "users", uid, "history");
  const q = query(colRef, orderBy("timestamp", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Sentences CRUD
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
