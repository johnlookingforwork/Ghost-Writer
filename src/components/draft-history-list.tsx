"use client";

import type { Draft } from "@/lib/types";

interface DraftHistoryListProps {
  drafts: Draft[];
}

const MODEL_DISPLAY_NAMES: Record<string, string> = {
  openai: "GPT-4o",
  anthropic: "Claude Sonnet 4.5",
  google: "Gemini 2.5 Flash",
};

export function DraftHistoryList({ drafts }: DraftHistoryListProps) {
  if (drafts.length === 0) {
    return (
      <div className="text-center text-muted py-12">
        <p className="font-serif text-lg">No drafts yet.</p>
        <p className="text-sm mt-2">Start writing to see your history here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {drafts.map((draft) => (
        <div
          key={draft.id}
          className="bg-surface rounded-xl border border-white/5 p-4 space-y-2"
        >
          <p className="text-foreground text-sm line-clamp-2">
            {draft.raw_input}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-muted text-xs">
              {new Date(draft.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            {draft.selected_model ? (
              <span className="text-accent text-xs">
                {MODEL_DISPLAY_NAMES[draft.selected_model] ??
                  draft.selected_model}
              </span>
            ) : (
              <span className="text-muted/50 text-xs">No selection</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
