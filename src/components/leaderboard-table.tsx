"use client";

interface LeaderboardEntry {
  model: string;
  displayName: string;
  wins: number;
  percentage: number;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  totalDrafts: number;
}

export function LeaderboardTable({
  entries,
  totalDrafts,
}: LeaderboardTableProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center text-muted py-12">
        <p className="font-serif text-lg">No drafts selected yet.</p>
        <p className="text-sm mt-2">
          Start writing to see which model captures your voice.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-muted text-sm">{totalDrafts} drafts selected</p>
      {entries.map((entry) => (
        <div key={entry.model} className="space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="font-serif text-foreground">
              {entry.displayName}
            </span>
            <span className="text-accent text-sm font-mono">
              {entry.wins} wins ({entry.percentage}%)
            </span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${entry.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
