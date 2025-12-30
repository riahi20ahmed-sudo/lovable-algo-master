import { useState, useEffect, useCallback } from "react";
import { MarketData } from "./types";

const COINGECKO_API = "https://api.coingecko.com/api/v3";

interface CoinGeckoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  high_24h: number;
  low_24h: number;
  total_volume: number;
  market_cap: number;
  sparkline_in_7d?: { price: number[] };
}

const COIN_IDS = [
  "bitcoin",
  "ethereum",
  "solana",
  "ripple",
  "cardano",
  "avalanche-2",
  "chainlink",
  "polkadot",
  "dogecoin",
  "shiba-inu",
];

const SYMBOL_MAP: Record<string, string> = {
  bitcoin: "BTC/USD",
  ethereum: "ETH/USD",
  solana: "SOL/USD",
  ripple: "XRP/USD",
  cardano: "ADA/USD",
  "avalanche-2": "AVAX/USD",
  chainlink: "LINK/USD",
  polkadot: "DOT/USD",
  dogecoin: "DOGE/USD",
  "shiba-inu": "SHIB/USD",
};

export function useRealTimePrices(refreshInterval = 10000) {
  const [prices, setPrices] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [priceChanges, setPriceChanges] = useState<Record<string, "up" | "down" | null>>({});

  const fetchPrices = useCallback(async () => {
    try {
      const response = await fetch(
        `${COINGECKO_API}/coins/markets?vs_currency=usd&ids=${COIN_IDS.join(",")}&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=24h`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch prices");
      }

      const data: CoinGeckoPrice[] = await response.json();

      const newPrices: MarketData[] = data.map((coin) => ({
        symbol: SYMBOL_MAP[coin.id] || `${coin.symbol.toUpperCase()}/USD`,
        name: coin.name,
        price: coin.current_price,
        change: coin.price_change_24h,
        changePercent: coin.price_change_percentage_24h,
        high24h: coin.high_24h,
        low24h: coin.low_24h,
        volume: coin.total_volume,
        marketCap: coin.market_cap,
        sparkline: coin.sparkline_in_7d?.price,
      }));

      // Track price changes for flash animations
      setPrices((prev) => {
        const changes: Record<string, "up" | "down" | null> = {};
        newPrices.forEach((newPrice) => {
          const oldPrice = prev.find((p) => p.symbol === newPrice.symbol);
          if (oldPrice && oldPrice.price !== newPrice.price) {
            changes[newPrice.symbol] = newPrice.price > oldPrice.price ? "up" : "down";
          }
        });
        setPriceChanges(changes);
        
        // Clear flash after animation
        setTimeout(() => setPriceChanges({}), 500);
        
        return newPrices;
      });

      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      console.error("Error fetching prices:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchPrices, refreshInterval]);

  return { prices, loading, error, lastUpdate, priceChanges, refetch: fetchPrices };
}

// Get base price for a symbol from real-time data
export function getBasePrice(symbol: string, prices: MarketData[]): number {
  const price = prices.find((p) => p.symbol === symbol);
  if (price) return price.price;
  
  // Fallback prices
  if (symbol.includes("BTC")) return 97500;
  if (symbol.includes("ETH")) return 3450;
  if (symbol.includes("SOL")) return 189;
  return 100;
}
