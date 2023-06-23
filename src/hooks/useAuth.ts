import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
// import { injectedConnector } from "../utils/connectors";
import { InjectedConnector } from "@web3-react/injected-connector";

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    1, // Mainet
    // 3, // Ropsten
    // 4, // Rinkeby
    5, // Goerli
    // 42, // Kovan
    137, // Polygon
    80001, // Mumbai
    56, //Smart chain
    // parseInt(process.env.NEXT_PUBLIC_CHAIN_ID as string),
    // 1287, //Moonbase albha
    // 1285, //Moonriver
  ],
});
const useAuth = () => {
  const { activate } = useWeb3React();

  const login = useCallback(() => {
    activate(injectedConnector, async (error: Error) => {
      console.error(error);
      if (error.name === "UnsupportedChainIdError") {
        alert(
          `Unsupported chain, Please connect ETH Mainnet Network to continue`
        );
      } else {
        console.log("error", error.name || error.message);
      }
    });
  }, [activate]);

  return { login };
};

export default useAuth;
