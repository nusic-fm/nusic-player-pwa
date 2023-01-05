import {
  Button,
  Chip,
  Grid,
  IconButton,
  Snackbar,
  TextField,
  Tooltip,
  // TextField,
  Typography,
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
  removeToPlaylistDb,
} from "../src/services/db/playlists.service";
import SongsList from "../src/components/SongsList";
import { PlayerSong, Song, SongDoc } from "../src/models/Song";
import ArrowRightRoundedIcon from "@mui/icons-material/SwitchRightRounded";
import ArrowLeftRoundedIcon from "@mui/icons-material/SwitchLeftRounded";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import ShareTwoToneIcon from "@mui/icons-material/ShareTwoTone";
import ListNFT from "../src/components/ListNFT";
import SaveRounded from "@mui/icons-material/SaveRounded";
import CancelOutlined from "@mui/icons-material/CancelOutlined";
import { getEnsName } from "../src/helpers";
import NftFeed from "../src/components/NftFeed";
import { useRouter } from "next/router";
import Head from "next/head";
// import { uploadFromUrl } from "./services/storage";

// const predefinedChains = ["ethereum", "polygon", "solana"];

function App() {
  const [songs, setSongs] = useState<PlayerSong[]>([]);
  const [oriSongs, setOriSongs] = useState<SongDoc[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [isCustomPlaylistMode, setIsCustomPlaylistMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  // const [playlistInfo, setPlaylistInfo] = useState<{
  //   name: string;
  //   id: string;
  // }>();
  const [playlistName, setPlaylistName] = useState("Unnamed Playlist");

  const [userPlaylist, setUserPlaylist] = useState<PlayerSong[]>();

  const { account } = useWeb3React();
  const { login } = useAuth();
  const [userEnsName, setUserEnsName] = useState<string>();
  const [showFeed, setShowFeed] = useState(false);

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
    setShowFeed(true);
  };
  const onFeedClose = () => {
    setShowFeed(false);
  };

  const fetchSongs = async () => {
    setIsLoading(true);
    const _songs = await getSongs();
    setOriSongs(_songs.map((s, i) => ({ ...s, idx: i })));
    const _new = _songs.map((song, i) => ({
      name: song.name,
      musicSrc: song.audioFileUrl,
      cover: song.artworkUrl,
      // singer: `#${song.openseaName.split("#")[1]}`,
      id: song.id,
      idx: i,
    }));
    setIsLoading(false);
    setSongs(_new);
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchPlaylist = async (address: string) => {
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
        setUserPlaylist(
          playlistSongs.map((s, i) => ({
            idx: i,
            id: s.id,
            name: s.name,
            musicSrc: s.audioFileUrl,
            cover: s.artworkUrl,
            // singer: s.artist,
          }))
        );
      }
    }
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
  const fetchEnsName = async (address: string) => {
    const userEns = await getEnsName(address);
    if (userEns) {
      setUserEnsName(userEns);
    }
  };
  useEffect(() => {
    if (account) {
      fetchPlaylist(account);
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
        <meta property="og:title" content={"NUSIC"} key="title" />
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
              <Typography variant="h4">NUSIC Player</Typography>
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
          <Grid item xs={0} md={3}></Grid>
          <Grid item xs={12} md={6} sx={{ position: "relative" }}>
            <Box
              sx={{ height: "100vh", overflowY: "auto" }}
              p={2}
              maxHeight={"80vh"}
              mb={9}
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
                                `https://player.nusic.fm/#/playlist/${account}`
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
                  {/* <IconButton size="small" sx={{ ml: 1 }} onClick={() => {}}>
                  <EditTwoToneIcon sx={{ width: "18px", height: "18px" }} />
                </IconButton> */}
                </Box>
                <Box>
                  <Box display={"flex"} gap={2}>
                    {/* {isEditMode && (
                    <Button
                      onClick={() => {
                        setIsEditMode(false);
                        // if (account) fetchPlaylist(account);
                      }}
                      color="info"
                      size="small"
                    >
                      Cancel
                    </Button>
                  )} */}
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
                      {/* {isCustomPlaylistMode && isEditMode
                      ? `Save`
                      : `Switch Playlist`} */}
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
            {showFeed && (
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
