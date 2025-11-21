"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react";
import { CryptoData } from "@/types/crypto";

interface TableProps {
  coins: CryptoData[];
}

export default function CoinsTable({ coins }: TableProps) {
  const [sortBy, setSortBy] = useState<string>("market_cap");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Refined Sort Logic: Handles both nested Quote numbers and root strings (Name)
  const sortedCoins = [...coins].sort((a, b) => {
    let valA: number | string;
    let valB: number | string;

    if (sortBy === "name") {
      valA = a.name.toLowerCase();
      valB = b.name.toLowerCase();
    } else {
      // Safe access for nested properties
      valA = a.quotes.USD[sortBy as keyof typeof a.quotes.USD] || 0;
      valB = b.quotes.USD[sortBy as keyof typeof b.quotes.USD] || 0;
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key: string) => {
    if (key === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("desc");
    }
  };

  const renderSortIcon = (columnKey: string) => {
    if (sortBy !== columnKey)
      return (
        <ArrowUpDown className="w-4 h-4 opacity-20 group-hover:opacity-50 transition-opacity" />
      );
    return sortOrder === "asc" ? (
      <ChevronUp className="w-4 h-4 text-amber-400" />
    ) : (
      <ChevronDown className="w-4 h-4 text-amber-400" />
    );
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm shadow-2xl shadow-black/20">
      <table className="w-full text-left border-collapse">
        <thead className="bg-neutral-950/50 border-b border-neutral-800 text-xs uppercase tracking-wider text-neutral-500 font-medium">
          <tr>
            <th
              className="p-5 cursor-pointer group hover:bg-neutral-800/30 transition-colors select-none"
              onClick={() => handleSort("market_cap")}
            >
              <div className="flex items-center gap-2">
                Market Cap {renderSortIcon("market_cap")}
              </div>
            </th>

            <th
              className="p-5 cursor-pointer group hover:bg-neutral-800/30 transition-colors select-none"
              onClick={() => handleSort("name")}
            >
              <div className="flex items-center gap-2">
                Coin {renderSortIcon("name")}
              </div>
            </th>

            <th
              className="p-5 cursor-pointer group hover:bg-neutral-800/30 transition-colors select-none"
              onClick={() => handleSort("price")}
            >
              <div className="flex items-center gap-2">
                Price {renderSortIcon("price")}
              </div>
            </th>

            <th
              className="p-5 cursor-pointer group hover:bg-neutral-800/30 transition-colors select-none"
              onClick={() => handleSort("volume_24h")}
            >
              <div className="flex items-center gap-2">
                24h Volume {renderSortIcon("volume_24h")}
              </div>
            </th>

            <th
              className="p-5 cursor-pointer group hover:bg-neutral-800/30 transition-colors select-none"
              onClick={() => handleSort("percent_change_24h")}
            >
              <div className="flex items-center gap-2">
                24h Change {renderSortIcon("percent_change_24h")}
              </div>
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-neutral-800">
          {sortedCoins.map((coin) => (
            <tr
              key={coin.id}
              className="group hover:bg-neutral-800/40 transition-all duration-200"
            >
              <td className="p-5 text-neutral-300 font-medium whitespace-nowrap">
                ${coin.quotes.USD.market_cap.toLocaleString()}
              </td>

              <td className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-neutral-800 to-neutral-700 flex items-center justify-center text-xs font-bold text-amber-500 border border-neutral-700 group-hover:border-amber-500/30 transition-colors shrink-0">
                    {coin.symbol[0]}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-neutral-100 group-hover:text-amber-400 transition-colors">
                      {coin.name}
                    </span>
                    <span className="text-xs text-neutral-500 uppercase">
                      {coin.symbol}
                    </span>
                  </div>
                </div>
              </td>

              <td className="p-5 text-neutral-200 whitespace-nowrap">
                {/* Improved formatting for small decimals */}$
                {coin.quotes.USD.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 6,
                })}
              </td>

              <td className="p-5 text-neutral-400 whitespace-nowrap">
                ${coin.quotes.USD.volume_24h.toLocaleString()}
              </td>

              <td className="p-5 whitespace-nowrap">
                <div
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    coin.quotes.USD.percent_change_24h >= 0
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  }`}
                >
                  {coin.quotes.USD.percent_change_24h >= 0 ? "+" : ""}
                  {coin.quotes.USD.percent_change_24h.toFixed(2)}%
                </div>
              </td>
            </tr>
          ))}

          {/* Fallback for when search has no results but list is passed empty - rarely hit due to parent logic but good safety */}
          {coins.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="p-12 text-center text-neutral-500 italic"
              >
                No market data available to display.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
