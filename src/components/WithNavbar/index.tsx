import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import NusicNavBar from "../NusicNavBar";

type Props = { children: any };

const WithNavbar = ({ children }: Props) => {
  return (
    <Box display={"flex"} gap={2} height="100vh">
      <Box position={"absolute"} bottom={0} width="100%">
        <Box
          sx={{ bgcolor: "rgba(0, 0, 0, 0.83)" }}
          height={100}
          p={4}
          border="2px solid #212121"
        ></Box>
      </Box>
      <NusicNavBar />
      <Box
        height={"calc(100vh - 100px)"}
        width="100%"
        sx={{ overflowY: "auto" }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default WithNavbar;
