import { Box } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useInViewport } from "../../hooks/useInViewport";
import { Song } from "../../models/Song";

type Props = { song: Song };

const VideoPlayer = ({ song }: Props) => {
  const { isInViewport, ref } = useInViewport(song.name);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isInViewport) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [isInViewport]);

  const togglePauseOrPlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <Box
      width="100%"
      height="100%"
      ref={(r: any) => ref(r)}
      onClick={() => togglePauseOrPlay()}
    >
      <Box
        width={"100%"}
        height={"100%"}
        display="flex"
        flexDirection={"column"}
        justifyContent="center"
        alignItems="center"
      >
        <video
          ref={videoRef}
          width="260px"
          height="260px"
          src={song.audioFileUrl}
          // controls
          poster={song.artworkUrl}
        ></video>
      </Box>
    </Box>
  );
};

export default VideoPlayer;
