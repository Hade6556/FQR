"use client";

import { generateFomo } from "@/actions/fomo";
import { useState } from "react";

export function FomoGenerator() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    
    const result = await generateFomo();
    
    if (result.success && result.message) {
      setMessage(result.message);
    } else {
      setError(result.error || "Nepavyko sugeneruoti pranešimo");
    }
    
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full py-4 bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Generuojama...
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Generuoti FOMO
          </>
        )}
      </button>

      {message && (
        <div className="p-4 bg-accent/10 border border-accent/30 rounded-xl animate-pulse">
          <p className="text-sm font-medium leading-relaxed">{message}</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}

