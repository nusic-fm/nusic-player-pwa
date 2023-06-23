import { Grid, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import Player from "../../src/components/Player";
import WithNavbar from "../../src/components/WithNavbar";

type Props = {};

const Home = (props: Props) => {
  return (
    <WithNavbar>
      <Grid container>
        <Grid item md={9}>
          <Stack p={2} gap={2}>
            <Box>
              <Typography variant="h5">Top Music NFTs</Typography>
            </Box>
            <Box
              display={"flex"}
              gap={2}
              sx={{
                overflowX: "auto",
                background:
                  "linear-gradient(96.42deg, rgba(128, 37, 98, 0.73) 5.79%, rgba(231, 237, 237, 0.21) 41.02%, rgba(185, 195, 181, 0.64) 63.15%, rgba(0, 141, 255, 0.38) 92.25%, rgba(20, 20, 20, 0) 102.64%)",
              }}
              borderRadius={6}
            >
              <Box p={2}>
                <Box border={"2px solid gray"} borderRadius="6px" p={15}></Box>
              </Box>
              <Box p={2}>
                <Box border={"2px solid gray"} borderRadius="6px" p={15}></Box>
              </Box>
              <Box p={2}>
                <Box border={"2px solid gray"} borderRadius="6px" p={15}></Box>
              </Box>
              <Box p={2}>
                <Box border={"2px solid gray"} borderRadius="6px" p={15}></Box>
              </Box>
              <Box p={2}>
                <Box border={"2px solid gray"} borderRadius="6px" p={15}></Box>
              </Box>
            </Box>
            <Box>
              <Typography variant="h5">Categories</Typography>
            </Box>
            <Box>
              <img src="/home/wall.png" width={"100%"} />
            </Box>
          </Stack>
        </Grid>
        <Grid item md={3}>
          <Stack p={2} gap={2}>
            <Box
              border={"2px solid gray"}
              borderRadius="6px"
              //   px={1}
              py={25}
            ></Box>
            <Box
              border={"2px solid gray"}
              borderRadius="6px"
              //   px={1}
              py={30}
            ></Box>
          </Stack>
        </Grid>
      </Grid>
    </WithNavbar>
  );
};

export default Home;
