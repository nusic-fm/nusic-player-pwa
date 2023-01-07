import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import { SongDoc } from "../../models/Song";
import AudioPlayer from "../AudioPlayer";
import VideoPlayer from "../VideoPlayer";
// import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import PlayCircleRounded from "@mui/icons-material/PlayCircleRounded";
import PauseCircleRounded from "@mui/icons-material/PauseCircleRounded";
import SeekBar from "../SeekBar";
import { useAudioPlayer, useAudioPosition } from "react-use-audio-player";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PlaylistAddRoundedIcon from "@mui/icons-material/PlaylistAddRounded";
import LoopRoundedIcon from "@mui/icons-material/LoopRounded";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import { useState } from "react";

type Props = {
  song: SongDoc;
  onFeedClose: () => void;
  inView: (index: number) => void;
  isPlaying: boolean;
  addToPlaylist: (songId: string) => Promise<void>;
};

const ScrollElem = ({
  song,
  onFeedClose,
  inView,
  isPlaying,
  addToPlaylist,
}: Props) => {
  const { playing, togglePlayPause } = useAudioPlayer();
  const { duration, position } = useAudioPosition();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Box
      display="flex"
      // justifyContent={"center"}
      alignItems="center"
      flexDirection={"column"}
      width="100%"
      height="100vh"
      key={song.name}
      sx={{ scrollSnapAlign: "start", scrollSnapStop: "always" }}
      pt={2}
    >
      <Box px={1} display="flex" justifyContent={"end"} width="100%">
        <IconButton onClick={onFeedClose}>
          <CloseRoundedIcon sx={{ fontSize: "2rem" }} />
        </IconButton>
      </Box>
      <Box
        display="flex"
        justifyContent={"center"}
        alignItems="center"
        flexBasis="40%"
      >
        {song.format === "audio" ? (
          <AudioPlayer song={song} inView={inView} isPlaying={isPlaying} />
        ) : (
          <VideoPlayer song={song} inView={inView} isPlaying={isPlaying} />
        )}
      </Box>
      <Box
        pt={4}
        px={4}
        display="flex"
        justifyContent={"space-between"}
        width="100%"
        alignItems={"center"}
      >
        <Typography variant="h6" noWrap width={"70%"}>
          {song.name}
        </Typography>
        {/* <IconButton>
          <FavoriteOutlinedIcon htmlColor="#c3c3c3" />
        </IconButton> */}
      </Box>
      <Box pt={2} px={4} width="100%">
        <SeekBar
          value={position}
          max={duration}
          onChange={() => {}}
          onChangeCommitted={() => {}}
        />
      </Box>
      <Box
        p={4}
        width="100%"
        display={"flex"}
        alignItems="center"
        justifyContent={"center"}
      >
        <IconButton disabled>
          {/* <ShareRoundedIcon sx={{ fontSize: 40 }} /> */}
        </IconButton>
        <IconButton onClick={togglePlayPause}>
          {playing ? (
            <PauseCircleRounded sx={{ fontSize: 80 }} />
          ) : (
            <PlayCircleRounded sx={{ fontSize: 80 }} />
          )}
        </IconButton>
        {/* <IconButton disabled>
          <LoopRoundedIcon sx={{ fontSize: 40 }} />
        </IconButton> */}
      </Box>
      <Box
        px={4}
        width="100%"
        display={"flex"}
        alignItems="center"
        justifyContent={"space-between"}
        gap={2}
      >
        <IconButton disabled>
          <ShareOutlinedIcon sx={{ fontSize: 40 }} />
        </IconButton>
        <IconButton
          onClick={async () => {
            setIsLoading(true);
            await addToPlaylist(song.id);
            setIsLoading(false);
          }}
        >
          {isLoading ? (
            <CircularProgress sx={{ fontSize: 40 }} />
          ) : (
            <PlaylistAddRoundedIcon sx={{ fontSize: 40 }} />
          )}
        </IconButton>
      </Box>
    </Box>
  );
};

export default ScrollElem;
