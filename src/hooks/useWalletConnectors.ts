import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { InjectedConnector } from "@web3-react/injected-connector";

export const CoinbaseWallet = new WalletLinkConnector({
  url: process.env.NEXT_PUBLIC_RPC as string,
  appName: "NUSIC Player",
  supportedChainIds: [Number(process.env.NEXT_PUBLIC_CHAIN_ID)],
});

export const WalletConnect = new WalletConnectConnector({
  rpc: process.env.NEXT_PUBLIC_RPC as string,
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  supportedChainIds: [Number(process.env.NEXT_PUBLIC_CHAIN_ID)],
});

export const Injected = new InjectedConnector({
  supportedChainIds: [Number(process.env.NEXT_PUBLIC_CHAIN_ID)],
});
