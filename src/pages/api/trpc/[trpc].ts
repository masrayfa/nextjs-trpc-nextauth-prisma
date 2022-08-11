import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";
import { createContext } from "../../../server/context";
import { appRouter } from "../../../server/routers/_app";

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext, // It's the same like createContext: createContext

  batching: {
    enabled: true,
  },
  onError({ error }) {
    if (error.code === "INTERNAL_SERVER_ERROR") {
      console.error("Something went wrong", error);
    }
  },
});
