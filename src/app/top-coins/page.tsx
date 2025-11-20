"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import CoinsTable from "@/components/CoinsTable";
import { CryptoData } from "@/types/crypto";

export default function TopCoinsPage() {
  const [coins, setCoins] = useState<CryptoData[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoins = async () => {
      const res = await fetch("/api/crypto");
      const data = await res.json();
      setCoins(data);
      setLoading(false);
    };

    fetchCoins();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading top coins...</div>
      </div>
    );

  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white">
      <div className="max-w-7xl mx-auto space-y-10">
        <Header />

        <h2 className="text-4xl font-bold text-yellow-400">Top 20 Coins</h2>

        <input
          type="text"
          placeholder="Search coin..."
          className="w-full p-4 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:border-yellow-400 focus:ring-yellow-400 focus:outline-none transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <CoinsTable coins={filteredCoins} />
      </div>
      {/* Footer */}
      <div className="text-center text-slate-500 text-sm pt-4">
        <p>Data updates every minute • Powered by CoinGecko API</p>
      </div>
    </div>
  );
}
