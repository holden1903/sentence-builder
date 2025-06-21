import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

export default function AdminPanel() {
  const [sentences, setSentences] = useState([]);
  const [level, setLevel] = useState("A1");
  const [topic, setTopic] = useState("");
  const [words, setWords] = useState("");
  const [correct, setCorrect] = useState("");

  const fetchSentences = async () => {
    const snap = await getDocs(collection(db, "sentences"));
    setSentences(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { fetchSentences(); }, []);

  const handleAdd = async () => {
    if (!topic || !words || !correct) return;
    const wordArr = words.split(",").map(w => w.trim());
    await addDoc(collection(db, "sentences"), { level, topic, words: wordArr, correct });
    setTopic(""); setWords(""); setCorrect("");
    fetchSentences();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "sentences", id));
    fetchSentences();
  };

  const handleUpdate = async (id) => {
    const wordArr = words.split(",").map(w => w.trim());
    await updateDoc(doc(db, "sentences", id), { level, topic, words: wordArr, correct });
    setTopic(""); setWords(""); setCorrect("");
    fetchSentences();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Panel</h1>
      <div style={{ marginBottom: '1rem' }}>
        <select value={level} onChange={e => setLevel(e.target.value)}>
          {["A1","A2","B1","B2"].map(lv => <option key={lv}>{lv}</option>)}
        </select>
        <input placeholder="Topic" value={topic} onChange={e => setTopic(e.target.value)} style={{ marginLeft: '0.5rem' }}/>
        <input placeholder="Words (comma sep)" value={words} onChange={e => setWords(e.target.value)} style={{ marginLeft: '0.5rem' }}/>
        <input placeholder="Correct Sentence" value={correct} onChange={e => setCorrect(e.target.value)} style={{ marginLeft: '0.5rem' }}/>
        <button onClick={handleAdd} style={{ marginLeft: '0.5rem' }}>Add</button>
      </div>
      <table border="1" cellPadding="8">
        <thead>
          <tr><th>Level</th><th>Topic</th><th>Words</th><th>Correct</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {sentences.map(s => (
            <tr key={s.id}>
              <td>{s.level}</td>
              <td>{s.topic}</td>
              <td>{s.words.join(", ")}</td>
              <td>{s.correct}</td>
              <td>
                <button onClick={() => { setLevel(s.level); setTopic(s.topic); setWords(s.words.join(", ")); setCorrect(s.correct); }}>Edit</button>
                <button onClick={() => handleDelete(s.id)} style={{ marginLeft: '0.5rem' }}>Delete</button>
                <button onClick={() => handleUpdate(s.id)} style={{ marginLeft: '0.5rem' }}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
);
}
