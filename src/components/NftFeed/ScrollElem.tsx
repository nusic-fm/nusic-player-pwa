/* eslint-disable @next/next/no-img-element */
import { Box, IconButton, Typography } from "@mui/material";
import { SongDoc } from "../../models/Song";
// import AudioPlayer from "../AudioPlayer";
// import VideoPlayer from "../VideoPlayer";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import PlayCircleRounded from "@mui/icons-material/PlayCircleRounded";
import PauseCircleRounded from "@mui/icons-material/PauseCircleRounded";
// import StopCircleRounded from "@mui/icons-material/StopCircleRounded";
// import SeekBar from "../SeekBar";
// import { useAudioPlayer, useAudioPosition } from "react-use-audio-player";
// import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PlaylistAddRoundedIcon from "@mui/icons-material/PlaylistAddRounded";
// import LoopRoundedIcon from "@mui/icons-material/LoopRounded";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import { MutableRefObject, useEffect, useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useRouter } from "next/router";
import { useInViewport } from "../../hooks/useInViewport";
import { LoadingButton } from "@mui/lab";
import { fmtMSS } from "../../helpers";
// import SeekBar from "../SeekBar";

type Props = {
  song: SongDoc;
  onFeedClose: () => void;
  inView: (index: string) => void;
  isPlaying: boolean;
  addToPlaylist: (songId: string) => Promise<void>;
  wavesurferInstances: MutableRefObject<{
    [key: string]: WaveSurfer;
  }>;
  togglePlayPause: () => void;
};

