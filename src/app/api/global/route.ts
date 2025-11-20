import { NextResponse } from "next/server";
import type { GlobalData } from "@/types/crypto";

export async function GET() {
  try {
    // CoinGecko global market data endpoint
    const response = await fetch("https://api.coingecko.com/api/v3/global");

    if (!response.ok) {
      throw new Error(`Failed to fetch global data: ${response.status}`);
    }

    const data: GlobalData = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching global market data from CoinGecko:", error);
    return NextResponse.json(
      { error: "Failed to fetch global market data" },
      { status: 500 }
    );
  }
}
