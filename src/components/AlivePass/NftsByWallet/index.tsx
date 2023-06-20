/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { Button, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import axios from "axios";
import Close from "@mui/icons-material/Close";
import { getNftsMetadataByWallet } from "../../../helpers/zora";
import { IZoraData } from "../../../models/TypeZora";

type Props = {
  onConnect: () => void;
  onInsert?: (nft: IZoraData) => void;
  onClose?: () => void;
};

const NftsByWallet = ({ onConnect, onClose }: Props) => {
  const { account } = useWeb3React();
  const [tokens, setTokens] = useState<IZoraData[]>([]);
  // const [previewNft, setPreviewNft] = useState<SelectedNftDetails>(); //TODO
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [insertUrl, setInsertUrl] = useState<string>();

  const onInsert = async (url: string) => {
    // setIsLoading(true);
    const res = await axios.post(
      `https://nusic-image-conversion-ynfarb57wa-uc.a.run.app/overlay?url=${url}`,
      {},
      { responseType: "arraybuffer" }
    );
    let base64ImageString = Buffer.from(res.data, "binary").toString("base64");
    let srcValue = "data:image/png;base64," + base64ImageString;
    setInsertUrl(srcValue);
    // setIsLoading(false);
  };

  const fetchAllNfts = async () => {
    // "0xA0cb079D354b66188f533A919d1c58cd67aFe398"
    if (!account) return;
    const _tokens = await getNftsMetadataByWallet(
      account
      // "0x1f3aECdD7b1c376863d08C5340B1E48Da2961539"
    );
    setTokens(_tokens);
  };

  useEffect(() => {
    if (account) {
      fetchAllNfts();
    }
  }, [account]);

  if (!account)
    return (
      <Box display={"flex"} justifyContent="center" my={6}>
        <Button onClick={onConnect} variant="contained">
          Connect Wallet
        </Button>
      </Box>
    );
  else
    return (
      <Box sx={{ bgcolor: "#0f0f0f" }} height="100vh" p={2}>
        <Box
          p={1}
          m={1}
          // borderBottom="1px solid gray"
          display={"flex"}
          justifyContent="space-between"
          alignItems={"center"}
        >
          <Typography variant="subtitle1" fontWeight={700}>
            Inject your pfp
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <Box
          display={"flex"}
          gap={1}
          sx={{ overflowX: "auto" }}
          width={{ xs: 350, md: 600 }}
          mt={4}
        >
          {tokens.length === 0 && (
            <Typography color={"yellow"} align="center" width={"100%"} my={5}>
              NFTs not found in your wallet
            </Typography>
          )}
          {tokens.map((nft, i) => (
            <Stack
              key={i}
              width={180}
              p={2}
              gap={1}
              // borderTop="1px solid #474747"
            >
              <Box>
                <Tooltip title={nft.name} placement="bottom-start">
                  <Typography
                    fontWeight={900}
                    noWrap
                    variant="subtitle2"
                    color={"rgba(255,255,255,0.8)"}
                  >
                    {nft.collectionName}
                  </Typography>
                </Tooltip>
                {/* <Tooltip
                  title={`Token ID: ${nft.tokenId}`}
                  placement="bottom-start"
                >
                  <Typography variant="body1" noWrap>
                    #{nft.tokenId}
                  </Typography>
                </Tooltip> */}
              </Box>
              {nft.image?.mediaEncoding?.thumbnail ? (
                <Box
                  display={"flex"}
                  alignItems="center"
                  justifyContent={"center"}
                  width="100%"
                  height={"100%"}
                >
                  <img
                    src={nft.image?.mediaEncoding?.thumbnail}
                    alt=""
                    width={150}
                    height={150}
                    style={{ borderRadius: "10px", objectFit: "cover" }}
                  ></img>
                </Box>
              ) : (
                <Box
                  display={"flex"}
                  alignItems="center"
                  justifyContent={"center"}
                  width="100%"
                  height={"100%"}
                >
                  <Box
                    width={200}
                    height={200}
                    display="flex"
                    alignItems={"center"}
                  >
                    <Typography align="center" color={"gray"}>
                      Image not available at this moment, you can hit Refresh to
                      see it
                    </Typography>
                  </Box>
                </Box>
              )}
              <Box
                id="isnft"
                width={"100%"}
                display="flex"
                justifyContent={"center"}
                alignItems="center"
                gap={4}
                // mt={4}
              >
                {/* <Typography>is it a Music NFT?</Typography> */}
                <Button
                  disabled={isPreviewLoading}
                  variant="outlined"
                  color="info"
                  size="small"
                  onClick={() => {
                    if (nft.image?.mediaEncoding?.original) {
                      onInsert(nft.image.mediaEncoding.original);
                    } else if (nft.image?.mediaEncoding?.thumbnail) {
                      onInsert(nft.image.mediaEncoding.thumbnail);
                    }
                    // setInsertUrl(nft.image?.mediaEncoding?.thumbnail);
                  }}
                >
                  Insert
                </Button>
              </Box>
            </Stack>
          ))}
        </Box>
        <Stack
          sx={{ bgcolor: "black" }}
          gap={2}
          p={4}
          mt={2}
          borderRadius="6px"
        >
          <Typography variant="subtitle1">Preview</Typography>
          <Box display={"flex"} justifyContent="center" position={"relative"}>
            <Box width={{ xs: "100%", md: "400px" }}>
              {insertUrl ? (
                <img src={insertUrl} alt="" width={"100%"} />
              ) : (
                <img src="/alive/new_card.png" alt="" width={"100%"} />
              )}
            </Box>
          </Box>
          <Box display={"flex"} justifyContent="center">
            <Button variant="contained">Inject</Button>
          </Box>
        </Stack>
      </Box>
    );
};

export default NftsByWallet;
