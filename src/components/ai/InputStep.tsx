import Buttons from "../shared/button";
import LoadingSpinner from "../shared/loading-spinner";
import { Action, ACTION_LABELS } from "./AiAssistant";

interface InputStepProps {
  action: Action;
  instruction: string;
  isLoading: boolean;
  error: string | null;
  onInstructionChange: (v: string) => void;
  onBack: () => void;
  onGenerate: () => void;
}

const INSTRUCTION_PLACEHOLDERS: Record<Action, string> = {
  improve_writing: "e.g. make it more concise, fix the intro...",
  suggest_title: "e.g. make it catchy, keep it technical...",
  generate_excerpt: "e.g. focus on practical aspects...",
};

export default function InputStep({
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
        className="w-full rounded-lg border border-border-default bg-bg-base px-3 py-2 text-sm text-text-primary placeholder-text-muted resize-y focus:outline-none focus:border-primary/60"
      />

      {error && <p className="text-xs text-danger">{error}</p>}

      <Buttons onClick={onGenerate} disabled={isLoading}>
        {isLoading ? (
          <>
            <LoadingSpinner />
            Generating…
          </>
        ) : (
          "Generate"
        )}
      </Buttons>
    </div>
  );
}
