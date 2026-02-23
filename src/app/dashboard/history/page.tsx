"use client";

import { useEffect, useState } from "react";
import { DraftHistoryList } from "@/components/draft-history-list";
import type { Draft } from "@/lib/types";

export default function HistoryPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDrafts() {
      const res = await fetch("/api/drafts");
      if (res.ok) {
        const data = await res.json();
        setDrafts(data);
      }
      setLoading(false);
    }
    fetchDrafts();
  }, []);

  return (
    <div>
      <h2 className="font-serif text-2xl mb-6">History</h2>
      {loading ? (
        <p className="text-muted text-center py-12">Loading...</p>
      ) : (
        <DraftHistoryList
          drafts={drafts}
          onDelete={(id) => setDrafts((prev) => prev.filter((d) => d.id !== id))}
        />
      )}
    </div>
  );
}
