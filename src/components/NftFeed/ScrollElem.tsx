import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import { SongDoc } from "../../models/Song";
import AudioPlayer from "../AudioPlayer";
// import VideoPlayer from "../VideoPlayer";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import PlayCircleRounded from "@mui/icons-material/PlayCircleRounded";
import PauseCircleRounded from "@mui/icons-material/PauseCircleRounded";
// import StopCircleRounded from "@mui/icons-material/StopCircleRounded";
// import SeekBar from "../SeekBar";
import { useAudioPlayer, useAudioPosition } from "react-use-audio-player";
// import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PlaylistAddRoundedIcon from "@mui/icons-material/PlaylistAddRounded";
// import LoopRoundedIcon from "@mui/icons-material/LoopRounded";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import { useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useRouter } from "next/router";
import SeekBar from "../SeekBar";

type Props = {
  song: SongDoc;
  onFeedClose: () => void;
  inView: (index: number) => void;
  isPlaying: boolean;
  addToPlaylist: (songId: string) => Promise<void>;
};

const ScrollElem = ({
  song,
  onFeedClose,
  inView,
  isPlaying,
  addToPlaylist,
}: Props) => {
  const { playing, togglePlayPause } = useAudioPlayer();
  const { duration, position } = useAudioPosition();
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

  // const showWaveForm = async () => {
  //   if (wavesurferIns.current) return;
  //   const WaveSurfer = (await import("wavesurfer.js")).default;
  //   var wavesurfer = WaveSurfer.create({
  //     scrollParent: true,
  //     fillParent: true,
  //     // barGap: 50,
  //     container: "#waveform",
  //     // backgroundColor: "rgba(255,255,255, 0.2)",
  //     // waveColor: "#573FC8",
  //     // cursorColor: "red",
  //     cursorWidth: 0,
  //     backend: "MediaElement",
  //     height: 80,
  //     barWidth: 2,
  //     barHeight: 1,
  //     // hideScrollbar: true,
  //     xhr: {},
  //     progressColor: "#A794FF",
  //     barGap: 3,
  //     plugins: [],
  //   });
  //   wavesurfer.on("ready", function () {
  //     setIsLoading(false);
  //     // wavesurfer.backend()
  //   });
  //   wavesurfer.load(
  //     song.streamUrl
  //     // "https://storage.googleapis.com/nusic-storage/assets/ethereum/1/0x0af1837ab358adc2acab032f26d1a1da0208ff67/33/audio/stream"
  //     // "https://storage.googleapis.com/nusic-storage/assets/ethereum/1/0x0af1837ab358adc2acab032f26d1a1da0208ff67/33/audio/stream.wav"
  //     // "https://storage.googleapis.com/nusic-storage/ethereum/1/0x123/1/content/stream.mp3"
  //     // "https://storage.cloud.google.com/nusic-storage/test"
  //     // "https://www.mfiles.co.uk/mp3-downloads/brahms-st-anthony-chorale-theme-two-pianos.mp3"
  //     // `${process.env.NEXT_PUBLIC_STREAMING}/file/${song.tokenAddress}/${song.tokenId}`
  //     // "https://storage.googleapis.com/nusic-audio/originals/MajorLazer_TooOriginal-bass.mp3"
  //     // "https://storage.googleapis.com/music-nft-indexer-9aaa2.appspot.com//assets/ethereum/1/0x4c22d3b875437d43402f5b81ae4f61b8f764e1b1/805/audio/stream?GoogleAccessId=firebase-adminsdk-gb3io%40music-nft-indexer-9aaa2.iam.gserviceaccount.com&Expires=1675679250&Signature=gK%2BV3BJE6aPj%2B8P6tuzPlZHSP%2F8F1mrBBaX21GfXCv6H%2BuG%2Bc5qvCLSCs%2F9NbwbYJniTOhBxnGwquPAUucfcLtsaQip5aeUfJym9CwW24JPOLec5FI8xNeSwW%2F7Qkj4sgeXJtzTIorY5UJJtfa5Wp0WFyiWqLxCPewjjxCeLh57sPnE5gYKsNwfMaG7nKDTqNOnMJGwlUQBkODrWCi%2Fad%2FJassDZ2zSEnIoab5YeCBnOAb8Lv1IduwCd83ZDgQLFwuVYVMoteeYHq9EpVP1yhQBAVqrDvQsL6mNRhN5FFRdPsFrdVgprbfArzgqAXVRoeo3uGxTSIq77IitvLnIXlg%3D%3D"
  //   );
  //   wavesurferIns.current = wavesurfer;
  // };

  // useEffect(() => {
  //   if (canPlay && song.idx === 1) {
  //     showWaveForm();
  //   }
  // }, [canPlay]);

  return (
    <Box
      display="flex"
      // justifyContent={"center"}
      alignItems="center"
      flexDirection={"column"}
      width="100%"
      height="100vh"
      key={song.name}
      sx={{ scrollSnapAlign: "start", scrollSnapStop: "always" }}
      pt={2} //TODO
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
        flexBasis="40%"
        position={"relative"}
      >
        {/* {song.format === "audio" ? (
          <AudioPlayer song={song} inView={inView} isPlaying={isPlaying} />
        ) : (
          <VideoPlayer song={song} inView={inView} isPlaying={isPlaying} />
        )} */}
        <AudioPlayer
          song={song}
          inView={inView}
          // inView={() => {
          //   setCanPlay(true);
          // }}
          isPlaying={playing}
        />
      </Box>
      <Box
        pt={1}
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
      {/* <Box width="100%" mt={2} display="flex" justifyContent={"center"}>
        <Box id="waveform" style={{ width: "80%" }}></Box>
      </Box> */}
      <Box
        pt={1}
        width="100%"
        display={"flex"}
        alignItems="center"
        justifyContent={"center"}
      >
        <IconButton disabled>
          {/* <ShareRoundedIcon sx={{ fontSize: 40 }} /> */}
        </IconButton>
        <IconButton onClick={togglePlayPause}>
          {playing ? (
            <PauseCircleRounded sx={{ fontSize: 80 }} />
          ) : (
            <PlayCircleRounded sx={{ fontSize: 80 }} />
          )}
        </IconButton>
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
          {isLoading ? <CircularProgress /> : <PlaylistAddRoundedIcon />}
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
