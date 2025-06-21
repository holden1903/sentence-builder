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
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => onClick(word)}
      className="bg-blue-100 border border-blue-400 rounded px-3 py-2 m-1 cursor-pointer text-sm sm:text-base hover:bg-blue-200"
    >
      {word}
    </div>
  );
}

function DropGrid({ sentence, statusArray }) {
  return (
    <div className="grid grid-cols-6 gap-2 mb-4 p-2 bg-white rounded">
      {statusArray.map((st, idx) => {
        const word = sentence[idx] || "";
        const base = "h-12 flex items-center justify-center border rounded text-sm sm:text-base";
        const style = st === true
          ? "bg-green-200 border-green-600"
          : st === false
          ? "bg-red-200 border-red-600"
          : "bg-gray-100 border-gray-300";
        const icon = st === true ? "✔️" : st === false ? "❌" : "";
        return (
          <div key={idx} className={`${base} ${style}`}>
            {word} <span>{icon}</span>
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
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <div className="flex justify-between items-center mb-4">
        <img src="/logo.svg" alt="Logo" className="h-8" />
        <div className="text-right text-sm text-gray-600">
          🎯 Score: <span className="font-bold text-green-700">{score}</span>
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-4">Build the Sentence</h1>
      <ol className="list-decimal list-inside mb-6 text-lg">
        <li>Use drag or click to fill the boxes</li>
        <li>Words appear in numbered boxes</li>
        <li>Check or Reset</li>
      </ol>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3 p-4 bg-gray-50 rounded-lg">
          <h2 className="font-semibold mb-2">Instructions</h2>
          <ul className="list-disc list-inside text-sm">
            <li>Click or drag words</li>
            <li>Fill the empty boxes</li>
            <li>Press Check or Reset</li>
          </ul>
        </div>

        <div className="col-span-6 p-4 bg-gray-50 rounded-lg">
          <DropGrid sentence={sentence} statusArray={statusArray} />
          <div className="mt-4 flex gap-4">
            <button onClick={() => validateLive(sentence)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Check Sentence
            </button>
            <button onClick={resetAll}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Reset
            </button>
          </div>
          {feedback && <p className="mt-4 text-lg font-bold">{feedback}</p>}
        </div>

        <div className="col-span-3 p-4 bg-gray-50 rounded-lg">
          <h2 className="font-semibold mb-2">Word Bank</h2>
          <div id="dropzone" className="p-2 border-dashed border-2 border-gray-300 rounded min-h-[8rem]">
            <DndContext onDragEnd={handleDragEnd}>
              {availableWords.map((w, i) => (
                <DraggableWord key={i} word={w} onClick={addWord} />
              ))}
            </DndContext>
          </div>
        </div>
      </div>

      {feedback === "✅ Correct! Great Job!" && (
        <p className="mt-6 text-green-700 text-lg">📘 {translation}</p>
      )}
    </div>
);