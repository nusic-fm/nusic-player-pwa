import { Box, IconButton, TextField, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { getAuth, isSignInWithEmailLink } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  useAuthState,
  useSendSignInLinkToEmail,
  useSignInWithEmailLink,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import Image from "next/image";
import { LoadingButton } from "@mui/lab";

type Props = {
  url: string;
};

const AuthUI = ({ url }: Props) => {
  const [email, setEmail] = useState<string>("");
  // const [password, setPassword] = useState<string>("");
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);
  // const [signInWithEmailAndPassword, , emailLoading, emailError] =
  //   useSignInWithEmailAndPassword(auth);
  // const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [sendSignInLinkToEmail, sending, emailError] =
    useSendSignInLinkToEmail(auth);
  const [signInWithGoogle, , googleLoading, googleError] =
    useSignInWithGoogle(auth);
  const [signInWithEmailLink] = useSignInWithEmailLink(auth);

  const checkForEmailAuth = async () => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem("email");
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt("Please provide your email for confirmation");
      }
      if (email) {
        await signInWithEmailLink(email, window.location.href);
        window.localStorage.removeItem("email");
        window.location.replace("");
      }
    }
  };
  const onEmailSignIn = async () => {
    // if (!email.length || !password.length) {
    //   alert("Please fill both email and password.");
    //   return;
    // }
    // signInWithEmailAndPassword(email, password);
    if (!email) {
      alert("Enter the email");
      return;
    }
    const isSuccess = await sendSignInLinkToEmail(email, {
      url,
      handleCodeInApp: true,
    });
    if (isSuccess) {
      window.localStorage.setItem("email", email);
      alert("Email has been sent");
    }
  };
  useEffect(() => {
    if (!user) {
      checkForEmailAuth();
    }
  }, []);

  return (
    <Box>
      <Stack p={2}>
        <Stack gap={2} alignContent="center" justifyContent={"center"}>
          <TextField
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            error={!!emailError}
          ></TextField>
          {/* <TextField
            placeholder="password"
            type={"password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!emailError}
          ></TextField> */}
          {emailError?.message && (
            <Typography color={"error"} align="center">
              {emailError?.message}
            </Typography>
          )}
          {/* <Box display="flex" justifyContent={"start"} gap={1}>
            <Link
              variant="body2"
              color={"rgb(155,155,164)"}
              sx={{ cursor: "pointer" }}
            >
              Forgot Password?
            </Link>
          </Box> */}
          <Box display={"flex"} justifyContent="center">
            <LoadingButton
              loading={sending}
              variant="contained"
              onClick={onEmailSignIn}
            >
              Sign Up / Login
            </LoadingButton>
          </Box>
          {/* <Box display="flex" justifyContent={"center"} gap={1}>
            <Typography variant="body2" color={"rgb(155,155,164)"}>
              Create a Password
            </Typography>
            <Link
              variant="body2"
              color={"#A794FF"}
              onClick={() => setShowRegistrationForm(true)}
            >
              here
            </Link>
          </Box> */}
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
      {/* <RegistrationForDialog
        open={showRegistrationForm}
        onClose={() => setShowRegistrationForm(false)}
      /> */}
    </Box>
  );
};

export default AuthUI;
