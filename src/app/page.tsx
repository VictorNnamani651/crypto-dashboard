"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import CryptoCard from "@/components/CryptoCard";
// import LiquiditySnapshot from '@/components/LiquiditySnapshot';
import type { CryptoData, GlobalData } from "@/types/crypto";

export default function HomePage() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [globalData, setGlobalData] = useState<GlobalData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const fetchData = async (): Promise<void> => {
    try {
      setError(null);

      // Fetch from our API routes
      const [cryptoResponse, globalResponse] = await Promise.all([
        fetch("/api/crypto"),
        fetch("/api/global"),
      ]);

      if (!cryptoResponse.ok || !globalResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const cryptoJson: CryptoData[] = await cryptoResponse.json();
      const globalJson: GlobalData = await globalResponse.json();

      setCryptoData(cryptoJson);
      setGlobalData(globalJson);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading market data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <Header />

        {/* Market Data Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cryptoData.map((crypto) => (
            <CryptoCard key={crypto.id} crypto={crypto} />
          ))}
        </div>

        {/* Liquidity Snapshot */}
        {/* {globalData && <LiquiditySnapshot globalData={globalData} />} */}

        {/* Footer */}
        <div className="text-center text-slate-500 text-sm">
          <p>Data updates every minute • Powered by CoinPaprika API</p>
        </div>
      </div>
    </div>
  );
}
