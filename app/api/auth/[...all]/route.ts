import { auth } from "@/lib/auth";
import { checkRateLimit, rateLimiters } from "@/lib/rate-limit";
import { toNextJsHandler } from "better-auth/next-js";
import { headers } from "next/headers";

const { POST: authPOST, GET: authGET } = toNextJsHandler(auth);

const getIdentifier = async (): Promise<string> => {
  const headersList = await headers();
  const forwarded = headersList.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "anonymous";
  return `auth:${ip}`;
};

const withRateLimit =
  (handler: (req: Request) => Promise<Response>) =>
  async (req: Request): Promise<Response> => {
    try {
      const identifier = await getIdentifier();
      await checkRateLimit(rateLimiters.auth, identifier);

      return handler(req);
    } catch {
      return new Response(
        JSON.stringify({ message: "Quá nhiều yêu cầu, vui lòng thử lại sau" }),
        { status: 429 },
      );
    }
  };

export const POST = withRateLimit(authPOST);
export const GET = withRateLimit(authGET);
