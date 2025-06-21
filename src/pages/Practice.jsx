import React, { useState, useEffect, useMemo } from "react";
import confetti from "canvas-confetti";

// Sentence data organized by level and grammar topic
export const sentenceData = {
  A1: {
    "Present Simple": { words: ["I","wake","up","at","7","a.m."], correct: "I wake up at 7 a.m.", translation: "Ben saat 7'de uyanırım." },
    "Past Simple": { words: ["She","went","to","the","park","yesterday"], correct: "She went to the park yesterday.", translation: "O dün parka gitti." }
  },
  A2: {
    "Future Simple": { words: ["We","will","travel","to","Istanbul","tomorrow"], correct: "We will travel to Istanbul tomorrow.", translation: "Yarın İstanbul'a seyahat edeceğiz." }
  }
};

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

export default function Practice() {
  const levels = Object.keys(sentenceData);
  const questionList = useMemo(() => {
    const list = [];
    Object.entries(sentenceData).forEach(([lv, topics]) => {
      Object.keys(topics).forEach(tp => list.push({ level: lv, topic: tp }));
    });
    return list;
  }, []);
  const [questionIndex, setQuestionIndex] = useState(0);
  const { level, topic } = questionList[questionIndex];
  const { words: initialWords, correct, translation } = sentenceData[level][topic];
  const correctWords = correct.split(" ");

  const [available, setAvailable] = useState([]);
  const [sentence, setSentence] = useState([]);
  const [status, setStatus] = useState(Array(correctWords.length).fill(null));
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(() => parseInt(localStorage.getItem("score"))||0);

  useEffect(() => {
    setAvailable(shuffle(initialWords));
    setSentence([]);
    setStatus(Array(correctWords.length).fill(null));
    setFeedback("");
  }, [questionIndex]);

  useEffect(() => {
    localStorage.setItem("score", score);
  }, [score]);

  const removeWordAt = idx => {
    const removed = sentence[idx];
    const newSent = sentence.filter((_,i)=>i!==idx);
    setSentence(newSent);
    setAvailable(prev=>shuffle([...prev, removed]));
    setFeedback("");
    const st = newSent.map((w,i)=>w===correctWords[i]);
    setStatus([...st, ...Array(correctWords.length-st.length).fill(null)]);
  };

  const addWord = w => {
    if(sentence.length<correctWords.length && available.includes(w)) {
      const newSent = [...sentence, w];
      setSentence(newSent);
      setAvailable(prev => prev.filter(x=>x!==w));
      const st = newSent.map((wd,i)=>wd===correctWords[i]);
      setStatus([...st, ...Array(correctWords.length-st.length).fill(null)]);
    }
  };

  const validate = () => {
    const arr = sentence;
    const joined = arr.join(" ");
    if(joined===correct) {
      setFeedback("✅ Correct! Great Job!");
      setScore(prev=>prev+10);
      confetti({ particleCount:80, spread:50 });
      setTimeout(()=> setQuestionIndex((questionIndex+1)%questionList.length), 1500);
    } else if(arr.length===correctWords.length) {
      setFeedback("❌ Try again.");
    } else setFeedback("");
  };

  // Reset function to clear sentence & restore available words
  const reset = () => {
    setSentence([]);
    setAvailable(shuffle(initialWords));
    setStatus(Array(correctWords.length).fill(null));
    setFeedback("");
  };

  return (
    <div style={{maxWidth:'800px', margin:'0 auto', padding:'2rem', background:'#f0f4f8'}}>
      <div style={{display:'flex', gap:'1rem', marginBottom:'1rem', justifyContent:'center'}}>
        <select value={level} disabled>
          <option>{level}</option>
        </select>
        <select value={topic} disabled>
          <option>{topic}</option>
        </select>
      </div>
      <div style={{textAlign:'center', marginBottom:'1rem'}}><strong>Score:</strong> {score}</div>
      <div style={{display:'grid', gridTemplateColumns:'1fr 2fr', gap:'1rem'}}>
        <div>
          <h2>Word Bank</h2>
          <div style={{padding:'1rem', background:'#fff', border:'2px dashed #D1D5DB', borderRadius:'0.375rem', minHeight:'200px'}}>
            {available.map((w,i)=>(
              <span key={i} onClick={()=>addWord(w)} style={{display:'inline-block', margin:'0.25rem', padding:'0.5rem 0.75rem', background:'#DBEAFE', border:'1px solid #BFDBFE', borderRadius:'0.375rem', cursor:'pointer'}}>{w}</span>
            ))}
          </div>
        </div>
        <div>
          <h2>Sentence</h2>
          <div style={{display:'grid', gridTemplateColumns:`repeat(${correctWords.length},1fr)`, gap:'0.5rem', padding:'1rem', background:'#fff', borderRadius:'0.375rem'}}>
            {status.map((st,i)=>{
              const base={height:'3rem', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid #D1D5DB', borderRadius:'0.375rem', cursor: sentence[i]? 'pointer':'default'};
              const style = st===true?{...base, background:'#DCFCE7', borderColor:'#34D399'}:st===false?{...base, background:'#FEE2E2', borderColor:'#FECACA'}:base;
              const icon = st===true?' ✔️':st===false?' ❌':'';
              return <div key={i} style={style} onClick={()=> sentence[i] && removeWordAt(i)}>{sentence[i]||i+1}{icon}</div>;
            })}
          </div>
          <div style={{textAlign:'center', marginTop:'1rem'}}>
            <button onClick={validate} style={{marginRight:'0.5rem', padding:'0.5rem 1rem', background:'#2563EB', color:'#fff', border:'none', borderRadius:'0.375rem'}}>Check</button>
            <button onClick={reset} style={{padding:'0.5rem 1rem', background:'#DC2626', color:'#fff', border:'none', borderRadius:'0.375rem'}}>Reset</button>
          </div>
          {feedback && <p style={{textAlign:'center', marginTop:'1rem'}}>{feedback}</p>}
        </div>
      </div>
      <div style={{marginTop:'2rem', padding:'1rem', background:'rgba(0,0,0,0.05)', borderRadius:'0.375rem', textAlign:'center'}}>Advertisement<br/>Your Ad Here</div>
    </div>
  );
}