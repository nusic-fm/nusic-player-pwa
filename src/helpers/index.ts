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

export const fmtMSS = (s: number) => {
  return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
};
export const createUrlFromCid = (tokenUri: string | null | undefined) => {
  if (!tokenUri) {
    return "";
  } else if (tokenUri.includes("https")) {
    return tokenUri;
  } else if (tokenUri.startsWith("ipfs")) {
    const cid = tokenUri.split("ipfs://")[1];
    return `https://ipfs.io/ipfs/${cid}`;
  } else if (tokenUri.startsWith("ar")) {
    const addressWithTokenId = tokenUri.split("ar://")[1];
    return `https://arweave.net/${addressWithTokenId}`;
  } else {
    return "";
  }
};

export const checkConnection = async () => {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  const accounts = await provider.listAccounts();
  if (accounts.length) {
    if (
      (window as any).ethereum?.networkVersion !==
      process.env.NEXT_PUBLIC_CHAIN_ID
    ) {
      try {
        await (window as any).ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId: ethers.utils.hexValue(
                Number(process.env.NEXT_PUBLIC_CHAIN_ID)
              ),
            },
          ],
        });
      } catch (err) {}
    }
  }
};
export const convertSecondsToHHMMSS = (totalSeconds: number) => {
  var hours = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds % 3600) / 60);
  var seconds = totalSeconds % 60;

  var hhmmss = "";

  if (hours > 0) {
    hhmmss += hours + ":";
  }

  hhmmss += ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);

  return hhmmss;
};
