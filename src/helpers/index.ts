import { ethers } from "ethers";

const getProvider = () => {
  return new ethers.providers.AlchemyProvider(
    process.env.NEXT_PUBLIC_CHAIN_NAME as string,
    process.env.NEXT_PUBLIC_ALCHEMY as string
  );
};

export const getEnsName = (address: string): Promise<string | null> => {
  const provider = getProvider();
  return provider.lookupAddress(address);
};
