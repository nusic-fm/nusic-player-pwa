import { LoadingButton } from "@mui/lab";
import {
  Box,
  TextField,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { MoralisNftData } from "../../models/MoralisNFT";
import { Song } from "../../models/Song";
import NFTPreview from "../NFTPreview";

type Props = {
  open: boolean;
  onClose: () => void;
  onSaveSongPlaylist: (nft: Song) => Promise<void>;
};

function ListNFT({ open, onClose, onSaveSongPlaylist }: Props) {
  //   const [tokenAddress, setTokenAddress] = useState<string>();
  //   const [tokenId, setTokenId] = useState<string>();
  const [marketPlaceLink, setMarketPlaceLink] = useState<string>();
  const [errorText, setErrorText] = useState<string>();
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [nftDetails, setNftDetails] = useState<MoralisNftData>();
  const [uriDetails, setUriDetails] = useState<{
    artworkUrl: string;
    audioFileUrl: string;
  }>();

  const onMarketPlaceLinkChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setMarketPlaceLink(e.target.value);
    //https://opensea.io/assets/ethereum/0xb48fc73160b1e3c77709cd275c588a049c7266b2/10
    if (e.target.value.includes("opensea")) {
      try {
        const [chain, address, token] = e.target.value
          .split("opensea.io/assets/")[1]
          .split("/");
        if (chain === "ethereum") {
          setIsError(false);
          setIsLoading(true);
          const options = {
            method: "GET",
            url: `https://deep-index.moralis.io/api/v2/nft/${address}/${token}`,
            params: {
              chain: "eth",
              format: "decimal",
              normalizeMetadata: "true",
            },
            headers: {
              accept: "application/json",
              "X-API-Key": process.env.NEXT_PUBLIC_MORALIS_KEY,
            },
          };
          const response = await axios.request(options);
          setNftDetails(response.data as MoralisNftData);
          // const response = await axios.get(
          //   `https://api.opensea.io/asset/${address}/${token}`
          // );
          // //animation_url
          // //image_preview_url
          // //name
          // //description
          // const {
          //   animation_url,
          //   image_preview_url,
          //   name,
          //   description,
          //   asset_contract,
          //   collection,
          // } = response.data;
          // const collectinName = collection.name;
          // // .includes("-")
          // //   ? collection.name
          // //   : `${collection.name} - ${asset_contract?.name}`;
          // setNftDetails({
          //   chain,
          //   address,
          //   tokenId: token,
          //   animationUrl: animation_url,
          //   imagePreviewUrl: image_preview_url,
          //   name: asset_contract?.name,
          //   openseaName: name,
          //   description,
          //   collectionName: collectinName,
          // });
        } else {
          setIsError(true);
          setErrorText("Only Ethereum NFTs supported at the moment");
        }
      } catch (e) {
        setIsError(true);
        setErrorText("Unable to retrieve the NFT, please try again.");
      }
      setIsLoading(false);
    } else {
      setIsError(true);
      setErrorText("Only Opensea NFT links are supported at the moment");
    }
  };

  const onSave = async () => {
    if (nftDetails && nftDetails.token_address && uriDetails) {
      setIsLoading(true);
      await onSaveSongPlaylist({
        name: nftDetails.name,
        tokenId: nftDetails.token_id,
        address: nftDetails.token_address,
        artworkUrl: uriDetails.artworkUrl,
        audioFileUrl: uriDetails.audioFileUrl,
      });
      setNftDetails(undefined);
      setIsLoading(false);
      onClose();
    }
  };

  useEffect(() => {
    if (!open) {
      setMarketPlaceLink(undefined);
      setIsError(false);
      setErrorText(undefined);
      setNftDetails(undefined);
    }
  }, [open]);

  return (
    <Dialog open={open} fullWidth onClose={onClose}>
      <DialogTitle>List NFT</DialogTitle>
      <DialogContent>
        <Box>
          <Box p={2}>
            {/* <Box display={"flex"}>
              <TextField
                value={tokenAddress}
                label="NFT Address"
                fullWidth
              ></TextField>
              <TextField
                value={tokenId}
                label="Token ID"
                sx={{ width: "150px" }}
              ></TextField>
            </Box>
            <Box m={4}>
              <Typography>OR</Typography>
            </Box> */}
            <Box>
              <TextField
                value={marketPlaceLink}
                onChange={onMarketPlaceLinkChange}
                label="Opensea NFT Url"
                fullWidth
                helperText={
                  isError
                    ? errorText
                    : "Ex: https://opensea.io/assets/ethereum/nft_address/token_id"
                }
                error={isError}
              ></TextField>
            </Box>
          </Box>
          <Divider />
          {nftDetails && (
            <NFTPreview
              nftTokenProps={[nftDetails, setNftDetails]}
              errorProps={[isError, setIsError]}
              loadingProps={[isLoading, setIsLoading]}
              setUriDetails={setUriDetails}
            />
          )}
          {/* {nftDetails && (
            <Box p={2}>
              <Box display={"flex"} alignItems="center">
                <Typography>Preview</Typography>
                <Typography variant="caption" sx={{ ml: 2 }}>
                (only for Opensea)
              </Typography>
              </Box>
              <Box
                display={"flex"}
                gap={2}
                justifyContent="center"
                p={2}
                mt={2}
                flexWrap="wrap"
                alignItems="center"
              >
                <img
                  src={nftDetails?.imagePreviewUrl}
                  alt=""
                  width={100}
                  height={100}
                  style={{ borderRadius: "6px" }}
                />
                <Box display={"flex"} flexDirection="column" gap={2}>
                  <Typography variant="h6">
                    {nftDetails?.openseaName}
                  </Typography>
                  <Box mt={1}>
                    <audio controls src={nftDetails?.animationUrl}></audio>
                  </Box>
                </Box>
                <Typography>{nftDetails?.description}</Typography>
              </Box>
            </Box>
          )} */}
        </Box>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          loading={isLoading}
          onClick={() => {
            setNftDetails(undefined);
            onClose();
          }}
          color="info"
        >
          Cancel
        </LoadingButton>
        <LoadingButton
          disabled={!nftDetails?.token_address}
          loading={isLoading}
          variant="contained"
          onClick={onSave}
        >
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default ListNFT;
