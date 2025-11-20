import { Activity, DollarSign, PieChart, Droplet } from "lucide-react";
import type { GlobalData } from "@/types/crypto";

interface LiquiditySnapshotProps {
  globalData: GlobalData;
}

export default function LiquiditySnapshot({
  globalData,
}: LiquiditySnapshotProps) {
  const formatNumber = (num: number): string => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toFixed(2)}`;
  };

  const volumeRatio = (
    (globalData.volume_24h_usd / globalData.market_cap_usd) *
    100
  ).toFixed(2);
  const marketCapChange = globalData.market_cap_change_24h;
  const volumeChange = globalData.volume_24h_change_24h;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-6 h-6 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Liquidity Snapshot</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <p className="text-slate-400 text-sm">Total Market Cap</p>
          </div>
          <p className="text-2xl font-bold text-white">
            {formatNumber(globalData.market_cap_usd)}
          </p>
          <p
            className={`text-sm font-semibold ${
              marketCapChange >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {marketCapChange >= 0 ? "+" : ""}
            {marketCapChange.toFixed(2)}% (24h)
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            <p className="text-slate-400 text-sm">24h Volume</p>
          </div>
          <p className="text-2xl font-bold text-white">
            {formatNumber(globalData.volume_24h_usd)}
          </p>
          <p className="text-sm text-slate-400">{volumeRatio}% of cap</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-orange-400" />
            <p className="text-slate-400 text-sm">BTC Dominance</p>
          </div>
          <p className="text-2xl font-bold text-white">
            {globalData.bitcoin_dominance_percentage.toFixed(2)}%
          </p>
          <p className="text-sm text-slate-400">Market leader</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Droplet className="w-5 h-5 text-cyan-400" />
            <p className="text-slate-400 text-sm">Market Activity</p>
          </div>
          <p className="text-2xl font-bold text-white">
            {globalData.cryptocurrencies_number.toLocaleString()}
          </p>
          <p className="text-sm text-slate-400">Active coins</p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-700">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400">Volume/Market Cap Ratio</span>
          <span className="text-white font-semibold">{volumeRatio}%</span>
        </div>
        <div className="flex justify-between items-center text-sm mt-2">
          <span className="text-slate-400">Volume Change (24h)</span>
          <span
            className={`font-semibold ${
              volumeChange >= 0 ? "text-green-400" : "text-red-400"
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
