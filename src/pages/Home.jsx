import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-4xl mx-auto grid grid-cols-2 gap-8 p-8 items-center">
        <div className="space-y-4">
          <img src="/logo.svg" alt="Sentence Builder" className="h-16" />
          <h1 className="text-5xl font-bold text-gray-800">Build the Sentence</h1>
          <p className="text-gray-600 text-lg">
            Improve your English sentence-building skills with step-by-step guidance and interactive practice.
          </p>
          <Link to="/builder">
            <button className="mt-4 bg-blue-600 text-white px-6 py-3 rounded shadow-lg hover:bg-blue-700 transition">
              Start Practicing →
            </button>
          </Link>
        </div>
        <div className="flex justify-center">
          <img src="/mockups/landing_wireframe.png" alt="Landing Mockup" className="w-full max-w-md shadow-lg" />
        </div>
      </div>
    </div>
  );
}
