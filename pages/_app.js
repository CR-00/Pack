import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { MantineProvider } from "@mantine/core";
import { RouterTransition } from "../components/RouterTransition";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import theme from "../lib/theme";
import Page from "../components/Page";
import "../styles/index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider
      session={pageProps.session}
      refetchInterval={5 * 60}
      refetchOnWindowFocus={true}
    >
      <QueryClientProvider client={queryClient}>
        <Head>
          <title>Pack</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
        </Head>
        <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
          <RouterTransition />
          <Page>
            <Component {...pageProps} />
          </Page>
        </MantineProvider>
        {process.env.NEXT_PUBLIC_STAGE == "DEV" && (
          <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        )}
      </QueryClientProvider>
    </SessionProvider>
  );
}
