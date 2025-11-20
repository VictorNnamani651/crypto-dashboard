import { NextResponse } from "next/server";
import type { CryptoData } from "@/types/crypto";

export async function GET() {
  try {
    const cryptoIds = ["btc-bitcoin", "eth-ethereum", "sol-solana"];

    const cryptoPromises = cryptoIds.map((id) =>
      fetch(`https://api.coinpaprika.com/v1/tickers/${id}`).then((res) =>
        res.json()
      )
    );

    const cryptoResults: CryptoData[] = await Promise.all(cryptoPromises);

    return NextResponse.json(cryptoResults);
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    return NextResponse.json(
      { error: "Failed to fetch crypto data" },
      { status: 500 }
    );
  }
}
