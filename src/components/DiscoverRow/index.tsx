/* eslint-disable @next/next/no-img-element */
import { Box, Typography, IconButton } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
// import StopRoundedIcon from "@mui/icons-material/StopRounded";
import PauseRounded from "@mui/icons-material/PauseRounded";
import { SongDoc } from "../../models/Song";

type Props = {
  song: SongDoc;
  onTogglePlay: (e: any) => void;
  isPlaying: boolean;
  onRowClick: (address: string, tokenId: string) => void;
};

const DiscoverRow = ({ song, onTogglePlay, isPlaying, onRowClick }: Props) => {
  return (
    <Box
      key={song.id}
      width={"100%"}
      position="relative"
      display={"flex"}
      alignItems="center"
      gap={1}
      onClick={() => onRowClick(song.tokenAddress, song.tokenId)}
    >
      <img src={song.posterUrl} alt="" width={60} height={60}></img>
      <Box width={"80%"}>
        <Typography variant="body2">{song.name}</Typography>
        <Typography variant="caption">{song.artist}</Typography>
      </Box>
      <IconButton onClick={onTogglePlay}>
        {isPlaying ? <PauseRounded /> : <PlayArrowRoundedIcon />}
      </IconButton>
    </Box>
  );
};

export default DiscoverRow;
