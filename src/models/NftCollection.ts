export interface NftCollection {
  name: string;
  description: string;
  contratType: string;
  ownerAddress: string;
  symbol: string;
  tokenUri: string;
}

export interface NftCollectionDoc extends NftCollection {
  id: string;
}

export interface NftToken {
  name: string;
  description: string;
  tokenAddress: string;
  tokenId: string;
  original: { animationUrl: string; imageUrl: string };
  tokenUri: string;

  artist: string;
  attributes?: { trait_type: string; value: string }[];
}

export interface NftTokenDoc extends NftToken {
  id: string;
  streamUrl: string;
  posterUrl: string;
}
