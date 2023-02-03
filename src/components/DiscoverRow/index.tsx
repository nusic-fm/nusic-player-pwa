/* eslint-disable @next/next/no-img-element */
import { Box, Typography, IconButton } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import StopRoundedIcon from "@mui/icons-material/StopRounded";
import { SongDoc } from "../../models/Song";

type Props = {
  song: SongDoc;
  onTogglePlay: () => void;
  isPlaying: boolean;
};

const DiscoverRow = ({ song, onTogglePlay, isPlaying }: Props) => {
  return (
    <Box
      key={song.id}
      width={"100%"}
      position="relative"
      display={"flex"}
      alignItems="center"
      gap={1}
    >
      <img
        src={`${process.env.NEXT_PUBLIC_STREAMING}/image/${song.tokenAddress}/${song.tokenId}`}
        alt="test"
        width={60}
        height={60}
      ></img>
      <Box width={"80%"}>
        <Typography variant="body2">{song.name}</Typography>
        <Typography variant="caption">{song.artist}</Typography>
      </Box>
      <IconButton onClick={onTogglePlay}>
        {isPlaying ? <StopRoundedIcon /> : <PlayArrowRoundedIcon />}
      </IconButton>
    </Box>
  );
};

export default DiscoverRow;
