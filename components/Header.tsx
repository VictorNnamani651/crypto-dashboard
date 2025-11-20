"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `px-4 py-2 rounded-md transition ${
      pathname === path
        ? "text-yellow-400 font-semibold"
        : "text-slate-300 hover:text-yellow-400"
    }`;

  return (
    <header className="flex justify-between items-center py-4">
      <h1 className="text-3xl font-bold text-yellow-400 tracking-wide">
        Rhein Gold Dashboard
      </h1>

      <nav className="flex gap-4">
        <Link href="/" className={linkClass("/")}>
          Home
        </Link>

        <Link href="/top-coins" className={linkClass("/top-coins")}>
          Top Coins
        </Link>
      </nav>
    </header>
  );
}
