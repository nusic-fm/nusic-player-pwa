/* eslint-disable @next/next/no-img-element */
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import AudioFileOutlinedIcon from "@mui/icons-material/AudioFileOutlined";
import DonutSmallOutlinedIcon from "@mui/icons-material/DonutSmallOutlined";
import EastIcon from "@mui/icons-material/East";
import { useRouter } from "next/router";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import SpatialAudioOffIcon from "@mui/icons-material/SpatialAudioOff";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";

type Props = {};

const styles = {
  paper: {
    background: "red",
  },
} as any;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const NusicNavBar = (props: Props) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  // return (
  //   <Drawer variant="permanent" open={open}>
  //     <DrawerHeader>
  //       <IconButton
  //         onClick={() => {
  //           setOpen(!open);
  //         }}
  //       >
  //         <ChevronLeftIcon />
  //       </IconButton>
  //     </DrawerHeader>
  //     <Divider></Divider>
  //     <List>
  //       <ListItem disablePadding sx={{ display: "block" }}>
  //         <ListItemButton
  //           sx={{
  //             minHeight: 48,
  //             justifyContent: open ? "initial" : "center",
  //             px: 2.5,
  //           }}
  //         >
  //           <ListItemIcon
  //             sx={{
  //               minWidth: 0,
  //               mr: open ? 3 : "auto",
  //               justifyContent: "center",
  //             }}
  //           >
  //             <HomeRoundedIcon />
  //           </ListItemIcon>
  //           <ListItemText primary={"Home"} sx={{ opacity: open ? 1 : 0 }} />
  //         </ListItemButton>
  //       </ListItem>

  //       <ListItem disablePadding sx={{ display: "block" }}>
  //         <ListItemButton
  //           sx={{
  //             minHeight: 48,
  //             justifyContent: open ? "initial" : "center",
  //             px: 2.5,
  //           }}
  //         >
  //           <ListItemIcon
  //             sx={{
  //               minWidth: 0,
  //               mr: open ? 3 : "auto",
  //               justifyContent: "center",
  //             }}
  //           >
  //             <PersonSearchIcon />
  //           </ListItemIcon>
  //           <ListItemText
  //             primary={"Something"}
  //             sx={{ opacity: open ? 1 : 0 }}
  //           />
  //         </ListItemButton>
  //       </ListItem>
  //       <Divider sx={{ my: 10 }} />
  //     </List>
  //   </Drawer>
  // );

  return (
    <Box
      mt={5}
      mb={10}
      ml={4}
      sx={{ bgcolor: "#141414" }}
      width={80}
      display="flex"
      justifyContent={"center"}
      borderRadius="10px"
      height={"calc(100% - 180px)"}
    >
      <List>
        <ListItemButton sx={{ mb: 2 }} onClick={() => router.push("/home")}>
          <HomeRoundedIcon />
        </ListItemButton>
        <ListItemButton sx={{ mb: 2 }} disabled>
          <PersonSearchIcon />
        </ListItemButton>
        <ListItemButton sx={{ mb: 2 }} disabled>
          <SpatialAudioOffIcon />
        </ListItemButton>
        <ListItemButton sx={{ mb: 2 }} disabled>
          <LibraryMusicIcon />
        </ListItemButton>
        <ListItemButton sx={{ mb: 2 }} disabled>
          <StorefrontIcon />
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
