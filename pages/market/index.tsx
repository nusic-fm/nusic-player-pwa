/* eslint-disable @next/next/no-img-element */
import { Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { NftTokenDoc } from "../../src/models/NftCollection";
import { getNftCollectionsToken } from "../../src/services/db/nfts.service";

type Props = {};

const Market = (props: Props) => {
  const [collections, setCollections] = useState<NftTokenDoc[]>();
  const router = useRouter();

  const fetchNftCollections = async () => {
    const nftCollections = await getNftCollectionsToken();
    setCollections(nftCollections);
  };

  useEffect(() => {
    fetchNftCollections();
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
          <Stack
            key={i}
            gap={2}
            p={1}
            border="1px solid #c3c3c3"
            borderRadius={"6px"}
            onClick={() =>
              router.push(`market/${nft.tokenAddress}?tokenId=${nft.tokenId}`)
            }
            width="45%"
            alignItems={"center"}
          >
            <img
              src={nft.original.imageUrl}
              alt={nft.tokenId}
              width="80"
              height="80"
            />
            <Box>
              <Typography variant="caption">{nft.artist}</Typography>
              <Typography variant="body2">{nft.name}</Typography>
            </Box>
            {/* <Button variant="contained">Buy Now</Button> */}
          </Stack>
        ))}
      </Box>
    </Box>
  );
};

export default Market;
