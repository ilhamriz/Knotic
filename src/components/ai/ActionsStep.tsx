import { Action, ACTION_LABELS } from "./AiAssistant";

const ACTION_SUBTEXTS: Record<Action, string> = {
  improve_writing: "Enhance clarity, structure and flow",
  suggest_title: "Get 3 title options based on your content",
  generate_excerpt: "Create a compelling summary",
};

export default function ActionsStep({
  onSelect,
}: {
  onSelect: (a: Action) => void;
}) {
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
