"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import CryptoCard from "@/components/CryptoCard";
import LiquiditySnapshot from "@/components/LiquiditySnapshot";
import type { CryptoData, GlobalData } from "@/types/crypto";
import { fetchCryptoData, fetchGlobalData } from "@/utils/api";

export default function HomePage() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [globalData, setGlobalData] = useState<GlobalData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const [cryptoJson, globalJson] = await Promise.all([
          fetchCryptoData(),
          fetchGlobalData(),
        ]);

        setCryptoData(cryptoJson);
        setGlobalData(globalJson);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  // Loading Screen
  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black flex items-center justify-center">
        <div className="text-yellow-400 text-xl animate-pulse">
          Loading market data...
        </div>
      </div>
    );

  // Error Screen
  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black flex items-center justify-center">
        <div className="text-red-400 text-xl font-semibold">Error: {error}</div>
      </div>
    );

  // Main UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black p-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <Header />

        {/* Market Data Cards */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-yellow-400 tracking-wide">
            Market Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cryptoData
              .filter((c) => ["bitcoin", "ethereum", "solana"].includes(c.id))
              .map((crypto) => (
                <CryptoCard key={crypto.id} crypto={crypto} />
              ))}
          </div>
        </section>

        {/* Liquidity Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-yellow-400 tracking-wide">
            Liquidity Snapshot
          </h2>

          {globalData && (
            <div className="rounded-xl border border-yellow-900/40 bg-slate-900/40 backdrop-blur p-6 shadow-lg shadow-black/50">
              <LiquiditySnapshot globalData={globalData} />
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="text-center text-slate-500 text-sm pt-10">
          <p className="tracking-wide">
            Data updates every minute • Powered by{" "}
            <span className="text-yellow-400">CoinGecko</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
