import { Box } from "@mui/material";
import { useEffect } from "react";
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

  const [songIndex, setSongIdx] = useState(0);
  const { load, playing } = useAudioPlayer();

  useEffect(() => {
    const src = `${process.env.NEXT_PUBLIC_STREAMING}/stream/${songs[songIndex].tokenAddress}/${songs[songIndex].tokenId}`;
    load({
      src,
      html5: true,
      autoplay: true,
      format: ["mp3"],
      onend: () => setSongIdx(songIndex + 1),
    });
    // onPlayIndexChange(songs[songIndex].idx);
  }, [songIndex]);

  const inView = (index: number) => {
    if (songIndex === index) return;
    setSongIdx(index);
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
            isPlaying={songIndex === s.idx && playing}
            addToPlaylist={addToPlaylist}
          />
        ))}
      </Box>
    </Box>
  );
};

export default NftFeed;
