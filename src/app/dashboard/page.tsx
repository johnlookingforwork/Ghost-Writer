"use client";

import { useState, useCallback, useEffect } from "react";
import { BrainDumpInput } from "@/components/brain-dump-input";
import { StreamingOverlay } from "@/components/streaming-overlay";
import { DraftCards } from "@/components/draft-cards";
import type { GenerateState, Slot, SlotReveal } from "@/lib/types";

const STORAGE_KEY = "ghost-writer-session";

interface SessionState {
  state: GenerateState;
  texts: Record<Slot, string>;
  labels: Record<Slot, string>;
  reveal: SlotReveal[];
  draftId: string | null;
}

function saveSession(session: SessionState) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Ignore storage errors
  }
}

function loadSession(): SessionState | null {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const session = JSON.parse(stored) as SessionState;
    // Only restore if we were in reviewing state (had completed drafts)
    if (session.state === "reviewing" || session.state === "revealed") {
      return session;
    }
    return null;
  } catch {
    return null;
  }
}

function clearSession() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}

export default function DashboardPage() {
  const [state, setState] = useState<GenerateState>("idle");
  const [texts, setTexts] = useState<Record<Slot, string>>({
    a: "",
    b: "",
    c: "",
  });
  const [labels, setLabels] = useState<Record<Slot, string>>({
    a: "",
    b: "",
    c: "",
  });
  const [reveal, setReveal] = useState<SlotReveal[]>([]);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);

  // Restore session on mount
  useEffect(() => {
    const session = loadSession();
    if (session) {
      setState(session.state);
      setTexts(session.texts);
      setLabels(session.labels);
      setReveal(session.reveal);
      setDraftId(session.draftId);
    }
    setRestored(true);
  }, []);

  // Persist session when in reviewing state
  useEffect(() => {
    if (!restored) return;
    if (state === "reviewing" || state === "revealed") {
      saveSession({ state, texts, labels, reveal, draftId });
    }
  }, [state, texts, labels, reveal, draftId, restored]);

  const generate = useCallback(async (rawInput: string) => {
    setState("streaming");
    setTexts({ a: "", b: "", c: "" });
    setLabels({ a: "", b: "", c: "" });
    setReveal([]);
    setDraftId(null);

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rawInput }),
    });

    if (!res.ok || !res.body) {
      setState("idle");
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let doneCount = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n\n");
      buffer = lines.pop()!;

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        try {
          const data = JSON.parse(line.slice(6));

          if (data.type === "init") {
            const labelMap: Record<string, string> = {};
            data.mapping.forEach(
              (m: { slot: string; label: string }) =>
                (labelMap[m.slot] = m.label)
            );
            setLabels(labelMap as Record<Slot, string>);
          } else if (data.type === "chunk") {
            setTexts((prev) => ({
              ...prev,
              [data.slot]: prev[data.slot as Slot] + data.text,
            }));
          } else if (data.type === "done") {
            doneCount++;
            if (doneCount === 3) {
              setState("reviewing");
            }
          } else if (data.type === "complete") {
            setDraftId(data.draftId);
            setReveal(data.reveal);
          }
        } catch {
          // Skip malformed JSON
        }
      }
    }
  }, []);

  function handleReset() {
    setState("idle");
    setTexts({ a: "", b: "", c: "" });
    setLabels({ a: "", b: "", c: "" });
    setReveal([]);
    setDraftId(null);
    clearSession();
  }

  // Don't render until we've checked for a saved session
  if (!restored) return null;

  return (
    <div>
      <StreamingOverlay visible={state === "streaming"} />

      {state === "idle" && (
        <div>
          <h2 className="font-serif text-2xl mb-6">Brain Dump</h2>
          <BrainDumpInput onSubmit={generate} />
        </div>
      )}

      {(state === "reviewing" || state === "revealed") && (
        <div>
          <h2 className="font-serif text-2xl mb-6 text-center">
            {state === "revealed" ? "Selected" : "Choose your draft"}
          </h2>
          <DraftCards
            texts={texts}
            labels={labels}
            reveal={reveal}
            draftId={draftId}
            onReveal={() => setState("revealed")}
          />
          {state === "revealed" && (
            <div className="mt-8 text-center">
              <button
                onClick={handleReset}
                className="bg-surface hover:bg-surface-hover border border-white/10 transition-colors text-foreground font-medium py-3 px-8 rounded-full text-sm"
              >
                Write another
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
