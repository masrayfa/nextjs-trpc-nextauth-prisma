import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const hello = trpc.useQuery(["hailo-semua", { text: "dari" }]);
  if (!hello.data) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h1>{hello.data.greeting}</h1>
    </div>
  );
};

export default Home;
