/* eslint-disable @next/next/no-img-element */
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Chip,
  Divider,
  Fab,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { NftTokenDoc } from "../../src/models/NftCollection";
import { getNftCollectionToken } from "../../src/services/db/nfts.service";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

type Props = {};

const NftInfo = (props: Props) => {
  const router = useRouter();
  const { address, tokenId } = router.query;
  const [nftToken, setNftToken] = useState<NftTokenDoc>();

  const fetchNftInfo = async () => {
    if (address && tokenId) {
      const token = await getNftCollectionToken(
        address as string,
        tokenId as string
      );
      setNftToken(token);
    }
  };

  useEffect(() => {
    if (!router.isReady) return;
    fetchNftInfo();
  }, [router.isReady]);

  return (
    <Box p={2} pb={6} sx={{ bgcolor: "black" }} minHeight="100vh">
      {nftToken && (
        <Box>
          <Typography align="center">{nftToken?.name}</Typography>
          <Box display={"flex"} justifyContent="center" my={2}>
            <img
              src={nftToken.original.imageUrl}
              alt="nft"
              width={200}
              height={200}
            ></img>
          </Box>
          <Box>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                Description
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="subtitle2">
                  {nftToken.description}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
          <Box py={2}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                Attributes
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="subtitle2">
                  {nftToken.attributes?.map((attribute) => (
                    <Chip
                      variant="outlined"
                      key={attribute.trait_type}
                      sx={{ py: 4 }}
                      label={
                        <Stack>
                          <Typography variant="caption">
                            {attribute.trait_type}
                          </Typography>
                          <Typography>{attribute.value}</Typography>
                        </Stack>
                      }
                    />
                  ))}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
          <Box>
            <Stack
              direction={"row"}
              justifyContent="center"
              gap={2}
              alignItems="center"
            >
              <Button variant="contained">Make Offer</Button>
            </Stack>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default NftInfo;
