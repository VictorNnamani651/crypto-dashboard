import { NextResponse } from "next/server";
import type { GlobalData } from "@/types/crypto";

export async function GET() {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/global", {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch global data: ${response.status}`);
    }

    const json = await response.json();
    const d = json.data;

    // UPDATED: Map the raw Coingecko data to your GlobalData interface HERE
    const mappedData: GlobalData = {
      market_cap_usd: d.total_market_cap.usd,
      volume_24h_usd: d.total_volume.usd,
      bitcoin_dominance_percentage: d.market_cap_percentage.btc, // This gives the BTC Dominance
      cryptocurrencies_number: d.active_cryptocurrencies,
      market_cap_change_24h: d.market_cap_change_percentage_24h_usd,
      volume_24h_change_24h: 0,
    };

    return NextResponse.json(mappedData);
  } catch (error) {
    console.error("Error fetching global data:", error);
    return NextResponse.json(
      { error: "Failed to fetch global market data" },
      { status: 500 }
    );
  }
}
