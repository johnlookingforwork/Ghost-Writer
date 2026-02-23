import { streamText } from "ai";
import { createClient } from "@/lib/supabase/server";
import { SYSTEM_PROMPT, shuffleModels } from "@/lib/ai/config";

export async function POST(req: Request) {
  const { rawInput } = await req.json();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const models = shuffleModels();

  const streamResults = models.map((m) =>
    streamText({
      model: m.provider,
      system: SYSTEM_PROMPT,
      prompt: rawInput,
    })
  );

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      // Send label mapping (without model names)
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({
            type: "init",
            mapping: models.map((m) => ({ slot: m.slot, label: m.label })),
          })}\n\n`
        )
      );

      const fullTexts: Record<string, string> = { a: "", b: "", c: "" };

      // Process all three streams concurrently
      const promises = streamResults.map(async (streamResult, i) => {
        const slot = models[i].slot;
        try {
          for await (const chunk of streamResult.textStream) {
            fullTexts[slot] += chunk;
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "chunk", slot, text: chunk })}\n\n`
              )
            );
          }
        } catch (error) {
          fullTexts[slot] = `[Error generating draft: ${error instanceof Error ? error.message : "Unknown error"}]`;
        }
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "done", slot })}\n\n`
          )
        );
      });

      await Promise.all(promises);

      // Save draft to Supabase
      const modelA = models.find((m) => m.slot === "a")!;
      const modelB = models.find((m) => m.slot === "b")!;
      const modelC = models.find((m) => m.slot === "c")!;

      const { data: draft } = await supabase
        .from("drafts")
        .insert({
          user_id: user.id,
          raw_input: rawInput,
          model_a_name: modelA.id,
          model_a_text: fullTexts["a"],
          model_b_name: modelB.id,
          model_b_text: fullTexts["b"],
          model_c_name: modelC.id,
          model_c_text: fullTexts["c"],
        })
        .select("id")
        .single();

      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({
            type: "complete",
            draftId: draft?.id,
            reveal: models.map((m) => ({
              slot: m.slot,
              label: m.label,
              modelName: m.displayName,
            })),
          })}\n\n`
        )
      );

      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
