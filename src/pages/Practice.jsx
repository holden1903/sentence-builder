import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";

// Sentence data organized by level and grammar topic
const sentenceData = {
  A1: {
    "Present Simple": { words: ["I","wake","up","at","7","a.m."], correct: "I wake up at 7 a.m.", translation: "Ben saat 7'de uyanırım." },
    "Past Simple": { words: ["She","went","to","the","park","yesterday"], correct: "She went to the park yesterday.", translation: "O dün parka gitti." }
  },
  A2: {
    "Future Simple": { words: ["We","will","travel","to","Istanbul","tomorrow"], correct: "We will travel to Istanbul tomorrow.", translation: "Yarın İstanbul'a seyahat edeceğiz." }
  }
};

// Utility: shuffle an array
const shuffle = arr => arr.sort(() => Math.random() - 0.5);

export default function Practice() {
  const levels = Object.keys(sentenceData);
  const [level, setLevel] = useState(levels[0]);
  const topics = Object.keys(sentenceData[level]);
  const [topic, setTopic] = useState(topics[0]);

  const { words: initialWords, correct, translation } = sentenceData[level][topic];
  const correctWords = correct.split(" ");

  const [available, setAvailable] = useState([]);
  const [sentence, setSentence] = useState([]);
  const [status, setStatus] = useState(Array(correctWords.length).fill(null));
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(() => parseInt(localStorage.getItem("score"))||0);

  useEffect(() => {
    setAvailable(shuffle([...initialWords]));
    setSentence([]);
    setStatus(Array(correctWords.length).fill(null));
    setFeedback("");
  }, [level, topic]);

  useEffect(() => {
    localStorage.setItem("score", score);
  }, [score]);

  function addWord(w) {
    if(sentence.length < correctWords.length && available.includes(w)) {
      const newSent = [...sentence, w];
      setSentence(newSent);
      setAvailable(prev => prev.filter(x => x!==w));
      validate(newSent);
    }
  }

  function validate(arr) {
    const st = arr.map((w,i) => w===correctWords[i]);
    setStatus([...st, ...Array(correctWords.length-st.length).fill(null)]);
    if(arr.join(" ")===correct) {
      setFeedback("✅ Correct! Great Job!");
      setScore(prev=>prev+10);
      confetti({ particleCount:80, spread:50 });
    } else if(arr.length===correctWords.length) {
      setFeedback("❌ Try again.");
    } else setFeedback("");
  }

  function reset() {
    setSentence([]);
    setAvailable(shuffle([...initialWords]));
    setStatus(Array(correctWords.length).fill(null));
    setFeedback("");
  }

  return (
    <div style={{maxWidth:'800px', margin:'0 auto', padding:'2rem', background:'#f0f4f8'}}>
      {/* Filters */}
      <div style={{display:'flex', gap:'1rem', marginBottom:'1rem', justifyContent:'center'}}>
        <select value={level} onChange={e=>setLevel(e.target.value)}>
          {levels.map(lv=><option key={lv}>{lv}</option>)}
        </select>
        <select value={topic} onChange={e=>setTopic(e.target.value)}>
          {Object.keys(sentenceData[level]).map(tp=><option key={tp}>{tp}</option>)}
        </select>
      </div>
      {/* Score */}
      <div style={{textAlign:'center', marginBottom:'1rem'}}><strong>Score:</strong> {score}</div>
      {/* Word Bank & Sentence */}
      <div style={{display:'grid', gridTemplateColumns:'1fr 2fr', gap:'1rem'}}>
        <div>
          <h2>Word Bank</h2>
          <div style={{padding:'1rem', background:'#fff', border:'2px dashed #D1D5DB', borderRadius:'0.375rem', minHeight:'200px'}}>
            {available.map((w,i)=>(
              <span key={i} onClick={()=>addWord(w)} style={{
                display:'inline-block', margin:'0.25rem', padding:'0.5rem 0.75rem',
                background:'#DBEAFE', border:'1px solid #BFDBFE', borderRadius:'0.375rem',
                cursor:'pointer'
              }}>{w}</span>
            ))}
          </div>
        </div>
        <div>
          <h2>Sentence</h2>
          <div style={{display:'grid', gridTemplateColumns:`repeat(${correctWords.length},1fr)`, gap:'0.5rem', padding:'1rem', background:'#fff', borderRadius:'0.375rem'}}>
            {status.map((st,i)=>{
              const base={height:'3rem', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid #D1D5DB', borderRadius:'0.375rem'};
              const style = st===true?{...base, background:'#DCFCE7', borderColor:'#34D399'}:st===false?{...base, background:'#FEE2E2', borderColor:'#FECACA'}:base;
              const icon = st===true?' ✔️':st===false?' ❌':'';
              return <div key={i} style={style}>{sentence[i]||i+1}{icon}</div>;
            })}
          </div>
          <div style={{textAlign:'center', marginTop:'1rem'}}>
            <button onClick={()=>validate(sentence)} style={{marginRight:'0.5rem', padding:'0.5rem 1rem', background:'#2563EB', color:'#fff', border:'none', borderRadius:'0.375rem'}}>Check</button>
            <button onClick={reset} style={{padding:'0.5rem 1rem', background:'#DC2626', color:'#fff', border:'none', borderRadius:'0.375rem'}}>Reset</button>
          </div>
          {feedback&&<p style={{textAlign:'center', marginTop:'1rem'}}>{feedback}</p>}
        </div>
      </div>
      {/* Advertisement */}
      <div style={{marginTop:'2rem', padding:'1rem', background:'rgba(0,0,0,0.05)', borderRadius:'0.375rem', textAlign:'center'}}>Advertisement<br/>Your Ad Here</div>
      {/* Translation */}
      {feedback==="✅ Correct! Great Job!" && <p style={{textAlign:'center', color:'#10B981', marginTop:'1rem'}}>{translation}</p>}
    </div>
  );
}