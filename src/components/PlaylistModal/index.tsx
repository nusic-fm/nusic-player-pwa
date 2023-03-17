import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Playlist } from "../../models/Playlist";
import { getUserPlaylists } from "../../services/db/user.service";

type Props = {
  open: boolean;
  uid: string;
  onPlaylistSelect: (
    playlistId: string,
    isCreate?: boolean,
    playlistName?: string
  ) => void;
  onClose: () => void;
};

const PlaylistModal = ({ open, uid, onPlaylistSelect, onClose }: Props) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [showNewPlaylistInput, setShowNewPlaylistInput] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const fetchUserPlaylists = async () => {
    const _playlists = await getUserPlaylists(uid);
    setPlaylists(_playlists);
  };

  useEffect(() => {
    fetchUserPlaylists();
  }, []);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add to Playlist</DialogTitle>
      <DialogContent>
        <List>
          {playlists.map((playlist, i) => (
            <ListItemButton
              key={i}
              onClick={() => {
                onPlaylistSelect(playlist.id);
              }}
            >
              <ListItemIcon>
                <Skeleton variant="rounded" width={"50%"} animation={false} />
              </ListItemIcon>
              <ListItemText>{playlist.name}</ListItemText>
            </ListItemButton>
          ))}
          <Box sx={{ my: 2 }}>
            {showNewPlaylistInput ? (
              <TextField
                placeholder="playlist name"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
              ></TextField>
            ) : (
              <Button
                variant="contained"
                fullWidth
                onClick={() => setShowNewPlaylistInput(true)}
              >
                New Playlist
              </Button>
            )}
          </Box>
        </List>
      </DialogContent>
      <DialogActions>
        {showNewPlaylistInput && (
          <>
            <Button color="info" onClick={() => setShowNewPlaylistInput(false)}>
              Cancel
            </Button>
            <Button
              color="info"
              disabled={!newPlaylistName}
              onClick={() => {
                onPlaylistSelect("", true, newPlaylistName);
              }}
            >
              Save
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PlaylistModal;
