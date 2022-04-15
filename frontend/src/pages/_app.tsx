import type { AppProps } from "next/app";
import Head from "next/head";
import { RelayEnvironmentProvider } from "react-relay/hooks";
import { ErrorBoundary } from "react-error-boundary";
import { ClientRenderingOnly } from "ClientRenderingOnly";
import { relayEnv } from "../relayEnvironment";
import { NotAuthenticatedErrorBoundary } from "../auth";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex,nofollow" />
        <title>フリオク！</title>
      </Head>
      <div>
        <ClientRenderingOnly>
          <RelayEnvironmentProvider environment={relayEnv}>
            <ErrorBoundary FallbackComponent={NotAuthenticatedErrorBoundary}>
              <Component {...pageProps} />
            </ErrorBoundary>
          </RelayEnvironmentProvider>
        </ClientRenderingOnly>
      </div>
    </>
  );
}

export default MyApp;
