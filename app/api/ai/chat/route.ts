import { NextRequest } from "next/server";
import { gemini, STAYWISE_SYSTEM_PROMPT } from "@/lib/gemini";
import { checkRateLimit, rateLimiters } from "@/lib/rate-limit";
import { z } from "zod";

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "model"]),
        content: z.string().min(1).max(2000),
      }),
    )
    .min(1)
    .max(50),
});

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "anonymous"
  );
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  try {
    await checkRateLimit(rateLimiters.aiChat, ip);
  } catch {
    return new Response("Quá nhiều yêu cầu. Vui lòng thử lại sau.", {
      status: 429,
    });
  }

  let parsed: z.infer<typeof bodySchema>;
  try {
    const body = await req.json();
    const result = bodySchema.safeParse(body);
    if (!result.success)
      return new Response("Dữ liệu không hợp lệ.", { status: 400 });
    parsed = result.data;
  } catch {
    return new Response("Dữ liệu không hợp lệ.", { status: 400 });
  }

  try {
    const contents = parsed.messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.content }],
    }));

    const result = await gemini.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: STAYWISE_SYSTEM_PROMPT,
        maxOutputTokens: 1024,
        temperature: 0.4,
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
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[ai/chat]", err);
    return new Response("Lỗi máy chủ. Vui lòng thử lại.", { status: 500 });
  }
}