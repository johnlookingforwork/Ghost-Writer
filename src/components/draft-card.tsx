"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface DraftCardProps {
  label: string;
  text: string;
  modelName?: string;
  onSelect: () => void;
  isRevealed: boolean;
}

export function DraftCard({
  label,
  text,
  modelName,
  onSelect,
  isRevealed,
}: DraftCardProps) {
  const [flipped, setFlipped] = useState(false);

  function handleSelect() {
    setFlipped(true);
    onSelect();
  }

  return (
    <div className="w-full" style={{ perspective: 1000 }}>
      <motion.div
        className="relative w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* Front face */}
        <div
          className="w-full bg-surface rounded-2xl border border-white/5 p-6 flex flex-col"
          style={{ backfaceVisibility: "hidden" }}
        >
          <h3 className="text-accent text-sm font-medium tracking-widest uppercase mb-4">
            Draft {label}
          </h3>
          <div className="overflow-y-auto max-h-[60vh] mb-4 overscroll-contain">
            <p className="font-serif text-foreground leading-relaxed whitespace-pre-wrap">
              {text || (
                <span className="text-muted italic">Waiting for words...</span>
              )}
            </p>
          </div>
          {!isRevealed && text && (
            <button
              onClick={handleSelect}
              className="w-full bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20 transition-colors font-medium py-3 rounded-xl text-sm flex-shrink-0"
            >
              Choose this draft
            </button>
          )}
        </div>

        {/* Back face */}
        <div
          className="absolute inset-0 w-full bg-surface rounded-2xl border border-accent/20 p-6 flex flex-col items-center justify-center"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={flipped ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-center space-y-4"
          >
            <p className="text-muted text-sm uppercase tracking-widest">
              Authored by
            </p>
            <h3 className="text-accent text-2xl font-serif">{modelName}</h3>
            <p className="text-muted text-sm">Draft {label}</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
