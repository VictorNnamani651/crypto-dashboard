"use client";

import { useState } from "react";
import { CryptoData } from "@/types/crypto";

interface TableProps {
  coins: CryptoData[];
}

export default function CoinsTable({ coins }: TableProps) {
  const [sortBy, setSortBy] = useState<string>("market_cap");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const sortedCoins = [...coins].sort((a, b) => {
    const valA = a.quotes.USD[sortBy as keyof typeof a.quotes.USD];
    const valB = b.quotes.USD[sortBy as keyof typeof b.quotes.USD];

    return sortOrder === "asc" ? valA - valB : valB - valA;
  });

  const handleSort = (key: string) => {
    if (key === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("desc");
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-800 shadow-xl shadow-black/40">
      <table className="w-full text-left">
        <thead className="bg-slate-700/40 backdrop-blur">
          <tr>
            <th
              className="p-4 cursor-pointer"
              onClick={() => handleSort("market_cap")}
            >
              Market Cap{" "}
              {sortBy === "market_cap" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>

            <th className="p-4">Coin</th>

            <th
              className="p-4 cursor-pointer"
              onClick={() => handleSort("price")}
            >
              Price{" "}
              {sortBy === "price" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>

            <th
              className="p-4 cursor-pointer"
              onClick={() => handleSort("volume_24h")}
            >
              24h Volume{" "}
              {sortBy === "volume_24h" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>

            <th
              className="p-4 cursor-pointer"
              onClick={() => handleSort("percent_change_24h")}
            >
              24h Change{" "}
              {sortBy === "percent_change_24h"
                ? sortOrder === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </th>
          </tr>
        </thead>

        <tbody>
          {sortedCoins.map((coin) => (
            <tr
              key={coin.id}
              className="border-b border-slate-700 hover:bg-slate-700/50 hover:shadow-md hover:shadow-yellow-400/10 transition"
            >
              <td className="p-4">
                ${coin.quotes.USD.market_cap.toLocaleString()}
              </td>

              <td className="p-4 flex items-center gap-3">
                <span className="font-semibold">{coin.name}</span>
                <span className="uppercase text-slate-400 text-sm">
                  {coin.symbol}
                </span>
              </td>

              <td className="p-4">${coin.quotes.USD.price.toLocaleString()}</td>

              <td className="p-4">
                ${coin.quotes.USD.volume_24h.toLocaleString()}
              </td>

              <td
                className={`p-4 font-semibold ${
                  coin.quotes.USD.percent_change_24h >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {coin.quotes.USD.percent_change_24h.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
