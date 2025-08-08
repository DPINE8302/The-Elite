import { useGameContext } from "@/context/game-context";
import { Card, CardContent } from "@/components/ui/card";

export default function Portfolio() {
  const { state, calculatePortfolioValue, calculateDailyChange } = useGameContext();

  const portfolioValue = calculatePortfolioValue();
  const dailyChange = calculateDailyChange();
  const liquidCash = parseFloat(state.player?.liquidCash || "0");
  const totalValue = portfolioValue + liquidCash;

  const formatCurrency = (amount: number) => {
    if (amount >= 1e9) {
      return `$${(amount / 1e9).toFixed(1)}B`;
    }
    if (amount >= 1e6) {
      return `$${(amount / 1e6).toFixed(1)}M`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const formatPercent = (percent: number) => {
    const sign = percent >= 0 ? "+" : "";
    return `${sign}${percent.toFixed(2)}%`;
  };

  const calculatePnL = (holding: any) => {
    const currentValue = holding.shares * parseFloat(holding.currentPrice);
    const costBasis = holding.shares * parseFloat(holding.avgCostBasis);
    return currentValue - costBasis;
  };

  // Asset allocation calculations
  const publicEquitiesValue = portfolioValue;
  const publicEquitiesPercent = totalValue > 0 ? (publicEquitiesValue / totalValue) * 100 : 0;
  const cashPercent = totalValue > 0 ? (liquidCash / totalValue) * 100 : 0;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Portfolio Overview</h1>
        <div className="text-right">
          <p className="text-2xl font-bold font-mono">{formatCurrency(totalValue)}</p>
          <p className={`${dailyChange.amount >= 0 ? 'text-elite-green' : 'text-elite-red'}`}>
            {dailyChange.amount >= 0 ? '+' : ''}{formatCurrency(dailyChange.amount)} ({formatPercent(dailyChange.percentage)})
          </p>
        </div>
      </div>

      {/* Portfolio Allocation */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card className="bg-elite-slate-800/50 backdrop-blur-sm border-elite-slate-700">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Holdings</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-elite-slate-600">
                      <th className="pb-3 text-elite-slate-400">Position</th>
                      <th className="pb-3 text-elite-slate-400 text-right">Shares</th>
                      <th className="pb-3 text-elite-slate-400 text-right">Avg Cost</th>
                      <th className="pb-3 text-elite-slate-400 text-right">Current</th>
                      <th className="pb-3 text-elite-slate-400 text-right">Value</th>
                      <th className="pb-3 text-elite-slate-400 text-right">P&L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.portfolio.map((holding) => {
                      const currentValue = holding.shares * parseFloat(holding.currentPrice);
                      const pnl = calculatePnL(holding);
                      return (
                        <tr key={holding.id} className="border-b border-elite-slate-700/50">
                          <td className="py-3">
                            <div>
                              <p className="font-semibold text-elite-blue">{holding.symbol}</p>
                              <p className="text-xs text-elite-slate-400">{holding.companyName}</p>
                            </div>
                          </td>
                          <td className="py-3 text-right font-mono">{holding.shares.toLocaleString()}</td>
                          <td className="py-3 text-right font-mono">${parseFloat(holding.avgCostBasis).toFixed(2)}</td>
                          <td className="py-3 text-right font-mono">${parseFloat(holding.currentPrice).toFixed(2)}</td>
                          <td className="py-3 text-right font-mono">{formatCurrency(currentValue)}</td>
                          <td className={`py-3 text-right font-semibold ${pnl >= 0 ? 'text-elite-green' : 'text-elite-red'}`}>
                            {pnl >= 0 ? '+' : ''}{formatCurrency(pnl)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-elite-slate-800/50 backdrop-blur-sm border-elite-slate-700">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Asset Allocation</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-elite-slate-400">Public Equities</span>
                  <span className="font-semibold">{publicEquitiesPercent.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-elite-slate-700 rounded-full h-2">
                  <div 
                    className="bg-elite-blue h-2 rounded-full" 
                    style={{ width: `${Math.min(publicEquitiesPercent, 100)}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-elite-slate-400">Cash & Equivalents</span>
                  <span className="font-semibold">{cashPercent.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-elite-slate-700 rounded-full h-2">
                  <div 
                    className="bg-elite-green h-2 rounded-full" 
                    style={{ width: `${Math.min(cashPercent, 100)}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-elite-slate-400">Private Equity</span>
                  <span className="font-semibold">0%</span>
                </div>
                <div className="w-full bg-elite-slate-700 rounded-full h-2">
                  <div className="bg-elite-purple h-2 rounded-full w-0"></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-elite-slate-400">Alternative Assets</span>
                  <span className="font-semibold">0%</span>
                </div>
                <div className="w-full bg-elite-slate-700 rounded-full h-2">
                  <div className="bg-elite-amber h-2 rounded-full w-0"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-elite-slate-800/50 backdrop-blur-sm border-elite-slate-700">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Performance</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-elite-slate-400">1 Day</span>
                  <span className={`font-semibold ${dailyChange.percentage >= 0 ? 'text-elite-green' : 'text-elite-red'}`}>
                    {formatPercent(dailyChange.percentage)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-elite-slate-400">1 Week</span>
                  <span className="text-elite-green font-semibold">+1.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-elite-slate-400">1 Month</span>
                  <span className="text-elite-green font-semibold">+2.3%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-elite-slate-400">YTD</span>
                  <span className="text-elite-red font-semibold">-1.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-elite-slate-400">Since Inception</span>
                  <span className="text-elite-green font-semibold">+8.7%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
