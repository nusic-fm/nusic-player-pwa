/* eslint-disable @next/next/no-img-element */
import { Box } from "@mui/system";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MarketItem from "../src/components/MarketItem";

type Props = {};

const nfts = [
  {
    name: "TestOS",
    id: "0x5c4e84e52863308a99618b0cca680d1d07f09355-279",
    original: {
      imageUrl:
        "	https://i.seadn.io/gcs/files/8b1dbaabe55f57e5c58155401bbaf33e.png?auto=format&w=1000",
    },
    tokenAddress: "0x5c4e84e52863308a99618b0cca680d1d07f09355",
    tokenId: "279",
    artist: "Ape",
  },
  {
    name: "Sample NFT 23",
    id: "0xacc0772136c47f36ab95d5f506e7ab3549469400-23",
    original: {
      imageUrl:
        "	https://i.seadn.io/gcs/files/a4ed7315d262aa81a81402be5d186b99.png?auto=format&w=1000",
    },
    tokenAddress: "0xacc0772136c47f36ab95d5f506e7ab3549469400",
    tokenId: "23",
    artist: "Test C2",
  },
  {
    name: "TestOS #281",
    id: "0x5c4e84e52863308a99618b0cca680d1d07f09355-281",
    original: {
      imageUrl:
        "https://i.seadn.io/gcs/files/402fcda3edf20d5bed33a28d7a53c933.jpg?auto=format&w=1000",
    },
    tokenAddress: "0x5c4e84e52863308a99618b0cca680d1d07f09355",
    tokenId: "281",
    artist: "Ape",
  },
  {
    name: "Test Ape - Rarible",
    id: "0xc87fa76c704fe8de4bc727ef337907bf1e316418-107815925331162638946912699502085937632525691841123028314428424931925624356865",
    original: {
      imageUrl:
        "https://i.seadn.io/gcs/files/beaeb87b8f63a8e131e710df157ea804.png?auto=format&w=1000",
    },
    tokenAddress: "0xc87fa76c704fe8de4bc727ef337907bf1e316418",
    tokenId:
      "107815925331162638946912699502085937632525691841123028314428424931925624356865",
    artist: "FreeMintable",
  },
];

const Market = (props: Props) => {
  const [collections, setCollections] = useState<
    {
      name: string;
      id: string;
      tokenAddress: string;
      tokenId: string;
      original: { imageUrl: string };
      artist: string;
    }[]
  >(nfts);
  const [priceObj, setPriceObj] = useState<any>();
  const router = useRouter();

  const fetchPrices = async () => {
    const res = await axios.post("api/test-market-tokens", {
      tokens: nfts.map((n) => `${n.tokenAddress}:${n.tokenId}`),
      baseUrl: "https://api-goerli.reservoir.tools/tokens/v5",
    });
    const pricesObj = res.data.pricesObj;
    setPriceObj(pricesObj);
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const onMakeOffer = async (nft: any) => {};

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
            key={i}
            nft={nft as any}
            pricesObj={priceObj}
          ></MarketItem>
        ))}
      </Box>
    </Box>
  );
};

export default Market;
