"use client";

import { useState } from "react";
import { DraftCard } from "./draft-card";
import type { Slot, SlotReveal } from "@/lib/types";

interface DraftCardsProps {
  texts: Record<Slot, string>;
  labels: Record<Slot, string>;
  reveal: SlotReveal[];
  draftId: string | null;
  onReveal: () => void;
}

const SLOTS: Slot[] = ["a", "b", "c"];

export function DraftCards({
  texts,
  labels,
  reveal,
  draftId,
  onReveal,
}: DraftCardsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  async function handleSelect(slot: Slot) {
    setSelectedSlot(slot);

    const revealData = reveal.find((r) => r.slot === slot);
    if (draftId && revealData) {
      const modelMap: Record<string, string> = {
        "GPT-4o": "openai",
        "Claude Sonnet 4.5": "anthropic",
        "Gemini 2.5 Flash": "google",
      };
      const selectedModel =
        modelMap[revealData.modelName] ?? revealData.modelName;

      await fetch(`/api/drafts/${draftId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedModel }),
      });
    }

    onReveal();
  }

  const activeSlot = SLOTS[activeIndex];

  return (
    <div className="w-full">
      {/* Tab buttons */}
      <div className="flex gap-2 mb-4">
        {SLOTS.map((slot, i) => (
          <button
            key={slot}
            onClick={() => setActiveIndex(i)}
            className={`flex-1 py-2 text-sm font-medium tracking-wide uppercase rounded-lg transition-colors ${
              i === activeIndex
                ? "bg-accent/15 text-accent border border-accent/30"
                : "bg-surface text-muted border border-white/5"
            }`}
          >
            {labels[slot] || `Draft ${["Alpha", "Beta", "Gamma"][i]}`}
          </button>
        ))}
      </div>

      {/* Active card */}
      <DraftCard
        key={activeSlot}
        label={labels[activeSlot] || ""}
        text={texts[activeSlot]}
        modelName={reveal.find((r) => r.slot === activeSlot)?.modelName}
        onSelect={() => handleSelect(activeSlot)}
        isRevealed={selectedSlot !== null}
      />
    </div>
  );
}
