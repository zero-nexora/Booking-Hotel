import { createUploadthing, type FileRouter } from "uploadthing/next";
import { requireAdmin, requireAuth } from "@/lib/auth";

const f = createUploadthing();

type AuthUser = { role: string; id: string };

async function adminMiddleware() {
  const session = await requireAdmin();
  return { userId: (session.user as AuthUser).id };
}

async function authMiddleware() {
  const session = await requireAuth();
  return { userId: session.user.id };
}

export const ourFileRouter = {
  hotelImages: f({ image: { maxFileSize: "8MB", maxFileCount: 10 } })
    .middleware(adminMiddleware)
    .onUploadComplete(async ({ metadata, file }) => ({
      uploadedBy: metadata.userId,
      url: file.ufsUrl,
      name: file.name,
    })),

  roomImages: f({ image: { maxFileSize: "8MB", maxFileCount: 10 } })
    .middleware(adminMiddleware)
    .onUploadComplete(async ({ metadata, file }) => ({
      uploadedBy: metadata.userId,
      url: file.ufsUrl,
      name: file.name,
    })),

  profileImage: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(authMiddleware)
    .onUploadComplete(async ({ metadata, file }) => ({
      uploadedBy: metadata.userId,
      url: file.ufsUrl,
      name: file.name,
    })),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
