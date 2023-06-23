/* eslint-disable @next/next/no-img-element */
import VolumeDownRounded from "@mui/icons-material/VolumeDownRounded";
import VolumeUpRounded from "@mui/icons-material/VolumeUpRounded";
import FastRewindOutlined from "@mui/icons-material/FastRewindOutlined";
import PauseIcon from "@mui/icons-material/Pause";
import {
  Box,
  CircularProgress,
  Fab,
  IconButton,
  Slider,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAudioPlayer, useAudioPosition } from "react-use-audio-player";
import { useTheme } from "@mui/material/styles";
import SeekBar from "../SeekBar";
import { IZoraData } from "../../models/TypeZora";
import FastForwardOutlinedIcon from "@mui/icons-material/FastForwardOutlined";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { convertSecondsToHHMMSS, createUrlFromCid } from "../../helpers";

type Props = {
  songs: IZoraData[];
  songIndexProps: [number, (val: number) => void];
};

const Player = ({ songs, songIndexProps }: Props) => {
  const [songIndex, setSongIndex] = songIndexProps;
  const theme = useTheme();
  const [localPosition, setLocalPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const {
    loading,
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
    // const src = `${process.env.NEXT_PUBLIC_STREAMING}/stream/${songs[songIndex].tokenAddress}/${songs[songIndex].tokenId}`;
    if (songIndex !== -1) {
      const src = createUrlFromCid(songs[songIndex].content?.url);
      if (!src) return;
      load({
        src,
        html5: true,
        autoplay: true,
        format: ["wav", "mp3", "mp4"],
        onend: () => setSongIndex(songIndex + 1),
      });
    }
    // onPlayIndexChange(songs[songIndex].idx);
  }, [songIndex]);

  // useEffect(() => {
  //   if (playing) onAudioPlay({ id: songs[songIndex].id });
  //   else onAudioPause();
  // }, [playing]);

  if (isMobile) {
    return (
      <Box
        border={"2px solid #212121"}
        borderRadius="8px"
        sx={{ bgcolor: "black" }}
        p={2}
        px={{ md: 6 }}
        display="flex"
        alignItems={"center"}
        gap={2}
        justifyContent="space-between"
      >
        <Box
          display="flex"
          alignItems={"center"}
          // width={{ xs: "75%", md: "60%" }}
          gap={2}
          width="60%"
        >
          <img
            src={`${
              songs[songIndex].image?.mediaEncoding?.thumbnail ||
              songs[songIndex].image?.mediaEncoding?.poster
            }`}
            alt=""
            width={isMobile ? "40px" : "80px"}
            height={isMobile ? "40px" : "80px"}
            style={{ borderRadius: "10px" }}
          />
          <Box
            display="flex"
            justifyContent={"center"}
            flexDirection="column"
            // width={"calc(100% - 40px)"}
            width={"90%"}
          >
            <Typography
              noWrap
              fontSize={"italic"}
              fontWeight={900}
              // letterSpacing={1}
            >
              {songs[songIndex].name}
            </Typography>
          </Box>
        </Box>
        <Box display={"flex"} alignItems="center" gap={2}>
          <Fab
            size="small"
            color="primary"
            onClick={() => {
              togglePlayPause();
            }}
          >
            {loading ? (
              <CircularProgress size={"small"} />
            ) : playing ? (
              <PauseIcon color="secondary" />
            ) : (
              <PlayArrowIcon color="secondary" />
            )}
          </Fab>
          <IconButton
            size="small"
            disabled={songIndex === songs.length - 1}
            onClick={() => setSongIndex(songIndex + 1)}
          >
            <FastForwardOutlinedIcon />
          </IconButton>
          {/* )} */}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      border={"2px solid #212121"}
      borderRadius="8px"
      sx={{ bgcolor: "black" }}
      p={2}
      px={{ md: 6 }}
      display="flex"
      alignItems={"center"}
      gap={2}
      justifyContent="space-between"
    >
      <Box
        display="flex"
        alignItems={"center"}
        // width={{ xs: "75%", md: "60%" }}
        gap={2}
      >
        <img
          src={`${
            songs[songIndex].image?.mediaEncoding?.thumbnail ||
            songs[songIndex].image?.mediaEncoding?.poster
          }`}
          alt=""
          width={"80px"}
          height="80px"
          style={{ borderRadius: "10px" }}
        />
        <Box
          display="flex"
          justifyContent={"center"}
          flexDirection="column"
          width={"calc(100% - 40px)"}
        >
          <Typography
            noWrap
            fontSize={"italic"}
            fontWeight={900}
            letterSpacing={1}
          >
            {songs[songIndex].name}
          </Typography>
        </Box>
      </Box>
      <Stack width={"40%"} alignItems="center">
        <SeekBar
          value={localPosition}
          max={duration}
          marks={[
            {
              value: 0,
              label: convertSecondsToHHMMSS(Math.floor(localPosition)),
            },
            {
              value: duration,
              label: convertSecondsToHHMMSS(Math.floor(duration)),
            },
          ]}
          onChange={(e, newPosition) => {
            setIsDragging(true);
            setLocalPosition(newPosition as number);
          }}
          onChangeCommitted={(e, val) => {
            setIsDragging(false);
            seek(val as number);
          }}
        />
        <Box display={"flex"} alignItems="center" gap={2}>
          {/* {!isMobile && ( */}
          <IconButton
            size="small"
            disabled={songIndex === 0}
            onClick={() => setSongIndex(songIndex - 1)}
          >
            <FastRewindOutlined />
          </IconButton>
          {/* )} */}
          <Fab
            size="small"
            color="primary"
            onClick={() => {
              togglePlayPause();
            }}
          >
            {loading ? (
              <CircularProgress size={"small"} />
            ) : playing ? (
              <PauseIcon color="secondary" />
            ) : (
              <PlayArrowIcon color="secondary" />
            )}
          </Fab>
          {/* <LoadingButton
            size="small"
            // loading={!ready}
            onClick={() => {
              togglePlayPause();
            }}
            color="primary"
          ></LoadingButton> */}
          {/* {!isMobile && ( */}
          <IconButton
            size="small"
            disabled={songIndex === songs.length - 1}
            onClick={() => setSongIndex(songIndex + 1)}
          >
            <FastForwardOutlinedIcon />
          </IconButton>
          {/* )} */}
        </Box>
      </Stack>
      <Box display={"flex"} alignItems="center" gap={2}>
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
