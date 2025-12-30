import { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { MarketTicker } from "@/components/MarketTicker";
import { QuickStats } from "@/components/QuickStats";
import { ProChart } from "@/components/ProChart";
import { ChartAnalysisPanel } from "@/components/ChartAnalysisPanel";
import { ChatPanel } from "@/components/ChatPanel";
import { AnalysisPanel } from "@/components/AnalysisPanel";
import { WatchlistPanel } from "@/components/WatchlistPanel";
import { AlertsPanel } from "@/components/AlertsPanel";
import { PortfolioPanel } from "@/components/PortfolioPanel";
import { NewsPanel } from "@/components/NewsPanel";
import { LivePricesPanel } from "@/components/LivePricesPanel";
import { FearGreedGauge } from "@/components/FearGreedGauge";
import { Analysis, ChartAnalysis } from "@/lib/types";

type ViewType = "chat" | "analysis" | "strategies" | "chart" | "watchlist" | "alerts" | "portfolio" | "backtest" | "news" | "orderbook" | "heatmap" | "calendar" | "prices";

export default function Index() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeView, setActiveView] = useState<ViewType>("chart");
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState("BTC/USD");
  const [chartAnalysis, setChartAnalysis] = useState<ChartAnalysis | null>(null);

  const handleSymbolSelect = (symbol: string) => {
    setSelectedSymbol(symbol);
    setActiveView("chart");
  };

  const renderContent = () => {
    switch (activeView) {
      case "chart":
        return (
          <div className="flex-1 flex gap-4 p-4 overflow-hidden">
            <ProChart symbol={selectedSymbol} className="flex-[2]" onAnalysisUpdate={setChartAnalysis} />
            <div className="w-80 flex-shrink-0">
              <ChartAnalysisPanel analysis={chartAnalysis} symbol={selectedSymbol} currentPrice={selectedSymbol.includes("BTC") ? 97500 : 3450} />
            </div>
          </div>
        );
      case "watchlist":
        return (
          <div className="flex-1 flex">
            <div className="flex-1 max-w-md border-r border-border"><WatchlistPanel onSelectSymbol={handleSymbolSelect} /></div>
            <div className="flex-1 p-4"><ProChart symbol={selectedSymbol} onAnalysisUpdate={setChartAnalysis} /></div>
          </div>
        );
      case "alerts":
        return (
          <div className="flex-1 flex">
            <div className="flex-1 max-w-md border-r border-border"><AlertsPanel /></div>
            <div className="flex-1 p-4"><ProChart symbol={selectedSymbol} onAnalysisUpdate={setChartAnalysis} /></div>
          </div>
        );
      case "portfolio":
        return (
          <div className="flex-1 flex">
            <div className="flex-1 max-w-lg border-r border-border"><PortfolioPanel /></div>
            <div className="flex-1 p-4"><ProChart symbol={selectedSymbol} onAnalysisUpdate={setChartAnalysis} /></div>
          </div>
        );
      case "news":
        return (
          <div className="flex-1 flex">
            <div className="flex-1 max-w-lg border-r border-border"><NewsPanel /></div>
            <div className="flex-1 flex flex-col gap-4 p-4">
              <FearGreedGauge />
              <div className="flex-1"><ProChart symbol={selectedSymbol} onAnalysisUpdate={setChartAnalysis} /></div>
            </div>
          </div>
        );
      case "prices":
        return (
          <div className="flex-1 flex">
            <div className="flex-1 max-w-md border-r border-border"><LivePricesPanel onSelectSymbol={handleSymbolSelect} /></div>
            <div className="flex-1 p-4"><ProChart symbol={selectedSymbol} onAnalysisUpdate={setChartAnalysis} /></div>
          </div>
        );
      default:
        return (
          <>
            <ChatPanel onAnalysisComplete={(data) => { setAnalysis(data); setActiveView("analysis"); }} isAnalyzing={isAnalyzing} setIsAnalyzing={setIsAnalyzing} isVisible={activeView === "chat"} pendingPrompt={pendingPrompt} clearPendingPrompt={() => setPendingPrompt(null)} />
            <AnalysisPanel analysis={analysis} isAnalyzing={isAnalyzing} isVisible={activeView === "analysis"} />
          </>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden matrix-bg noise-overlay">
      <Header />
      <MarketTicker />
      <QuickStats />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 flex overflow-hidden">{renderContent()}</main>
      </div>
    </div>
  );
}
