"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import CryptoCard from "@/components/CryptoCard";
import LiquiditySnapshot from "@/components/LiquiditySnapshot";
import type { CryptoData, GlobalData } from "@/types/crypto";
import { fetchCryptoData, fetchGlobalData } from "@/utils/api";

export default function DashBoard() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [globalData, setGlobalData] = useState<GlobalData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initial fetch ONLY.
    // Subsequent updates are handled by individual CryptoCards.
    const fetchData = async () => {
      try {
        setError(null);
        setLoading(true);

        const [cryptoJson, globalJson] = await Promise.all([
          fetchCryptoData(),
          fetchGlobalData(),
        ]);

        setCryptoData(cryptoJson);
        setGlobalData(globalJson);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      }
    };

    fetchData();
    // No setInterval here anymore.
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-linear-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center">
        <div className="text-amber-400 text-xl">Loading market data...</div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-linear-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center">
        <div className="text-red-400 text-xl">Error: {error}</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <Header />

        {/* Market Data Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cryptoData
            .filter((c) => ["bitcoin", "ethereum", "solana"].includes(c.id))
            .map((crypto) => (
              // Pass initial data; Card handles its own updates now
              <CryptoCard key={crypto.id} crypto={crypto} />
            ))}
        </div>

        {/* Liquidity Snapshot */}
        {/* Note: This will now remain static until refresh, unlike the cards */}
        {globalData && <LiquiditySnapshot globalData={globalData} />}

        {/* Footer */}
        <div className="text-center text-neutral-500 text-sm">
          <p>Data updates every minute • Powered by CoinGecko API</p>
        </div>
      </div>
    </div>
  );
}
