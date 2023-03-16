import { Dialog, DialogContentText, DialogContent, Box } from "@mui/material";
import {
  EmailAuthProvider,
  isSignInWithEmailLink,
  linkWithCredential,
  User,
} from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { auth } from "../../services/firebase.service";
import EmailLink from "./EmailLink";

type Props = { user: User };

const LinkAccounts = ({ user }: Props) => {
  const router = useRouter();

  const linkAccounts = async () => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem("email");
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt("Please provide your email for confirmation");
      }
      if (email) {
        const credential = EmailAuthProvider.credentialWithLink(
          email,
          window.location.href
        );
        await linkWithCredential(user, credential);
        router.push("/profile", undefined, { shallow: true });
        window.localStorage.removeItem("email");
      }
    }
  };

  useEffect(() => {
    linkAccounts();
  }, []);

  return (
    <Dialog open>
      <DialogContent>
        <DialogContentText align="center">
          Provide your email to customise your profile
        </DialogContentText>
        <Box mt={2}>
          <EmailLink
            url={
              typeof window === "undefined"
                ? ""
                : `${window.location.origin}/profile`
            }
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LinkAccounts;
