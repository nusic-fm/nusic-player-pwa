/* eslint-disable @next/next/no-img-element */
import { Box } from "@mui/system";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MarketItem from "../../src/components/MarketItem";
import { NftTokenDoc } from "../../src/models/NftCollection";
import { PricesObj } from "../../src/models/Price";
import { renderPaperCheckoutLink } from "@paperxyz/js-client-sdk";

type Props = {};

const Market = ({}: Props) => {
  const [collections, setCollections] = useState<NftTokenDoc[]>();
  const [pricesObj, setPricesObj] = useState<PricesObj>();

  const fetchNftCollectionsWithPrices = async () => {
    const res = await axios.post(
      "api/market-tokens",
      {
        tokens: [{ message: "test" }],
        baseUrl: "https://api.reservoir.tools/tokens/v5",
      },
      { headers: { "Content-Type": "application/json" } }
    );
    const data = res.data as {
      tokens: NftTokenDoc[];
      pricesObj: PricesObj;
    };

    setCollections(data.tokens);
    setPricesObj(data.pricesObj);
  };

  const openCheckout = (checkoutLinkUrl: string) =>
    renderPaperCheckoutLink({
      checkoutLinkUrl,
      onModalClosed() {
        alert("Closed");
      },
      onPaymentFailed: ({ transactionId }) => {
        console.log(transactionId);
        alert("failed");
      },
      onPaymentSucceeded({ transactionId }) {
        console.log(transactionId);
        alert("success");
      },
      onTransferSucceeded({ transactionId, claimedTokens }) {
        console.log(transactionId, claimedTokens);
        alert("Transfer Success");
      },
    });

  useEffect(() => {
    fetchNftCollectionsWithPrices();
  }, []);

  return (
    <Box sx={{ bgcolor: "black" }} minHeight="100vh" p={2} pb={6} width="100%">
      <Box
        display={"flex"}
        flexWrap="wrap"
        gap={2}
        justifyContent="center"
        width="100%"
      >
        {collections?.map((nft, i) => (
          <MarketItem
            nft={nft}
            pricesObj={pricesObj}
            key={i}
            openCheckout={openCheckout}
          ></MarketItem>
        ))}
      </Box>
    </Box>
  );
};

export default Market;
