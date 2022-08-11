import * as trpc from "@trpc/server";
import { z } from "zod";
import { createRouter } from "../createRouter";
import { userRouter } from "./user.router";

// export type definition of API
export const appRouter = createRouter().merge("users.", userRouter);

export type AppRouter = typeof appRouter;
