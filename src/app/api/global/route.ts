import { NextResponse } from "next/server";
import type { GlobalData } from "@/types/crypto";

export async function GET() {
  try {
    const response = await fetch("https://api.coinpaprika.com/v1/global");

    if (!response.ok) {
      throw new Error("Failed to fetch global data");
    }

    const data: GlobalData = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching global data:", error);
    return NextResponse.json(
      { error: "Failed to fetch global market data" },
      { status: 500 }
    );
  }
}
