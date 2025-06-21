import React, { useState, useEffect } from "react";

const quotes = [
  "The only way to do great work is to love what you do.",
  "Learning never exhausts the mind.",
  "Practice makes perfect.",
  "Don’t watch the clock; do what it does. Keep going.",
  "Success is the sum of small efforts, repeated day in and day out."
];

export default function RandomQuote() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <div style={{
      padding: "1rem",
      background: "#ffffffcc",
      border: "1px solid #e2e8f0",
      borderRadius: "0.375rem",
      fontStyle: "italic",
      color: "#374151",
      textAlign: "center",
      minHeight: "4rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      “{quote}”
    </div>
  );
}
