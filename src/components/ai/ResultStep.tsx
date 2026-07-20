import Buttons from "../shared/button";
import { Action, ACTION_LABELS } from "./AiAssistant";

interface ResultStepProps {
  action: Action;
  result: string | string[];
  onBack: () => void;
  onApply: () => void;
  onApplyTitle: (title: string) => void;
  onDismiss: () => void;
}

export default function ResultStep({
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
          <Buttons intent="secondary" onClick={onDismiss}>
            Dismiss
          </Buttons>
        </>
      ) : (
        <>
          <div className="max-h-48 overflow-y-auto rounded-xl bg-bg-base p-3 text-sm text-text-primary leading-relaxed">
            {result as string}
          </div>
          <div className="flex gap-2">
            <Buttons onClick={onApply}>Apply</Buttons>
            <Buttons intent="secondary" onClick={onDismiss}>
              Dismiss
            </Buttons>
          </div>
        </>
      )}
    </div>
  );
}
