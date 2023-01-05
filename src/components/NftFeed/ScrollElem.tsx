import { Box, IconButton, Typography } from "@mui/material";
import { Song } from "../../models/Song";
import AudioPlayer from "../AudioPlayer";
import VideoPlayer from "../VideoPlayer";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

type Props = { song: Song; onFeedClose: () => void };

const ScrollElem = ({ song, onFeedClose }: Props) => {
  return (
    <Box
      display="flex"
      // justifyContent={"center"}
      alignItems="center"
      flexDirection={"column"}
      width="100%"
      height="100vh"
      key={song.name}
      boxSizing="border-box"
      sx={{ scrollSnapAlign: "start", scrollSnapStop: "always" }}
    >
      <Box p={2}>
        <Typography align="center" variant="h6">
          {song.name}
        </Typography>
      </Box>
      <Box display="flex" justifyContent={"center"} flexBasis="80%">
        {song.format === "audio" ? (
          <AudioPlayer song={song} />
        ) : (
          <VideoPlayer song={song} />
        )}
      </Box>
      <Box>
        <IconButton onClick={onFeedClose}>
          <HighlightOffIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ScrollElem;
