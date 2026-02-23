"use client";

import { useEffect, useState } from "react";
import { LeaderboardTable } from "@/components/leaderboard-table";
import type { Draft } from "@/lib/types";

const MODEL_DISPLAY_NAMES: Record<string, string> = {
  openai: "GPT-4o",
  anthropic: "Claude Sonnet 4.5",
  google: "Gemini 2.5 Flash",
};

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<
    { model: string; displayName: string; wins: number; percentage: number }[]
  >([]);
  const [totalDrafts, setTotalDrafts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const res = await fetch("/api/drafts");
      if (res.ok) {
        const drafts: Draft[] = await res.json();
        const selected = drafts.filter((d) => d.selected_model);
        const total = selected.length;
        setTotalDrafts(total);

        const counts: Record<string, number> = {};
        selected.forEach((d) => {
          counts[d.selected_model!] = (counts[d.selected_model!] || 0) + 1;
        });

        const sorted = Object.entries(counts)
          .map(([model, wins]) => ({
            model,
            displayName: MODEL_DISPLAY_NAMES[model] ?? model,
            wins,
            percentage: total > 0 ? Math.round((wins / total) * 100) : 0,
          }))
          .sort((a, b) => b.wins - a.wins);

        setEntries(sorted);
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  return (
    <div>
      <h2 className="font-serif text-2xl mb-6">Leaderboard</h2>
      {loading ? (
        <p className="text-muted text-center py-12">Loading...</p>
      ) : (
        <LeaderboardTable entries={entries} totalDrafts={totalDrafts} />
      )}
    </div>
  );
}
