/* eslint-disable react-hooks/exhaustive-deps */
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Grid,
  Typography,
  Tooltip,
  Chip,
  Button,
  Card,
  CardContent,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogActions,
  Snackbar,
  LinearProgress,
  Link,
  Divider,
} from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";
// import axios from "axios";
import { useEffect, useState } from "react";
import NFTPreview from "../src/components/NFTPreview";
import useAuth from "../src/hooks/useAuth";
import { MoralisNftData } from "../src/models/MoralisNFT";
import { Playlist } from "../src/models/Playlist";
import { Song } from "../src/models/Song";
import {
  // addToPlaylistDb,
  getPlaylist,
} from "../src/services/db/playlists.service";
import { addSongToDb } from "../src/services/db/songs.service";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import { useRouter } from "next/router";
import Head from "next/head";
import Header from "../src/components/Header";
// import { uploadFromUrl } from "./services/storage";

type Props = {};

// const startMoralis = async () => {
//   //   await Moralis.start({
//   //     apiKey: process.env.REACT_APP_MORALIS_KEY,
//   //   });
// };

const Dashboard = (props: Props) => {
  const { account } = useWeb3React();
  const { login } = useAuth();

  const router = useRouter();
  const [lastPage, setLastPage] = useState(0);
  const [pageDetails, setPageDetails] = useState<{
    [key: number]: { cursor: string; records: MoralisNftData[] };
  }>({});
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [isInsStarted, setIsInsStarted] = useState(false);
  const [nfts, setNfts] = useState<MoralisNftData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [isLoading, setIsLoading] = useState(false);

  const [previewToken, setPreviewToken] = useState<MoralisNftData>();
  const [isPreviewLoading, setIsPreviewLoading] = useState(true);
  const [isPreviewError, setIsPreviewError] = useState(false);
  const [uriDetails, setUriDetails] = useState<{
    artworkUrl: string;
    audioFileUrl: string;
  }>();
  const [snackbarMessage, setSnackbarMessage] = useState<boolean | string>(
    false
  );
  const [playlistInfo, setPlaylistInfo] = useState<Playlist>();

  const fetchNfts = async (pageId: number) => {
    if (pageDetails[pageId]) {
      setNfts(pageDetails[pageId].records);
      setCurrentPage(pageId);
      return;
    }
    if (!isInsStarted) {
      // await startMoralis();
      setIsInsStarted(true);
    }
    //   const chain = EvmChain.ETHEREUM;
    //   const response = await Moralis.EvmApi.nft.getWalletNFTs({
    //     address: account as string,
    //     chain,
    //     cursor: pageDetails[pageId].cursor,
    //     limit: 30,
    //     normalizeMetadata: true,
    //     format: "decimal",
    //   });
    setLoadingRecords(true);
    const options = {
      method: "GET",
      url: `https://deep-index.moralis.io/api/v2/${account}/nft`,
      params: {
        chain: "eth",
        format: "decimal",
        limit: "30",
        cursor: pageDetails[pageId - 1]?.cursor,
        normalizeMetadata: "true",
      },
      headers: {
        accept: "application/json",
        "X-API-Key": process.env.NEXT_PUBLIC_MORALIS_KEY,
      },
    };
    const response = await axios.request(options);
    const json = response.data;
    if (json.result?.length) {
      const filteredRecords = (json.result as MoralisNftData[]).filter(
        (x) =>
          x.contract_type === "ERC721" &&
          x.token_uri &&
          (x.normalized_metadata.name
            ? x.normalized_metadata.animation_url
            : true)
      );
      if (json.total <= json.page * json.page_size) {
        setLastPage(json.page);
      }
      const newPageDetails = {
        [json.page]: {
          cursor: json.cursor,
          records: filteredRecords,
        },
      };

      setCurrentPage(Number(json.page));
      setPageDetails({ ...pageDetails, ...newPageDetails });
      setNfts(filteredRecords);
      setLoadingRecords(false);
    } else {
      setLoadingRecords(false);
      setNfts([]);
    }
  };
  const fetchPlaylist = async (address: string) => {
    const playlist = await getPlaylist(address);
    if (playlist) {
      setPlaylistInfo(playlist);
    }
  };

  useEffect(() => {
    if (account) {
      fetchPlaylist(account);
    } else {
      login();
    }
  }, [account]);

  const addToPlaylist = async (id: string) => {
    if (account) {
      try {
        // await addToPlaylistDb(account, {
        //   address: id,
        // });
      } catch (e) {
        setSnackbarMessage(
          "Unable to Add to the Playlist, please try again later"
        );
      }
      setSnackbarMessage("Successfully added to the playlist");
      setPreviewToken(undefined);
    } else setSnackbarMessage("Please connect your account to continue");
  };

  const onSaveInSongs = async () => {
    // if (account && uriDetails && previewToken) {
    //   try {
    //     if (account) {
    //       setIsLoading(true);
    //       const nft: Song = {
    //         tokenAddress: previewToken.token_address,
    //         name: previewToken.name,
    //         tokenId: previewToken.token_id,
    //         artworkUrl: uriDetails.artworkUrl,
    //         audioFileUrl: uriDetails.audioFileUrl,
    //       };
    //       // try {
    //       //   const songUrl = await uploadFromUrl(
    //       //     nft.audioFileUrl,
    //       //     previewToken.name
    //       //   );
    //       //   nft.audioFileUrl = songUrl;
    //       // } catch (e) {
    //       //   console.log(e);
    //       // }
    //       await addSongToDb(nft);
    //       await addToPlaylist(`${nft.address}-${nft.tokenId}`);
    //     } else {
    //       setSnackbarMessage("Please connect your account and try again");
    //     }
    //   } catch (e) {
    //     setSnackbarMessage("Successfully added to the playlist");
    //   } finally {
    //     setIsLoading(false);
    //   }
    // }
  };

  return (
    <>
      <Head>
        <title>NUSIC | Dashboard</title>
        <meta property="og:title" content={"NUSIC"} key="title" />
      </Head>
      <Box
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(0deg, rgba(20,20,61,0.9920561974789917) 0%, rgba(22,22,42,1) 77%)",
        }}
      >
        <Header />
        {account ? (
          <Box mt="2rem">
            {/* <Box m={4} width={{ md: "50%" }}>
            <Typography>Your Playlists</Typography>
            <List>
              <ListItemButton
                href={`https://player.nusic.fm/#/playlist/${account}`}
              >
                <Typography>1. {playlistInfo.name}</Typography>
              </ListItemButton>
            </List>
          </Box> */}
            <Grid container>
              <Grid item md={3}></Grid>
              <Grid item xs={12} md={6}>
                <Box m={4}>
                  <Typography variant="h5">Dashboard</Typography>
                </Box>
                <Divider />
                <Box m={4} display="flex" alignItems={"center"} gap={4}>
                  <Typography>Playlist: </Typography>
                  {playlistInfo ? (
                    <Box
                      display={"flex"}
                      justifyContent="space-between"
                      alignItems={"center"}
                      width="100%"
                    >
                      <Link
                        href={`//player.nusic.fm/#/playlist/${playlistInfo.id}`}
                        target="_blank"
                        variant="h5"
                        sx={{
                          background:
                            "linear-gradient(90deg, rgba(58,180,164,1) 0%, rgba(253,235,29,1) 48%, rgba(149,252,69,1) 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          fontWeight: "bold",
                        }}
                      >
                        {playlistInfo.name}
                      </Link>
                      <Box display={"flex"} alignItems={"center"} gap={0.5}>
                        <Typography variant="h6">
                          {playlistInfo.totalLikes}{" "}
                        </Typography>
                        <FavoriteOutlinedIcon
                          color="error"
                          sx={{ width: "18px" }}
                        />
                      </Box>
                    </Box>
                  ) : (
                    <Typography>--</Typography>
                  )}
                </Box>
                <Box m={4}>
                  <LoadingButton
                    disabled={isInsStarted}
                    variant="contained"
                    onClick={() => {
                      fetchNfts(currentPage);
                    }}
                  >
                    Add Music NFTs from your wallet
                  </LoadingButton>
                </Box>
                {nfts.length ? (
                  <Box>
                    <Box m={4}>
                      <Typography variant="h5">
                        Select the music NFT from your NFT collections:
                      </Typography>
                      {loadingRecords && <LinearProgress />}
                    </Box>
                    <Box
                      m={4}
                      mb={0}
                      display={"flex"}
                      justifyContent="space-between"
                    >
                      <LoadingButton
                        variant="outlined"
                        size="small"
                        color="info"
                        disabled={currentPage === 1}
                        onClick={() => {
                          fetchNfts(currentPage - 1);
                        }}
                      >
                        Previous
                      </LoadingButton>
                      {/* <Box>
                      <Typography>Total: {total}</Typography>
                    </Box> */}
                      <LoadingButton
                        variant="outlined"
                        size="small"
                        color="info"
                        onClick={() => {
                          fetchNfts(currentPage + 1);
                        }}
                        disabled={lastPage === currentPage}
                      >
                        Next
                      </LoadingButton>
                    </Box>
                    <Box p={4} display={"flex"} gap={2} flexWrap="wrap">
                      {nfts.map((nft) => (
                        <Card
                          key={nft.token_address + nft.token_id}
                          sx={{
                            "#isnft": {
                              visibility: "hidden",
                            },
                            "&:hover": {
                              "#isnft": {
                                visibility: "visible",
                              },
                            },
                          }}
                        >
                          <CardContent>
                            <Typography>{nft.name}</Typography>
                            {/* <Typography>{nft.symbol}</Typography> */}
                            <Box
                              id="isnft"
                              display="flex"
                              justifyContent={"space-between"}
                              alignItems="center"
                              gap={4}
                              mt={4}
                            >
                              {/* <Typography>is it a Music NFT?</Typography> */}
                              <Button
                                variant="outlined"
                                color="info"
                                onClick={() => {
                                  setPreviewToken(nft);
                                }}
                              >
                                Select
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                        //   <Box>
                        //     <Box>
                        //       <Typography>{nft.name}</Typography>
                        //       <Typography>{nft.symbol}</Typography>
                        //     </Box>
                        //     <Box></Box>
                        //   </Box>
                      ))}
                    </Box>
                  </Box>
                ) : (
                  isInsStarted &&
                  (loadingRecords ? (
                    <LinearProgress />
                  ) : (
                    <Typography align="center">
                      No NFT Collections found for this wallet address, try
                      again with a different wallet
                    </Typography>
                  ))
                )}
              </Grid>
              <Grid item md={3}></Grid>
            </Grid>
          </Box>
        ) : (
          <Box>
            <Typography align="center">Your wallet is not connected</Typography>
          </Box>
        )}

        <Dialog
          open={!!previewToken}
          onClose={() => {
            if (isLoading) return;
            setPreviewToken(undefined);
            setUriDetails(undefined);
            setIsPreviewLoading(true);
            setIsPreviewError(false);
          }}
        >
          <DialogTitle>Preview</DialogTitle>
          <DialogContent>
            {previewToken && (
              <NFTPreview
                setUriDetails={setUriDetails}
                nftTokenProps={[previewToken, setPreviewToken]}
                loadingProps={[isPreviewLoading, setIsPreviewLoading]}
                errorProps={[isPreviewError, setIsPreviewError]}
              />
            )}
          </DialogContent>
          <DialogActions>
            <LoadingButton
              loading={isLoading}
              variant="contained"
              disabled={isPreviewLoading || isPreviewError}
              onClick={onSaveInSongs}
            >
              Start Streaming
            </LoadingButton>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={!!snackbarMessage}
          onClose={() => {
            setSnackbarMessage(false);
          }}
          message={snackbarMessage}
          autoHideDuration={5000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        />
      </Box>
    </>
  );
};
// 0x5b93ff82faaf241c15997ea3975419dddd8362c5;

export async function getServerSideProps() {
  // Fetch data from external API
  //   res.setHeader(
  //     "Cache-Control",
  //     "public, s-maxage=50, stale-while-revalidate=59"
  //   );
  // Pass data to the page via props

  return { props: {} };
}

export default Dashboard;
