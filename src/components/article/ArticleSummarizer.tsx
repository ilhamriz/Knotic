"use client";

import { useState } from "react";
import LoadingSpinner from "../shared/loading-spinner";
import { SparkleIcon } from "../shared/icons";

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
          <div className="text-primary shrink-0">
            <SparkleIcon size="16" />
          </div>
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
                <div className="text-primary shrink-0">
                  <SparkleIcon size="16" />
                </div>
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
