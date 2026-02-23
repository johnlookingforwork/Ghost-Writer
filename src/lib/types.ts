export type Slot = "a" | "b" | "c";
export type DraftLabel = "Alpha" | "Beta" | "Gamma";

export interface SlotMapping {
  slot: Slot;
  label: DraftLabel;
}

export interface SlotReveal extends SlotMapping {
  modelName: string;
}

export type GenerateState = "idle" | "streaming" | "reviewing" | "revealed";

export interface Draft {
  id: string;
  user_id: string;
  raw_input: string;
  model_a_name: string;
  model_a_text: string | null;
  model_b_name: string;
  model_b_text: string | null;
  model_c_name: string;
  model_c_text: string | null;
  selected_model: string | null;
  created_at: string;
}

export interface SSEInitEvent {
  type: "init";
  mapping: SlotMapping[];
}

export interface SSEChunkEvent {
  type: "chunk";
  slot: Slot;
  text: string;
}

export interface SSEDoneEvent {
  type: "done";
  slot: Slot;
}

export interface SSECompleteEvent {
  type: "complete";
  draftId: string;
  reveal: SlotReveal[];
}

export type SSEEvent =
  | SSEInitEvent
  | SSEChunkEvent
  | SSEDoneEvent
  | SSECompleteEvent;
