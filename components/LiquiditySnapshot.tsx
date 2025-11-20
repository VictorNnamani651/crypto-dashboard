"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  DollarSign,
  PieChart,
  Droplet,
  RefreshCcw,
} from "lucide-react";
import type { GlobalData } from "@/types/crypto";
import { fetchGlobalData } from "@/utils/api";

interface LiquiditySnapshotProps {
  globalData: GlobalData;
}

export default function LiquiditySnapshot({
  globalData: initialData,
}: LiquiditySnapshotProps) {
  const [data, setData] = useState<GlobalData>(initialData);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const refreshGlobal = async () => {
      try {
        setIsUpdating(true);
        const freshData = await fetchGlobalData();
        if (freshData) {
          setData(freshData);
        }
      } catch (error) {
        console.error("Failed to refresh global data", error);
      } finally {
        setTimeout(() => setIsUpdating(false), 1000);
      }
    };

    // Refresh global market data every 60 seconds
    const intervalId = setInterval(refreshGlobal, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toFixed(2)}`;
  };

  const volumeRatio = (
    (data.volume_24h_usd / data.market_cap_usd) *
    100
  ).toFixed(2);
  const marketCapChange = data.market_cap_change_24h;
  const volumeChange = data.volume_24h_change_24h;

  return (
    <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-xl p-6 relative group hover:border-amber-500/30 transition-colors duration-300">
      {/* Update Indicator */}
      <div
        className={`absolute top-6 right-6 transition-opacity duration-500 ${
          isUpdating ? "opacity-100" : "opacity-0"
        }`}
      >
        <RefreshCcw className="w-4 h-4 text-amber-500 animate-spin" />
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-6 h-6 text-amber-400" />
        <h2 className="text-2xl font-bold text-neutral-100">
          Liquidity Snapshot
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-400" />
            <p className="text-neutral-500 text-sm">Total Market Cap</p>
          </div>
          <p className="text-2xl font-bold text-neutral-100">
            {formatNumber(data.market_cap_usd)}
          </p>
          <p
            className={`text-sm font-semibold ${
              marketCapChange >= 0 ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {marketCapChange >= 0 ? "+" : ""}
            {marketCapChange.toFixed(2)}% (24h)
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-400" />
            <p className="text-neutral-500 text-sm">24h Volume</p>
          </div>
          <p className="text-2xl font-bold text-neutral-100">
            {formatNumber(data.volume_24h_usd)}
          </p>
          <p className="text-sm text-neutral-500">{volumeRatio}% of cap</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-amber-500" />
            <p className="text-neutral-500 text-sm">BTC Dominance</p>
          </div>
          <p className="text-2xl font-bold text-neutral-100">
            {data.bitcoin_dominance_percentage.toFixed(2)}%
          </p>
          <p className="text-sm text-neutral-500">Market leader</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Droplet className="w-5 h-5 text-amber-300" />
            <p className="text-neutral-500 text-sm">Market Activity</p>
          </div>
          <p className="text-2xl font-bold text-neutral-100">
            {data.cryptocurrencies_number.toLocaleString()}
          </p>
          <p className="text-sm text-neutral-500">Active coins</p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-neutral-800">
        <div className="flex justify-between items-center text-sm">
          <span className="text-neutral-500">Volume/Market Cap Ratio</span>
          <span className="text-neutral-200 font-semibold">{volumeRatio}%</span>
        </div>
        <div className="flex justify-between items-center text-sm mt-2">
          <span className="text-neutral-500">Volume Change (24h)</span>
          <span
            className={`font-semibold ${
              volumeChange >= 0 ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {volumeChange >= 0 ? "+" : ""}
            {volumeChange.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
}
