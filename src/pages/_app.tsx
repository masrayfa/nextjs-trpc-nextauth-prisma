import "../styles/globals.css";
import { withTRPC } from "@trpc/next";
import { AppType } from "next/dist/shared/lib/utils";
import { AppRouter } from "../server/routers/_app";
import superjson from "superjson";
import { SessionProvider } from "next-auth/react";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};
export default withTRPC<AppRouter>({
  config({ ctx }) {
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : "http://localhost:3000/api/trpc";

    // During ssr below
    const ONE_DAY_SECONDS = 60 * 60 * 24;
    ctx?.res?.setHeader(
      "Cache-Control",
      `s-maxage=1, stale-while-revalidate=${ONE_DAY_SECONDS}`
    );

    return {
      url,
      transformer: superjson,
      headers: {
        "x-ssr": "1",
      },
    };
  },

  ssr: true,
})(MyApp);

// export default MyApp;
