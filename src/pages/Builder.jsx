
import React, { useState, useEffect } from "react";
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
  const style = transform ? {
    transform: `translate(${transform.x}px, ${transform.y}px)`
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-blue-100 border border-blue-400 rounded px-3 py-2 m-1 cursor-pointer text-sm sm:text-base"
    >
      {word}
    </div>
  );
}

function DropZone({ sentence, correctArray }) {
  const { isOver, setNodeRef } = useDroppable({ id: "dropzone" });
  const style = isOver ? "bg-green-100" : "bg-gray-100";

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[60px] p-4 mb-4 border border-dashed border-gray-400 rounded ${style}`}
    >
      <p className="text-gray-600 text-sm sm:text-base">Drop words here:</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {sentence.map((word, idx) => {
          const correctness = correctArray[idx];
          const bgColor =
            correctness === true
              ? "bg-green-200 border-green-600"
              : correctness === false
              ? "bg-red-200 border-red-600"
              : "bg-gray-200 border-gray-400";
          return (
            <div
              key={idx}
              className={`border rounded px-3 py-2 text-sm sm:text-base ${bgColor}`}
            >
              {word}
            </div>
          );
        })}
      </div>
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
    if (over && over.id === "dropzone" && !sentence.includes(active.id)) {
      const newSentence = [...sentence, active.id];
      setSentence(newSentence);
      validateLive(newSentence);
    }
  }

  function validateLive(current) {
    const newFeedbackArray = current.map((word, idx) => word === correctWords[idx]);
    setCorrectArray(newFeedbackArray);

    const joined = current.join(" ");
    if (joined === correct) {
      setFeedback("✅ Correct!");
      setScore(prev => prev + 10);
    } else if (joined.length >= correct.length) {
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
    <div className="max-w-xl mx-auto p-4 sm:p-6 font-sans">
      <h1 className="text-lg sm:text-xl font-bold mb-4">Build the Sentence</h1>

      <div className="mb-2 text-right text-sm text-gray-600">
        🎯 Score: <span className="font-bold text-green-700">{score}</span>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium text-sm sm:text-base">Choose a topic:</label>
        <select
          value={selectedTopic}
          onChange={handleTopicChange}
          className="border rounded p-2 w-full text-sm sm:text-base"
        >
          {topicOptions.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <DropZone sentence={sentence} correctArray={correctArray} />
        <div className="flex flex-wrap gap-2 border p-4 rounded">
          {words.map((word, index) => (
            <DraggableWord key={index} word={word} id={word} />
          ))}
        </div>
      </DndContext>

      {sentence.length > 0 && (
        <>
          <p className="mt-4 text-base sm:text-lg">
            👉 Sentence: <span className="font-semibold">{sentence.join(" ")}</span>
          </p>
          <p className="mt-2 text-lg font-bold">{feedback}</p>
          {feedback === "✅ Correct!" && (
            <p className="mt-1 text-green-700 text-sm sm:text-base">📘 {translation}</p>
          )}
        </>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={resetSentence}
          className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 text-sm sm:text-base"
        >
          🔄 Reset
        </button>
      </div>
    </div>
  );
}
