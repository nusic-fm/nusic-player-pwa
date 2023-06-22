/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import {
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  Grid,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { checkConnection, createUrlFromCid } from "../src/helpers";
import { getNftsMetadataByWallet } from "../src/helpers/zora";
import { Injected, CoinbaseWallet } from "../src/hooks/useWalletConnectors";
import { IZoraData } from "../src/models/TypeZora";
import { useAudioPlayer } from "react-use-audio-player";
import WalletConnectors from "../src/components/AlivePass/WalletConnector";
import { AliveUserDoc } from "../src/models/User";
import {
  getOrCreateUserDoc,
  updateUserDoc,
} from "../src/services/db/user.service";
import NftsByWallet from "../src/components/AlivePass/NftsByWallet";
import { LoadingButton } from "@mui/lab";
import NftMusicCard from "../src/components/NftMusicCard";
import Player from "../src/components/Player";

type Props = {};

const Index = (props: Props) => {
  const { account, activate, library } = useWeb3React();
  const [showConnector, setShowConnector] = useState(false);
  //   const [tokens, setTokens] = useState<MoralisNftData[]>([]);

  const [musicNfts, setMusicNfts] = useState<IZoraData[]>([]);
  const [nfts, setNfts] = useState<IZoraData[]>([]);
  const { playing, togglePlayPause, loading, pause, play } = useAudioPlayer();
  const [playIndex, setPlayIndex] = useState<number>(-1);
  const [userDoc, setUserDoc] = useState<AliveUserDoc>();
  const [changedName, setChangedName] = useState<string>();
  const [changedBio, setChangedBio] = useState<string>();
  const [changedPfp, setChangedPfp] = useState<string>();
  const [updating, setUpdating] = useState<boolean>();
  const [showError, setShowError] = useState<boolean>();
  const [tokenId, setTokenId] = useState<string>("");

  const [showSetPfp, setShowSetPfp] = useState(false);

  const [showNftsDrawer, setShowNftsDrawer] = useState<boolean>();

  useEffect(() => {
    if (showNftsDrawer) {
      document.getElementsByTagName("html")[0].style.overflow = "scroll";
    } else {
      document.getElementsByTagName("html")[0].style.overflow = "auto";
    }
  }, [showNftsDrawer]);

  // useEffect(() => {
  //   if (playIndex !== -1) {
  //     load({
  //       src: musicNfts[playIndex].content?.mediaEncoding?.large,
  //       html5: true,
  //       autoplay: true,
  //       format: ["mp3"],
  //     });
  //   } else {
  //     pause();
  //   }
  // }, [playIndex]);

  const alivePassOwner = async (account: string) => {
    const nftContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_ETH_ALIVE_ADDRESS as string,
      [
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "balanceOf",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ],
      library.getSigner()
    );
    const bn = await nftContract.balanceOf(account);
    if (bn.toNumber()) {
      //   fetcMusicNfts();
      //   fetchNfts();
      setShowConnector(false);
      fetchUserDoc(account);
      fetchAllNfts();
    } else {
      setShowError(true);
    }
  };

  useEffect(() => {
    if (account) {
      alivePassOwner(account);
    } else {
      checkAutoLogin();
      setShowConnector(true);
    }
  }, [account]);

  //   const fetcMusicNfts = async () => {
  //     const _musicTokens = await getMusicNftsMetadataByWallet(
  //       "0xA0cb079D354b66188f533A919d1c58cd67aFe398"
  //     );
  //     setMusicNfts(_musicTokens);
  //   };
  const fetchUserDoc = async (walletAddress: string) => {
    const _userDoc = await getOrCreateUserDoc(walletAddress);
    setUserDoc(_userDoc);
  };

  const fetchAllNfts = async () => {
    // "0xA0cb079D354b66188f533A919d1c58cd67aFe398"
    if (!account) return;
    const _token = await getNftsMetadataByWallet(
      account
      // "0x1f3aECdD7b1c376863d08C5340B1E48Da2961539"
    );
    const alivePassIndex = _token.findIndex(
      (v) => v.collectionAddress === process.env.NEXT_PUBLIC_ETH_ALIVE_ADDRESS
    );
    if (alivePassIndex !== -1) setTokenId(_token[alivePassIndex].tokenId);
    const _musicNfts = _token.filter((t) => t.metadata?.animation_url);
    const _nfts = _token.filter((t) => !t.metadata?.animation_url);
    setMusicNfts(_musicNfts);
    setNfts(_nfts);
  };

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
    if (!(window as any).ethereum) return;
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

  // const onInsert = async (nft: SelectedNftDetails | MoralisNftData) => {
  //   // setIsLoading(true);
  //   const url = nft.artworkUrl;
  //   const res = await axios.post(
  //     `https://nusic-image-conversion-ynfarb57wa-uc.a.run.app/overlay?url=${url}`, //TODO
  //     {},
  //     { responseType: "arraybuffer" }
  //   );
  //   let base64ImageString = Buffer.from(res.data, "binary").toString("base64");
  //   let srcValue = "data:image/png;base64," + base64ImageString;
  //   // setImageFromServer(srcValue);
  //   // setIsLoading(false);
  // };

  const onUpdateUserDoc = async (obj: {
    bio?: string;
    userName?: string;
    pfp?: string;
  }) => {
    if (account) {
      setUpdating(true);
      await updateUserDoc(account, obj);
      await fetchUserDoc(account);
      setChangedName(undefined);
      setChangedName(undefined);
      setChangedPfp(undefined);
      setUpdating(false);
    }
  };

  return (
    <Box py={2} sx={{ bgcolor: "black" }} position="relative">
      <Box
        display={"flex"}
        justifyContent="space-between"
        alignItems={"center"}
        px={4}
      >
        <img src="nusic_purple.png" alt="" width={100} />
        {/* <Button onClick={}>Logout</Button> */}
      </Box>
      <Grid container>
        <Grid item xs={12} md={4}>
          <Stack gap={2} p={2}>
            <Stack
              m={2}
              p={4}
              alignItems="center"
              gap={2}
              sx={{ backgroundColor: "#141414" }}
              borderRadius="8px"
            >
              {/* <img src="" alt="pp" /> */}
              <Box
                borderRadius={"50%"}
                sx={{
                  background:
                    changedPfp || userDoc?.pfp
                      ? `url(${changedPfp || userDoc?.pfp})`
                      : "rgba(255,255,255,0.1)",
                  backgroundSize: "cover",
                  boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                }}
                p={1}
                width={100}
                height={100}
                position="relative"
              >
                <Box
                  position={"absolute"}
                  left={0}
                  top={0}
                  width="100%"
                  height="100%"
                  display={"flex"}
                  justifyContent="center"
                  alignItems={"center"}
                  sx={{
                    ".select": { display: "none" },
                    ":hover": { ".select": { display: "initial" } },
                  }}
                >
                  <Button
                    className="select"
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => setShowSetPfp(true)}
                  >
                    Select
                  </Button>
                </Box>{" "}
              </Box>
              <TextField
                size="small"
                placeholder="username"
                value={changedName || userDoc?.userName}
                onChange={(e) => setChangedName(e.target.value)}
                // InputProps={{
                //   endAdornment: (
                //     <IconButton
                //       disabled={!changedName || updating}
                //       onClick={() => onUpdateUserDoc({ userName: changedName })}
                //     >
                //       <SaveIcon fontSize="small" />
                //     </IconButton>
                //   ),
                // }}
              />
              {account && (
                <Chip
                  label={`${account.slice(0, 6)}...${account.slice(
                    account.length - 4
                  )}`}
                />
              )}
              <Stack width={"100%"} gap={1} my={2}>
                <Typography>Bio</Typography>
                <TextField
                  multiline
                  value={changedBio || userDoc?.bio}
                  onChange={(e) => setChangedBio(e.target.value)}
                  minRows={3}
                  maxRows={8}
                  // InputProps={{
                  //   endAdornment: (
                  //     <IconButton
                  //       disabled={!changedBio || updating}
                  //       onClick={() => onUpdateUserDoc({ bio: changedBio })}
                  //     >
                  //       <SaveIcon fontSize="small" />
                  //     </IconButton>
                  //   ),
                  // }}
                />
              </Stack>
              <Box display={"flex"} justifyContent="center">
                <LoadingButton
                  loading={updating}
                  variant="contained"
                  color="info"
                  size="small"
                  disabled={!changedBio && !changedName && !changedPfp}
                  onClick={() =>
                    onUpdateUserDoc({
                      bio: changedBio || userDoc?.bio,
                      userName: changedName || userDoc?.userName,
                      pfp: changedPfp || userDoc?.pfp,
                    })
                  }
                >
                  Save
                </LoadingButton>
              </Box>
            </Stack>
            <Box m={2}>
              <Box display={"flex"} justifyContent="space-between">
                <Typography variant="h6">Alive Pass</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  color="info"
                  onClick={() => setShowNftsDrawer(true)}
                >
                  Inject PFP
                </Button>
              </Box>
              <Box display={"flex"} justifyContent="center" my={4}>
                <img src="/alive/new_card.png" alt="" width={"80%"} />
              </Box>
            </Box>
          </Stack>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography sx={{ m: 2 }} variant="h6">
            My Music Collections
          </Typography>
          <Box
            display={"flex"}
            gap={2}
            sx={{ overflowX: "auto" }}
            width={"100%"}
          >
            {/* {musicNfts.length === 0 && (
              <Typography align="center" px={2} mb={2} color="gray">
                No Music NFTs found
              </Typography>
            )} */}
            {musicNfts.map((musicNft, i) => (
              <NftMusicCard
                key={i}
                i={i}
                loading={loading}
                nft={musicNft}
                playIndex={playIndex}
                playing={playing}
                setPlayIndex={setPlayIndex}
                togglePlayPause={togglePlayPause}
              />
            ))}
          </Box>
          <Divider />
          <Typography variant="h6" sx={{ m: 2 }}>
            Other NFT Collections
          </Typography>
          <Box
            display={"flex"}
            // flexWrap="wrap"
            gap={2}
            sx={{ overflowX: "auto" }}
          >
            {nfts.length === 0 && (
              <Typography align="center" px={2} mb={2} color="gray">
                No NFTs found
              </Typography>
            )}
            {nfts.map((nft, i) => (
              <Box
                key={i}
                width={180}
                sx={{
                  background: `url(${nft.image?.mediaEncoding?.thumbnail})`,
                  backgroundSize: "cover",
                }}
                borderRadius="15px"
              >
                <Stack
                  width={180}
                  height={180}
                  justifyContent="end"
                  alignItems={"center"}
                  position="relative"
                >
                  <Box
                    display={"flex"}
                    mb={0.5}
                    p={0.2}
                    px={1}
                    sx={{ background: "rgba(0,0,0,0.8)", borderRadius: "6px" }}
                    alignItems="center"
                    justifyContent={"space-between"}
                    gap={2}
                    maxWidth="90%"
                  >
                    <Tooltip title={nft.collectionName}>
                      <Typography
                        variant="caption"
                        noWrap
                        fontWeight={900}
                        fontSize={"10px"}
                      >
                        {nft.collectionName}
                      </Typography>
                    </Tooltip>
                  </Box>
                </Stack>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
      <WalletConnectors
        onClose={() => setShowConnector(false)}
        onSignInUsingWallet={onSignInUsingWallet}
        open={showConnector}
        showError={showError}
      />
      <Drawer
        anchor={"right"}
        hideBackdrop
        open={showNftsDrawer}
        onClose={() => setShowNftsDrawer(false)}
        sx={{ background: "rgba(0,0,0,0.8)" }}
      >
        <NftsByWallet
          onConnect={() => {}}
          tokenId={tokenId}
          // onInsert={(nft: any) => {}}
          onClose={() => {
            setShowNftsDrawer(false);
          }}
        />
      </Drawer>
      <Dialog open={showSetPfp} onClose={() => setShowSetPfp(false)} fullWidth>
        <DialogTitle letterSpacing={1}>
          Select NUSIC pfp from your collections
        </DialogTitle>
        <DialogContent>
          <Box display={"flex"} gap={2} sx={{ overflowX: "auto" }} p={4}>
            {musicNfts.map((mf) => (
              <Stack gap={2} key={`${mf.collectionAddress}-${mf.tokenId}`}>
                <Box
                  display={"flex"}
                  alignItems="center"
                  justifyContent={"center"}
                  width="100%"
                  height={"100%"}
                >
                  <img
                    src={mf.image?.mediaEncoding?.thumbnail || ""}
                    alt=""
                    //   width={150}
                    //   height={150}
                    style={{ borderRadius: "8px", objectFit: "cover" }}
                  ></img>
                </Box>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() =>
                    setChangedPfp(mf.image?.mediaEncoding?.thumbnail || "")
                  }
                >
                  Select
                </Button>
              </Stack>
            ))}
            {nfts.map((mf) => (
              <Stack gap={2} key={`${mf.collectionAddress}-${mf.tokenId}`}>
                <Box
                  display={"flex"}
                  alignItems="center"
                  justifyContent={"center"}
                  width="100%"
                  height={"100%"}
                >
                  <img
                    src={mf.image?.mediaEncoding?.thumbnail || ""}
                    alt=""
                    //   width={150}
                    //   height={150}
                    style={{ borderRadius: "8px", objectFit: "cover" }}
                  ></img>
                </Box>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() =>
                    setChangedPfp(mf.image?.mediaEncoding?.thumbnail || "")
                  }
                >
                  Select
                </Button>
              </Stack>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
      {playIndex !== -1 && playIndex < musicNfts.length && (
        <Box position={"fixed"} bottom={0} left={0} zIndex={9999} width="100%">
          <Player
            songs={musicNfts}
            songIndexProps={[playIndex, setPlayIndex]}
          />
        </Box>
      )}
    </Box>
  );
};

export default Index;
