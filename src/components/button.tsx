import React from "react";
import { trpc } from "../utils/trpc";


export default function button() {
  const hello = trpc.useQuery(["hailo-semua"]);
  return <div>button</div>;
}
