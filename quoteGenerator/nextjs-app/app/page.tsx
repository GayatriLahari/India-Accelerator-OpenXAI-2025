"use client";

import { useState } from "react";

export default function QuotesPage() {
  const [quote, setQuote] = useState("Click below to get a motivational quote!");
  const [loading, setLoading] = useState(false);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/quote");
      const data = await res.json();
      setQuote(data.quote || "⚠️ Failed to fetch quote.");
    } catch (err) {
      console.error("Error fetching quote:", err);
      setQuote("⚠️ Error fetching quote.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">✨ Quotes</h1>

        <p className="text-lg text-gray-700 mb-6 italic">
          {loading ? "⏳ Generating..." : quote}
        </p>

        <button
          onClick={fetchQuote}
          disabled={loading}
          className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl shadow-md transition disabled:opacity-50"
        >
          {loading ? "Loading..." : "New Quote"}
        </button>
      </div>
    </div>
  );
}
