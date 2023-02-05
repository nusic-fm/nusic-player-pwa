import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import createEmotionCache from "../src/createEmotionCache";
import { EmotionCache, CacheProvider } from "@emotion/react";
import {
  BottomNavigation,
  BottomNavigationAction,
  CssBaseline,
  Paper,
} from "@mui/material";
// import { Head } from "next/document";
import theme from "../src/theme";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
import { AudioPlayerProvider } from "react-use-audio-player";
import PlayCircleOutlineRoundedIcon from "@mui/icons-material/PlayCircleOutlineRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
// import Player from "../src/components/Player";

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
  const router = useRouter();

  const [value, setValue] = useState<number>();

  useEffect(() => {
    if (!router.isReady) return;
    if (router.pathname === "/") {
      setValue(0);
    } else if (router.pathname === "/discover") {
      setValue(1);
    } else if (router.pathname.startsWith("/market")) {
      setValue(2);
    }
  }, [router.isReady, router.pathname]);

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
          <AudioPlayerProvider>
            <Component {...pageProps} />
            {/* {value && (
              <Paper
                sx={{
                  position: "fixed",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "rgba(0,0,0,0.2)",
                }}
                elevation={3}
              >
                <Player songs={[]} songIndexProps={[0, () => {}]} />
              </Paper>
            )} */}
            <Paper
              sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                background: "rgba(0,0,0,0.2)",
              }}
              elevation={3}
            >
              <BottomNavigation
                showLabels
                sx={{ background: "rgb(0,0,0)" }}
                value={value}
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
              >
                <BottomNavigationAction
                  onClick={() => router.push(`/`)}
                  label="Play"
                  icon={
                    <PlayCircleOutlineRoundedIcon
                      sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                    />
                  }
                ></BottomNavigationAction>
                <BottomNavigationAction
                  onClick={() => router.push(`/discover`)}
                  label="Discover"
                  icon={
                    <ExploreRoundedIcon
                      sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                    />
                  }
                ></BottomNavigationAction>
                <BottomNavigationAction
                  onClick={() => router.push(`/market`)}
                  label="Market"
                  icon={
                    <Image
                      src="/nft.png"
                      color="white"
                      style={{
                        background: "white",
                        borderRadius: "50%",
                        opacity: 0.8,
                      }}
                      alt=""
                      width={20}
                      height={20}
                    />
                  }
                ></BottomNavigationAction>
              </BottomNavigation>
            </Paper>
          </AudioPlayerProvider>
        </Web3ReactProvider>
        {/* </SessionProvider> */}
      </ThemeProvider>
    </CacheProvider>
  );
}
