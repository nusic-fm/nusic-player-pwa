/* eslint-disable @next/next/no-img-element */
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch } from "react-instantsearch-hooks-web";
import SearchBar from "../src/components/SearchBar";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import StopRoundedIcon from "@mui/icons-material/StopRounded";
import { Fab } from "@mui/material";
import { useState, useEffect } from "react";
import { useAudioPlayer } from "react-use-audio-player";
import { SongDoc } from "../src/models/Song";
import {
  getDiscoverSongs,
  getSongsById,
} from "../src/services/db/songs.service";

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APPID as string,
  process.env.NEXT_PUBLIC_ALGOLIA_APIKEY as string
);

const Discover = () => {
  const [songsLoading, setSongsLoading] = useState(false);
  const [songs, setSongs] = useState<SongDoc[]>();
  const { load, playing, togglePlayPause } = useAudioPlayer();
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string>();

  const fetchSongs = async () => {
    setSongsLoading(true);
    const _songs = await getDiscoverSongs();
    setSongs(_songs);
    setSongsLoading(false);
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const onPlaySong = (song: SongDoc) => {
    const src = `${process.env.NEXT_PUBLIC_STREAMING}/stream/${song.tokenAddress}/${song.tokenId}`;
    load({
      src,
      html5: true,
      autoplay: true,
      format: ["mp3"],
    });
    setCurrentlyPlayingId(song.id);
  };

  const onSongSelect = async (songId: string) => {
    const song = await getSongsById(songId);
    setSongs([song]);
  };

  return (
    <Box>
      <InstantSearch searchClient={searchClient} indexName="songs">
        <SearchBar onSuggestionSelect={onSongSelect} />
        {/* <SearchBox autoFocus searchAsYouType />
        <Box
          height={"40vh"}
          overflow="auto"
          py={1}
          sx={{
            ".ais-Hits-item": {
              p: 2,
              bgcolor: "transparent",
              borderBottom: "1px solid rgba(114, 137, 218, 0.2)",
            },
          }}
        >
          <Hits
            hitComponent={({ hit }) => (
              <Typography>{(hit as any).name}</Typography>
            )}
          />
        </Box> */}
        {/* <RefinementList attribute="artist" /> */}
      </InstantSearch>
      <Box
        mt={2}
        display="flex"
        gap={2}
        flexWrap="wrap"
        justifyContent={"center"}
      >
        {songs?.map((song) => (
          <Box key={song.id} width={100} position="relative">
            <img
              src={`${process.env.NEXT_PUBLIC_STREAMING}/image/${song.tokenAddress}/${song.tokenId}`}
              alt="test"
              width={100}
              height={100}
            ></img>
            <Typography variant="caption">{song.name}</Typography>
            <Box position={"absolute"} bottom={0} right={0} zIndex={0}>
              <Fab
                sx={{
                  backgroundColor: "rgba(159, 159, 159, 0.4) !important",
                  backdropFilter: "blur(10px)",
                }}
                size="small"
                onClick={() => {
                  if (song.id === currentlyPlayingId && playing) {
                    togglePlayPause();
                    return;
                  }
                  onPlaySong(song);
                }}
              >
                {song.id === currentlyPlayingId && playing ? (
                  <StopRoundedIcon color="secondary" />
                ) : (
                  <PlayArrowRoundedIcon color="secondary" />
                )}
              </Fab>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Discover;
