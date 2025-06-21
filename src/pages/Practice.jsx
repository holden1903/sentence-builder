import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { recordHistory } from "../utils/firestore";
import Mascot from "../components/Mascot";
import confetti from "canvas-confetti";
import RandomQuote from "../components/RandomQuote";


// Updated sentence data with 4 levels and multiple grammar topics, variable sentence lengths
export const sentenceData = {
  A1: {
    "Present Simple": {
      words: ["I", "like", "to", "eat", "apples"],
      correct: "I like to eat apples",
      translation: ""
    },
    "Past Simple": {
      words: ["She", "went", "to", "the", "park", "today"],
      correct: "She went to the park today",
      translation: ""
    }
  },
  A2: {
    "Future Simple": {
      words: ["We", "will", "go", "for", "a", "walk", "tomorrow"],
      correct: "We will go for a walk tomorrow",
      translation: ""
    },
    "Present Continuous": {
      words: ["They", "are", "playing", "football", "at", "the", "ground"],
      correct: "They are playing football at the ground",
      translation: ""
    }
  },
  B1: {
    "Present Perfect": {
      words: ["He", "has", "lived", "here", "for", "five", "years"],
      correct: "He has lived here for five years",
      translation: ""
    },
    "Modals": {
      words: ["You", "should", "take", "an", "umbrella", "today"],
      correct: "You should take an umbrella today",
      translation: ""
    }
  },
  B2: {
    "Conditionals": {
      words: ["If", "I", "had", "time", "I", "would", "travel", "more"],
      correct: "If I had time I would travel more",
      translation: ""
    },
    "Passive Voice": {
      words: ["The", "book", "was", "written", "by", "John", "last", "year"],
      correct: "The book was written by John last year",
      translation: ""
    }
  }
};

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

export default function Practice() {
  const levels = Object.keys(sentenceData);
  const [level, setLevel] = useState(levels[0]);
  const topics = Object.keys(sentenceData[level]);
  const [topic, setTopic] = useState(topics[0]);

  // Build list of questions for navigation if needed
  const questionList = useMemo(() => {
    const list = [];
    levels.forEach(lv => {
      Object.keys(sentenceData[lv]).forEach(tp => list.push({ level: lv, topic: tp }));
    });
    return list;
  }, [levels]);

  const { words: initialWords, correct, translation } = sentenceData[level][topic];
  const correctWords = correct.split(" ");

  const [available, setAvailable] = useState([]);
  const [sentence, setSentence] = useState([]);
  const [status, setStatus] = useState(Array(correctWords.length).fill(null));
  const [feedback, setFeedback] = useState("");
  const [showMascot, setShowMascot] = useState(false);
  const nextTimeout = useRef(null);
  const [score, setScore] = useState(() => parseInt(localStorage.getItem("score")) || 0);
  const { currentUser } = useAuth();

  useEffect(() => {
    setAvailable(shuffle(initialWords));
    setSentence([]);
    setStatus(Array(correctWords.length).fill(null));
    setFeedback("");
  }, [level, topic]);

  useEffect(() => {
    localStorage.setItem("score", score);
  }, [score]);

  const addWord = w => {
    if (sentence.length < correctWords.length && available.includes(w)) {
      const newSent = [...sentence, w];
      setSentence(newSent);
      setAvailable(prev => prev.filter(x => x !== w));
      // update live status
      const st = newSent.map((wd, i) => wd === correctWords[i]);
      setStatus([...st, ...Array(correctWords.length - st.length).fill(null)]);
    }
  };

  const validate = () => {
    const arr = sentence;
    const joined = arr.join(" ");
    if (joined === correct) {
      // trigger mascot and record history
      setShowMascot(true);
      if (currentUser) recordHistory(currentUser.uid);
      // auto-next after 1s
      nextTimeout.current = setTimeout(() => {
        reset();
        // optionally rotate level/topic here if needed
      }, 1000);

      setFeedback("✅ Correct! Great Job!");
      const newScore = score + 10;
      setScore(newScore);
      if (currentUser) saveScore(currentUser.uid, newScore);
      confetti({ particleCount: 80, spread: 50 });
    } else if (arr.length === correctWords.length) {
      setFeedback("❌ Try again.");
    } else {
      setFeedback("");
    }
  };

  const reset = () => {
    setSentence([]);
    setAvailable(shuffle(initialWords));
    setStatus(Array(correctWords.length).fill(null));
    setFeedback("");
  };

  
  useEffect(() => {
    return () => {
      if (nextTimeout.current) clearTimeout(nextTimeout.current);
    }
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', background: '#f0f4f8' }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', justifyContent: 'center' }}>
        <select value={level} onChange={e => setLevel(e.target.value)} style={{ padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #D1D5DB", background: "#fff", fontSize: "1rem"}}>
          {levels.map(lv => <option key={lv} value={lv}>{lv}</option>)}
        </select>
        <select value={topic} onChange={e => setTopic(e.target.value)} style={{ padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #D1D5DB", background: "#fff", fontSize: "1rem"}}>
          {topics.map(tp => <option key={tp} value={tp}>{tp}</option>)}
        </select>
      </div>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <strong>Score:</strong> {score}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
        <div>
          <h2>Word Bank</h2>
          <div style={{ padding: '1rem', background: '#fff', border: '2px dashed #D1D5DB', borderRadius: '0.375rem', minHeight: '200px' }}>
            {available.map((w, i) => (
              <span key={i} style={{
                display: 'inline-flex', alignItems: 'center', margin: '0.25rem',
                padding: '0.5rem 0.75rem', background: '#DBEAFE', border: '1px solid #BFDBFE',
                borderRadius: '0.375rem', cursor: 'pointer'
              }}>
                <span onClick={() => addWord(w)} style={{ flex: 1 }}>{w}</span>
              </span>
            ))}
          </div>
        </div>
        <div>
          <h2>Sentence</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(\${correctWords.length},1fr)`,
            gap: '0.5rem',
            padding: '1rem',
            background: '#fff',
            borderRadius: '0.375rem'
          }}>
            {status.map((st, i) => {
              const base = { height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #D1D5DB', borderRadius: '0.375rem' };
              const style = st === true ? { ...base, background: '#DCFCE7', borderColor: '#34D399' }
                : st === false ? { ...base, background: '#FEE2E2', borderColor: '#FECACA' }
                  : base;
              const icon = st === true ? ' ✔️' : st === false ? ' ❌' : '';
              return <div key={i} style={style}>{sentence[i] || i+1}{icon}</div>;
            })}
          </div>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button onClick={validate} style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '0.375rem' }}>Check</button>
            <button onClick={reset} style={{ padding: '0.5rem 1rem', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '0.375rem' }}>Reset</button>
          </div>
          {feedback && <p style={{ textAlign: 'center', marginTop: '1rem' }}>{feedback}</p>}
        </div>
      </div>
      <RandomQuote />
    </div>
  );
}
