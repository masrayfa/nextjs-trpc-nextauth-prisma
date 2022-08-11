import { inferAsyncReturnType } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { PrismaClient } from "@prisma/client";
import { unstable_getServerSession } from "next-auth";
import { nextAuthOptions } from "../pages/api/auth/[...nextauth]";

const prisma = new PrismaClient();

export async function createContext(opts?: trpcNext.CreateNextContextOptions) {
  const req = opts?.req;
  const res = opts?.res;

  const session =
    req && res && (await unstable_getServerSession(req, res, nextAuthOptions));

  return {
    req,
    res,
    session,
    prisma,
  };
}

export type CreateContextType = inferAsyncReturnType<typeof createContext>;
