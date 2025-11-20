export interface CryptoQuote {
  price: number;
  volume_24h: number;
  market_cap: number;
  percent_change_24h: number;
  percent_change_7d: number;
  percent_change_1h: number;
}

export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  quotes: {
    USD: CryptoQuote;
  };
}

export interface GlobalData {
  market_cap_usd: number;
  volume_24h_usd: number;
  bitcoin_dominance_percentage: number;
  cryptocurrencies_number: number;
  market_cap_change_24h: number;
  volume_24h_change_24h: number;
}
