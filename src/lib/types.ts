export interface Analysis {
  asset: string;
  timeframe: string;
  trend: "bullish" | "bearish" | "neutral";
  summary: string;
  signals: {
    entry: string;
    stopLoss: string;
    takeProfit1: string;
    takeProfit2: string;
  };
  technicalAnalysis: {
    rsi: string;
    macd: string;
    trend: string;
    support: string[];
    resistance: string[];
    patterns: string[];
  };
  riskManagement: {
    riskReward: string;
    positionSize: string;
    riskLevel: "Low" | "Medium" | "High";
    confidence: number;
  };
  scenarios: Array<{
    type: "bullish" | "bearish" | "neutral";
    probability: number;
    description: string;
  }>;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: number;
  marketCap?: number;
  sparkline?: number[];
}

export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  alert?: {
    type: "above" | "below";
    price: number;
  };
}

export interface Alert {
  id: string;
  symbol: string;
  type: "price" | "percent" | "indicator";
  condition: "above" | "below" | "crosses";
  value: number;
  triggered: boolean;
  createdAt: Date;
}

export interface PortfolioPosition {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  pnl: number;
  pnlPercent: number;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  sentiment: "bullish" | "bearish" | "neutral";
  impact: "high" | "medium" | "low";
  url?: string;
}

export interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

export interface ChartAnalysis {
  trend: "bullish" | "bearish" | "neutral";
  strength: number;
  signals: string[];
  support: number[];
  resistance: number[];
  patterns: string[];
}

export interface EconomicEvent {
  id: string;
  title: string;
  country: string;
  time: string;
  impact: "high" | "medium" | "low";
  actual?: string;
  forecast?: string;
  previous?: string;
}
