import type { CryptoData, GlobalData } from "@/types/crypto";

// Helper to handle relative URLs in server vs client context if needed,
// but for client-side fetching (useEffect), relative paths work fine.

export async function fetchGlobalData(): Promise<GlobalData | null> {
  try {
    // UPDATED: Fetch from your INTERNAL server route
    const res = await fetch("/api/global");
    if (!res.ok) throw new Error("Global fetch failed");

    // The server now returns the clean GlobalData object, so we just return it
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function fetchCryptoData(): Promise<CryptoData[]> {
  try {
    // UPDATED: Fetch from your INTERNAL server route
    const res = await fetch("/api/crypto");
    if (!res.ok) throw new Error("Crypto fetch failed");

    // The server now returns the clean CryptoData[] array
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
