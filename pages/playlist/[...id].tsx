import { Box } from "@mui/system";
import { useEffect, useState } from "react";
// import styles from "react-jinke-music-player/assets/index.module.css";
import { getSongsByIds } from "../../src/services/db/songs.service";
import {
  addLikeDb,
  // addToPlaylistDb,
  getPlaylist,
  removeToPlaylistDb,
} from "../../src/services/db/playlists.service";
import SongsList from "../../src/components/SongsList";
import { SongDoc } from "../../src/models/Song";
import {
  Button,
  Chip,
  Grid,
  IconButton,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import { useWeb3React } from "@web3-react/core";
import useAuth from "../../src/hooks/useAuth";
import { useRouter } from "next/router";
import Head from "next/head";
import { Playlist } from "../../src/models/Playlist";

const Playlist = ({
  id,
  playlistInfo,
}: {
  id: string;
  playlistInfo?: Playlist;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  // const [playlistInfo, setPlaylistInfo] = useState<{
  //   name: string;
  //   id?: string;
  //   likedUsers?: string[];
  //   totalLikes?: number;
  // }>({ name: "-- Playlist" });

  const [userPlaylist, setUserPlaylist] = useState<SongDoc[]>();
  const router = useRouter();
  const [isInvalidId, setIsInvalidId] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<boolean | string>();

  const { account } = useWeb3React();
  const { login } = useAuth();

  const fetchPlaylistSongs = async () => {
    // console.log({ address });
    setIsLoading(true);
    // const playlist = await getPlaylist(address);
    // if (playlist) {
    //   setIsLiked(playlist.likedUsers?.includes(address) || false);
    //   setPlaylistInfo({
    //     name: playlist?.name,
    //     id: playlist.id,
    //   });
    if (playlistInfo && playlistInfo.songs) {
      const availableSongIds = playlistInfo.songs
        // .filter((s) => s.isAvailable)
        .map((s) => s.songId);
      if (availableSongIds.length) {
        const playlistSongs = await getSongsByIds(availableSongIds);
        setUserPlaylist(playlistSongs);
      } else {
        setUserPlaylist([]);
      }
    }
    // }
    else {
      setIsInvalidId(true);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (playlistInfo) {
      fetchPlaylistSongs();
    } else {
      setIsInvalidId(true);
    }
  }, [id]);

  if (isLoading) {
    return (
      <Box
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(0deg, rgba(20,20,61,0.9920561974789917) 0%, rgba(22,22,42,1) 77%)",
        }}
        display="flex"
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Typography align="center">Finding the playlist...</Typography>
      </Box>
    );
  }
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
      // await fetchPlaylist(account);
      setSnackbarMessage("Successfully added to the playlist");
    } else setSnackbarMessage("Please connect your account to continue");
  };
  const removeToPlaylist = async (id: string) => {
    if (account) {
      try {
        await removeToPlaylistDb(account, {
          songId: id,
        });
      } catch (e) {
        setSnackbarMessage(
          "Unable to Add to the Playlist, please try again later"
        );
      }
      await fetchPlaylistSongs();
      setSnackbarMessage("Successfully added to the playlist");
    } else setSnackbarMessage("Please connect your account to continue");
  };

  return (
    <>
      <Head>
        <title>{playlistInfo?.name || "Unnamed Playlist"}</title>
        <meta
          property="og:title"
          content={playlistInfo?.name || "Unnamed Playlist"}
          key="title"
        />
        <meta
          name="description"
          content={`Listen to ${playlistInfo?.name || "Unnamed"} Playlist now`}
        />
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
            <Grid item xs={10}>
              <Typography
                variant="h4"
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  router.push("/");
                }}
              >
                NUSIC Player
              </Typography>
            </Grid>
            <Grid item xs={6} md={2}>
              <Box display={"flex"} justifyContent="end">
                {account ? (
                  <Tooltip title={account} placement={"bottom-start"}>
                    <Chip
                      clickable
                      label={`${account.slice(0, 6)}...${account.slice(
                        account.length - 4
                      )}`}
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
          <Grid item xs={12} md={6}>
            {isInvalidId ? (
              <Box
                display="flex"
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Typography align="center">
                  Unable to find any playlist for this ID.
                </Typography>
              </Box>
            ) : (
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
                  sx={{
                    background:
                      "linear-gradient(90deg, rgba(58,180,164,1) 0%, rgba(253,235,29,1) 48%, rgba(149,252,69,1) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: "bold",
                  }}
                >
                  <Typography variant="h5">
                    {playlistInfo?.name || "Unnamed Playlist"}
                  </Typography>
                  <IconButton
                    onClick={() => {
                      if (!account) {
                        setSnackbarMessage("Please connect your wallet");
                        return;
                      }
                      setIsLiked(true);
                      if (id && !isLiked) addLikeDb(id, account);
                    }}
                  >
                    {isLiked ? (
                      <FavoriteOutlinedIcon color="error" />
                    ) : (
                      <FavoriteBorderOutlinedIcon color="secondary" />
                    )}
                  </IconButton>
                </Box>
                {userPlaylist && userPlaylist.length && (
                  <SongsList
                    isLoading={isLoading}
                    songs={userPlaylist}
                    addToPlaylist={addToPlaylist}
                    showAddToPlaylist={id !== account}
                    removeToPlaylist={removeToPlaylist}
                  />
                )}
                {(userPlaylist?.length === 0 || !userPlaylist) &&
                  !isLoading && (
                    <Box>
                      <Typography>
                        No songs available in the playlist
                      </Typography>
                    </Box>
                  )}
                {userPlaylist && userPlaylist?.length === 0 && (
                  <Typography align="center">Playlist is Empty</Typography>
                )}
              </Box>
            )}
          </Grid>
          <Grid item></Grid>
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
      </Box>
    </>
  );
};

export async function getServerSideProps(context: any) {
  // Fetch data from external API
  const { id } = context.query;
  //   res.setHeader(
  //     "Cache-Control",
  //     "public, s-maxage=50, stale-while-revalidate=59"
  //   );
  // Pass data to the page via props
  const _id = id[0];
  if (_id) {
    const playlistInfo = await getPlaylist(_id);
    return { props: { id: id[0], playlistInfo } };
  }

  return { props: { id: id[0] } };
}

export default Playlist;
