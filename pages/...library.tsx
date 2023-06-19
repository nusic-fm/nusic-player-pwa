import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Typography,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import AuthUI from "../src/components/AuthUI";
import { Playlist } from "../src/models/Playlist";
import { getUserPlaylists } from "../src/services/db/user.service";
import { auth } from "../src/services/firebase.service";

type Props = {};

const Library = ({}: Props) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [user, authLoading] = useAuthState(auth);
  const [loading, setLoading] = useState(true);

  const fetchUserPlaylists = async (uid: string) => {
    const _playlists = await getUserPlaylists(uid);
    setPlaylists(_playlists);
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchUserPlaylists(user.uid);
    }
  }, [user]);

  if (!user && !loading) {
    return (
      <Box sx={{ bgcolor: "black", minHeight: "100vh" }}>
        <Drawer anchor="bottom" open>
          <AuthUI
            url={
              typeof window === "undefined"
                ? ""
                : `${window.location.origin}/library`
            }
          />
        </Drawer>
      </Box>
    );
  }

  return (
    <Box minHeight={"100vh"} sx={{ bgcolor: "black" }} p={2}>
      <Stack gap={2}>
        <Typography variant="h6">My Library</Typography>
        {loading ? (
          <Skeleton variant="rounded" />
        ) : (
          <List>
            {playlists.map((p) => (
              <ListItemButton key={p.id}>
                <ListItemIcon>
                  <Skeleton variant="rounded" width={"50%"} animation={false} />
                </ListItemIcon>
                <ListItemText>{p.name}</ListItemText>
              </ListItemButton>
            ))}
            {playlists.length === 0 && (
              <Typography>No Playlists Available</Typography>
            )}
          </List>
        )}
      </Stack>
    </Box>
  );
};

export default Library;
