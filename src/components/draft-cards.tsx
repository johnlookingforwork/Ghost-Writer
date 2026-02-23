"use client";

import { useState } from "react";
import { useSwipeable } from "react-swipeable";
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

  const handlers = useSwipeable({
    onSwipedLeft: () =>
      setActiveIndex((prev) => Math.min(prev + 1, SLOTS.length - 1)),
    onSwipedRight: () => setActiveIndex((prev) => Math.max(prev - 1, 0)),
    trackMouse: true,
  });

  async function handleSelect(slot: Slot) {
    setSelectedSlot(slot);

    // Find the model ID for this slot from reveal data
    const revealData = reveal.find((r) => r.slot === slot);
    if (draftId && revealData) {
      // Map display name back to provider ID
      const modelMap: Record<string, string> = {
        "GPT-4o": "openai",
        "Claude 3.5 Sonnet": "anthropic",
        "Gemini 1.5 Pro": "google",
      };
      const selectedModel = modelMap[revealData.modelName] ?? revealData.modelName;

      await fetch(`/api/drafts/${draftId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedModel }),
      });
    }

    onReveal();
  }

  return (
    <div {...handlers} className="w-full overflow-hidden">
      <div
        className="flex transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {SLOTS.map((slot) => (
          <DraftCard
            key={slot}
            label={labels[slot] || ""}
            text={texts[slot]}
            modelName={reveal.find((r) => r.slot === slot)?.modelName}
            onSelect={() => handleSelect(slot)}
            isRevealed={selectedSlot !== null}
          />
        ))}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {SLOTS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === activeIndex ? "bg-accent" : "bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
