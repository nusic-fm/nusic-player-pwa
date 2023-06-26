/* eslint-disable @next/next/no-img-element */
import {
  Box,
  Skeleton,
  IconButton,
  Typography,
  List,
  ListItemButton,
  Popover,
  CircularProgress,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PauseIcon from "@mui/icons-material/Pause";
import PlayCircleOutlinedIcon from "@mui/icons-material/PlayCircleOutlined";
// import ReactJkMusicPlayer, {
//   ReactJkMusicPlayerInstance,
// } from "react-jinke-music-player";
import { useEffect, useState } from "react";
import { SongDoc } from "../../models/Song";
import { incrementStreamCount } from "../../services/db/songs.service";
// import Image from "next/image";
import { useGlobalAudioPlayer } from "react-use-audio-player";
import Player from "../Player";

type Props = {
  isLoading: boolean;
  songs: SongDoc[];
  addToPlaylist?: (id: string) => void;
  removeToPlaylist?: (id: string) => void;
  showAddToPlaylist?: boolean;
  onRowClick?: () => void;
};

const SongsList = ({
  isLoading,
  songs,
  addToPlaylist,
  showAddToPlaylist,
  removeToPlaylist,
  onRowClick,
}: Props) => {
  // const [playIndex, setPlayIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [audioIns, setAudioIns] = useState<any>();
  const [showPopover, setShowPopover] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  const [prevStreamId, setPrevStreamId] = useState<string>();
  const [selectedSong, setSelectedSong] = useState<SongDoc>();
  const [isPlaylistActionLoading, setIsPlaylistAcitonLoading] = useState(false);
  const [songIndex, setSongIndex] = useState(0);
  const {
    // loading,
    playing,
    // ready,
    // togglePlayPause,
    play,
    pause,
  } = useGlobalAudioPlayer();

  const resetTimer = (isPlay: boolean = false, playId?: string) => {
    if (timer) {
      clearTimeout(timer);
    }
    if (isPlay) {
      setTimer(
        setTimeout(() => {
          // Increase Stream
          setPrevStreamId(playId);
          if (playId) incrementStreamCount(playId);
          console.log(`Streamed: ${songs[songIndex].name}`);
        }, 10_000)
      );
    }
  };

  const onAddToPlaylist = async (songAddress: string) => {
    if (addToPlaylist) {
      setIsPlaylistAcitonLoading(true);
      await addToPlaylist(songAddress);
      setIsPlaylistAcitonLoading(false);
      setShowPopover(false);
    }
  };

  const onRemoveToPlaylist = async (songAddress: string) => {
    if (removeToPlaylist) {
      setIsPlaylistAcitonLoading(true);
      await removeToPlaylist(songAddress);
      setIsPlaylistAcitonLoading(false);
      setShowPopover(false);
    }
  };

  const onAudioPlay = (id: string) => {
    if (id === prevStreamId) {
      resetTimer();
    } else {
      resetTimer(true, id);
    }
    setIsPaused(false);
  };

  const onAudioPause = () => {
    resetTimer();
    setIsPaused(true);
  };

  useEffect(() => {
    if (playing) onAudioPlay(songs[songIndex].id);
    else onAudioPause();
  }, [playing]);

  if (songs.length === 0 && !isLoading) {
    return (
      <Box>
        <Typography>No Songs Available</Typography>
      </Box>
    );
  }

  return (
    <Box display={"flex"} flexDirection="column">
      {isLoading &&
        new Array(10)
          .fill("")
          .map((x, i) => (
            <Skeleton key={i} height="61px" sx={{ mx: 4 }} animation="wave" />
          ))}
      {songs.map((song, i) => (
        <Box
          boxShadow={
            songIndex === song.idx
              ? "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px"
              : ""
          }
          key={i}
          p={1}
          display="flex"
          alignItems={"center"}
          sx={{
            borderRadius: "6px",
            background: songIndex === song.idx ? "rgba(255,255,255,0.4)" : "",
            ":hover": {
              background:
                songIndex === song.idx
                  ? "rgba(255,255,255,0.4)"
                  : "rgba(0,0,0,0.3)",
            },
          }}
          justifyContent="space-between"
          width="100%"
          onClick={() => {
            onRowClick && onRowClick();
            if (song.idx === songIndex) {
              return;
            }
            setSongIndex(song.idx);
            // if (audioIns?.updatePlayIndex) audioIns.updatePlayIndex(song.idx);
            // setPlayIndex(i);
          }}
        >
          <Box display="flex" alignItems={"center"} gap={2}>
            <Box display="flex" alignItems={"center"} gap={2}>
              <Box position={"relative"} mr={1} width="24px">
                {songIndex === song.idx && (
                  <Box
                    sx={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      borderRadius: "4px",
                    }}
                    display="flex"
                  >
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isPaused) play();
                        else pause();
                      }}
                      sx={{
                        background: "black",
                        borderRadius: "4px",
                        ":hover": {
                          background: "black",
                        },
                      }}
                    >
                      {isPaused ? (
                        <PlayCircleOutlinedIcon
                          sx={{
                            background: "rgb(0,0,0)",
                            borderRadius: "50%",
                          }}
                        />
                      ) : (
                        <PauseIcon
                          sx={{
                            background: "rgb(0,0,0)",
                            borderRadius: "50%",
                          }}
                        />
                      )}
                    </IconButton>
                  </Box>
                )}
                <Typography align="right" sx={{ color: "#c4c4c4" }}>
                  {i + 1}
                </Typography>
              </Box>
              <img
                src={`${process.env.NEXT_PUBLIC_STREAMING}/${songs[songIndex].tokenAddress}/${songs[songIndex].tokenId}`}
                width={40}
                height={40}
                style={{ borderRadius: "4px" }}
                alt=""
              />
            </Box>
            <Box>
              <Typography textTransform={"capitalize"}>{song.name}</Typography>
            </Box>
          </Box>
          <Box>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setAnchorEl(e.target as any);
                setSelectedSong(song);
                setShowPopover(true);
              }}
            >
              <MoreVertIcon
                sx={{
                  color: "rgba(255,255,255,0.3)",
                }}
              />
            </IconButton>
          </Box>
        </Box>
      ))}
      {/* <ReactJkMusicPlayer
        // responsive={false}
        audioLists={songs}
        mode="full"
        onAudioPause={() => {
          resetTimer();
          setIsPaused(true);
        }}
        onAudioPlay={(audioInfo) => {
          if (audioInfo.id === prevStreamId) {
            resetTimer();
          } else {
            resetTimer(true, audioInfo.id);
          }
          setIsPaused(false);
        }}
        // onAudioPlayTrackChange={}
        getAudioInstance={(audio) => setAudioIns(audio)}
        onPlayIndexChange={(idx) => setPlayIndex(idx)}
        autoPlay={false}
        volumeFade={{ fadeIn: 1000, fadeOut: 500 }}
        defaultVolume={0.5}
        // drag={false}
        defaultPosition={{ right: "10%", bottom: "5%" }}
        showReload={false}
        showLyric={false}
        showDestroy={false}
        showDownload={false}
        showThemeSwitch={false}
        responsive={false}
        // mobileMediaQuery='(min-width: 1024px)'
      /> */}
      {songs?.length > 0 && (
        <Box position={"fixed"} bottom={0} width="100%" left={0}>
          {/* <Player songs={songs} songIndexProps={[songIndex, setSongIndex]} /> */}
        </Box>
      )}
      <Popover
        open={showPopover}
        onClose={() => setShowPopover(false)}
        anchorEl={anchorEl}
        sx={{ mt: 6 }}
      >
        <List>
          <ListItemButton
            onClick={() => {
              if (selectedSong && addToPlaylist)
                onAddToPlaylist(selectedSong.id);
            }}
            disabled={!showAddToPlaylist || isPlaylistActionLoading}
          >
            {isPlaylistActionLoading ? (
              <CircularProgress size={"18px"} color="info" />
            ) : (
              <Typography>Add to Playlist</Typography>
            )}
          </ListItemButton>
          {!showAddToPlaylist && (
            <ListItemButton
              onClick={() => {
                if (selectedSong && removeToPlaylist)
                  onRemoveToPlaylist(selectedSong.id);
              }}
            >
              {isPlaylistActionLoading ? (
                <CircularProgress size={"18px"} color="info" />
              ) : (
                <Typography>Remove from Playlist</Typography>
              )}
            </ListItemButton>
          )}
          {/* <ListItemButton>
            <Typography>Add to Queue</Typography>
          </ListItemButton> */}
          {/* <ListItemButton>
            <Typography>View Nft</Typography>
          </ListItemButton> */}
        </List>
      </Popover>
    </Box>
  );
};

export default SongsList;
