import { Skeleton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useAudioPlayer } from "react-use-audio-player";
import NftFeed from "../src/components/NftFeed";
import { SongDoc } from "../src/models/Song";
import { getSongs } from "../src/services/db/songs.service";

const Index = () => {
  const isMobile = 1 === 1 ? true : false;
  const [songs, setSongs] = useState<SongDoc[]>([]);
  const [songsLoading, setSongsLoading] = useState(false);

  const { pause } = useAudioPlayer();

  const fetchSongs = async () => {
    setSongsLoading(true);
    const _songs = await getSongs();
    setSongs(_songs);
    setSongsLoading(false);
  };

  useEffect(() => {
    pause();
    fetchSongs();
  }, []);

  return (
    <Box display={"flex"} height={"100vh"}>
      {isMobile === false && <Box height={"100vh"} width={200}></Box>}
      <Box height={"100vh"} width="100%">
        {songs.length ? (
          <NftFeed songs={songs} onFeedClose={() => {}} />
        ) : songsLoading ? (
          <Box
            display={"flex"}
            gap={5}
            flexDirection="column"
            alignItems={"center"}
            justifyContent="center"
            p={4}
          >
            <Skeleton variant="rounded" width={230} height={230} />
            <Skeleton variant="rounded" width="100%" height={30} />
            <Skeleton variant="rounded" width="100%" height={80} />
            <Skeleton variant="circular" width={80} height={80} />
            <Skeleton variant="rounded" width="80%" height={40} />
            <Skeleton
              variant="rounded"
              width={230}
              height={60}
              sx={{ mt: 4 }}
            />
          </Box>
        ) : (
          <Typography>
            Network error, please refresh and try again later
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Index;
