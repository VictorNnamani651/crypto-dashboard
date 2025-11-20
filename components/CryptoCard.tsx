import { TrendingUp, TrendingDown } from "lucide-react";
import type { CryptoData } from "@/types/crypto";

interface CryptoCardProps {
  crypto: CryptoData;
}

export default function CryptoCard({ crypto }: CryptoCardProps) {
  const formatPrice = (price: number): string => {
    if (price >= 1000) {
      return `$${price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
    return `$${price.toFixed(2)}`;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toFixed(2)}`;
  };

  const priceChange = crypto.quotes.USD.percent_change_24h;
  const isPositive = priceChange >= 0;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {crypto.symbol}
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">{crypto.name}</h3>
            <p className="text-slate-400 text-sm uppercase">{crypto.symbol}</p>
          </div>
        </div>
        {isPositive ? (
          <TrendingUp className="w-6 h-6 text-green-400" />
        ) : (
          <TrendingDown className="w-6 h-6 text-red-400" />
        )}
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-3xl font-bold text-white">
            {formatPrice(crypto.quotes.USD.price)}
          </p>
          <p
            className={`text-sm font-semibold ${
              isPositive ? "text-green-400" : "text-red-400"
            }`}
          >
            {isPositive ? "+" : ""}
            {priceChange.toFixed(2)}% (24h)
          </p>
        </div>

        <div className="pt-3 border-t border-slate-700 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Market Cap</span>
            <span className="text-white font-semibold">
              {formatNumber(crypto.quotes.USD.market_cap)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">24h Volume</span>
            <span className="text-white font-semibold">
              {formatNumber(crypto.quotes.USD.volume_24h)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Rank</span>
            <span className="text-white font-semibold">#{crypto.rank}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
