import {
  Typography,
  Button,
  Drawer,
  Skeleton,
  Chip,
  Stack,
} from "@mui/material";
import { Box } from "@mui/system";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import AuthUI from "../src/components/AuthUI";
import { auth } from "../src/services/firebase.service";

type Props = {};

const Profile = (props: Props) => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <Box>
        <Skeleton />
      </Box>
    );
  }
  if (!user) {
    return (
      <Drawer anchor="bottom" open>
        <AuthUI
          url={
            typeof window === "undefined"
              ? ""
              : `${window.location.origin}/profile`
          }
        />
      </Drawer>
    );
  }

  if (user.emailVerified === false) {
    return (
      <Stack p={2} gap={1}>
        <Typography textAlign={"center"}>
          Hi, a verificaion Email has been sent to this {user.email} account,
          Kindly verify to continue
        </Typography>

        <Chip
          label={
            !user.emailVerified
              ? "Email Verified"
              : "Email Verification Pending"
          }
          color={!user.emailVerified ? "success" : "warning"}
        />
      </Stack>
    );
  }

  return (
    <Stack p={2} gap={1}>
      <Box
        display={"flex"}
        alignItems="center"
        justifyContent={"center"}
        mb={2}
      >
        <Button
          variant="outlined"
          color="info"
          component={"label"}
          sx={{
            borderRadius: "50%",
            width: 120,
            height: 120,
            textAlign: "center",
          }}
        >
          Upload Profile Picture
          <input hidden accept="image/*" type="file" />
        </Button>
      </Box>
      <Typography>Name: {user.displayName ?? "--"}</Typography>
      <Typography>Email: {user.email}</Typography>
      <Box display={"flex"} justifyContent="center" mt={2}>
        <Button onClick={() => signOut(auth)} variant="contained">
          Sign Out
        </Button>
      </Box>
    </Stack>
  );
};

export default Profile;
