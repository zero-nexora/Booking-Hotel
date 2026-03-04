import { createTRPCRouter } from '../init';
import { adminRouter } from './admin';
import { clientRouter } from './client';
export const appRouter = createTRPCRouter({
  client: clientRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;