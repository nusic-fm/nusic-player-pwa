import { ethers } from "ethers";

// const providerURL = "https://rpc.api.moonbase.moonbeam.network";
// Define Provider
export const provider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_RPC
);
//   new ethers.providers.StaticJsonRpcProvider(
//   providerURL,
//   {
//     chainId: 1287,
//     name: "moonbase-alphanet",
//   }
// );
