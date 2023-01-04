/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useInViewport } from "../../hooks/useInViewport";
import { Song } from "../../models/Song";
import { keyframes } from "@emotion/react";

const roteteImage = keyframes`
  from {
    transform: rotate(0dev);
  }

  to {
    transform: rotate(360deg);
  }
`;

type Props = { song: Song };

const AudioPlaer = ({ song }: Props) => {
  const audioRef = useRef(new Audio(song.audioFileUrl));
  const { isInViewport, ref } = useInViewport(song.name);
  const [isPlaying, setIsPlaying] = useState(false);
  const animationRef = useRef<HTMLImageElement>(null);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  useEffect(() => {
    if (isPlaying) {
      if (animationRef.current)
        animationRef.current.style.animationPlayState = "running";
      audioRef.current.play();
    } else {
      if (animationRef.current)
        animationRef.current.style.animationPlayState = "paused";
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isInViewport) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [isInViewport]);

  useEffect(() => {
    // Pause and clean up on unmount
    return () => {
      audioRef.current.pause();
      // TODO
      // clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <Box
      width="100%"
      height="100%"
      ref={(r) => ref(r as any)}
      onClick={() => togglePlayPause()}
    >
      <Box
        width={"100%"}
        height={"100%"}
        display="flex"
        flexDirection={"column"}
        justifyContent="center"
        alignItems="center"
      >
        <img
          ref={animationRef}
          css={css`
            animation: ${roteteImage} 30s ease infinite;
            border-radius: 50%;
          `}
          src={song.artworkUrl}
          alt=""
          width="260px"
          height="260px"
        ></img>
      </Box>
      {/* <Box display={"flex"} gap={2} justifyContent="center">
        <LoadingButton
          // loading={loading}
          onClick={() => {
            togglePlayPause();
          }}
          color="secondary"
        >
          {isPlaying ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
        </LoadingButton>
      </Box> */}
    </Box>
  );
};

export default AudioPlaer;
