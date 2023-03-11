/* eslint-disable @next/next/no-img-element */
import { LoadingButton } from "@mui/lab";
import { Stack, Box, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { NftTokenDoc } from "../../models/NftCollection";
import { PricesObj } from "../../models/Price";

type Props = {
  nft: NftTokenDoc;
  pricesObj?: PricesObj;
  openCheckout: (link: string) => void;
};

const MarketItem = ({ nft, pricesObj, openCheckout }: Props) => {
  const [isActionLoading, setIsActionLoading] = useState(false);

  const onMakeOffer = async (nft: NftTokenDoc) => {
    setIsActionLoading(true);
    try {
      const response = await axios.post(
        "/api/checkout",
        { tokenAddress: nft.tokenAddress, tokenId: nft.tokenId },
        { headers: { "Content-Type": "application/json" } }
      );
      const checkoutLinkIntentUrl = response.data.checkoutLinkIntentUrl;
      openCheckout(checkoutLinkIntentUrl);
      // window.open(checkoutLinkIntentUrl, "_blank");
    } catch (e: any) {
      alert("Unable to find the checkout link from paper, try again later.");
    } finally {
      setIsActionLoading(false);
    }
  };
  return (
    <Stack
      gap={2}
      p={1}
      border="1px solid #c3c3c3"
      borderRadius={"6px"}
      onClick={
        () => {}
        // router.push(`market/${nft.tokenAddress}?tokenId=${nft.tokenId}`)
      }
      width="45%"
      alignItems={"center"}
      justifyContent="space-between"
    >
      <Box width={"100%"}>
        <Box display={"flex"} justifyContent="center">
          <img
            src={nft.original.imageUrl}
            alt={nft.tokenId}
            width="100%"
            style={{ borderRadius: "6px" }}
          />
        </Box>
        <Box mt={2}>
          <Typography variant="caption">{nft.artist}</Typography>
          <Typography variant="body2">{nft.name}</Typography>
        </Box>
      </Box>
      <Box>
        {pricesObj && pricesObj[nft.id]?.price && (
          <Box>
            <Typography variant="caption" color={"yellow"}>
              Price: {pricesObj[nft.id].price} ETH
            </Typography>
          </Box>
        )}
        {pricesObj && pricesObj[nft.id]?.lastBuy !== null && (
          <Box>
            <Typography variant="caption" color={"yellow"}>
              Last Buy Price: {pricesObj[nft.id].lastBuy} ETH
            </Typography>
          </Box>
        )}
        {pricesObj && pricesObj[nft.id]?.lastBuy !== null && (
          <Box>
            <Typography variant="caption" color={"yellow"}>
              Last Sell Price: {pricesObj[nft.id].lastSell} ETH
            </Typography>
          </Box>
        )}
      </Box>
      <LoadingButton
        loading={isActionLoading}
        variant="contained"
        onClick={() => onMakeOffer(nft)}
      >
        Make Offer
      </LoadingButton>
    </Stack>
  );
};

export default MarketItem;
