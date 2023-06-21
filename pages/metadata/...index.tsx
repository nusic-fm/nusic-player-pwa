import {
  Box,
  Stack,
  Typography,
  Button,
  Tabs,
  Tab,
  AppBar,
} from "@mui/material";
import React from "react";
import NftsByWallet from "../../src/components/AlivePass/NftsByWallet";
import WithNavbar from "../../src/components/WithNavbar";

type Props = {};

function Metadata({}: Props) {
  const [value, setValue] = React.useState(1);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <WithNavbar>
      <Stack>
        <Box width={"calc(100vw - 160px)"} mr={6}>
          <NftsByWallet onConnect={() => {}} onInsert={() => {}} tokenId={""} />
        </Box>
        <Box mt={10} mr={6}>
          <AppBar position="static">
            <Tabs
              value={value}
              onChange={handleChange}
              variant="fullWidth"
              textColor="secondary"
              indicatorColor="secondary"
            >
              <Tab label="Artist Metadata" value={1}></Tab>
              <Tab label="Song Metadata" value={2}></Tab>
              <Tab label="NFT Metadata" value={3}></Tab>
            </Tabs>
          </AppBar>
          {value === 1 && <Box></Box>}
        </Box>
      </Stack>
    </WithNavbar>
  );
}

export default Metadata;
