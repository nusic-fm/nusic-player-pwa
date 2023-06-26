import { Box } from "@mui/material";
import { useRef } from "react";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
// import { useSpring, animated } from "react-spring";
// import useGesture from "../../hooks/useGesture";
// import useScan from "../../hooks/useScan";
// import useWindowSize from "../../hooks/useWindowSize";
import { SongDoc } from "../../models/Song";
import {
  createPlaylistDb,
  saveToPlaylistDb,
} from "../../services/db/playlists.service";
import { addToUserPlaylist } from "../../services/db/user.service";
import { auth } from "../../services/firebase.service";
import PlaylistModal from "../PlaylistModal";
import ScrollElem from "./ScrollElem";

type Props = {
  songs: SongDoc[];
  onFeedClose: () => void;
};

const NftFeed = ({ songs, onFeedClose }: Props) => {
  const [songId, setSongId] = useState<string>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [user, authLoading] = useAuthState(auth);
  // const { load, playing } = useAudioPlayer();
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [selectedSongId, setSelectedSongId] = useState<string>();

  const onAddToPlaylist = async (songId: string) => {
    if (!user) {
      alert("Please login");
      return;
    }
    setSelectedSongId(songId);
    setShowPlaylists(true);
  };

  const onPlaylistSelect = async (
    playlistId: string,
    isCreate: boolean = false,
    playlistName: string = ""
  ) => {
    if (!user || !selectedSongId) return;
    if (isCreate) {
      try {
        const newPlaylistId = await createPlaylistDb(playlistName, user.uid, {
          songId: selectedSongId,
        });
        await addToUserPlaylist(user?.uid, newPlaylistId, {
          name: playlistName,
        });
      } catch (e: any) {
        alert(e.message);
      }
    } else {
      await saveToPlaylistDb(playlistId, [{ songId: selectedSongId }]);
    }
    alert("Added to Playlist");
    setShowPlaylists(false);
    // TODO
    // playlists
    // user/playlists
    // await addToUserPlaylist(user?.uid, songId, {});
  };

  const wavesurferInstances = useRef<{
    [key: string]: WaveSurfer;
  }>({});

  // useEffect(() => {
  // const src = songs[songIndex].streamUrl;
  // load({
  //   src,
  //   html5: true,
  //   autoplay: false,
  //   format: ["mp3"],
  // });
  // onPlayIndexChange(songs[songIndex].idx);
  // }, [songIndex]);

  const pauseSong = () =>
    wavesurferInstances.current[`waveform-${songId}`].pause();
  const playSong = (id: string) => wavesurferInstances.current[id].play();

  const inView = (id: string) => {
    if (id === songId) return;

    if (isPlaying) {
      pauseSong();
      if (wavesurferInstances.current[id]?.isPlaying() === false) playSong(id);
    }
    // if (songIndex === index || songs.length === index) return;
    // const prevSong = songs[songIndex];
    // if (prevSong && wavesurferInstances.current[prevSong.id]?.isPlaying()) {
    //   wavesurferInstances.current[prevSong.id].pause();
    // }
    // // const song = songs[index];
    // // wavesurferInstances.current[song.id].play();
    setSongId(id);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      pauseSong();
    } else {
      setIsPlaying(true);
      playSong(`waveform-${songId}`);
    }
  };

  return (
    <Box
      width="100%"
      boxSizing="border-box"
      sx={{ background: "rgba(0,0,0,0.85)" }}
      position="relative"
    >
      <Box
        position="relative"
        width="100%"
        height="100vh"
        sx={{ overflowY: "auto", scrollSnapType: "y mandatory" }}
      >
        {songs.map((s) => (
          <ScrollElem
            key={s.name}
            song={s}
            onFeedClose={onFeedClose}
            inView={inView}
            isPlaying={isPlaying}
            onAddToPlaylist={onAddToPlaylist}
            wavesurferInstances={wavesurferInstances}
            togglePlayPause={togglePlayPause}
            user={user}
          />
        ))}
      </Box>
      {user && (
        <PlaylistModal
          open={showPlaylists}
          uid={user.uid}
          onPlaylistSelect={onPlaylistSelect}
          onClose={() => setShowPlaylists(false)}
        />
      )}
    </Box>
  );
};

export default NftFeed;

// const [currentPostIndex, setCurrentPostIndex, scan] = useScan(songs);

// const [, height] = useWindowSize();

// // Set the initial posistion of the view based on the position of
// // the current element in the feed scan.
// const initialY = scan.previous ? -height : 0;

// const [animation, spring] = useSpring(() => ({
//   top: initialY,
// }));

// // Select next post in scan.
// const nextSelect = () => {
//   setCurrentPostIndex(currentPostIndex + 1);

//   spring.start({
//     from: {
//       top: -height,
//     },
//   });
// };

// // Select previous post in scan.
// const previousSelect = () => {
//   setCurrentPostIndex(currentPostIndex - 1);

//   spring.start({
//     from: {
//       top: currentPostIndex - 1 !== 0 ? -height : 0,
//     },
//   });
// };

// const gestures = useGesture((type, measure) => {
//   if (type === "moving") {
//     return spring.start({
//       top: initialY + measure.delta,
//     });
//   }

//   if (type === "end") {
//     const resetInitialY = () =>
//       spring.start({
//         top: initialY,
//       });

//     // In case of a slow gesture, spring back to the initial position.
//     if (measure.delta <= height * 0.75 && Math.abs(measure.speed) < 0.5) {
//       return resetInitialY();
//     }

//     // In case the post is an boundary, reset to the initial position.
//     if (
//       (!scan.next && measure.direction === 1) ||
//       (!scan.previous && measure.direction === -1)
//     ) {
//       return resetInitialY();
//     }

//     if (measure.direction === 1) {
//       return spring.start({
//         top: scan.previous ? -2 * height : -height,
//         onRest: nextSelect,
//       });
//     }

//     if (measure.direction === -1) {
//       return spring.start({
//         top: 0,
//         onRest: previousSelect,
//       });
//     }
//   }
// });

// const elements = [scan.previous, scan.current, scan.next];

// const renderables = elements.filter((element) => !!element);

// const renders = renderables.map((r) => <ScrollElem key={r.name} song={r} />);