const ScrollElem = ({
  song,
  onFeedClose,
  inView,
  isPlaying,
  addToPlaylist,
  wavesurferInstances,
  togglePlayPause,
}: Props) => {
  const waveformId = `waveform-${song.id}`;

  const [error, setError] = useState<string>();
  const [duration, setDuration] = useState<string>();

  const { isInViewport, ref } = useInViewport(song.name);
  // const { playing, togglePlayPause } = useAudioPlayer();
  // const { duration, position } = useAudioPosition();
  const [isLoading, setIsLoading] = useState(false);
  // const wavesurferIns = useRef<null | WaveSurfer>(null);
  // const [canPlay, setCanPlay] = useState(false);
  // const [isPlaying, setIsPlaying] = useState(false);

  const router = useRouter();

  // const togglePlayPause = () => {
  //   wavesurferIns.current?.playPause();
  //   setIsPlaying(!isPlaying);
  //   // if(wavesurferIns.current?.isPlaying) {
  //   //   wavesurferIns.current.pause()
  //   // } else {
  //   //   wavesurferIns.current?.play()
  //   // }
  // };

  const showWaveForm = async () => {
    if (wavesurferInstances.current[waveformId]) {
      if (isPlaying) wavesurferInstances.current[waveformId].play();
      return;
    }
    setIsLoading(true);
    const WaveSurfer = (await import("wavesurfer.js")).default;
    var wavesurfer = WaveSurfer.create({
      scrollParent: false,
      fillParent: true,
      // barGap: 50,
      container: `#${waveformId}`,
      // backgroundColor: "rgba(255,255,255, 0.2)",
      // waveColor: "#00000066",
      // cursorColor: "red",
      cursorWidth: 0,
      backend: "MediaElement",
      height: 40,
      barWidth: 1,
      barHeight: 1,
      // hideScrollbar: true,
      xhr: {},
      progressColor: "#A794FF",
      barGap: 2,
      barRadius: 3,
      plugins: [],
    });
    wavesurfer.on("ready", function () {
      const d = wavesurfer.getDuration();
      setDuration(fmtMSS(Math.floor(d)));
      setIsLoading(false);
      if (isPlaying) wavesurfer.play();
      // wavesurfer.play();
      // wavesurfer.backend()
    });
    wavesurfer.on("error", function (errMessage: string) {
      setIsLoading(false);
      setError(errMessage);
      // if (isPlaying) togglePlayPause();
      // wavesurfer.play();
      // wavesurfer.backend()
    });
    // wavesurfer.on('play')
    // wavesurfer.load(song.streamUrl);
    wavesurferInstances.current[waveformId] = wavesurfer;
  };

  useEffect(() => {
    if (isInViewport) {
      // console.log("yes, inside ", song.name);
      showWaveForm();
      inView(song.id);
      // setIsPlaying(true);
    } else {
      // pause();
      // setIsPlaying(false);
    }
  }, [isInViewport]);

  return (
    <Box
      display="flex"
      ref={(r) => ref(r as any)}
      // justifyContent={"center"}
      alignItems="center"
      flexDirection={"column"}
      width="100%"
      height="100vh"
      key={song.name}
      sx={{
        scrollSnapAlign: "start",
        scrollSnapStop: "always",
        opacity: !isInViewport ? 0.3 : 1,
        transition: "opacity 0.5s",
      }}
      pt={"1rem"} //TODO
      mb={-12}
    >
      <Box position={"relative"} width="100%">
        <Box
          position={"absolute"}
          width="100%"
          top={0}
          height="100vh"
          zIndex={0}
          sx={{
            backgroundImage: `url("${song.posterUrl}")`,
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            filter: "blur(80px)",
            opacity: 0.6,
            backgroundSize: "cover",
          }}
        ></Box>
      </Box>
      <Box
        display="flex"
        justifyContent={"center"}
        alignItems="center"
        // flexBasis="40%"
        position={"relative"}
      >
        <img
          // ref={animationRef}
          // css={css`
          //   animation: ${roteteImage} 30s ease infinite;
          //   border-radius: 50%;
          // `}
          src={song.posterUrl}
          alt=""
          width="70%"
          style={{ borderRadius: "8px" }}
        ></img>
      </Box>
      <Box
        mt={"6%"}
        px={4}
        // display="flex"
        // justifyContent={"space-between"}
        width="100%"
        // alignItems={"center"}
      >
        <Typography variant="body1" width={"100%"}>
          {song.name}
        </Typography>
        <Typography variant="caption" width={"100%"}>
          {song.artist}
        </Typography>
      </Box>
      {/* <Box pt={2} px={4} width="100%">
        <SeekBar
          value={playing ? position : 0}
          max={duration}
          onChange={() => {}}
          onChangeCommitted={() => {}}
        />
      </Box> */}
      <Box
        width="100%"
        mt={"10%"}
        display="flex"
        justifyContent={"center"}
        flexDirection="column"
        alignItems={"center"}
      >
        {!error && <Box id={waveformId} style={{ width: "80%" }} mb={1}></Box>}
        {!error && (
          <Box
            style={{ width: "80%" }}
            display="flex"
            justifyContent={"space-between"}
          >
            <Typography></Typography>
            <Typography variant="caption">{duration}</Typography>
          </Box>
        )}
        {error && <Typography color="red">{error}</Typography>}
      </Box>
      <Box
        width="100%"
        display={"flex"}
        alignItems="center"
        justifyContent={"center"}
        mt={"5%"}
      >
        <IconButton disabled>
          {/* <ShareRoundedIcon sx={{ fontSize: 40 }} /> */}
        </IconButton>
        {isLoading ? (
          <LoadingButton loading={isLoading} size="large">
            <PlayCircleRounded sx={{ fontSize: 80 }} />
          </LoadingButton>
        ) : (
          <IconButton onClick={togglePlayPause} disabled={!!error}>
            {isPlaying ? (
              <PauseCircleRounded sx={{ fontSize: 80 }} />
            ) : (
              <PlayCircleRounded sx={{ fontSize: 80 }} />
            )}
          </IconButton>
        )}
        {/* <IconButton disabled>
          <LoopRoundedIcon sx={{ fontSize: 40 }} />
        </IconButton> */}
      </Box>
      <Box
        px={2}
        width="100%"
        display={"flex"}
        alignItems="center"
        justifyContent={"center"}
        gap={2}
      >
        <IconButton disabled>
          <FavoriteOutlinedIcon />
        </IconButton>
        <IconButton disabled>
          <ShareOutlinedIcon />
        </IconButton>

        <IconButton
          onClick={async () => {
            setIsLoading(true);
            await addToPlaylist(song.id);
            setIsLoading(false);
          }}
          disabled
        >
          <PlaylistAddRoundedIcon />
          {/* {isLoading ? <CircularProgress /> : } */}
        </IconButton>
        <IconButton
          onClick={() =>
            router.push(`market/${song.tokenAddress}?tokenId=${song.tokenId}`)
          }
        >
          <InfoOutlinedIcon />
        </IconButton>
      </Box>
      {/* <Box px={1} display="flex" justifyContent={"end"} width="100%">
        <IconButton onClick={onFeedClose}>
          <CloseRoundedIcon sx={{ fontSize: "2rem" }} />
        </IconButton>
      </Box> */}
    </Box>
  );
};

export default ScrollElem;
