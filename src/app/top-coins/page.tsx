"use client";

import { useEffect, useState } from "react";
import { Search, Loader2, X, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import CoinsTable from "@/components/CoinsTable";
import { CryptoData } from "@/types/crypto";
import { fetchCryptoData } from "@/utils/api";
import LoadingSpinner from "@/components/Loading";
import ErrorFallback from "@/components/ErrorFallback";

export default function TopCoinsPage() {
  const [coins, setCoins] = useState<CryptoData[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCoins = async () => {
    try {
      setLoading(true);
      setError(null);
      // Use the utility function which hits /api/crypto
      const data = await fetchCryptoData();

      if (!data || data.length === 0) {
        throw new Error("No coin data available");
      }

      setCoins(data);
    } catch (error) {
      console.error("Failed to fetch coins", error);
      setError("Failed to load cryptocurrency data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoins();
  }, []);

  // Filter logic
  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  // --- Render: Loading State ---
  if (loading) {
    return (
      <>
        <Header />
        <LoadingSpinner message="Loading market leaders..." fullScreen />
      </>
    );
  }
  // --- Render: Error State ---
  if (error) {
    return (
      <>
        <Header />
        <ErrorFallback message={error} onRetry={loadCoins} fullScreen />
      </>
    );
  }
  return (
    <>
      <Header />
      <div className="min-h-screen bg-linear-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-neutral-100 via-amber-200 to-amber-500 w-fit">
                Market Leaders
              </h2>
              <p className="text-neutral-500 text-sm md:text-base">
                Real-time ranking of the top cryptocurrencies by market
                capitalization.
              </p>
            </div>

            {/* Stylized Search Input */}
            <div className="relative w-full md:max-w-sm group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-neutral-500 group-focus-within:text-amber-400 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search coins..."
                className="w-full pl-11 pr-10 py-3 rounded-xl bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 text-neutral-200 placeholder-neutral-600 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all shadow-lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {/* Clear Button */}
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-amber-400 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Render Table or Empty State */}
          <div className="min-h-[400px]">
            {filteredCoins.length > 0 ? (
              <CoinsTable coins={filteredCoins} />
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-neutral-900/30 rounded-xl border border-neutral-800 border-dashed animate-in fade-in duration-300">
                <Search className="w-12 h-12 text-neutral-700 mb-4" />
                <p className="text-neutral-500 text-lg">
                  No coins found matching "
                  <span className="text-neutral-300">{search}</span>"
                </p>
                <button
                  onClick={() => setSearch("")}
                  className="mt-4 text-amber-400 hover:text-amber-300 font-medium text-sm underline underline-offset-4 decoration-amber-500/30 hover:decoration-amber-500 transition-all"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-neutral-600 text-xs py-8 border-t border-neutral-900/50 mt-8">
          <p>Data updates every minute • Powered by CoinGecko API</p>
        </div>
      </div>
    </>
  );
}
