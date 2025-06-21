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
  const style = transform ? { transform: \`translate(\${transform.x}px, \${transform.y}px)\` } : {};
  return (
    <div
      ref={setNodeRef}
      style={{ ...style, background: '#DBEAFE', border: '1px solid #BFDBFE',
               borderRadius: '0.375rem', padding: '0.5rem 0.75rem', margin: '0.25rem',
               cursor: 'pointer', textAlign: 'center' }}
      {...listeners} {...attributes}
      onClick={() => onAdd(word)}
    >
      {word}
    </div>
  );
}

function DropGrid({ sentence, status }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 8,
                  padding: 16, background: '#fff', borderRadius: 6,
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
      {status.map((st, i) => {
        const w = sentence[i] || (i+1);
        const base = { height: 48, display: 'flex', alignItems: 'center',
                       justifyContent: 'center', border: '1px solid #D1D5DB',
                       borderRadius: 6, fontSize: 16 };
        const style = st === true
          ? { ...base, background: '#DCFCE7', borderColor: '#34D399' }
          : st === false
          ? { ...base, background: '#FEE2E2', borderColor: '#FECACA' }
          : base;
        const icon = st === true ? ' ✔️' : st === false ? ' ❌' : '';
        return <div key={i} style={style}>{w}{icon}</div>;
      })}
    </div>
  );
}

export default function Builder() {
  const topic = Object.keys(sentenceSets)[0];
  const { words, correct, translation } = sentenceSets[topic];
  const correctWords = correct.split(' ');

  const [available, setAvailable] = useState([...words]);
  const [sentence, setSentence] = useState([]);
  const [status, setStatus] = useState(Array(correctWords.length).fill(null));
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(() => parseInt(localStorage.getItem('score')) || 0);

  useEffect(() => { localStorage.setItem('score', score); }, [score]);

  function addWord(w) {
    if (sentence.length < correctWords.length && available.includes(w)) {
      const newSent = [...sentence, w];
      setSentence(newSent);
      setAvailable(prev => prev.filter(x => x !== w));
      validate(newSent);
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (over && over.id === 'dropzone') addWord(active.id);
  }

  function validate(arr) {
    const st = arr.map((w, i) => w === correctWords[i]);
    setStatus([...st, ...Array(correctWords.length - st.length).fill(null)]);
    if (arr.join(' ') === correct) {
      setFeedback('✅ Correct! Great Job!');
      setScore(prev => prev + 10);
      confetti({ particleCount: 80, spread: 50 });
    } else if (arr.length === correctWords.length) {
      setFeedback('❌ Try again.');
    } else setFeedback('');
  }

  function reset() {
    setSentence([]);
    setAvailable([...words]);
    setStatus(Array(correctWords.length).fill(null));
    setFeedback('');
  }

  return (
    <div style={{ maxWidth: 1024, margin: '0 auto', padding: 24 }}>
      <h1 style={{ textAlign: 'center', fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Build the Sentence</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: 16 }}>
        <div>
          <h2>Word Bank</h2>
          <div id="dropzone" style={{ padding: 8, background: '#fff', border: '2px dashed #D1D5DB', borderRadius: 6, minHeight: 200 }}>
            <DndContext onDragEnd={handleDragEnd}>
              {available.map((w, i) => <DraggableWord key={i} word={w} onAdd={addWord} />)}
            </DndContext>
          </div>
        </div>
        <div>
          <DropGrid sentence={sentence} status={status} />
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
