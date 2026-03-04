"use client";

import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "@/lib/auth";

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
});

export const { signIn, signUp, signOut, useSession } = authClient;

export function useUser() {
  const { data: session, isPending } = authClient.useSession();
  
  return { user: session?.user ?? null, isPending };
}

export function useIsAdmin() {
  const { data: session } = authClient.useSession();
  return session?.user?.role === "ADMIN";
}
