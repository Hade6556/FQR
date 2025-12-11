"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";

function ScanContent() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("id") || "unknown";
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [result, setResult] = useState<{
    action?: string;
    timestamp?: string;
    message?: string;
    error?: string;
  }>({});

  useEffect(() => {
    async function recordAttendance() {
      try {
        const res = await fetch("/api/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomId }),
        });
        
        const data = await res.json();
        
        if (res.ok && data.success) {
          setStatus("success");
          setResult({
            action: data.action,
            timestamp: data.timestamp,
            message: data.message,
          });
        } else {
          setStatus("error");
          setResult({ error: data.error || "Nepavyko užregistruoti" });
        }
      } catch {
        setStatus("error");
        setResult({ error: "Klaida jungiantis prie serverio" });
      }
    }
    
    recordAttendance();
  }, [roomId]);

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString("lt-LT", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
      {status === "loading" && (
        <div className="space-y-4">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted">Registruojamas lankomumas...</p>
        </div>
      )}

      {status === "success" && (
        <div className="space-y-6">
          <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-10 h-10 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {result.action === "enter" ? "Įėjimas užregistruotas" : 
               result.action === "exit" ? "Išėjimas užregistruotas" : 
               "Lankomumas užregistruotas"}
            </h1>
            <p className="text-muted">
              Auditorija: <span className="text-white font-mono">{roomId}</span>
            </p>
            <p className="text-muted">
              Laikas: <span className="text-white font-mono">{formatTime(result.timestamp)}</span>
            </p>
            {result.message && (
              <p className="text-muted text-sm mt-2">{result.message}</p>
            )}
          </div>

          <div className="flex gap-4 justify-center pt-4">
            <Link
              href="/"
              className="px-6 py-2 bg-surface border border-muted/20 rounded-lg hover:border-accent transition-colors"
            >
              Pradžia
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-2 bg-accent hover:bg-accent/90 rounded-lg transition-colors"
            >
              Statistika
            </Link>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-6">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          
          <div>
            <h1 className="text-2xl font-bold mb-2">Klaida</h1>
            <p className="text-muted">{result.error || "Nepavyko užregistruoti lankomumo"}</p>
          </div>

          <Link
            href="/login"
            className="inline-block px-6 py-2 bg-accent hover:bg-accent/90 rounded-lg transition-colors"
          >
            Prisijungti
          </Link>
        </div>
      )}
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ScanContent />
    </Suspense>
  );
}
