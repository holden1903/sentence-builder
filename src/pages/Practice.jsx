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

function DraggableWord({ word, onAdd }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: word });
  const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : {};
  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        background: '#DBEAFE',
        border: '1px solid #BFDBFE',
        borderRadius: '0.375rem',
        padding: '0.5rem 0.75rem',
        margin: '0.25rem',
        cursor: 'pointer',
        textAlign: 'center'
      }}
      {...listeners}
      {...attributes}
      onClick={() => onAdd(word)}
    >
      {word}
    </div>
  );
}

function DropGrid({ sentence, statusArray }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(6,1fr)',
      gap: 8,
      padding: 16,
      background: '#fff',
      borderRadius: 6,
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
    }}>
      {statusArray.map((st, idx) => {
        const display = sentence[idx] || (idx + 1);
        const base = {
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #D1D5DB',
          borderRadius: 6,
          fontSize: 16
        };
        const style = st === true
          ? { ...base, background: '#DCFCE7', borderColor: '#34D399' }
          : st === false
          ? { ...base, background: '#FEE2E2', borderColor: '#FECACA' }
          : base;
        const icon = st === true ? ' ✔️' : st === false ? ' ❌' : '';
        return <div key={idx} style={style}>{display}{icon}</div>;
      })}
    </div>
  );
}

export default function Practice() {
  const topic = Object.keys(sentenceSets)[0];
  const { words, correct, translation } = sentenceSets[topic];
  const correctWords = correct.split(' ');

  const [available, setAvailable] = useState([...words]);
  const [sentence, setSentence] = useState([]);
  const [statusArray, setStatusArray] = useState(Array(correctWords.length).fill(null));
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(() => parseInt(localStorage.getItem('score')) || 0);

  useEffect(() => {
    localStorage.setItem('score', score);
  }, [score]);

  function addWord(word) {
    if (sentence.length < correctWords.length && available.includes(word)) {
      const newSent = [...sentence, word];
      setSentence(newSent);
      setAvailable(prev => prev.filter(w => w !== word));
      validate(newSent);
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (over && over.id === 'dropzone') {
      addWord(active.id);
    }
  }

  function validate(arr) {
    const st = arr.map((w, i) => w === correctWords[i]);
    setStatusArray([...st, ...Array(correctWords.length - st.length).fill(null)]);
    if (arr.join(' ') === correct) {
      setFeedback('✅ Correct! Great Job!');
      setScore(prev => prev + 10);
      confetti({ particleCount: 80, spread: 50 });
    } else if (arr.length === correctWords.length) {
      setFeedback('❌ Try again.');
    } else {
      setFeedback('');
    }
  }

  function reset() {
    setSentence([]);
    setAvailable([...words]);
    setStatusArray(Array(correctWords.length).fill(null));
    setFeedback('');
  }

  return (
    <div style={{ maxWidth: 1024, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 18 }}>Score: {score}</h2>
      </div>
      <h1 style={{ textAlign: 'center', fontSize: 24, marginBottom: 16 }}>Build the Sentence</h1>
      <ol style={{ listStyle: 'decimal inside', textAlign: 'center', marginBottom: 24 }}>
        <li>Click or drag words to fill blanks</li>
        <li>Blanks show 1-6 for order</li>
        <li>Press Reset or Check</li>
      </ol>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
        <div>
          <h3>Word Bank</h3>
          <div id="dropzone" style={{ minHeight: 200, padding: 8, background: '#fff', border: '2px dashed #D1D5DB', borderRadius: 6 }}>
            <DndContext onDragEnd={handleDragEnd}>
              {available.map((w, i) => <DraggableWord key={i} word={w} onAdd={addWord} />)}
            </DndContext>
          </div>
        </div>
        <div>
          <DropGrid sentence={sentence} statusArray={statusArray} />
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button onClick={() => validate(sentence)} style={{ marginRight: 8, padding: '8px 16px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: 6 }}>Check Sentence</button>
            <button onClick={reset} style={{ padding: '8px 16px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: 6 }}>Reset</button>
          </div>
          {feedback && <p style={{ textAlign: 'center', marginTop: 16 }}>{feedback}</p>}
        </div>
      </div>
      {feedback === '✅ Correct! Great Job!' && <p style={{ textAlign: 'center', color: '#10B981', marginTop: 16 }}>{translation}</p>}
    </div>
  );
}