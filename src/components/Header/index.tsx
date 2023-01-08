import { Grid, Box, Tooltip, Chip, Button } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getEnsName } from "../../helpers";
import useAuth from "../../hooks/useAuth";

type Props = {};

const Header = (props: Props) => {
  const router = useRouter();
  const { account } = useWeb3React();
  const { login } = useAuth();
  const [userEnsName, setUserEnsName] = useState<string>();

  const fetchEnsName = async (address: string) =>
    getEnsName(address).then((userEns) => userEns && setUserEnsName(userEns));

  useEffect(() => {
    if (account) {
      fetchEnsName(account);
    }
  }, [account]);

  return (
    <Box p={2}>
      <Grid container alignItems={"center"} rowSpacing={4}>
        <Grid item xs={8} md={5}>
          <Image
            src="/nusic-white.png"
            alt=""
            width={140}
            height={42}
            onClick={() => router.push("/")}
            style={{ cursor: "pointer" }}
          />
        </Grid>
        <Grid item xs={0} md={4}>
          {/* <TextField
              label="Search"
              fullWidth
              onChange={(e) => {
                const _new = songsDataSource.filter(
                  (s) =>
                    s.name
                      ?.toString()
                      .toLowerCase()
                      .includes(e.target.value.toLowerCase()) ||
                    s.singer
                      ?.toString()
                      .toLowerCase()
                      .includes(e.target.value.toLowerCase())
                );
                setSongs(_new);
              }}
            ></TextField> */}
        </Grid>
        <Grid item xs={4} md={3}>
          <Box display={"flex"} justifyContent="end" alignItems={"center"}>
            {account ? (
              <Tooltip title={account} placement={"bottom-start"}>
                <Chip
                  clickable
                  label={
                    userEnsName ||
                    `${account.slice(0, 6)}...${account.slice(
                      account.length - 4
                    )}`
                  }
                  // size="small"
                  color="info"
                  variant="outlined"
                  onClick={() => router.push("/dashboard")}
                />
              </Tooltip>
            ) : (
              <Button
                variant="outlined"
                color="info"
                onClick={(e) => {
                  e.stopPropagation();
                  login();
                }}
              >
                connect
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Header;
