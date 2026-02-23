"use client";

import { useState } from "react";

interface BrainDumpInputProps {
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

export function BrainDumpInput({ onSubmit, disabled }: BrainDumpInputProps) {
  const [text, setText] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSubmit(text.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
        placeholder="Pour your thoughts here..."
        className="flex-1 w-full bg-transparent text-foreground text-lg leading-relaxed placeholder:text-muted/50 resize-none focus:outline-none font-serif min-h-[300px]"
      />
      <div className="pt-4">
        <button
          type="submit"
          disabled={!text.trim() || disabled}
          className="w-full bg-accent hover:bg-accent-dim disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-background font-medium py-3 rounded-full text-sm tracking-wide uppercase"
        >
          Transmit
        </button>
      </div>
    </form>
  );
}
