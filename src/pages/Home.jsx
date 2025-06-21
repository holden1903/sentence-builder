import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Welcome to Sentence Builder</h1>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        Improve your English sentence-building skills with interactive drag-and-drop practice. Track your score and progress!
      </p>
      <Link to="/builder">
        <button className="bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700 transition">
          Start Practicing →
        </button>
      </Link>
    </div>
  );
}