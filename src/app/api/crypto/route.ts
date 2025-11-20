import { CryptoData } from "@/types/crypto";

export async function GET() {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1"
    );

    if (!response.ok) {
      return Response.json({ error: "API failed" }, { status: 500 });
    }

    const geckoData = await response.json();

    // Map CoinGecko → CoinPaprika-style CryptoData[]
    const mapped: CryptoData[] = geckoData.map((coin: any) => ({
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
          percent_change_1h: 0, // CoinGecko doesn't provide for free
        },
      },
    }));

    return Response.json(mapped);
  } catch (error) {
    return Response.json({ error: "Network error" }, { status: 500 });
  }
}
