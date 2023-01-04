import { Box } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useInViewport } from "../../hooks/useInViewport";
import { Song } from "../../models/Song";

type Props = { song: Song };

const VideoPlayer = ({ song }: Props) => {
  const { isInViewport, ref } = useInViewport(song.name);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isInViewport) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  }, [isInViewport]);

  return (
    <Box width="100%" height="100%" ref={(r: any) => ref(r)}>
      <video
        ref={videoRef}
        width={"100%"}
        height="100%"
        src={song.audioFileUrl}
        controls
        poster={song.artworkUrl}
      ></video>
    </Box>
  );
};

export default VideoPlayer;
