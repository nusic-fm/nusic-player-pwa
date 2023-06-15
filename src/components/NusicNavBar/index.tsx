/* eslint-disable @next/next/no-img-element */
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  Typography,
} from "@mui/material";
import React from "react";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import AudioFileOutlinedIcon from "@mui/icons-material/AudioFileOutlined";
import DonutSmallOutlinedIcon from "@mui/icons-material/DonutSmallOutlined";
import EastIcon from "@mui/icons-material/East";
import { useRouter } from "next/router";

type Props = {};

const styles = {
  paper: {
    background: "red",
  },
} as any;

const NusicNavBar = (props: Props) => {
  const router = useRouter();

  return (
    <Box
      my={5}
      mx={4}
      sx={{ bgcolor: "#141414" }}
      width={80}
      display="flex"
      justifyContent={"center"}
      borderRadius="10px"
    >
      <List>
        <ListItemButton sx={{ mb: 2 }} disabled>
          <HomeRoundedIcon />
        </ListItemButton>
        <ListItemButton sx={{ mb: 2 }} disabled>
          <PersonSearchIcon />
        </ListItemButton>
        <Divider sx={{ my: 10 }} />
        <ListItemButton sx={{ mb: 2 }} onClick={() => router.push("/metadata")}>
          <DonutSmallOutlinedIcon />
        </ListItemButton>
        <ListItemButton
          disabled
          sx={{ mb: 2 }}
          // onClick={() => router.push("/downloads")}
        >
          <AudioFileOutlinedIcon />
        </ListItemButton>
        <ListItemButton
          onClick={() => router.push("/alive-pass")}
          sx={{
            mt: 12,
            background:
              "radial-gradient(256.25% 1511.83% at -8.24% -39.29%, #9E00FF 0%, #563FC8 23.91%, #3D7EFF 50.42%, #2FF3FF 80.66%)",
            borderRadius: "6px",
          }}
        >
          <EastIcon />
        </ListItemButton>
      </List>
    </Box>
  );
};

export default NusicNavBar;
