"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { CloseIcon, SparkleIcon } from "../shared/icons";
import ActionsStep from "./ActionsStep";
import ResultStep from "./ResultStep";
import InputStep from "./InputStep";

export type Action = "improve_writing" | "suggest_title" | "generate_excerpt";
type Step = "actions" | "input" | "result";

interface AiAssistantProps {
  content: string;
  onApplyContent: (value: string) => void;
  onApplyTitle: (value: string) => void;
  onApplyExcerpt: (value: string) => void;
}

export const ACTION_LABELS: Record<Action, string> = {
  improve_writing: "Improve writing",
  suggest_title: "Suggest title",
  generate_excerpt: "Generate excerpt",
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
              <div className="text-primary">
                <SparkleIcon />
              </div>
              <span className="text-sm font-semibold text-text-primary">
                AI Assistant
              </span>
            </div>
            <button
              onClick={handleToggle}
              className="group"
              aria-label="Close AI Assistant"
            >
              <CloseIcon
                size="20"
                className="fill-text-secondary group-hover:fill-text-primary"
              />
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
          "fixed right-6 z-50 w-12 h-12 rounded-full bg-primary hover:bg-primary-hover text-text-primary shadow-lg flex items-center justify-center transition-all duration-500",
          isNearFooter
            ? "bottom-[calc(100px+24px)] sm:bottom-[calc(70px+24px)]"
            : "bottom-6",
        )}
        aria-label="Toggle AI Assistant"
      >
        {isOpen ? <CloseIcon size="20" /> : <SparkleIcon />}
      </button>
    </>
  );
}
