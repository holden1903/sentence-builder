import React from "react";

// A simple Text-to-Speech button using Web Speech API
export default function TextToSpeechButton({ text }) {
  const speak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Sorry, your browser does not support Text-to-Speech.');
    }
  };

  return (
    <button
      onClick={speak}
      style={{
        marginLeft: '0.5rem',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1rem'
      }}
      aria-label={`Speak ${text}`}
      title="🔊 Play pronunciation"
    >
      🔊
    </button>
  );
}
