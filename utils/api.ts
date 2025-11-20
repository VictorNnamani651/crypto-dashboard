import type { CryptoData, GlobalData, CryptoQuote } from "@/types/crypto";

// Fetch global market data from CoinGecko and map it to your GlobalData interface
export async function fetchGlobalData(): Promise<GlobalData> {
  const res = await fetch("https://api.coingecko.com/api/v3/global");
  const data = await res.json();
  const d = data.data;

  return {
    market_cap_usd: d.total_market_cap.usd,
    volume_24h_usd: d.total_volume.usd,
    bitcoin_dominance_percentage: d.market_cap_percentage.btc,
    cryptocurrencies_number: d.active_cryptocurrencies,
    market_cap_change_24h: d.market_cap_change_percentage_24h_usd,
    volume_24h_change_24h: 0, // CoinGecko does not provide
  };
}

// Fetch top coins from CoinGecko and map to your CryptoData type
export async function fetchCryptoData(): Promise<CryptoData[]> {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false"
  );
  const data = await res.json();

  return data.map((coin: any) => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    rank: coin.market_cap_rank,
    quotes: {
      USD: {
        price: coin.current_price,
        volume_24h: coin.total_volume,
        market_cap: coin.market_cap,
        percent_change_24h: coin.price_change_percentage_24h,
        percent_change_7d: coin.price_change_percentage_7d_in_currency || 0,
        percent_change_1h: coin.price_change_percentage_1h_in_currency || 0,
      } as CryptoQuote,
    },
  }));
}
