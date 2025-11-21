"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Coins,
  LayoutDashboard,
  TrendingUp,
  House,
  Menu,
  X,
} from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Helper to determine active state styles
  const linkClass = (path: string, isMobile = false) => {
    const isActive = pathname === path;
    const base =
      "flex items-center gap-2 font-medium transition-all duration-300";

    // Desktop Styles (Pill shape)
    const desktopStyles = `px-4 py-2 rounded-full text-sm ${
      isActive
        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
        : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800"
    }`;

    // Mobile Styles (Full width block)
    const mobileStyles = `w-full p-4 text-lg border-b border-neutral-800 ${
      isActive
        ? "text-amber-400 bg-neutral-900/50"
        : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/50"
    }`;

    return `${base} ${isMobile ? mobileStyles : desktopStyles}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* --- LOGO --- */}
        <Link href="/" className="flex items-center gap-3 group z-50">
          <div className="w-10 h-10 bg-linear-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all duration-300">
            <Coins className="w-6 h-6 text-neutral-950 fill-neutral-950" />
          </div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-neutral-100 via-amber-200 to-amber-500 tracking-tight">
            CryptoDash
          </h1>
        </Link>

        {/* --- DESKTOP NAVIGATION --- */}
        <nav className="hidden md:flex items-center gap-2 bg-neutral-900/50 p-1.5 rounded-full border border-neutral-800/50">
          <Link href="/" className={linkClass("/")}>
            <House className="w-4 h-4" />
            Home
          </Link>
          <Link href="/dash-board" className={linkClass("/dash-board")}>
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link href="/top-coins" className={linkClass("/top-coins")}>
            <TrendingUp className="w-4 h-4" />
            Top Coins
          </Link>
        </nav>

        {/* --- MOBILE MENU TOGGLE --- */}
        <button
          className="md:hidden p-2 text-neutral-400 hover:text-amber-400 transition-colors z-50"
          onClick={toggleMenu}
        >
          {isMobileMenuOpen ? (
            <X className="w-8 h-8" />
          ) : (
            <Menu className="w-8 h-8" />
          )}
        </button>
      </div>

      {/* --- MOBILE DROPDOWN MENU --- */}
      {/* Conditional rendering with a backdrop blur overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-neutral-950/95 backdrop-blur-xl border-b border-neutral-800 shadow-2xl animate-in slide-in-from-top-5 duration-200">
          <nav className="flex flex-col p-4 space-y-2">
            <Link href="/" className={linkClass("/")}>
              <House className="w-4 h-4" />
              Home
            </Link>
            <Link
              href="/dash-board"
              className={linkClass("/dash-board", true)}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>

            <Link
              href="/top-coins"
              className={linkClass("/top-coins", true)}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <TrendingUp className="w-5 h-5" />
              Top Coins
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
