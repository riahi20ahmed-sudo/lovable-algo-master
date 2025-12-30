import { Analysis } from "./types";

export function extractAsset(message: string): string {
  const pairs = ["BTC/USD", "ETH/USD", "AAPL", "TSLA", "EUR/USD", "GBP/USD", "SPX", "GOLD", "SOL/USD"];
  const upperMessage = message.toUpperCase();

  for (const pair of pairs) {
    if (upperMessage.includes(pair.replace("/", "")) || upperMessage.includes(pair)) {
      return pair;
    }
  }

  if (upperMessage.includes("BTC") || upperMessage.includes("BITCOIN")) return "BTC/USD";
  if (upperMessage.includes("ETH") || upperMessage.includes("ETHEREUM")) return "ETH/USD";
  if (upperMessage.includes("SOL") || upperMessage.includes("SOLANA")) return "SOL/USD";
  if (upperMessage.includes("APPLE")) return "AAPL";
  if (upperMessage.includes("TESLA")) return "TSLA";
  if (upperMessage.includes("EURO")) return "EUR/USD";
  if (upperMessage.includes("GOLD")) return "XAU/USD";
  if (upperMessage.includes("S&P") || upperMessage.includes("SPX")) return "SPX";

  return "BTC/USD";
}

function formatPrice(price: number, isCrypto: boolean, isForex: boolean): string {
  if (isForex) return price.toFixed(5);
  if (isCrypto) return price > 1000 ? price.toFixed(0) : price.toFixed(2);
  return price.toFixed(2);
}

export function generateMockAnalysis(asset: string, message: string): Analysis {
  const isCrypto = asset.includes("BTC") || asset.includes("ETH") || asset.includes("SOL");
  const isForex = asset.includes("EUR") || asset.includes("GBP");

  const basePrice = isCrypto
    ? asset.includes("BTC")
      ? 97500
      : asset.includes("ETH")
        ? 3450
        : 189
    : isForex
      ? 1.085
      : asset === "AAPL"
        ? 178.5
        : asset === "TSLA"
          ? 248.3
          : 5450;

  const trends = ["bullish", "bearish", "neutral"] as const;
  const trend = trends[Math.floor(Math.random() * 2)];

  const timeframe = message.toLowerCase().includes("daily")
    ? "Daily"
    : message.toLowerCase().includes("weekly")
      ? "Weekly"
      : message.toLowerCase().includes("1h")
        ? "1H"
        : "4H";

  return {
    asset,
    timeframe,
    trend,
    summary:
      trend === "bullish"
        ? `${asset} is showing strong bullish momentum with price action respecting key support levels. Multiple technical indicators are aligning for a potential continuation move. Watch for a break above resistance for confirmation.`
        : trend === "bearish"
          ? `${asset} is displaying bearish characteristics with lower highs forming on the ${timeframe} chart. Momentum indicators suggest selling pressure is increasing. Key support levels should be monitored for potential breakdown.`
          : `${asset} is consolidating in a range on the ${timeframe} timeframe. Wait for a clear breakout direction before taking a position. Both bulls and bears are showing equal strength currently.`,
    signals: {
      entry: formatPrice(basePrice * (trend === "bullish" ? 0.995 : 1.005), isCrypto, isForex),
      stopLoss: formatPrice(basePrice * (trend === "bullish" ? 0.97 : 1.03), isCrypto, isForex),
      takeProfit1: formatPrice(basePrice * (trend === "bullish" ? 1.03 : 0.97), isCrypto, isForex),
      takeProfit2: formatPrice(basePrice * (trend === "bullish" ? 1.06 : 0.94), isCrypto, isForex),
    },
    technicalAnalysis: {
      rsi:
        trend === "bullish"
          ? "58 - Healthy bullish momentum"
          : trend === "bearish"
            ? "42 - Bearish momentum building"
            : "50 - Neutral, awaiting direction",
      macd:
        trend === "bullish"
          ? "Bullish crossover confirmed"
          : trend === "bearish"
            ? "Bearish crossover forming"
            : "Histogram flattening",
      trend:
        trend === "bullish"
          ? "Uptrend with higher highs and higher lows"
          : trend === "bearish"
            ? "Downtrend with lower highs"
            : "Range-bound consolidation",
      support: [
        formatPrice(basePrice * 0.97, isCrypto, isForex),
        formatPrice(basePrice * 0.94, isCrypto, isForex),
        formatPrice(basePrice * 0.9, isCrypto, isForex),
      ],
      resistance: [
        formatPrice(basePrice * 1.03, isCrypto, isForex),
        formatPrice(basePrice * 1.06, isCrypto, isForex),
        formatPrice(basePrice * 1.1, isCrypto, isForex),
      ],
      patterns:
        trend === "bullish"
          ? ["Bull Flag forming", "Higher low structure", "Volume increasing on rallies"]
          : trend === "bearish"
            ? ["Bear Flag forming", "Lower high structure", "Increasing sell volume"]
            : ["Symmetrical triangle", "Range consolidation", "Decreasing volume"],
    },
    riskManagement: {
      riskReward: trend === "neutral" ? "1:1.5" : "1:2.5",
      positionSize: "2% of portfolio",
      riskLevel: trend === "neutral" ? "Medium" : (Math.random() > 0.5 ? "Low" : "Medium"),
      confidence: trend === "neutral" ? 55 : Math.floor(Math.random() * 20) + 70,
    },
    scenarios: [
      {
        type: "bullish",
        probability: trend === "bullish" ? 65 : trend === "bearish" ? 25 : 40,
        description: `Price breaks above ${formatPrice(basePrice * 1.03, isCrypto, isForex)} resistance with strong volume. Target ${formatPrice(basePrice * 1.08, isCrypto, isForex)} with momentum continuation.`,
      },
      {
        type: "bearish",
        probability: trend === "bearish" ? 60 : trend === "bullish" ? 20 : 35,
        description: `Price loses ${formatPrice(basePrice * 0.97, isCrypto, isForex)} support level. Expect acceleration toward ${formatPrice(basePrice * 0.92, isCrypto, isForex)} with increased selling pressure.`,
      },
      {
        type: "neutral",
        probability: trend === "neutral" ? 50 : 15,
        description: `Price continues to consolidate between ${formatPrice(basePrice * 0.97, isCrypto, isForex)} and ${formatPrice(basePrice * 1.03, isCrypto, isForex)}. Wait for clear breakout with volume confirmation.`,
      },
    ],
  };
}
