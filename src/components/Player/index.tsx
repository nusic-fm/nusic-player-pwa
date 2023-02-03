/* eslint-disable @next/next/no-img-element */
import VolumeDownRounded from "@mui/icons-material/VolumeDownRounded";
import VolumeUpRounded from "@mui/icons-material/VolumeUpRounded";
import FastForwardRounded from "@mui/icons-material/FastForwardRounded";
import FastRewindRounded from "@mui/icons-material/FastRewindRounded";
import PauseCircleRounded from "@mui/icons-material/PauseCircleRounded";
import PlayCircleRounded from "@mui/icons-material/PlayCircleRounded";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  IconButton,
  Slider,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAudioPlayer, useAudioPosition } from "react-use-audio-player";
import { useTheme } from "@mui/material/styles";
import { SongDoc } from "../../models/Song";
import SeekBar from "../SeekBar";

type Props = {
  songs: SongDoc[];
  songIndexProps: [number, (val: number) => void];
};

const Player = ({ songs, songIndexProps }: Props) => {
  const [songIndex, setSongIndex] = songIndexProps;
  const theme = useTheme();
  const [localPosition, setLocalPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const {
    // loading,
    playing,
    // ready,
    togglePlayPause,
    // play,
    // pause,
    volume,
    load,
    // error,
  } = useAudioPlayer();
  const { duration, seek, position } = useAudioPosition();

  useEffect(() => {
    if (!isDragging) setLocalPosition(position);
  }, [position, isDragging]);

  const isMobile = useMediaQuery(() => theme.breakpoints.down("md"));

  useEffect(() => {
    const src = `${process.env.NEXT_PUBLIC_STREAMING}/stream/${songs[songIndex].tokenAddress}/${songs[songIndex].tokenId}`;
    if (!src) return;
    load({
      src,
      html5: true,
      autoplay: true,
      format: ["wav", "mp3", "mp4"],
      onend: () => setSongIndex(songIndex + 1),
    });
    // onPlayIndexChange(songs[songIndex].idx);
  }, [songIndex]);

  // useEffect(() => {
  //   if (playing) onAudioPlay({ id: songs[songIndex].id });
  //   else onAudioPause();
  // }, [playing]);

  return (
    <Box
      sx={{ bgcolor: "black" }}
      p={1}
      display="flex"
      alignItems={"center"}
      gap={2}
      justifyContent="space-between"
    >
      <Box
        display="flex"
        alignItems={"center"}
        width={{ xs: "75%", md: "60%" }}
        gap={2}
      >
        <img
          src={`${process.env.NEXT_PUBLIC_STREAMING}/image/${songs[songIndex].tokenAddress}/${songs[songIndex].tokenId}`}
          alt=""
          width={"40px"}
          height="40px"
          style={{ borderRadius: "50%" }}
        />
        <Box
          display="flex"
          justifyContent={"center"}
          flexDirection="column"
          width={"calc(100% - 40px)"}
        >
          <Typography noWrap fontSize={"italic"}>
            {songs[songIndex].name}
          </Typography>
          <SeekBar
            value={localPosition}
            max={duration}
            onChange={(e, newPosition) => {
              setIsDragging(true);
              setLocalPosition(newPosition as number);
            }}
            onChangeCommitted={(e, val) => {
              setIsDragging(false);
              seek(val as number);
            }}
          />
          {/* <Slider
            value={localPosition}
            max={duration}
            color="secondary"
            size="small"
            onChange={(e, newPosition) => {
              setIsDragging(true);
              setLocalPosition(newPosition as number);
            }}
            onChangeCommitted={(e, val) => {
              setIsDragging(false);
              seek(val as number);
            }}
            min={0}
            // step={1}
            sx={{
              ml: 0.5,
              width: "100%",
              color:
                theme.palette.mode === "dark" ? "#fff" : "rgba(0,0,0,0.87)",
              height: 4,
              "& .MuiSlider-thumb": {
                width: 8,
                height: 8,
                transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
                "&:before": {
                  boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
                },
                "&:hover, &.Mui-focusVisible": {
                  boxShadow: `0px 0px 0px 8px ${
                    theme.palette.mode === "dark"
                      ? "rgb(255 255 255 / 16%)"
                      : "rgb(0 0 0 / 16%)"
                  }`,
                },
                "&.Mui-active": {
                  width: 20,
                  height: 20,
                },
              },
              "& .MuiSlider-rail": {
                opacity: 0.28,
              },
            }}
          /> */}
        </Box>
      </Box>
      <Box display={"flex"} alignItems="center" gap={2}>
        <Box display={"flex"}>
          {!isMobile && (
            <IconButton
              size="small"
              disabled={songIndex === 0}
              onClick={() => setSongIndex(songIndex - 1)}
            >
              <FastRewindRounded />
            </IconButton>
          )}
          <LoadingButton
            size="small"
            // loading={!ready}
            onClick={() => {
              togglePlayPause();
            }}
            color="secondary"
          >
            {playing ? <PauseCircleRounded /> : <PlayCircleRounded />}
          </LoadingButton>
          {!isMobile && (
            <IconButton
              size="small"
              disabled={songIndex === songs.length - 1}
              onClick={() => setSongIndex(songIndex + 1)}
            >
              <FastForwardRounded />
            </IconButton>
          )}
        </Box>
        {!isMobile && (
          <Stack spacing={2} direction="row" alignItems="center">
            <VolumeDownRounded htmlColor={"rgba(255,255,255,0.4)"} />
            <Slider
              aria-label="Volume"
              min={0}
              defaultValue={1}
              step={0.01}
              max={1}
              // value={volume()}
              onChange={(e, newVal) => volume(newVal)}
              sx={{
                width: "100px",
                color:
                  theme.palette.mode === "dark" ? "#fff" : "rgba(0,0,0,0.87)",
                "& .MuiSlider-track": {
                  border: "none",
                },
                "& .MuiSlider-thumb": {
                  width: 12,
                  height: 12,
                  backgroundColor: "#fff",
                  "&:before": {
                    boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
                  },
                  "&:hover, &.Mui-focusVisible, &.Mui-active": {
                    boxShadow: "none",
                  },
                },
              }}
            />
            <VolumeUpRounded htmlColor={"rgba(255,255,255,0.4)"} />
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default Player;
