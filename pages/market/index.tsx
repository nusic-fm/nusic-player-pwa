import { Chip } from "@mui/material";
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
    <Box sx={{ bgcolor: "black" }} minHeight="100vh" p={2} pb={6}>
      <Box display={"flex"} flexWrap="wrap" gap={2}>
        {collections?.map((nft) => (
          <Chip
            key={nft.id}
            label={nft.name}
            clickable
            onClick={() =>
              router.push(`market/${nft.tokenAddress}?tokenId=${nft.tokenId}`)
            }
          ></Chip>
        ))}
      </Box>
    </Box>
  );
};

export default Market;
