import PlayCircleRounded from "@mui/icons-material/PlayCircleRounded";
import PauseCircleRounded from "@mui/icons-material/PauseCircleRounded";
import { Box, IconButton, Typography } from "@mui/material";

type Props = {
  isPlayling: boolean;
};

const PlaylistNameCard = ({ isPlayling }: Props) => {
  return (
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
        {isPlayling ? (
          <PauseCircleRounded />
        ) : (
          <PlayCircleRounded htmlColor="black" />
        )}
      </IconButton>
      <Typography color="black" align="center">
        Welcome to NUSIC
      </Typography>
    </Box>
  );
};

export default PlaylistNameCard;
