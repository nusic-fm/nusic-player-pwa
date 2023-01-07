import { Box, IconButton, Typography } from "@mui/material";
import { SongDoc } from "../../models/Song";
import AudioPlayer from "../AudioPlayer";
import VideoPlayer from "../VideoPlayer";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";

type Props = { song: SongDoc; onFeedClose: () => void };

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
      <Box
        display="flex"
        justifyContent={"center"}
        alignItems="center"
        flexBasis="40%"
      >
        {song.format === "audio" ? (
          <AudioPlayer song={song} />
        ) : (
          <VideoPlayer song={song} />
        )}
      </Box>
      <Box
        p={4}
        display="flex"
        justifyContent={"space-between"}
        width="100%"
        alignItems={"center"}
      >
        <Typography align="center" variant="h6" noWrap width={"70%"}>
          {song.name}
        </Typography>
        <IconButton>
          <FavoriteOutlinedIcon htmlColor="#c3c3c3" />
        </IconButton>
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
