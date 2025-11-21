"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, RefreshCcw } from "lucide-react";
import type { CryptoData } from "@/types/crypto";
import { fetchCryptoData } from "@/utils/api";

interface CryptoCardProps {
  crypto: CryptoData;
}

export default function CryptoCard({ crypto: initialData }: CryptoCardProps) {
  const [data, setData] = useState<CryptoData>(initialData);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Independent refresh cycle for this specific card
    const refreshCard = async () => {
      try {
        setIsUpdating(true);
        // Fetching fresh data
        const allCrypto = await fetchCryptoData();
        const freshData = allCrypto.find((c) => c.id === initialData.id);

        if (freshData) {
          setData(freshData);
        }
      } catch (error) {
        console.error("Failed to refresh card", error);
      } finally {
        setTimeout(() => setIsUpdating(false), 1000); // Small delay for visual feedback
      }
    };

    // Set interval for 30 seconds (independent of other cards)
    const intervalId = setInterval(refreshCard, 30000);
    return () => clearInterval(intervalId);
  }, [initialData.id]);

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

  const priceChange = data.quotes.USD.percent_change_24h;
  const isPositive = priceChange >= 0;

  return (
    <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-xl p-6 hover:bg-neutral-900/80 hover:border-amber-500/30 transition-all duration-300 hover:scale-105 group relative">
      {/* Optional: Tiny indicator that the card is live/updating */}
      <div
        className={`absolute top-4 right-4 transition-opacity duration-500 ${
          isUpdating ? "opacity-100" : "opacity-0"
        }`}
      >
        <RefreshCcw className="w-3 h-3 text-amber-500 animate-spin" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Gold Gradient Icon */}
          <div className="w-10 h-10 bg-linear-to-br from-amber-300 to-amber-600 rounded-full flex items-center justify-center text-neutral-950 font-bold text-sm shadow-lg shadow-amber-500/10">
            {data.symbol}
          </div>
          <div>
            <h3 className="text-neutral-100 font-bold text-lg group-hover:text-amber-400 transition-colors">
              {data.name}
            </h3>
            <p className="text-neutral-500 text-sm uppercase">{data.symbol}</p>
          </div>
        </div>
        {isPositive ? (
          <TrendingUp className="w-6 h-6 text-emerald-400" />
        ) : (
          <TrendingDown className="w-6 h-6 text-rose-400" />
        )}
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-3xl font-bold text-neutral-100">
            {formatPrice(data.quotes.USD.price)}
          </p>
          <p
            className={`text-sm font-semibold ${
              isPositive ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {isPositive ? "+" : ""}
            {priceChange.toFixed(2)}% (24h)
          </p>
        </div>

        <div className="pt-3 border-t border-neutral-800 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Market Cap</span>
            <span className="text-neutral-200 font-semibold">
              {formatNumber(data.quotes.USD.market_cap)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">24h Volume</span>
            <span className="text-neutral-200 font-semibold">
              {formatNumber(data.quotes.USD.volume_24h)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Rank</span>
            <span className="text-neutral-200 font-semibold">#{data.rank}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
