"use client";

import { useState } from "react";

type State = "idle" | "loading" | "done" | "error";

interface ArticleSummarizerProps {
  articleTitle: string;
  articleContent: string;
}

export default function ArticleSummarizer({
  articleTitle,
  articleContent,
}: ArticleSummarizerProps) {
  const [state, setState] = useState<State>("idle");
  const [summary, setSummary] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);

  async function handleSummarize() {
    // If we already have a summary, just show it - no API call
    if (summary) {
      setIsVisible(true);
      setState("done");
      return;
    }

    setState("loading");
    setError("");
    // setSummary("");

    try {
      const res = await fetch("/api/ai/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "summarize_article",
          title: articleTitle,
          content: articleContent,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setState("error");
        return;
      }

      setSummary(data.result);
      setState("done");
      setIsVisible(true);
    } catch {
      setError("Network error. Please try again.");
      setState("error");
    }
  }

  function handleDismiss() {
    setIsVisible(false);
    setState("idle"); // shows the button again, but summary is preserved
  }

  return (
    <div className="my-2">
      {/* Button: shown in idle, loading, and error states */}
      {!isVisible && (
        <button
          onClick={handleSummarize}
          disabled={state === "loading"}
          className="inline-flex items-center gap-2 rounded-lg bg-bg-elevated border border-border-default px-4 py-2 text-sm font-medium text-text-primary hover:bg-border-default hover:border-border-strong disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer"
          aria-label="Summarize article with AI"
        >
          <SparkleIcon className="w-4 h-4 text-primary shrink-0" />
          {state === "loading" ? "Summarizing…" : "Summarize with AI"}
          {state === "loading" && <LoadingSpinner />}
        </button>
      )}

      {/* Error message */}
      {state === "error" && error && (
        <p className="mt-2 text-sm text-danger">{error}</p>
      )}

      {/* Summary panel */}
      {isVisible && summary && (
        <div className="rounded-lg border border-border-default bg-bg-elevated border-l-2 border-l-primary overflow-hidden">
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <SparkleIcon className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  AI Summary
                </span>
              </div>
              <button
                onClick={handleDismiss}
                className="text-xs text-text-secondary hover:text-text-primary transition-colors"
                aria-label="Dismiss AI summary"
              >
                Dismiss
              </button>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              {summary}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Icons ──────────────────────────────────────────────────────── */

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z" />
      <path
        d="M5 3l.9 2.7L8.5 6.5 5.9 7.4 5 10l-.9-2.6L1.5 6.5l2.6-.9L5 3z"
        opacity="0.6"
      />
      <path
        d="M19 13l.7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1-2.1-.7 2.1-.7.7-2.1z"
        opacity="0.6"
      />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg
      className="w-4 h-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}
