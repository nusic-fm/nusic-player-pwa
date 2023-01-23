import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { collection, DocumentData, limit, query } from "firebase/firestore";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import { db } from "../src/services/firebase.service";

type Props = {};

const Overview = (props: Props) => {
  const [values, loading, error, snapshot] =
    useCollectionDataOnce<DocumentData>(query(collection(db, "songs_v1")));

  return (
    <Box>
      <Typography variant="h4">Total Count: {values?.length}</Typography>
      <Box display={"flex"} gap={2} flexWrap="wrap">
        {values?.map((value, i) => (
          <Card key={i}>
            <CardContent>
              <Typography variant="h5">{value.name}</Typography>
              <Typography variant="caption">
                {value.tokenAddress}-{value.tokenId}
              </Typography>
            </CardContent>
            <CardActionArea
              onClick={() => {
                window.open(
                  `https://opensea.io/assets/ethereum/${value.tokenAddress}/${value.tokenId}`,
                  "_blank"
                );
              }}
            >
              <Button>Open</Button>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Overview;
