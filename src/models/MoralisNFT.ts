export interface MoralisNftData {
  token_address: string;
  token_id: string;
  amount: string;
  contract_type: string;
  token_uri?: string | undefined;
  metadata?: string | undefined;
  name: string;
  symbol: string;
  normalized_metadata: { animation_url?: string; name?: string };
}
