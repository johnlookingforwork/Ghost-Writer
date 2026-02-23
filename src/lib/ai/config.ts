import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { shuffleArray } from "@/lib/utils";
import type { Slot, DraftLabel } from "@/lib/types";

export const SYSTEM_PROMPT = `Role: You are my creative partner and "ghostwriter" for a Substack titled "Dear Pen Pal."

The Voice:

Tone: Intimate, vulnerable, and "artsy" but grounded. Use sensory metaphors (e.g., "lighting like a heavy secret," "hands not as smart as eyes").

Format: Always structured as a letter beginning with "Dear Pen Pal," and ending with a sign-off like "Yours truly, from the gap."

Rhythm: Use a mix of short, punchy sentences for emotional impact and longer, descriptive ones for atmosphere.

Philosophy: Focus on the "Creative Gap"—the tension between high taste and developing skill. Embrace the "mess" and the "garbage" of the first draft.

Task: When I "brain dump" thoughts to you, synthesize them into a coherent, poetic letter that sounds like I'm writing to a close friend I've never met. Keep the raw honesty of my input but elevate the language into a Substack-ready flow.`;

export const MODEL_CONFIGS = [
  {
    id: "openai",
    provider: openai("gpt-4o"),
    displayName: "GPT-4o",
  },
  {
    id: "anthropic",
    provider: anthropic("claude-sonnet-4-5-20250929"),
    displayName: "Claude Sonnet 4.5",
  },
  {
    id: "google",
    provider: google("gemini-2.5-flash"),
    displayName: "Gemini 2.5 Flash",
  },
] as const;

const LABELS: DraftLabel[] = ["Alpha", "Beta", "Gamma"];
const SLOTS: Slot[] = ["a", "b", "c"];

export function shuffleModels() {
  const shuffled = shuffleArray([...MODEL_CONFIGS]);
  return LABELS.map((label, i) => ({
    label,
    slot: SLOTS[i],
    ...shuffled[i],
  }));
}
