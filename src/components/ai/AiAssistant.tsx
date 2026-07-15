"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type Action = "improve_writing" | "suggest_title" | "generate_excerpt";
type Step = "actions" | "input" | "result";

interface AiAssistantProps {
  content: string;
  onApplyContent: (value: string) => void;
  onApplyTitle: (value: string) => void;
  onApplyExcerpt: (value: string) => void;
}

const ACTION_LABELS: Record<Action, string> = {
  improve_writing: "Improve writing",
  suggest_title: "Suggest title",
  generate_excerpt: "Generate excerpt",
};

const ACTION_SUBTEXTS: Record<Action, string> = {
  improve_writing: "Enhance clarity, structure and flow",
  suggest_title: "Get 3 title options based on your content",
  generate_excerpt: "Create a compelling summary",
};

const INSTRUCTION_PLACEHOLDERS: Record<Action, string> = {
  improve_writing: "e.g. make it more concise, fix the intro...",
  suggest_title: "e.g. make it catchy, keep it technical...",
  generate_excerpt: "e.g. focus on practical aspects...",
};

export default function AiAssistant({
  content,
  onApplyContent,
  onApplyTitle,
  onApplyExcerpt,
}: AiAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>("actions");
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [instruction, setInstruction] = useState("");
  const [result, setResult] = useState<string | string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNearFooter, setIsNearFooter] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsNearFooter(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  function resetState() {
    setStep("actions");
    setSelectedAction(null);
    setInstruction("");
    setResult(null);
    setIsLoading(false);
    setError(null);
  }

  function handleToggle() {
    if (isOpen) {
      resetState();
    }
    setIsOpen((v) => !v);
  }

  function handleSelectAction(action: Action) {
    setSelectedAction(action);
    setStep("input");
    setInstruction("");
    setError(null);
    setResult(null);
  }

  async function handleGenerate() {
    if (!selectedAction) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: selectedAction,
          content,
          instruction,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setResult(data.result);
      setStep("result");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleApply() {
    if (!result || !selectedAction) return;
    if (selectedAction === "improve_writing") {
      onApplyContent(result as string);
    } else if (selectedAction === "generate_excerpt") {
      onApplyExcerpt(result as string);
    }
    setIsOpen(false);
    resetState();
  }

  function handleApplyTitle(title: string) {
    onApplyTitle(title);
    setIsOpen(false);
    resetState();
  }

  return (
    <>
      {/* Floating panel */}
      <div
        className={cn(
          "fixed right-6 z-50 w-80 transition-all duration-300",
          isNearFooter
            ? "bottom-[calc(100px+80px)] sm:bottom-[calc(70px+80px)]"
            : "bottom-20",
          isOpen
            ? "translate-y-0 pointer-events-auto"
            : "translate-y-2 pointer-events-none opacity-0",
        )}
        aria-hidden={!isOpen}
      >
        <div className="bg-bg-surface border border-border-default rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
            <div className="flex items-center gap-2">
              <SparkleIcon className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-text-primary">
                AI Assistant
              </span>
            </div>
            <button
              onClick={handleToggle}
              className="text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Close AI Assistant"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4">
            {step === "actions" && (
              <ActionsStep onSelect={handleSelectAction} />
            )}

            {step === "input" && selectedAction && (
              <InputStep
                action={selectedAction}
                instruction={instruction}
                isLoading={isLoading}
                error={error}
                onInstructionChange={setInstruction}
                onBack={() => setStep("actions")}
                onGenerate={handleGenerate}
              />
            )}

            {step === "result" && selectedAction && result !== null && (
              <ResultStep
                action={selectedAction}
                result={result}
                onBack={() => setStep("input")}
                onApply={handleApply}
                onApplyTitle={handleApplyTitle}
                onDismiss={resetState}
              />
            )}
          </div>
        </div>
      </div>

      {/* Floating trigger button */}
      <button
        onClick={handleToggle}
        className={cn(
          "fixed right-6 z-50 w-12 h-12 rounded-full bg-primary hover:bg-primary-hover text-white shadow-lg flex items-center justify-center transition-all duration-500",
          isNearFooter
            ? "bottom-[calc(100px+24px)] sm:bottom-[calc(70px+24px)]"
            : "bottom-6",
        )}
        aria-label="Toggle AI Assistant"
      >
        {isOpen ? (
          <XIcon className="w-5 h-5" />
        ) : (
          <SparkleIcon className="w-5 h-5" />
        )}
      </button>
    </>
  );
}

/* ── Sub-components ─────────────────────────────────────────────── */

function ActionsStep({ onSelect }: { onSelect: (a: Action) => void }) {
  const actions: Action[] = [
    "suggest_title",
    "generate_excerpt",
    "improve_writing",
  ];
  return (
    <div className="space-y-2">
      {actions.map((action) => (
        <button
          key={action}
          onClick={() => onSelect(action)}
          className="w-full text-left rounded-xl border border-border-default bg-bg-base p-4 hover:border-primary/50 transition-colors"
        >
          <p className="text-sm font-medium text-text-primary">
            {ACTION_LABELS[action]}
          </p>
          <p className="text-xs text-text-secondary mt-0.5">
            {ACTION_SUBTEXTS[action]}
          </p>
        </button>
      ))}
    </div>
  );
}

interface InputStepProps {
  action: Action;
  instruction: string;
  isLoading: boolean;
  error: string | null;
  onInstructionChange: (v: string) => void;
  onBack: () => void;
  onGenerate: () => void;
}

function InputStep({
  action,
  instruction,
  isLoading,
  error,
  onInstructionChange,
  onBack,
  onGenerate,
}: InputStepProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-text-primary">
          {ACTION_LABELS[action]}
        </p>
        <button
          onClick={onBack}
          className="text-xs text-text-secondary hover:text-text-primary transition-colors"
        >
          ← Back
        </button>
      </div>

      <textarea
        value={instruction}
        onChange={(e) => onInstructionChange(e.target.value)}
        placeholder={INSTRUCTION_PLACEHOLDERS[action]}
        rows={3}
        className="w-full rounded-lg border border-border-default bg-bg-base px-3 py-2 text-sm text-white placeholder-text-muted resize-y focus:outline-none focus:border-primary/60"
      />

      {error && <p className="text-xs text-danger">{error}</p>}

      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="w-full rounded-lg bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            Generating…
          </>
        ) : (
          "Generate"
        )}
      </button>
    </div>
  );
}

