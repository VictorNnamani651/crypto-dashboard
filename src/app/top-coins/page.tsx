"use client";

import { useEffect, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import CoinsTable from "@/components/CoinsTable";
import { CryptoData } from "@/types/crypto";

export default function TopCoinsPage() {
  const [coins, setCoins] = useState<CryptoData[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch("/api/crypto");
        const data = await res.json();
        setCoins(data);
      } catch (error) {
        console.error("Failed to fetch coins", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-amber-400 text-xl font-medium">
          <Loader2 className="w-6 h-6 animate-spin" />
          Loading top coins...
        </div>
      </div>
    );

  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-6">
      <div className="max-w-7xl mx-auto space-y-10">
        <Header />

        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 via-amber-200 to-amber-500 w-fit">
            Top 20 Coins
          </h2>

          {/* Stylized Search Input */}
          <div className="relative max-w-md group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-neutral-500 group-focus-within:text-amber-400 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search coin name or symbol..."
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 text-neutral-200 placeholder-neutral-600 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all shadow-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Render Table or Empty State */}
        {filteredCoins.length > 0 ? (
          <CoinsTable coins={filteredCoins} />
        ) : (
          <div className="text-center py-20 bg-neutral-900/30 rounded-xl border border-neutral-800 border-dashed">
            <p className="text-neutral-500 text-lg">
              No coins found matching "{search}"
            </p>
            <button
              onClick={() => setSearch("")}
              className="mt-4 text-amber-400 hover:text-amber-300 font-medium text-sm"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-neutral-600 text-sm pt-12 pb-6">
        <p>Data updates every minute • Powered by CoinGecko API</p>
      </div>
    </div>
  );
}
