import { NextRequest } from "next/server";
import { gemini, STAYWISE_SYSTEM_PROMPT } from "@/lib/gemini";
import { z } from "zod";

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "model"]),
        content: z.string().max(2000),
      }),
    )
    .min(1)
    .max(50),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = bodySchema.safeParse(body);

    if (!parsed.success) {
      return new Response("Invalid request", { status: 400 });
    }

    const { messages } = parsed.data;

    const contents = messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.content }],
    }));

    const result = await gemini.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: STAYWISE_SYSTEM_PROMPT,
      },
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result) {
            const text = chunk.text;
            if (text) controller.enqueue(encoder.encode(text));
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    console.error("[ai/chat]", err);
    return new Response("Lỗi máy chủ. Vui lòng thử lại.", {
      status: 500,
    });
  }
}
