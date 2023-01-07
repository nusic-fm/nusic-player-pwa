import {
  Button,
  Chip,
  Grid,
  IconButton,
  Skeleton,
  Snackbar,
  TextField,
  Tooltip,
  // TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Box from "@mui/system/Box";
import { useEffect, useState } from "react";
// import styles from "react-jinke-music-player/assets/index.module.css";
import {
  addSongToDb,
  getSongs,
  getSongsByIds,
} from "../src/services/db/songs.service";
import { useWeb3React } from "@web3-react/core";
import useAuth from "../src/hooks/useAuth";
import {
  addToPlaylistDb,
  changePlaylistName,
  getPlaylist,
  getPlaylists,
  removeToPlaylistDb,
} from "../src/services/db/playlists.service";
import SongsList from "../src/components/SongsList";
import { PlayerSong, Song, SongDoc } from "../src/models/Song";
// import ArrowRightRoundedIcon from "@mui/icons-material/SwitchRightRounded";
// import ArrowLeftRoundedIcon from "@mui/icons-material/SwitchLeftRounded";
// import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
// import ShareTwoToneIcon from "@mui/icons-material/ShareTwoTone";
import ListNFT from "../src/components/ListNFT";
// import SaveRounded from "@mui/icons-material/SaveRounded";
// import CancelOutlined from "@mui/icons-material/CancelOutlined";
import { getEnsName } from "../src/helpers";
import NftFeed from "../src/components/NftFeed";
import { useRouter } from "next/router";
import Head from "next/head";
// import Player from "../src/components/Player";
// import { AudioPlayerProvider } from "react-use-audio-player";
import PlayCircleRounded from "@mui/icons-material/PlayCircleRounded";
// import { uploadFromUrl } from "./services/storage";
// import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import Image from "next/image";
import { Playlist } from "../src/models/Playlist";
import { useAudioPlayer } from "react-use-audio-player";
import PauseCircleRounded from "@mui/icons-material/PauseCircleRounded";

// const predefinedChains = ["ethereum", "polygon", "solana"];

function App() {
  const [selectedPlaylistSongs, setSelectedPlaylistSongs] = useState<SongDoc[]>(
    []
  );
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylistIdx, setSelectedPlaylistIdx] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isCustomPlaylistMode, setIsCustomPlaylistMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [playlistName, setPlaylistName] = useState("Unnamed Playlist");
  const { playing, stop, togglePlayPause } = useAudioPlayer();

  const { account } = useWeb3React();
  const { login } = useAuth();
  const [userEnsName, setUserEnsName] = useState<string>();
  const [showFeed, setShowFeed] = useState(false);
  const isMobile = useMediaQuery((_theme) =>
    (_theme as any).breakpoints.down("md")
  );

  const router = useRouter();
  // const [newPlaylist, setNewPlaylist] = useState<{
  //   [key: string]: PlayListSong;
  // }>({});
  const [snackbarMessage, setSnackbarMessage] = useState<boolean | string>(
    false
  );
  // const [chainOptions, setChainOptions] = useState<string[]>([]);
  const [isListNftOpen, setIsListNftOpen] = useState(false);

  const onRowClick = () => {
    setShowFeed(true && isMobile);
  };
  const onFeedClose = () => {
    setShowFeed(false);
  };

  const fetchSongs = async () => {
    setIsLoading(true);
    const _songs = await getSongs();
    setSelectedPlaylistSongs(_songs);
    setIsLoading(false);
  };

  const fetchPlaylists = async () => {
    const playlists = await getPlaylists();
    setPlaylists(playlists);
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  useEffect(() => {
    if (playing) stop();
    setSelectedPlaylistSongs([]);
    if (selectedPlaylistIdx) {
      fetchPlaylist(playlists[selectedPlaylistIdx - 1].id);
    } else {
      fetchSongs();
    }
  }, [selectedPlaylistIdx]);

  const fetchPlaylist = async (address: string) => {
    setIsLoading(true);
    const playlist = await getPlaylist(address);
    if (playlist) {
      // setPlaylistInfo({
      //   name: playlist?.name,
      //   id: playlist.id,
      // });
      setPlaylistName(playlist.name);
      if (!playlist.songs) return;
      const availableSongIds = playlist.songs
        // .filter((s) => s.isAvailable)
        .map((s) => s.address);
      // const newChainOptions = playlist.songs
      //   .map((s) => s.chain)
      //   .filter(
      //     (s, i, self) =>
      //       s !== "ADDED" &&
      //       self.indexOf(s) === i &&
      //       !predefinedChains.includes(s)
      //   );
      // setChainOptions([...predefinedChains, ...newChainOptions]);
      // const newPlaylistObj: { [key: string]: PlayListSong } = {};
      // let i = 0;
      // playlist.songs.map((s) => {
      //   if (!s.isAvailable) {
      //     newPlaylistObj[i] = { ...s, isFrozen: true };
      //     i += 1;
      //   }
      //   return "";
      // });
      // setNewPlaylist(newPlaylistObj);
      if (availableSongIds.length) {
        const playlistSongs = await getSongsByIds(availableSongIds);
        setSelectedPlaylistSongs(
          playlistSongs.map((s, i) => ({
            ...s,
            idx: i,
          }))
        );
      } else {
        setSelectedPlaylistSongs([]);
      }
    }
    setIsLoading(false);
  };
  // const onSavePlaylist = async () => {
  //   if (account) {
  //     const newSongsList = Object.values(newPlaylist).filter(
  //       (o) => o.address.length && !o.isFrozen
  //     );
  //     if (newSongsList.length) {
  //       try {
  //         await savePlaylist(account, newSongsList, playlistInfo.name);
  //       } catch (e) {
  //         setSnackbarMessage("Error occured, Please try again later");
  //       }
  //       setSnackbarMessage("Successfully Saved the Playlist");
  //       setIsEditMode(false);
  //       fetchPlaylist(account);
  //     } else setSnackbarMessage("NFT address is not provided");
  //   } else {
  //     setSnackbarMessage("Please connect your account to continue");
  //   }
  // };

  const onPlaylistNameSave = async () => {
    if (account) {
      try {
        setIsLoading(true);
        await changePlaylistName(account, playlistName);
        setIsEditMode(false);
        setSnackbarMessage("Successfully Saved");
      } catch (e) {
        setSnackbarMessage(
          "Unable to save the changes, please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    }
  };
  const fetchEnsName = async (address: string) =>
    getEnsName(address).then((userEns) => userEns && setUserEnsName(userEns));

  useEffect(() => {
    if (account) {
      // fetchPlaylist(account);
      fetchEnsName(account);
    }
  }, [account]);

  const addToPlaylist = async (id: string) => {
    if (account) {
      try {
        await addToPlaylistDb(account, {
          address: id,
        });
      } catch (e) {
        setSnackbarMessage(
          "Unable to Add to the Playlist, please try again later"
        );
      }
      await fetchPlaylist(account);
      setSnackbarMessage("Successfully added to the playlist");
    } else setSnackbarMessage("Please connect your account to continue");
  };
  const removeToPlaylist = async (id: string) => {
    if (account) {
      try {
        await removeToPlaylistDb(account, {
          address: id,
        });
      } catch (e) {
        setSnackbarMessage(
          "Unable to Add to the Playlist, please try again later"
        );
      }
      await fetchPlaylist(account);
      setSnackbarMessage("Successfully added to the playlist");
    } else setSnackbarMessage("Please connect your account to continue");
  };

  const onSaveSongPlaylist = async (nft: Song) => {
    try {
      if (account) {
        // try {
        //   const songUrl = await uploadFromUrl(nft.audioFileUrl, nft.name);
        //   nft.audioFileUrl = songUrl;
        // } catch (e) {}
        await addSongToDb(nft);
        await addToPlaylist(`${nft.address}-${nft.tokenId}`);
      } else {
        setSnackbarMessage("Please connect your account and try again");
      }
    } catch (e) {
      setSnackbarMessage("Successfully removed from the playlist");
    }
  };

  return (
    <>
      <Head>
        <title>NUSIC | Player</title>
        <meta property="og:title" content="NUSIC | Player" key="title" />
        <meta name="description" content="Powering the Evolution of Music" />
      </Head>
      <Box
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(0deg, rgba(20,20,61,0.9920561974789917) 0%, rgba(22,22,42,1) 77%)",
        }}
      >
        <Box p={2}>
          <Grid container alignItems={"center"} rowSpacing={4}>
            <Grid item xs={8} md={5}>
              {/* <Typography variant="h4">NUSIC</Typography> */}
              <Image src="/nusic-white.png" alt="" width={140} height={42} />
            </Grid>
            <Grid item xs={0} md={4}>
              {/* <TextField
              label="Search"
              fullWidth
              onChange={(e) => {
                const _new = songsDataSource.filter(
                  (s) =>
                    s.name
                      ?.toString()
                      .toLowerCase()
                      .includes(e.target.value.toLowerCase()) ||
                    s.singer
                      ?.toString()
                      .toLowerCase()
                      .includes(e.target.value.toLowerCase())
                );
                setSongs(_new);
              }}
            ></TextField> */}
            </Grid>
            <Grid item xs={4} md={3}>
              <Box display={"flex"} justifyContent="end" alignItems={"center"}>
                {account ? (
                  <Tooltip title={account} placement={"bottom-start"}>
                    <Chip
                      clickable
                      label={
                        userEnsName ||
                        `${account.slice(0, 6)}...${account.slice(
                          account.length - 4
                        )}`
                      }
                      // size="small"
                      color="info"
                      variant="outlined"
                      onClick={() => router.push("/dashboard")}
                    />
                  </Tooltip>
                ) : (
                  <Button
                    variant="outlined"
                    color="info"
                    onClick={(e) => {
                      e.stopPropagation();
                      login();
                    }}
                  >
                    connect
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Grid container>
          <Grid item xs={0} md={2}></Grid>
          <Grid item xs={12} md={8} sx={{ position: "relative" }}>
            <Box p={2} mb={"70px"}>
              <Box>
                {/* <Box
                  my={"2rem"}
                  py={"2rem"}
                  sx={{ bgcolor: "primary.main" }}
                  borderRadius="6px"
                >
                  <Box display={"flex"} justifyContent="center" pb={2}>
                    <Image
                      src="/nusic-white.png"
                      alt=""
                      width={200}
                      height={60}
                    />
                  </Box>
                  <Typography
                    align="center"
                    variant="h6"
                    fontFamily={"BenchNine"}
                  >
                    POWERING THE EVOLUTION OF MUSIC
                  </Typography>
                </Box> */}
                <Typography
                  align="center"
                  fontFamily={"Nunito"}
                  variant="h5"
                  textTransform="capitalize"
                >
                  {`THE WEB3 PLATFORM FOR MUSIC CREATORS, LABELS & COLLECTORS`.toLowerCase()}
                </Typography>
                <Typography
                  align="center"
                  fontFamily={"Nunito"}
                  variant="h6"
                  sx={{ mt: 2 }}
                  textTransform="capitalize"
                >
                  {`STREAM, PLAYLIST, MINT, COLLECT`.toLowerCase()}
                </Typography>
                <Typography
                  align="center"
                  fontFamily={"Nunito"}
                  variant="h6"
                  sx={{ mt: 2 }}
                  textTransform="capitalize"
                >
                  {`EARN $NUSIC TOKENS FOR EVERY STREAM`.toLowerCase()}
                </Typography>
                <Typography
                  align="center"
                  fontFamily={"Nunito"}
                  variant="h6"
                  sx={{ mt: 2 }}
                  textTransform="capitalize"
                >
                  {`FIAT AND CRYPTO PAYMENTS`.toLowerCase()}
                </Typography>
                <Typography
                  align="center"
                  fontFamily={"Nunito"}
                  variant="h6"
                  sx={{ mt: 2 }}
                  textTransform="capitalize"
                >
                  {`ONBOARD YOUR NON CRYPTO NATIVE AUDIENCE TO THE FUTURE OF MUSIC`.toLowerCase()}
                </Typography>
              </Box>
              <Box
                sx={{
                  background:
                    "linear-gradient(0deg, rgba(58,180,164,0.1) 0%, rgba(253,235,29,0.11) 48%, rgba(149,252,69,0.1) 100%)",
                }}
                borderRadius="6px"
                // m={2}
                mt={6}
                p={2}
              >
                <Typography
                  variant="h5"
                  textTransform={"capitalize"}
                  fontFamily={"Nunito"}
                >
                  Top Playlist
                </Typography>
                <Box display={"flex"} gap={2} flexWrap="wrap" my={4}>
                  <Box
                    sx={{
                      background:
                        selectedPlaylistIdx === 0
                          ? "rgba(255,255,255,0.8)"
                          : "rgba(255,255,255,0.6)",
                    }}
                    boxShadow={
                      selectedPlaylistIdx === 0
                        ? "rgba(255, 255, 255, 0.85) 0px 5px 15px"
                        : ""
                    }
                    p={1}
                    pr={2.5}
                    borderRadius="6px"
                    display={"flex"}
                    // gap={1}
                    alignItems="center"
                  >
                    <IconButton
                      onClick={() => {
                        if (selectedPlaylistIdx === 0) {
                          togglePlayPause();
                        } else {
                          setSelectedPlaylistIdx(0);
                        }
                      }}
                    >
                      {playing && selectedPlaylistIdx === 0 ? (
                        <PauseCircleRounded htmlColor="black" />
                      ) : (
                        <PlayCircleRounded htmlColor="black" />
                      )}
                    </IconButton>
                    <Typography color="black" align="center">
                      Welcome to NUSIC
                    </Typography>
                  </Box>
                  {playlists.map((p, i) => (
                    <Box
                      key={i}
                      sx={{
                        background:
                          selectedPlaylistIdx - 1 === i
                            ? "rgba(255,255,255,0.8)"
                            : "rgba(255,255,255,0.6)",
                      }}
                      boxShadow={
                        selectedPlaylistIdx - 1 === i
                          ? "rgba(255, 255, 255, 0.85) 0px 5px 15px"
                          : ""
                      }
                      p={1}
                      pr={2.5}
                      borderRadius="6px"
                      display={"flex"}
                      // gap={1}
                      alignItems="center"
                    >
                      <IconButton
                        onClick={() => {
                          if (i + 1 === selectedPlaylistIdx) {
                            togglePlayPause();
                          } else {
                            setSelectedPlaylistIdx(i + 1);
                          }
                        }}
                      >
                        {playing && selectedPlaylistIdx - 1 === i ? (
                          <PauseCircleRounded htmlColor="black" />
                        ) : (
                          <PlayCircleRounded htmlColor="black" />
                        )}
                      </IconButton>
                      <Typography color="black" align="center">
                        {p.name}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                {/* <Typography
                  variant="h5"
                  textTransform={"capitalize"}
                  fontFamily={"Nunito"}
                >
                  My Playlist
                </Typography>
                <Box display={"flex"} gap={2} flexWrap="wrap" my={4}>
                  <Box
                    sx={{ background: "rgba(255,255,255,0.8)" }}
                    p={1}
                    pr={2.5}
                    borderRadius="6px"
                    display={"flex"}
                    // gap={1}
                    alignItems="center"
                  >
                    <IconButton>
                      <FavoriteOutlinedIcon color="error" />
                    </IconButton>
                    <Typography color="black" align="center">
                      Logesh's Mix of the Year
                    </Typography>
                  </Box>
                </Box> */}
                {selectedPlaylistSongs && (
                  <SongsList
                    isLoading={isLoading}
                    songs={selectedPlaylistSongs}
                    addToPlaylist={addToPlaylist}
                    showAddToPlaylist
                    onRowClick={onRowClick}
                  />
                )}
              </Box>
            </Box>
            {/* <Box
              sx={{ height: "100vh", overflowY: "auto" }}
              p={2}
              // maxHeight={"80vh"}
              mb={"70px"}
            >
              <Box
                display={"flex"}
                justifyContent="space-between"
                alignItems={"center"}
                mb={4}
                flexWrap="wrap"
                gap={2}
              >
                <Box display={"flex"} alignItems={"center"}>
                  {isCustomPlaylistMode ? (
                    isEditMode ? (
                      <TextField
                        size="small"
                        value={playlistName}
                        variant="standard"
                        onChange={(e) => {
                          setPlaylistName(e.target.value);
                        }}
                        InputProps={{
                          endAdornment: (
                            <Box display={"flex"}>
                              <IconButton
                                onClick={() => {
                                  setIsEditMode(false);
                                }}
                                size="small"
                              >
                                <CancelOutlined
                                  color="info"
                                  sx={{ width: "18px", height: "18px" }}
                                />
                              </IconButton>
                              <IconButton
                                onClick={onPlaylistNameSave}
                                size="small"
                                disabled={isLoading}
                              >
                                <SaveRounded
                                  color="info"
                                  sx={{ width: "18px", height: "18px" }}
                                />
                              </IconButton>
                            </Box>
                          ),
                        }}
                      />
                    ) : (
                      <>
                        <Typography
                          sx={{ cursor: "pointer" }}
                          onClick={() => {
                            if (!account) {
                              setSnackbarMessage("Please connect your wallet");
                            } else {
                              setIsCustomPlaylistMode(!isCustomPlaylistMode);
                            }
                          }}
                        >
                          {playlistName}
                        </Typography>
                        <IconButton
                          sx={{ ml: 2 }}
                          onClick={(e) => {
                            setIsEditMode(true);
                          }}
                        >
                          <EditTwoToneIcon
                            color="info"
                            sx={{ width: "18px", height: "18px" }}
                          />
                        </IconButton>
                        {userPlaylist?.length && (
                          <IconButton
                            onClick={() => {
                              navigator.clipboard.writeText(
                                `${window.location.href}playlist/${account}`
                              );
                              setSnackbarMessage("Copied to clipboard");
                            }}
                          >
                            <ShareTwoToneIcon
                              color="info"
                              sx={{ width: "18px", height: "18px" }}
                            />
                          </IconButton>
                        )}
                      </>
                    )
                  ) : (
                    <Typography
                      sx={{ cursor: "pointer" }}
                      onClick={() => {
                        if (!account) {
                          setSnackbarMessage("Please connect your wallet");
                        } else {
                          setIsCustomPlaylistMode(!isCustomPlaylistMode);
                        }
                      }}
                    >
                      Welcome to NUSIC
                    </Typography>
                  )}
                </Box>
                <Box>
                  <Box display={"flex"} gap={2}>
                    <Button
                      disabled={isEditMode}
                      onClick={() => {
                        // if (isEditMode) {
                        //   onSavePlaylist();
                        // } else {
                        if (!account) {
                          setSnackbarMessage("Please connect your wallet");
                        } else {
                          setIsCustomPlaylistMode(!isCustomPlaylistMode);
                        }
                        // }
                      }}
                      variant="contained"
                      // color="info"
                      size="small"
                      startIcon={
                        isCustomPlaylistMode ? (
                          <ArrowLeftRoundedIcon />
                        ) : (
                          <ArrowRightRoundedIcon />
                        )
                      }
                    >
                      {!userPlaylist && !isCustomPlaylistMode
                        ? "Create Playlist"
                        : "Switch Playlist"}
                    </Button>
                  </Box>
                </Box>
              </Box>
              {!isCustomPlaylistMode && (
                <SongsList
                  isLoading={isLoading}
                  songs={songs}
                  addToPlaylist={addToPlaylist}
                  showAddToPlaylist
                  onRowClick={onRowClick}
                />
              )}
              {isCustomPlaylistMode && userPlaylist && (
                <SongsList
                  isLoading={isLoading}
                  songs={userPlaylist}
                  removeToPlaylist={removeToPlaylist}
                />
              )}
              {isCustomPlaylistMode && !userPlaylist && (
                <Box py={"2rem"}>
                  <Typography>
                    You can create a playlist by setting a name and adding a
                    Music NFT from opensea
                  </Typography>
                </Box>
              )}
              {(!userPlaylist || userPlaylist.length < 15) &&
                isCustomPlaylistMode && (
                  <Box display={"flex"} justifyContent="center" mt={2}>
                    <Button
                      onClick={() => {
                        setIsListNftOpen(true);
                      }}
                      variant="contained"
                    >
                      Add MUSIC NFT
                    </Button>
                  </Box>
                )}
            </Box>
            {showFeed && isMobile && (
              <Box
                position={"fixed"}
                zIndex={100}
                top={0}
                height="100vh"
                width="100%"
              >
                {oriSongs && (
                  <NftFeed songs={oriSongs} onFeedClose={onFeedClose} />
                )}
              </Box>
            )} */}
            {showFeed && isMobile && selectedPlaylistSongs && (
              <Box
                position={"fixed"}
                zIndex={100}
                top={0}
                height="100vh"
                width="100%"
              >
                <NftFeed
                  songs={selectedPlaylistSongs}
                  onFeedClose={onFeedClose}
                />
              </Box>
            )}
          </Grid>
          <Grid item xs={0} md={2}></Grid>
        </Grid>
        <Snackbar
          open={!!snackbarMessage}
          onClose={() => {
            setSnackbarMessage(false);
          }}
          message={snackbarMessage}
          autoHideDuration={5000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        />
        <ListNFT
          open={isListNftOpen}
          onClose={() => {
            setIsListNftOpen(false);
          }}
          onSaveSongPlaylist={onSaveSongPlaylist}
        />
      </Box>
    </>
  );
}

export async function getServerSideProps(context: any) {
  // Fetch data from external API
  //   res.setHeader(
  //     "Cache-Control",
  //     "public, s-maxage=50, stale-while-revalidate=59"
  //   );
  // Pass data to the page via props

  return { props: {} };
}

export default App;
