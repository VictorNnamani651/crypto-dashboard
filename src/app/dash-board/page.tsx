"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Loader2,
  AlertCircle,
  RefreshCw,
  PieChart,
  Wallet,
} from "lucide-react";
import Header from "@/components/Header";
import CryptoCard from "@/components/CryptoCard";
import LiquiditySnapshot from "@/components/LiquiditySnapshot";
import type { CryptoData, GlobalData } from "@/types/crypto";
import { fetchCryptoData, fetchGlobalData } from "@/utils/api";

export default function DashBoard() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [globalData, setGlobalData] = useState<GlobalData | null>(null);

  // UI States
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Data fetching logic extracted for reusability (Retry/Refresh)
  const loadDashboardData = useCallback(async (isRefresh = false) => {
    try {
      setError(null);
      if (isRefresh) setIsRefreshing(true);
      else setLoading(true);

      const [cryptoJson, globalJson] = await Promise.all([
        fetchCryptoData(),
        fetchGlobalData(),
      ]);

      setCryptoData(cryptoJson);
      setGlobalData(globalJson);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load market data."
      );
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // --- Derived Data Calculations ---

  // Calculate Total Stablecoin Market Cap (USDT, USDC, DAI, FDUSD, etc.)
  // We assume the API returns at least the top 20-50 coins.
  const stableCoinIds = [
    "tether",
    "usd-coin",
    "dai",
    "first-digital-usd",
    "ethena-usde",
  ];
  const stablecoinMarketCap = cryptoData
    .filter((c) => stableCoinIds.includes(c.id))
    .reduce((acc, curr) => acc + curr.quotes.USD.market_cap, 0);

  // Format helper
  const formatCap = (num: number) =>
    num >= 1e9 ? `$${(num / 1e9).toFixed(2)}B` : `$${(num / 1e6).toFixed(2)}M`;

  // --- Render States ---

  if (loading)
    return (
      <div className="min-h-screen bg-linear-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
        <p className="text-neutral-400 font-medium animate-pulse">
          Syncing market data...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-linear-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl max-w-md space-y-4">
          <div className="flex justify-center">
            <AlertCircle className="w-12 h-12 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-red-400">
            Unable to Load Dashboard
          </h2>
          <p className="text-neutral-400 text-sm">{error}</p>
          <button
            onClick={() => loadDashboardData()}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <Header />

        {/* Control Bar: Refresh & Status */}
        <div className="flex justify-end">
          <button
            onClick={() => loadDashboardData(true)}
            disabled={isRefreshing}
            className="flex items-center gap-2 text-xs font-medium text-neutral-500 hover:text-amber-400 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>

        {/* Highlights: BTC Dominance & Stablecoins (Added per request) */}
        {globalData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* BTC Dominance Card */}
            <div className="col-span-2 md:col-span-2 bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <PieChart className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-neutral-400 uppercase font-bold tracking-wider">
                    BTC Dominance
                  </p>
                  <p className="text-lg font-bold text-neutral-100">
                    {globalData.bitcoin_dominance_percentage.toFixed(2)}%
                  </p>
                </div>
              </div>
              <div className="h-1 w-16 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500"
                  style={{
                    width: `${globalData.bitcoin_dominance_percentage}%`,
                  }}
                />
              </div>
            </div>

            {/* Stablecoin Totals Card */}
            <div className="col-span-2 md:col-span-2 bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Wallet className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-neutral-400 uppercase font-bold tracking-wider">
                  Stablecoin Cap
                </p>
                <p className="text-lg font-bold text-neutral-100">
                  {formatCap(stablecoinMarketCap)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Top Assets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cryptoData
            .filter((c) => ["bitcoin", "ethereum", "solana"].includes(c.id))
            .map((crypto) => (
              <CryptoCard key={crypto.id} crypto={crypto} />
            ))}
        </div>

        {/* Global Snapshot */}
        {globalData && <LiquiditySnapshot globalData={globalData} />}

        {/* Footer */}
        <div className="pt-8 pb-4 border-t border-neutral-800/50 text-center">
          <p className="text-neutral-600 text-xs">
            Market data provided by CoinGecko • Auto-refresh enabled
          </p>
        </div>
      </div>
    </div>
  );
}
