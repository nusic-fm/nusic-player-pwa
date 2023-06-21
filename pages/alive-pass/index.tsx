/* eslint-disable @next/next/no-img-element */
import {
  Button,
  CircularProgress,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import axios from "axios";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import NftsByWallet from "../../src/components/AlivePass/NftsByWallet";
import NusicNavBar from "../../src/components/NusicNavBar";
import WithNavbar from "../../src/components/WithNavbar";
import { checkConnection } from "../../src/helpers";
import { Injected, CoinbaseWallet } from "../../src/hooks/useWalletConnectors";
import { SelectedNftDetails } from "../../src/models";
import { MoralisNftData } from "../../src/models/MoralisNFT";

type Props = {};

const Metadata = (props: Props) => {
  const { account, library, activate } = useWeb3React();
  const [insertUrl, setInsertUrl] = useState<string>();
  const [imageFromServer, setImageFromServer] = useState<string>();

  const [isLoading, setIsLoading] = useState(false);

  const onSignInUsingWallet = async (
    connector: WalletConnectConnector | WalletLinkConnector | InjectedConnector
  ) => {
    await checkConnection();
    activate(connector, async (e) => {
      if (e.name === "t" || e.name === "UnsupportedChainIdError") {
        // setSnackbarMessage("Please switch to Ethereum Mainnet");
      } else {
        // setSnackbarMessage(e.message);
      }

      console.log(e.name, e.message);
    });
  };

  const checkAutoLogin = async () => {
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    const accounts = await provider.listAccounts();
    if (accounts.length) {
      const eth = (window as any).ethereum;
      if (eth.isMetaMask) {
        onSignInUsingWallet(Injected);
      } else if (eth.isCoinbaseBrowser) {
        onSignInUsingWallet(CoinbaseWallet);
      }
    }
  };

  useEffect(() => {
    checkAutoLogin();
  }, []);

  // const onInsert = async (nft: SelectedNftDetails | MoralisNftData) => {
  //   setIsLoading(true);
  //   const url = nft.artworkUrl;
  //   const res = await axios.post(
  //     `https://nusic-image-conversion-ynfarb57wa-uc.a.run.app/overlay?url=${url}`,
  //     {},
  //     { responseType: "arraybuffer" }
  //   );
  //   let base64ImageString = Buffer.from(res.data, "binary").toString("base64");
  //   let srcValue = "data:image/png;base64," + base64ImageString;
  //   setImageFromServer(srcValue);
  //   setIsLoading(false);
  // };

  return (
    <WithNavbar>
      <Box>
        <Box width={"calc(100vw - 160px)"}>
          <NftsByWallet onConnect={() => {}} tokenId={""} />
          <Stack mt={10} alignItems="center">
            <Box
              my={2}
              display="flex"
              justifyContent={"center"}
              border={imageFromServer ? "unset" : "1px solid gray"}
              borderRadius={6}
              p={imageFromServer ? 0 : 10}
            >
              {/* {isLoading && <LinearProgress sx={{ my: 5 }} variant='' />} */}
              {imageFromServer ? (
                <img src={imageFromServer} alt="" width={"30%"} />
              ) : (
                <Typography>
                  Card will be shown here after selecting an NFT
                </Typography>
              )}
            </Box>
            <Button variant="contained">Inject your Pfp</Button>
          </Stack>
        </Box>
      </Box>
    </WithNavbar>
  );
};

export default Metadata;
