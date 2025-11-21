"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Wallet,
  ArrowRight,
} from "lucide-react";
import { fetchGlobalData } from "@/utils/api"; // <-- import existing API util

interface QuickStat {
  title: string;
  value: string;
  icon: React.ElementType;
  className: string;
}

export default function HomePage() {
  const [stats, setStats] = useState<QuickStat[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const globalData = await fetchGlobalData();

        setStats([
          {
            title: "Total Market Cap",
            value: `$${(globalData.market_cap_usd / 1e12).toFixed(2)}T`,
            icon: DollarSign,
            className: "bg-amber-500/10 text-amber-400",
          },
          {
            title: "24h Volume",
            value: `$${(globalData.volume_24h_usd / 1e9).toFixed(1)}B`,
            icon: TrendingUp,
            className: "bg-neutral-800 text-neutral-400",
          },
          {
            title: "Active Coins",
            value: `${globalData.cryptocurrencies_number.toLocaleString()}+`,
            icon: BarChart3,
            className: "bg-amber-500/10 text-amber-400",
          },
        ]);
      } catch (error) {
        console.error("Error fetching global data:", error);
      }
    }

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex flex-col">
      <Header />
      <main className="grow flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
        {/* Background decorative blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl -z-10" />

        <div className="max-w-5xl mx-auto text-center space-y-10">
          {/* Hero Section */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-amber-400 text-xs font-medium uppercase tracking-wider mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              Live Market Data
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-neutral-100 via-amber-200 to-amber-500 leading-[1.1]">
              Your Golden Ledger
            </h1>

            <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              Track liquidity and market moves in a sleek, high‑contrast
              dashboard.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Link
              href="/dash-board"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-lg font-bold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:-translate-y-1"
            >
              <Wallet className="w-5 h-5" />
              Launch Dashboard
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 w-full max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="group p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 backdrop-blur-sm hover:bg-neutral-900/60 hover:border-amber-500/30 transition-all duration-300 text-left"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-neutral-500 font-medium text-sm">
                    {stat.title}
                  </span>
                  <div className={`p-2 rounded-lg ${stat.className}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-neutral-100 group-hover:text-amber-100 transition-colors">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-800/50 bg-neutral-950/50 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-500 text-sm">
            &copy; {new Date().getFullYear()} CryptoDash. Built with Next.js &
            Tailwind.
          </p>
          <div className="flex gap-6 text-sm font-medium text-neutral-400">
            <Link href="#" className="hover:text-amber-400 transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-amber-400 transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-amber-400 transition-colors">
              API
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
