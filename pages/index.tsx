/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import {
  Button,
  Chip,
  CircularProgress,
  Divider,
  Fab,
  Grid,
  IconButton,
  TextareaAutosize,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import axios from "axios";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { checkConnection, createUrlFromCid } from "../src/helpers";
import {
  getMusicNftsMetadataByWallet,
  getNftsMetadataByWallet,
} from "../src/helpers/zora";
import { Injected, CoinbaseWallet } from "../src/hooks/useWalletConnectors";
import { SelectedNftDetails } from "../src/models";
import { MoralisNftData } from "../src/models/MoralisNFT";
import { IZoraData } from "../src/models/zora";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useAudioPlayer } from "react-use-audio-player";
import PauseIcon from "@mui/icons-material/Pause";
import WalletConnectors from "../src/components/AlivePass/WalletConnector";

type Props = {};

const Index = (props: Props) => {
  const { account, activate } = useWeb3React();
  const [showConnector, setShowConnector] = useState(false);
  //   const [tokens, setTokens] = useState<MoralisNftData[]>([]);

  const [musicNfts, setMusicNfts] = useState<IZoraData[]>([]);
  const [nfts, setNfts] = useState<IZoraData[]>([]);
  const { load, playing, togglePlayPause, loading, pause } = useAudioPlayer();
  const [playIndex, setPlayIndex] = useState<number>(-1);

  useEffect(() => {
    if (playIndex !== -1) {
      load({
        src: musicNfts[playIndex].content?.mediaEncoding?.large,
        html5: true,
        autoplay: true,
        format: ["mp3"],
      });
    } else {
      pause();
    }
  }, [playIndex]);

  useEffect(() => {
    if (account) {
      debugger;
      //   fetcMusicNfts();
      //   fetchNfts();
      setShowConnector(false);
      fetchAllNfts();
    } else {
      checkAutoLogin();
      setShowConnector(true);
    }
  }, [account]);

  //   const fetcMusicNfts = async () => {
  //     const _musicTokens = await getMusicNftsMetadataByWallet(
  //       "0xA0cb079D354b66188f533A919d1c58cd67aFe398"
  //     );
  //     setMusicNfts(_musicTokens);
  //   };

  const fetchAllNfts = async () => {
    // "0xA0cb079D354b66188f533A919d1c58cd67aFe398"
    if (!account) return;
    const _token = await getNftsMetadataByWallet(account);
    const _musicNfts = _token.filter((t) => t.metadata?.animation_url);
    const _nfts = _token.filter((t) => !t.metadata?.animation_url);
    setMusicNfts(_musicNfts);
    setNfts(_nfts);
  };

  //   const fetchNfts = async () => {
  //     let cursor;
  //     do {
  //       // const moralisEndpoint = `https://deep-index.moralis.io/api/v2/${account}/nft?chain=eth&format=decimal&normalizeMetadata=true`;
  //       const options = {
  //         method: "GET",
  //         url: `https://deep-index.moralis.io/api/v2/0xA0cb079D354b66188f533A919d1c58cd67aFe398/nft`,
  //         params: {
  //           chain: "eth",
  //           format: "decimal",
  //           limit: "30",
  //           // cursor: pageDetails[pageId - 1]?.cursor,
  //           normalizeMetadata: "true",
  //         },
  //         headers: {
  //           accept: "application/json",
  //           "X-API-Key": process.env.NEXT_PUBLIC_MORALIS_KEY,
  //         },
  //       };
  //       const response = await axios.request(options as any);
  //       const json = response.data;
  //       cursor = json.cursor;
  //       if (json.result?.length) {
  //         const filteredRecords = (json.result as MoralisNftData[])
  //           // .filter(
  //           //   (x) => x.contract_type === "ERC721" && x.token_uri
  //           //   //   &&
  //           //   //   x.normalized_metadata?.animation_url
  //           //   //   (x.normalized_metadata.image
  //           //   //     ? x.normalized_metadata.animation_url
  //           //   //     : true)
  //           // )
  //           .map((r) => {
  //             if (r.normalized_metadata.image) {
  //               return {
  //                 ...r,
  //                 artworkUrl: createUrlFromCid(r.normalized_metadata.image),
  //               };
  //             } else {
  //               return r;
  //             }
  //           });
  //         console.log(filteredRecords);
  //         setTokens(filteredRecords);
  //       }
  //     } while (!!cursor);
  //   };

  const onSignInUsingWallet = async (
    connector: WalletConnectConnector | WalletLinkConnector | InjectedConnector
  ) => {
    await checkConnection();
    activate(connector, async (e) => {
      if (e.name === "t" || e.name === "UnsupportedChainIdError") {
        // setSnackbarMessage("Please switch to Ethereum Mainnet");
      } else {
        // setSnackbarMessage(e.message);
      }

      console.log(e.name, e.message);
    });
  };

  const checkAutoLogin = async () => {
    if (!(window as any).ethereum) return;
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    const accounts = await provider.listAccounts();
    if (accounts.length) {
      const eth = (window as any).ethereum;
      if (eth.isMetaMask) {
        onSignInUsingWallet(Injected);
      } else if (eth.isCoinbaseBrowser) {
        onSignInUsingWallet(CoinbaseWallet);
      }
    }
  };

  const onInsert = async (nft: SelectedNftDetails | MoralisNftData) => {
    // setIsLoading(true);
    const url = nft.artworkUrl;
    const res = await axios.post(
      `https://nusic-image-conversion-ynfarb57wa-uc.a.run.app/overlay?url=${url}`, //TODO
      {},
      { responseType: "arraybuffer" }
    );
    let base64ImageString = Buffer.from(res.data, "binary").toString("base64");
    let srcValue = "data:image/png;base64," + base64ImageString;
    // setImageFromServer(srcValue);
    // setIsLoading(false);
  };

  return (
    <Box my={2}>
      <Grid container>
        <Grid item xs={12} md={4}>
          <Stack gap={2} p={2}>
            <Stack
              m={2}
              p={4}
              alignItems="center"
              gap={2}
              sx={{ backgroundColor: "#141414" }}
            >
              {/* <img src="" alt="pp" /> */}
              <Box
                borderRadius={"50%"}
                sx={{ backgroundColor: "gray" }}
                p={1}
                width={100}
                height={100}
              >
                {" "}
              </Box>
              <TextField size="small" placeholder="username" />
              {account && (
                <Chip
                  label={`${account.slice(0, 6)}...${account.slice(
                    account.length - 4
                  )}`}
                />
              )}
              <Stack width={"100%"} gap={1} my={2}>
                <Typography>Bio</Typography>
                <TextField multiline minRows={3} maxRows={8} />
              </Stack>
            </Stack>
            <Box m={2}>
              <Box display={"flex"} justifyContent="space-between">
                <Typography variant="h6">Alive Pass</Typography>
                <Button variant="outlined" size="small" color="info">
                  Inject PFP
                </Button>
              </Box>
              <Box display={"flex"} justifyContent="center" my={4}>
                <img src="/alive/new_card.png" alt="" width={"80%"} />
              </Box>
            </Box>
          </Stack>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography sx={{ m: 2 }} variant="h6">
            My Music Collections
          </Typography>
          <Box display={"flex"} flexWrap="wrap" gap={2}>
            {musicNfts.length === 0 && (
              <Typography align="center" px={2} mb={2} color="gray">
                No Music NFTs found
              </Typography>
            )}
            {musicNfts.map((musicNft, i) => (
              <Stack
                key={i}
                width={280}
                p={2}
                gap={1}
                // borderTop="1px solid #474747"
              >
                <Box>
                  <Tooltip title={musicNft.name} placement="bottom-start">
                    <Typography fontWeight={900} noWrap>
                      {musicNft.collectionName}
                    </Typography>
                  </Tooltip>
                  <Tooltip
                    title={`Token ID: ${musicNft.tokenId}`}
                    placement="bottom-start"
                  >
                    <Typography variant="body1" noWrap>
                      #{musicNft.tokenId}
                    </Typography>
                  </Tooltip>
                </Box>
                {musicNft.image ? (
                  <Box
                    display={"flex"}
                    alignItems="center"
                    justifyContent={"center"}
                    width="100%"
                    height={"100%"}
                  >
                    <img
                      src={musicNft.image.mediaEncoding?.thumbnail || ""}
                      alt=""
                      //   width={150}
                      //   height={150}
                      style={{ borderRadius: "8px", objectFit: "cover" }}
                    ></img>
                  </Box>
                ) : (
                  <Box
                    display={"flex"}
                    alignItems="center"
                    justifyContent={"center"}
                    width="100%"
                    height={"100%"}
                  >
                    <Box
                      width={200}
                      height={200}
                      display="flex"
                      alignItems={"center"}
                    >
                      <Typography align="center" color={"gray"}>
                        Image not available at this moment, you can hit Refresh
                        to see it
                      </Typography>
                    </Box>
                  </Box>
                )}
                <Box
                  id="isnft"
                  width={"100%"}
                  display="flex"
                  justifyContent={"center"}
                  alignItems="center"
                  gap={4}
                  // mt={4}
                >
                  {/* <Typography>is it a Music NFT?</Typography> */}
                  <Fab
                    // disabled={isPreviewLoading}
                    // variant="outlined"
                    color="info"
                    size="small"
                    onClick={() => {
                      if (i === playIndex) {
                        togglePlayPause();
                      } else {
                        setPlayIndex(i);
                      }
                      //   if (nft.artworkUrl) {
                      //     onInsert(nft);
                      //   } else {
                      //     onNftSelect(nft);
                      //   }
                    }}
                  >
                    {loading && playIndex === i ? (
                      <CircularProgress />
                    ) : playing && playIndex === i ? (
                      <PauseIcon />
                    ) : (
                      <PlayArrowIcon />
                    )}
                  </Fab>
                </Box>
              </Stack>
            ))}
          </Box>
          <Divider />
          <Typography variant="h6" sx={{ m: 2 }}>
            Other NFT Collections
          </Typography>
          <Box display={"flex"} flexWrap="wrap" gap={2}>
            {nfts.length === 0 && (
              <Typography align="center" px={2} mb={2} color="gray">
                No NFTs found
              </Typography>
            )}
            {nfts.map((nft, i) => (
              <Stack
                key={i}
                width={280}
                p={2}
                gap={1}
                // borderTop="1px solid #474747"
              >
                <Box>
                  <Tooltip title={nft.name} placement="bottom-start">
                    <Typography fontWeight={900} noWrap>
                      {nft.collectionName}
                    </Typography>
                  </Tooltip>
                  <Tooltip
                    title={`Token ID: ${nft.tokenId}`}
                    placement="bottom-start"
                  >
                    <Typography variant="body1" noWrap>
                      #{nft.tokenId}
                    </Typography>
                  </Tooltip>
                </Box>
                {nft.image?.mediaEncoding?.thumbnail ? (
                  <Box
                    display={"flex"}
                    alignItems="center"
                    justifyContent={"center"}
                    width="100%"
                    height={"100%"}
                  >
                    <img
                      src={nft.image?.mediaEncoding?.thumbnail}
                      alt=""
                      //   width={150}
                      //   height={150}
                      style={{ borderRadius: "8px", objectFit: "cover" }}
                    ></img>
                  </Box>
                ) : (
                  <Box
                    display={"flex"}
                    alignItems="center"
                    justifyContent={"center"}
                    width="100%"
                    height={"100%"}
                  >
                    <Box
                      width={200}
                      height={200}
                      display="flex"
                      alignItems={"center"}
                    >
                      <Typography align="center" color={"gray"}>
                        Image not available at this moment, you can hit Refresh
                        to see it
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Stack>
            ))}
          </Box>
        </Grid>
      </Grid>
      <WalletConnectors
        onClose={() => setShowConnector(false)}
        onSignInUsingWallet={onSignInUsingWallet}
        open={showConnector}
      />
    </Box>
  );
};

export default Index;
