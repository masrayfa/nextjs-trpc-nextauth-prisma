import * as trpc from "@trpc/server";
import { CreateContextType } from "./context";
import superjson from "superjson";

export function createRouter() {
  return trpc.router<CreateContextType>().transformer(superjson);
}
