/* eslint-disable @next/next/no-img-element */
import { Button, Fab, Grid, TextField, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AlivePass from "../AlivePass";
import { useRef } from "react";

type Props = {};

const LandingPage = (props: Props) => {
  const buyRef = useRef(null);

  return (
    <Box minHeight="100vh" position={"relative"}>
      <img
        src="/home/Ellipse1.png"
        alt=""
        style={{ position: "absolute", zIndex: 99999 }}
        height={300}
      ></img>
      <Grid
        container
        minHeight={"100vh"}
        sx={{
          background:
            "linear-gradient(0deg, rgba(27,19,51,1) 20%, rgba(2,1,3,1) 100%)",
        }}
      >
        <Grid xs={12} md={8}>
          <Stack
            gap={12}
            p={{ xs: 2, md: 10 }}
            // alignItems="center"
            // justifyContent={"center"}
          >
            <Box>
              <Typography variant="h3" fontWeight={700}>
                STREAM & EARN{" "}
                {<img src="/nusic_purple.png" alt="" width={100} />} TOKENS
              </Typography>
              <Typography>Mint an Alive Pass to be able to</Typography>
            </Box>
            <Stack gap={3}>
              <Typography
                variant="h6"
                sx={{
                  background:
                    "linear-gradient(91.05deg, #563FC8 -9%, rgba(75, 205, 214, 0.85) 44.26%, rgba(178, 0, 207, 0.96) 109.05%)",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Edit your Music NFT metadata
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  background:
                    "linear-gradient(91.05deg, #563FC8 -9%, rgba(75, 205, 214, 0.85) 44.26%, rgba(178, 0, 207, 0.96) 109.05%)",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Generate Nusic link tree to share to friends & fans
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  display: "block",
                  background:
                    "linear-gradient(91.05deg, #563FC8 -9%, rgba(75, 205, 214, 0.85) 44.26%, rgba(178, 0, 207, 0.96) 109.05%)",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Stream Music NFTs
              </Typography>
              <Box mt={6}>
                <Button
                  variant="outlined"
                  color="info"
                  onClick={() =>
                    (buyRef.current as any).scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                      inline: "nearest",
                    })
                  }
                >
                  Get Access Now !!!
                </Button>
              </Box>
            </Stack>
            {/* <Box
              display="flex"
              gap={4}
              flexWrap="wrap"
              justifyContent={"center"}
            >
              <img
                src="/home/r1.png"
                alt=""
                // borderRadius={"0%"}
                // sx={{
                //   background: "url(/home/r1.png)",
                //   backgroundSize: "cover",
                // }}
                // width="301px"
                // height={"523px"}
              ></img>
              <Stack
                gap={2}
                justifyContent="center"
                alignItems={"center"}
                flexDirection={{ xs: "row", md: "column" }}
              >
                <img
                  src="/home/r3.png"
                  alt=""
                  // borderRadius={"0%"}
                  //   sx={{
                  //     background: "url(/home/r3.png)",
                  //     backgroundSize: "cover",
                  //   }}
                  //   width="197px"
                  //   height={"183px"}
                ></img>
                <img
                  src="/home/r2.png"
                  alt=""
                  // borderRadius={"0%"}
                  //   sx={{
                  //     background: "url(/home/r2.png)",
                  //     backgroundSize: "cover",
                  //   }}
                  //   width="197px"
                  //   height={"303px"}
                ></img>
              </Stack>
              <Stack gap={2} alignItems="center" justifyContent={"center"}>
                <Stack
                  sx={{
                    background:
                      "linear-gradient(180deg, #563FC8 -54.71%, rgba(65, 31, 86, 0.21) 107.79%)",
                  }}
                  borderRadius={"40%"}
                  gap={1}
                  width={150}
                  height={150}
                  justifyContent="center"
                  alignItems={"center"}
                  p={2}
                >
                  <Typography variant="h6" color={"#F1F1F1"} fontWeight={700}>
                    98%
                  </Typography>
                  <Typography
                    color={"#A8A8A8"}
                    align="center"
                    variant="caption"
                  >
                    Sorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nunc{" "}
                  </Typography>
                </Stack>
                <Stack
                  sx={{
                    background:
                      "linear-gradient(180deg, #563FC8 -54.71%, rgba(65, 31, 86, 0.21) 107.79%)",
                  }}
                  borderRadius={"40%"}
                  width={150}
                  height={150}
                  gap={1}
                  justifyContent="center"
                  alignItems={"center"}
                  p={2}
                >
                  <Stack alignItems={"center"}>
                    <Typography variant="h6" color={"#F1F1F1"} fontWeight={700}>
                      7K Tracks
                    </Typography>
                  </Stack>
                  <Typography
                    color={"#A8A8A8"}
                    align="center"
                    variant="caption"
                  >
                    Sorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nunc{" "}
                  </Typography>
                </Stack>
              </Stack>
            </Box> */}
          </Stack>
        </Grid>
        <Grid xs={12} md={4} minHeight={"100%"}>
          <Stack
            justifyContent={"center"}
            height={"100%"}
            width="100%"
            gap={4}
            sx={{ bgcolor: "#3A3068", borderTopLeftRadius: "80px 80px" }}
            position="relative"
            alignItems={"center"}
          >
            <Box position={"absolute"} bottom="10%" left="-25px">
              <img
                src="/home/btn-blend.png"
                alt=""
                width={56}
                height={56}
                style={{ position: "absolute", top: 0, left: 0, zIndex: 999 }}
              />
              <Fab
                sx={{
                  //   backgroundImage: "url(/home/btn-blend.png)",
                  background:
                    "linear-gradient(125.34deg, #563FC8 12.91%, #AE2FFC 156.55%)",
                }}
                size="large"
              >
                <PlayArrowIcon color="secondary" fontSize="large" />
              </Fab>
            </Box>
            <Stack gap={2}>
              <img src="/nusic_white.png" alt="" width={200}></img>
              <Typography align="center">Stream to Earn</Typography>
            </Stack>
            <Stack gap={2} mt={4}>
              <Typography align="center" fontWeight={600}>
                Launch App
              </Typography>
              <Stack gap={2}>
                <Button
                  variant="contained"
                  // sx={{ bgcolor: "#010101" }}
                  // size="small"
                  href="/metadata"
                >
                  Connect Wallet
                </Button>
              </Stack>
            </Stack>
            <Box
              position={"absolute"}
              bottom="0px"
              width={"100%"}
              display="flex"
            >
              <img
                src="/home/band.png"
                width={"100%"}
                alt="band"
                style={{ objectFit: "cover" }}
              />
            </Box>
          </Stack>
        </Grid>
      </Grid>
      <AlivePass buyRef={buyRef} />
    </Box>
  );
};

export default LandingPage;