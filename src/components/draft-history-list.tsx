"use client";

import { useState } from "react";
import type { Draft } from "@/lib/types";

interface DraftHistoryListProps {
  drafts: Draft[];
  onDelete: (id: string) => void;
}

const MODEL_DISPLAY_NAMES: Record<string, string> = {
  openai: "GPT-4o",
  anthropic: "Claude Sonnet 4.5",
  google: "Gemini 2.5 Flash",
};

export function DraftHistoryList({ drafts, onDelete }: DraftHistoryListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (drafts.length === 0) {
    return (
      <div className="text-center text-muted py-12">
        <p className="font-serif text-lg">No drafts yet.</p>
        <p className="text-sm mt-2">Start writing to see your history here.</p>
      </div>
    );
  }

  function getDraftSlots(draft: Draft) {
    return [
      { label: "A", modelName: draft.model_a_name, text: draft.model_a_text },
      { label: "B", modelName: draft.model_b_name, text: draft.model_b_text },
      { label: "C", modelName: draft.model_c_name, text: draft.model_c_text },
    ];
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const res = await fetch(`/api/drafts/${id}`, { method: "DELETE" });
    if (res.ok) {
      onDelete(id);
      if (expandedId === id) setExpandedId(null);
    }
    setDeletingId(null);
  }

  return (
    <div className="space-y-3">
      {drafts.map((draft) => {
        const isExpanded = expandedId === draft.id;
        const slots = getDraftSlots(draft);

        return (
          <div
            key={draft.id}
            className="bg-surface rounded-xl border border-white/5 overflow-hidden"
          >
            {/* Summary row */}
            <button
              onClick={() => {
                setExpandedId(isExpanded ? null : draft.id);
                setActiveTab(0);
              }}
              className="w-full text-left p-4 space-y-2"
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
                <div className="flex items-center gap-2">
                  {draft.selected_model ? (
                    <span className="text-accent text-xs">
                      {MODEL_DISPLAY_NAMES[draft.selected_model] ??
                        draft.selected_model}
                    </span>
                  ) : (
                    <span className="text-muted/50 text-xs">No selection</span>
                  )}
                  <span className="text-muted text-xs">
                    {isExpanded ? "▲" : "▼"}
                  </span>
                </div>
              </div>
            </button>

            {/* Expanded view with 3 drafts */}
            {isExpanded && (
              <div className="border-t border-white/5 p-4 space-y-3">
                {/* Tab buttons */}
                <div className="flex gap-2">
                  {slots.map((slot, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveTab(i)}
                      className={`flex-1 py-2 text-xs font-medium tracking-wide uppercase rounded-lg transition-colors ${
                        i === activeTab
                          ? "bg-accent/15 text-accent border border-accent/30"
                          : "bg-background text-muted border border-white/5"
                      }`}
                    >
                      {MODEL_DISPLAY_NAMES[slot.modelName] ?? slot.modelName}
                      {draft.selected_model === slot.modelName && " ★"}
                    </button>
                  ))}
                </div>

                {/* Active draft text */}
                <div className="overflow-y-auto max-h-[50vh] overscroll-contain">
                  <p className="font-serif text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                    {slots[activeTab].text || (
                      <span className="text-muted italic">
                        No text generated
                      </span>
                    )}
                  </p>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(draft.id)}
                  disabled={deletingId === draft.id}
                  className="w-full text-red-400/70 hover:text-red-400 hover:bg-red-400/10 border border-red-400/20 disabled:opacity-50 transition-colors text-xs font-medium py-2 rounded-lg"
                >
                  {deletingId === draft.id ? "Deleting..." : "Delete entry"}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
