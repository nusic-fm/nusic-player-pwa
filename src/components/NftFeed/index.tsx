import { Box } from "@mui/material";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { useAudioPlayer } from "react-use-audio-player";
// import { useSpring, animated } from "react-spring";
// import useGesture from "../../hooks/useGesture";
// import useScan from "../../hooks/useScan";
// import useWindowSize from "../../hooks/useWindowSize";
import { SongDoc } from "../../models/Song";
import ScrollElem from "./ScrollElem";

type Props = {
  songs: SongDoc[];
  onFeedClose: () => void;
  addToPlaylist: (songId: string) => Promise<void>;
};

const NftFeed = ({ songs, onFeedClose, addToPlaylist }: Props) => {
  const [songId, setSongId] = useState<string>();
  const [isPlaying, setIsPlaying] = useState(false);
  // const { load, playing } = useAudioPlayer();

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
            addToPlaylist={addToPlaylist}
            wavesurferInstances={wavesurferInstances}
            togglePlayPause={togglePlayPause}
          />
        ))}
      </Box>
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
