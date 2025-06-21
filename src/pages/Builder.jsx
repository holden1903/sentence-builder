import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";

const sentenceSets = {
  "Daily Routine (Present Simple)": {
    words: ["I", "wake", "up", "at", "7", "a.m."],
    correct: "I wake up at 7 a.m.",
    translation: "Ben saat 7'de uyanırım."
  },
  "Yesterday (Past Simple)": {
    words: ["She", "went", "to", "the", "park", "yesterday"],
    correct: "She went to the park yesterday.",
    translation: "O dün parka gitti."
  },
  "Tomorrow (Future)": {
    words: ["We", "will", "travel", "to", "Istanbul", "tomorrow"],
    correct: "We will travel to Istanbul tomorrow.",
    translation: "Yarın İstanbul'a seyahat edeceğiz."
  }
};

function DraggableWord({ word, id }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined;
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}
      className="bg-blue-100 border border-blue-400 rounded px-4 py-2 m-1 cursor-pointer text-sm sm:text-base">
      {word}
    </div>
  );
}

function DropZone({ sentence, correctArray }) {
  const { setNodeRef } = useDroppable({ id: "dropzone" });
  return (
    <div ref={setNodeRef}
      className="grid grid-cols-6 gap-2 mb-4 p-4 border-2 border-dashed border-gray-400 rounded bg-white">
      {Array.from({ length: correctArray.length }).map((_, idx) => {
        const word = sentence[idx] || "";
        const status = correctArray[idx];
        const base = "h-12 flex items-center justify-center border rounded text-sm sm:text-base";
        const style = status === true
          ? "bg-green-200 border-green-600"
          : status === false
          ? "bg-red-200 border-red-600"
          : "bg-gray-100 border-gray-300";
        const icon = status === true ? "✔️" : status === false ? "❌" : "";
        return (
          <div key={idx} className={`${base} ${style}`}>
            {word} <span className="ml-1">{icon}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function Builder() {
  const topicOptions = Object.keys(sentenceSets);
  const [selectedTopic, setSelectedTopic] = useState(topicOptions[0]);
  const [sentence, setSentence] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [correctArray, setCorrectArray] = useState([]);
  const [score, setScore] = useState(() => parseInt(localStorage.getItem("sentenceScore")) || 0);

  const { words, correct, translation } = sentenceSets[selectedTopic];
  const correctWords = correct.split(" ");

  useEffect(() => {
    localStorage.setItem("sentenceScore", score);
  }, [score]);

  function handleDragEnd(event) {
    const { active, over } = event;
    if (over && over.id === "dropzone" && sentence.length < correctWords.length) {
      setSentence(prev => {
        const newSentence = [...prev, active.id];
        validateLive(newSentence);
        return newSentence;
      });
    }
  }

  function validateLive(current) {
    const statusArr = current.map((w, i) => w === correctWords[i]);
    setCorrectArray(statusArr);
    if (current.join(" ") === correct) {
      setFeedback("✅ Correct! Great Job!");
      setScore(prev => prev + 10);
      confetti({ particleCount: 100, spread: 70 });
    } else if (current.length === correctWords.length) {
      setFeedback("❌ Try again.");
    } else {
      setFeedback("");
    }
  }

  function resetSentence() {
    setSentence([]);
    setCorrectArray([]);
    setFeedback("");
  }

  function handleTopicChange(e) {
    setSelectedTopic(e.target.value);
    resetSentence();
  }

  return (
    <div className="max-w-xl mx-auto p-6 font-sans">
      <div className="flex justify-between items-center mb-4">
        <img src="/logo.svg" alt="Logo" className="h-8" />
        <div className="text-right text-sm text-gray-600">
          🎯 Score: <span className="font-bold text-green-700">{score}</span>
        </div>
      </div>
      <h1 className="text-xl font-bold mb-4">Build the Sentence</h1>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Choose a topic:</label>
        <select value={selectedTopic} onChange={handleTopicChange}
          className="border rounded p-2 w-full text-sm sm:text-base">
          {topicOptions.map(topic => (
            <option key={topic} value={topic}>{topic}</option>
          ))}
        </select>
      </div>
      <DndContext onDragEnd={handleDragEnd}>
        <DropZone sentence={sentence} correctArray={correctWords.map((_, i) => correctArray[i] ?? null)} />
        <div className="flex flex-wrap gap-2 p-4 bg-gray-100 rounded">
          {words.map((word, idx) => (
            <DraggableWord key={idx} word={word} id={word} />
          ))}
        </div>
      </DndContext>
      {feedback && <p className="mt-4 text-lg font-bold">{feedback}</p>}
      <div className="mt-4">
        <button onClick={resetSentence}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          🔄 Reset
        </button>
      </div>
    </div>
);
}
