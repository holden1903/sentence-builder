import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";

const sentenceSets = {
  "Daily Routine (Present Simple)": {
    words: ["I", "wake", "up", "at", "7", "a.m."],
    correct: "I wake up at 7 a.m.",
    translation: "Ben saat 7'de uyanırım."
  }
};

function DraggableWord({ word, onClick }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: word });
  const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : {};
  return (
    <div
      ref={setNodeRef}
      style={{ ...style, backgroundColor: '#DBEAFE', border: '1px solid #BFDBFE', borderRadius: '0.375rem', padding: '0.5rem 0.75rem', margin: '0.25rem', cursor: 'pointer', textAlign: 'center' }}
      {...listeners}
      {...attributes}
      onClick={() => onClick(word)}
    >
      {word}
    </div>
  );
}

function DropGrid({ sentence, statusArray }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '0.5rem', padding: '1rem', backgroundColor: 'white', borderRadius: '0.375rem', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
      {statusArray.map((st, idx) => {
        const word = sentence[idx] || "";
        const baseStyle = { height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #D1D5DB', borderRadius: '0.375rem', fontSize: '1rem' };
        const style = st === true
          ? { ...baseStyle, backgroundColor: '#DCFCE7', borderColor: '#34D399' }
          : st === false
          ? { ...baseStyle, backgroundColor: '#FEE2E2', borderColor: '#FECACA' }
          : baseStyle;
        const icon = st === true ? ' ✔️' : st === false ? ' ❌' : '';
        return (
          <div key={idx} style={style}>
            {word}{icon}
          </div>
        );
      })}
    </div>
);
}

export default function Builder() {
  const topic = Object.keys(sentenceSets)[0];
  const { words: initialWords, correct, translation } = sentenceSets[topic];
  const correctWords = correct.split(" ");

  const [availableWords, setAvailableWords] = useState([...initialWords]);
  const [sentence, setSentence] = useState([]);
  const [statusArray, setStatusArray] = useState(Array(correctWords.length).fill(null));
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(() => parseInt(localStorage.getItem("score")) || 0);

  useEffect(() => { localStorage.setItem("score", score); }, [score]);

  function addWord(word) {
    if (sentence.length < correctWords.length && availableWords.includes(word)) {
      const newSentence = [...sentence, word];
      setSentence(newSentence);
      setAvailableWords(prev => prev.filter(w => w !== word));
      validateLive(newSentence);
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (over && over.id === "dropzone") {
      addWord(active.id);
    }
  }

  function validateLive(arr) {
    const st = arr.map((w, i) => w === correctWords[i]);
    setStatusArray([...st, ...Array(correctWords.length - st.length).fill(null)]);
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

  function resetAll() {
    setSentence([]);
    setAvailableWords([...initialWords]);
    setStatusArray(Array(correctWords.length).fill(null));
    setFeedback("");
  }

  return (
    <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '1.5rem', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <img src="/logo.svg" alt="Logo" style={{ height: '2rem' }} />
        <div style={{ fontSize: '0.875rem', color: '#4B5563' }}>
          🎯 Score: <span style={{ fontWeight: 'bold', color: '#10B981' }}>{score}</span>
        </div>
      </div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem' }}>Build the Sentence</h1>
      <ol style={{ listStyle: 'decimal inside', textAlign: 'center', marginBottom: '1.5rem', fontSize: '1rem' }}>
        <li>Click or drag words to fill the boxes</li>
        <li>Words appear in numbered boxes</li>
        <li>Check or Reset your sentence</li>
      </ol>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1rem' }}>
        <div style={{ gridColumn: 'span 3', backgroundColor: '#F9FAFB', padding: '1rem', borderRadius: '0.375rem' }}>
          <h2 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Instructions</h2>
          <ul style={{ listStyle: 'disc inside', fontSize: '0.875rem' }}>
            <li>Click or drag words</li>
            <li>Fill the empty boxes</li>
            <li>Press Reset or Check</li>
          </ul>
        </div>

        <div style={{ gridColumn: 'span 6', backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '0.375rem' }}>
          <DropGrid sentence={sentence} statusArray={statusArray} />
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
            <button onClick={() => validateLive(sentence)} style={{ backgroundColor: '#2563EB', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer' }}>
              Check Sentence
            </button>
            <button onClick={resetAll} style={{ backgroundColor: '#DC2626', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer' }}>
              Reset
            </button>
          </div>
          {feedback && <p style={{ textAlign: 'center', fontSize: '1.125rem', fontWeight: '600', marginTop: '1rem' }}>{feedback}</p>}
        </div>

        <div style={{ gridColumn: 'span 3', backgroundColor: '#F9FAFB', padding: '1rem', borderRadius: '0.375rem' }}>
          <h2 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Word Bank</h2>
          <div id="dropzone" style={{ padding: '0.5rem', backgroundColor: 'white', border: '2px dashed #D1D5DB', borderRadius: '0.375rem', minHeight: '10rem' }}>
            <DndContext onDragEnd={handleDragEnd}>
              {availableWords.map((w, i) => (
                <DraggableWord key={i} word={w} onClick={addWord} />
              ))}
            </DndContext>
          </div>
        </div>
      </div>

      {feedback === "✅ Correct! Great Job!" && (
        <p style={{ textAlign: 'center', color: '#10B981', fontSize: '1rem', marginTop: '1.5rem' }}>{translation}</p>
      )}
    </div>
);