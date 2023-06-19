export interface NftDetails {
  artworkUrl: string;
  audioFileUrl: string;
  name: string;
  format: "audio" | "video" | undefined;
  tokenUri: string;
}

export interface SelectedNftDetails {
  address: string;
  artworkUrl: string;
  audioFileUrl: string;
  name: string;
  tokenId: string;
  format: "audio" | "video" | undefined;
  tokenUri: string;
}
