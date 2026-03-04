import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { initTRPC, TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import { cache } from "react";
import superjson from "superjson";

export const createTRPCContext = cache(async () => {
  const sessionData = await auth.api.getSession({
    headers: await headers(),
  });

  return {
    session: sessionData?.user ? sessionData : null,
    db: prisma,
  };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const authMiddleware = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Bạn cần đăng nhập để thực hiện hành động này",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.session.user,
    },
  });
});

export const adminMiddleware = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Bạn cần đăng nhập để thực hiện hành động này",
    });
  }

  if (ctx.session.user.role !== "ADMIN") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Bạn không có quyền thực hiện hành động này",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.session.user,
    },
  });
});

export const protectedProcedure = baseProcedure.use(authMiddleware);

export const adminProcedure = baseProcedure.use(adminMiddleware);
