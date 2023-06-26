import { Divider, Typography } from "@mui/material";
import { Box } from "@mui/system";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch } from "react-instantsearch-hooks-web";
import SearchBar from "../src/components/SearchBar";
import { useState, useEffect } from "react";
import { useGlobalAudioPlayer } from "react-use-audio-player";
import { SongDoc } from "../src/models/Song";
import {
  getDiscoverSongs,
  getSongById,
} from "../src/services/db/songs.service";
import DiscoverRow from "../src/components/DiscoverRow";
import { useRouter } from "next/router";

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APPID as string,
  process.env.NEXT_PUBLIC_ALGOLIA_APIKEY as string
);

const Discover = () => {
  const [songsLoading, setSongsLoading] = useState(false);
  const [songs, setSongs] = useState<SongDoc[]>();
  const [searchResult, setSearchResult] = useState<SongDoc[]>();
  const { load, playing, togglePlayPause } = useGlobalAudioPlayer();
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string>();

  const router = useRouter();

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
    const src = song.streamUrl;
    load(src, {
      html5: true,
      autoplay: true,
    });
    setCurrentlyPlayingId(song.id);
  };

  const onSongSelect = async (songId: string) => {
    const song = await getSongById(songId);
    setSearchResult([song]);
  };
  const removeSearchResult = async () => {
    setSearchResult(undefined);
  };

  return (
    <Box sx={{ bgcolor: "black" }} minHeight="100vh">
      <InstantSearch searchClient={searchClient} indexName="tracks">
        <SearchBar
          onSuggestionSelect={onSongSelect}
          clearSearch={removeSearchResult}
        />
      </InstantSearch>
      {searchResult && (
        <Box px={1} mt={2}>
          <Typography variant="body2" sx={{ color: "#c3c3c3" }}>
            Results
          </Typography>
          <Box
            mt={2}
            display="flex"
            gap={2}
            flexWrap="wrap"
            justifyContent={"center"}
            flexDirection="column"
          >
            {searchResult.map((song) => (
              <DiscoverRow
                key={song.idx}
                onTogglePlay={(e) => {
                  e.stopPropagation();
                  if (song.id === currentlyPlayingId && playing) {
                    togglePlayPause();
                    return;
                  }
                  onPlaySong(song);
                }}
                song={song}
                isPlaying={song.id === currentlyPlayingId && playing}
                onRowClick={(address: string, tokenId: string) => {
                  router.push(`market/${address}?tokenId=${tokenId}`);
                }}
              />
            ))}
          </Box>
          <Divider sx={{ my: 2 }} />
        </Box>
      )}
      <Box
        mt={2}
        display="flex"
        gap={2}
        flexWrap="wrap"
        justifyContent={"center"}
        flexDirection="column"
        px={1}
      >
        {songs?.map((song) => (
          <DiscoverRow
            key={song.idx}
            onTogglePlay={(e) => {
              e.stopPropagation();
              if (song.id === currentlyPlayingId) {
                togglePlayPause();
                return;
              }
              onPlaySong(song);
            }}
            song={song}
            isPlaying={song.id === currentlyPlayingId && playing}
            onRowClick={(address: string, tokenId: string) => {
              router.push(`market/${address}?tokenId=${tokenId}`);
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Discover;
