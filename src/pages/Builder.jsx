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
      className="bg-blue-100 border border-blue-300 rounded px-4 py-2 m-1 cursor-pointer hover:bg-blue-200 text-center"
    >
      {word}
    </div>
  );
}

function DropGrid({ sentence, statusArray }) {
  return (
    <div className="grid grid-cols-6 gap-3 p-4 bg-white rounded shadow-inner">
      {statusArray.map((st, idx) => {
        const word = sentence[idx] || "";
        const base = "h-14 flex items-center justify-center border rounded text-base";
        const style = st === true
          ? "bg-green-200 border-green-600"
          : st === false
          ? "bg-red-200 border-red-600"
          : "bg-gray-100 border-gray-300";
        const icon = st === true ? "✔️" : st === false ? "❌" : null;
        return (
          <div key={idx} className={`${base} ${style}`}>{word}{icon && <span className="ml-2">{icon}</span>}</div>
        );
      })}
    </div>
);