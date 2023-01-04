/* eslint-disable react-hooks/exhaustive-deps */
import { Box, LinearProgress, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { MoralisNftData } from "../../models/MoralisNFT";

type Props = {
  nftTokenProps: [MoralisNftData, (val: MoralisNftData) => void];
  loadingProps: [boolean, (val: boolean) => void];
  errorProps: [boolean, (val: boolean) => void];
  setUriDetails: (val: { artworkUrl: string; audioFileUrl: string }) => void;
};

const NFTPreview = ({
  nftTokenProps,
  loadingProps,
  errorProps,
  setUriDetails,
}: Props) => {
  const [isLoading, setIsLoading] = loadingProps;
  const [isError, setIsError] = errorProps;
  const [nft, setNft] = nftTokenProps;
  const [animationUrl, setAnimationUrl] = useState<string>();
  const [artworkUrl, setArtworkUrl] = useState<string>();

  const onFetchNftPreview = async () => {
    const tokenUri = nft.token_uri;
    if (tokenUri) {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER}/nft/`,
          {
            tokenUri,
          }
        );
        if (response) {
          const obj = {
            artworkUrl: response.data.artworkUrl,
            audioFileUrl: "",
          };
          setNft({ ...nft, name: response.data.name });
          setArtworkUrl(response.data.artworkUrl);
          if (response.data.audioFileUrl && response.data.audioFileUrl.length) {
            obj.audioFileUrl = response.data.audioFileUrl;
            setAnimationUrl(response.data.audioFileUrl);
          } else {
            setAnimationUrl(response.data.artworkUrl);
          }

          setUriDetails(obj);
        }
      } catch (e) {
        setIsError(true);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (nft.token_uri) {
      onFetchNftPreview();
    }
  }, []);

  if (isError) {
    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }} align="center" color={"error"}>
          {nft?.name}
        </Typography>
        <Typography align="center">
          does not have Music in the Metadata or does not follow https or ipfs
          or arweave formats
        </Typography>
        <Typography sx={{ mt: 4 }}>
          If this is a music NFT, DM us with {nft.token_address} #{nft.token_id}
        </Typography>
      </Box>
    );
  }
  if (isLoading) {
    return (
      <Box>
        <LinearProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        display={"flex"}
        gap={2}
        justifyContent="center"
        p={2}
        mt={2}
        flexWrap="wrap"
        alignItems="center"
      >
        {artworkUrl && (
          // <img
          //   src={artworkUrl}
          //   alt=""
          //   width={100}
          //   height={100}
          //   style={{ borderRadius: "6px" }}
          // />
          <Box
            style={{
              borderRadius: "6px",
              backgroundImage: `url(${artworkUrl})`,
              backgroundSize: "100%",
            }}
            width={100}
            height={100}
          ></Box>
        )}
        <Box display={"flex"} flexDirection="column" gap={2}>
          <Typography variant="h6">{nft?.name}</Typography>
          {animationUrl && (
            <Box mt={1}>
              <audio controls src={animationUrl} autoPlay></audio>
            </Box>
          )}
        </Box>
        {/* <Typography>{nftDetails?.description}</Typography> */}
      </Box>
    </Box>
  );
};

export default NFTPreview;
