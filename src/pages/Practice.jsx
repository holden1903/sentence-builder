import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";

const sentenceSets = {
  "Daily Routine (Present Simple)": {
    words: ["I", "wake", "up", "at", "7", "a.m."],
    correct: "I wake up at 7 a.m.",
    translation: "Ben saat 7'de uyanırım."
  }
};

export default function Practice() {
  const { words, correct, translation } = sentenceSets["Daily Routine (Present Simple)"];
  const correctWords = correct.split(" ");
  const [available, setAvailable] = useState([...words]);
  const [sentence, setSentence] = useState([]);
  const [status, setStatus] = useState(Array(correctWords.length).fill(null));
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(() => parseInt(localStorage.getItem("score")) || 0);

  useEffect(() => {
    localStorage.setItem("score", score);
  }, [score]);

  function addWord(word) {
    if (sentence.length < correctWords.length && available.includes(word)) {
      const newSent = [...sentence, word];
      setSentence(newSent);
      setAvailable(prev => prev.filter(w => w !== word));
      validate(newSent);
    }
  }

  function validate(arr) {
    const st = arr.map((w, i) => w === correctWords[i]);
    setStatus([...st, ...Array(correctWords.length - st.length).fill(null)]);
    if (arr.join(" ") === correct) {
      setFeedback("✅ Correct! Great Job!");
      setScore(prev => prev + 10);
      confetti({ particleCount: 80, spread: 50 });
    } else if (arr.length === correctWords.length) {
      setFeedback("❌ Try again.");
    } else {
      setFeedback("");
    }
  }

  function reset() {
    setSentence([]);
    setAvailable([...words]);
    setStatus(Array(correctWords.length).fill(null));
    setFeedback("");
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '1rem' }}>Build the Sentence</h1>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <strong>Score:</strong> {score}
      </div>
      <ol style={{ listStyle: 'decimal inside', marginBottom: '1rem' }}>
        <li>Click words to fill the blanks</li>
        <li>Blanks numbered left to right</li>
        <li>Click Reset or Check below</li>
      </ol>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <h2>Word Bank</h2>
          <div style={{ padding: '1rem', background: '#fff', border: '2px dashed #D1D5DB', borderRadius: '0.375rem', minHeight: '200px' }}>
            {available.map((w, i) => (
              <div key={i} onClick={() => addWord(w)} style={{
                display: 'inline-block', margin: '0.25rem', padding: '0.5rem 0.75rem',
                background: '#DBEAFE', border: '1px solid #BFDBFE', borderRadius: '0.375rem',
                cursor: 'pointer'
              }}>
                {w}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2>Sentence</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.5rem', padding: '1rem', background: '#fff', borderRadius: '0.375rem' }}>
            {status.map((st, i) => {
              const display = sentence[i] || i+1;
              const base = { height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #D1D5DB', borderRadius: '0.375rem' };
              const style = st === true ? { ...base, background: '#DCFCE7', borderColor: '#34D399' } : st === false ? { ...base, background: '#FEE2E2', borderColor: '#FECACA' } : base;
              const icon = st === true ? ' ✔️' : st === false ? ' ❌' : '';
              return <div key={i} style={style}>{display}{icon}</div>;
            })}
          </div>
          <div style={{ textAlign: 'center', margin: '1rem 0' }}>
            <button onClick={() => validate(sentence)} style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}>Check</button>
            <button onClick={reset} style={{ padding: '0.5rem 1rem', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}>Reset</button>
          </div>
          {feedback && <p style={{ textAlign: 'center', marginTop: '1rem' }}>{feedback}</p>}
        </div>
      </div>
      {feedback === "✅ Correct! Great Job!" && <p style={{ textAlign: 'center', color: '#10B981', marginTop: '1rem' }}>{translation}</p>}
    </div>
  );
}