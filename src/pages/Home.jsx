import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-green-400 p-6">
      <img src="/logo.svg" alt="Logo" className="mb-6" />
      <h1 className="text-4xl font-bold text-white mb-4">Sentence Builder</h1>
      <p className="text-white text-center mb-6 max-w-md">
        Improve your English sentence-building skills with interactive drag-and-drop practice.
      </p>
      <Link to="/builder">
        <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded shadow hover:bg-gray-100 transition">
          Start Practicing →
        </button>
      </Link>
    </div>
  );
}
