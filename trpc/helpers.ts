import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const paginationInput = z.object({
  page: z.number().min(1).default(DEFAULT_PAGE),
  limit: z.number().min(1).max(100).default(DEFAULT_PAGE_SIZE),
});

export type PaginationInput = z.infer<typeof paginationInput>;

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export const buildPaginatedResult = <T>(
  items: T[],
  total: number,
  { page, limit }: PaginationInput,
): PaginatedResult<T> => ({
  items,
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
});

export const getSkip = ({ page, limit }: PaginationInput): number =>
  (page - 1) * limit;

export const assertFound = <T>(
  value: T | null | undefined,
  message = "Không tìm thấy",
): T => {
  if (value == null) throw new TRPCError({ code: "NOT_FOUND", message });
  return value;
};

export const cursorInput = z
  .object({ id: z.string(), updatedAt: z.date() })
  .optional();

export type CursorInput = z.infer<typeof cursorInput>;

export const buildCursorWhere = (cursor: CursorInput) => {
  if (!cursor) return undefined;
  return {
    OR: [
      { updatedAt: { lt: cursor.updatedAt } },
      { updatedAt: cursor.updatedAt, id: { lt: cursor.id } },
    ],
  };
};

export const getNextCursor = <T extends { id: string; updatedAt: Date }>(
  items: T[],
  limit: number,
): { id: string; updatedAt: Date } | null => {
  if (items.length <= limit) return null;
  const last = items[items.length - 1]!;
  return { id: last.id, updatedAt: last.updatedAt };
};

export const popNextCursor = <T extends { id: string; updatedAt: Date }>(
  items: T[],
  limit: number,
): { items: T[]; nextCursor: { id: string; updatedAt: Date } | null } => {
  let nextCursor: { id: string; updatedAt: Date } | null = null;
  if (items.length > limit) {
    items.pop();
    const last = items[items.length - 1]!;
    nextCursor = { id: last.id, updatedAt: last.updatedAt };
  }
  return { items, nextCursor };
};
