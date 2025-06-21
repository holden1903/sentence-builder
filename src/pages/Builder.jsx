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
  },
  "Food (Present Simple)": {
    words: ["I", "eat", "an", "apple", "every", "morning"],
    correct: "I eat an apple every morning.",
    translation: "Her sabah elma yerim."
  },
  "School (Present Simple)": {
    words: ["He", "studies", "English", "at", "school"],
    correct: "He studies English at school.",
    translation: "O okulda İngilizce çalışır."
  },
  "Travel (Future Simple)": {
    words: ["They", "will", "fly", "to", "London", "next", "week"],
    correct: "They will fly to London next week.",
    translation: "Gelecek hafta Londra'ya uçacaklar."
  },
  "Free Time (Past Simple)": {
    words: ["We", "played", "football", "after", "school"],
    correct: "We played football after school.",
    translation: "Okuldan sonra futbol oynadık."
  },
  "Weather (Present Simple)": {
    words: ["It", "rains", "a", "lot", "in", "November"],
    correct: "It rains a lot in November.",
    translation: "Kasım’da çok yağmur yağar."
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

function DropZone({ sentence }) {
  const { isOver, setNodeRef } = useDroppable({ id: "dropzone" });
  const style = isOver ? "bg-green-100" : "bg-gray-100";

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[60px] p-4 mb-4 border border-dashed border-gray-400 rounded ${style}`}
    >
      <p className="text-gray-600 text-sm sm:text-base">Drop words here:</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {sentence.map((word, idx) => (
          <div
            key={idx}
            className="bg-green-200 border rounded px-3 py-2 text-sm sm:text-base"
          >
            {word}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Builder() {
  const topicOptions = Object.keys(sentenceSets);
  const [selectedTopic, setSelectedTopic] = useState(topicOptions[0]);
  const [sentence, setSentence] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(() => parseInt(localStorage.getItem("sentenceScore")) || 0);
  const [correctCount, setCorrectCount] = useState(() => parseInt(localStorage.getItem("correctCount")) || 0);
  const [wrongCount, setWrongCount] = useState(() => parseInt(localStorage.getItem("wrongCount")) || 0);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem("sentenceHistory")) || []);

  const { words, correct, translation } = sentenceSets[selectedTopic];

  useEffect(() => {
    localStorage.setItem("sentenceScore", score);
    localStorage.setItem("correctCount", correctCount);
    localStorage.setItem("wrongCount", wrongCount);
    localStorage.setItem("sentenceHistory", JSON.stringify(history));
  }, [score, correctCount, wrongCount, history]);

  function handleDragEnd(event) {
    const { active, over } = event;
    if (over && over.id === "dropzone" && !sentence.includes(active.id)) {
      const newSentence = [...sentence, active.id];
      setSentence(newSentence);
      validateSentence(newSentence);
    }
  }

  function validateSentence(current) {
    const userSentence = current.join(" ");
    const isCorrect = userSentence === correct;
    if (isCorrect) {
      setFeedback("✅ Correct!");
      setScore(prev => prev + 10);
      setCorrectCount(prev => prev + 1);
    } else {
      setFeedback("❌ Try again.");
      setWrongCount(prev => prev + 1);
    }
    setHistory(prev => [...prev, { sentence: userSentence, correct: isCorrect }]);
  }

  function resetSentence() {
    setSentence([]);
    setFeedback("");
    setShowAnswer(false);
  }

  function handleTopicChange(e) {
    setSelectedTopic(e.target.value);
    resetSentence();
  }

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 font-sans">
      <h1 className="text-lg sm:text-xl font-bold mb-4">Build the Sentence</h1>

      <div className="mb-2 text-right text-sm text-gray-600">
        🎯 Score: <span className="font-bold text-green-700">{score}</span> | ✅ {correctCount} | ❌ {wrongCount}
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
        <DropZone sentence={sentence} />
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
        <button
          onClick={() => setShowAnswer(true)}
          className="bg-gray-700 text-white px-3 py-2 rounded hover:bg-gray-800 text-sm sm:text-base"
        >
          💡 Show Answer
        </button>
      </div>

      {showAnswer && (
        <p className="mt-4 bg-yellow-100 border-l-4 border-yellow-500 p-3 text-sm sm:text-base">
          ✅ Correct Sentence: <span className="font-semibold">{correct}</span>
        </p>
      )}

      <div className="mt-6">
        <h2 className="font-semibold text-base mb-2">📜 Your Sentence History</h2>
        <ul className="text-sm list-disc pl-5 space-y-1">
          {history.slice(-5).reverse().map((entry, idx) => (
            <li key={idx} className={entry.correct ? "text-green-700" : "text-red-500"}>
              {entry.sentence} {entry.correct ? "✔️" : "❌"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}