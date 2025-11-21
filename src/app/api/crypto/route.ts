import { CryptoData } from "@/types/crypto";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // UPDATED: Increased per_page to 50 to ensure we get USDT, USDC, DAI, etc.
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false",
      { next: { revalidate: 60 } } // Optional: Cache for 60s
    );

    if (!response.ok) {
      return NextResponse.json({ error: "API failed" }, { status: 500 });
    }

    const geckoData = await response.json();

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

    return NextResponse.json(mapped);
  } catch (error) {
    return NextResponse.json({ error: "Network error" }, { status: 500 });
  }
}