interface ResultStepProps {
  action: Action;
  result: string | string[];
  onBack: () => void;
  onApply: () => void;
  onApplyTitle: (title: string) => void;
  onDismiss: () => void;
}

function ResultStep({
  action,
  result,
  onBack,
  onApply,
  onApplyTitle,
  onDismiss,
}: ResultStepProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-text-primary">
          {ACTION_LABELS[action]}
        </p>
        <button
          onClick={onBack}
          className="text-xs text-text-secondary hover:text-text-primary transition-colors"
        >
          ← Back
        </button>
      </div>

      {action === "suggest_title" ? (
        <>
          <div className="space-y-2">
            {(result as string[]).map((title, i) => (
              <button
                key={i}
                onClick={() => onApplyTitle(title)}
                className="w-full text-left rounded-xl border border-border-default bg-bg-base p-3 text-sm text-text-primary hover:border-primary/50 transition-colors"
              >
                {title}
              </button>
            ))}
          </div>
          <button
            onClick={onDismiss}
            className="w-full rounded-lg border border-border-default px-4 py-2 text-sm text-text-secondary hover:border-border-strong hover:text-white transition-colors"
          >
            Dismiss
          </button>
        </>
      ) : (
        <>
          <div className="max-h-48 overflow-y-auto rounded-xl bg-bg-base p-3 text-sm text-text-primary leading-relaxed">
            {result as string}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onApply}
              className="flex-1 rounded-lg bg-primary hover:bg-primary-hover px-4 py-2 text-sm font-semibold text-white transition-colors"
            >
              Apply
            </button>
            <button
              onClick={onDismiss}
              className="flex-1 rounded-lg border border-border-default px-4 py-2 text-sm text-text-secondary hover:border-border-strong hover:text-white transition-colors"
            >
              Dismiss
            </button>
          </div>
        </>
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

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
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
