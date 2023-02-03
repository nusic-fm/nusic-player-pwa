import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import { SongDoc } from "../../models/Song";
import AudioPlayer from "../AudioPlayer";
// import VideoPlayer from "../VideoPlayer";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import PlayCircleRounded from "@mui/icons-material/PlayCircleRounded";
// import PauseCircleRounded from "@mui/icons-material/PauseCircleRounded";
import StopCircleRounded from "@mui/icons-material/StopCircleRounded";
// import SeekBar from "../SeekBar";
import { useAudioPlayer, useAudioPosition } from "react-use-audio-player";
// import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PlaylistAddRoundedIcon from "@mui/icons-material/PlaylistAddRounded";
// import LoopRoundedIcon from "@mui/icons-material/LoopRounded";
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
      <Box position={"relative"} width="100%">
        <Box
          position={"absolute"}
          width="100%"
          top={0}
          height="100vh"
          zIndex={0}
          sx={{
            backgroundImage: `url("http://localhost:8080/image/${song.tokenAddress}/${song.tokenId}")`,
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            filter: "blur(80px)",
            opacity: 0.6,
            backgroundSize: "cover",
          }}
        ></Box>
      </Box>
      <Box
        display="flex"
        justifyContent={"center"}
        alignItems="center"
        flexBasis="40%"
        position={"relative"}
      >
        {/* {song.format === "audio" ? (
          <AudioPlayer song={song} inView={inView} isPlaying={isPlaying} />
        ) : (
          <VideoPlayer song={song} inView={inView} isPlaying={isPlaying} />
        )} */}
        <AudioPlayer song={song} inView={inView} isPlaying={isPlaying} />
      </Box>
      <Box
        pt={4}
        px={4}
        display="flex"
        justifyContent={"space-between"}
        width="100%"
        alignItems={"center"}
      >
        <Typography variant="body1" width={"100%"}>
          {song.name}
        </Typography>
      </Box>
      {/* <Box pt={2} px={4} width="100%">
        <SeekBar
          value={playing ? position : 0}
          max={duration}
          onChange={() => {}}
          onChangeCommitted={() => {}}
        />
      </Box> */}
      <Box
        p={2}
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
            <StopCircleRounded sx={{ fontSize: 80 }} />
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
        justifyContent={"center"}
        gap={2}
      >
        <IconButton disabled>
          <FavoriteOutlinedIcon />
        </IconButton>
        <IconButton disabled>
          <ShareOutlinedIcon />
        </IconButton>

        <IconButton
          onClick={async () => {
            setIsLoading(true);
            await addToPlaylist(song.id);
            setIsLoading(false);
          }}
          disabled
        >
          {isLoading ? <CircularProgress /> : <PlaylistAddRoundedIcon />}
        </IconButton>
      </Box>
      {/* <Box px={1} display="flex" justifyContent={"end"} width="100%">
        <IconButton onClick={onFeedClose}>
          <CloseRoundedIcon sx={{ fontSize: "2rem" }} />
        </IconButton>
      </Box> */}
    </Box>
  );
};

export default ScrollElem;
