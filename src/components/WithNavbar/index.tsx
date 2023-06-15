import { Box } from "@mui/system";
import NusicNavBar from "../NusicNavBar";

type Props = { children: any };

const WithNavbar = ({ children }: Props) => {
  return (
    <Box display={"flex"} gap={2} my={5}>
      <NusicNavBar />
      {children}
    </Box>
  );
};

export default WithNavbar;
