import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import createEmotionCache from "../src/createEmotionCache";
import { EmotionCache, CacheProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
// import { Head } from "next/document";
import theme from "../src/theme";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

// export default function App({ Component, pageProps }: AppProps) {
//   return <Component {...pageProps} />
// }

const POLLING_INTERVAL = 12000;
export const getLibrary = (provider: any): ethers.providers.Web3Provider => {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = POLLING_INTERVAL;
  return library;
};

export default function MyApp(props: MyAppProps) {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps: { session, ...pageProps },
  } = props;
  return (
    <CacheProvider value={emotionCache}>
      {/* <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>NUSIC</title>
      </Head> */}
      <ThemeProvider theme={theme}>
        {/* <SessionProvider session={session}> */}
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {/* <Header /> */}
        <Web3ReactProvider getLibrary={getLibrary}>
          <Component {...pageProps} />
        </Web3ReactProvider>
        {/* </SessionProvider> */}
      </ThemeProvider>
    </CacheProvider>
  );
}
