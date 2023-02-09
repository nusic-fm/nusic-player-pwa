import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { getAuth, signOut } from "firebase/auth";
import { useState } from "react";
import {
  useAuthState,
  useSignInWithEmailAndPassword,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import Image from "next/image";

type Props = {};

const AuthUI = (props: Props) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);
  const [signInWithEmailAndPassword, , emailLoading, emailError] =
    useSignInWithEmailAndPassword(auth);

  const [signInWithGoogle, , googleLoading, googleError] =
    useSignInWithGoogle(auth);

  const onEmailSignIn = async () => {
    if (!email.length || !password.length) {
      alert("Please fill both email and password.");
      return;
    }
    signInWithEmailAndPassword(email, password);
  };

  if (user) {
    return (
      <Box p={2}>
        <Typography>Name: {user.displayName}</Typography>
        <Typography>Email: {user.email}</Typography>
        <Box display={"flex"} justifyContent="center" mt={2}>
          <Button onClick={() => signOut(auth)} variant="contained">
            Sign Out
          </Button>
        </Box>
      </Box>
    );
  }
  return (
    <Box>
      <Stack p={2}>
        <Stack gap={2} alignContent="center" justifyContent={"center"}>
          <TextField
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
          ></TextField>
          <TextField
            placeholder="password"
            type={"password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!emailError}
          ></TextField>
          <Typography color={"error"} align="center">
            {emailError?.code}
          </Typography>
          <Box display={"flex"} justifyContent="center">
            <Button variant="contained" onClick={onEmailSignIn}>
              Log In
            </Button>
          </Box>
        </Stack>
        <Box my={1} mt={2}>
          <Typography align="center">OR</Typography>
        </Box>
        <Box display={"flex"} justifyContent="center">
          <IconButton onClick={() => signInWithGoogle()}>
            <Image
              src="/signin/google_signin.png"
              alt="google"
              width={191}
              height={46}
            />
          </IconButton>
        </Box>
      </Stack>
    </Box>
  );
};

export default AuthUI;
