import { useGameContext } from "@/context/game-context";
import { Card, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  const { state, calculatePortfolioValue, calculateDailyChange } = useGameContext();

  const portfolioValue = calculatePortfolioValue();
  const dailyChange = calculateDailyChange();
  const liquidCash = parseFloat(state.player?.liquidCash || "0");
  const burnRate = parseFloat(state.player?.dailyBurnRate || "0");

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

  return (
    <div className="p-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Command Dashboard</h1>
          <p className="text-elite-slate-400">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })} - {new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              timeZoneName: "short",
            })}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-elite-green">
            <div className="w-2 h-2 bg-elite-green rounded-full animate-pulse"></div>
            <span className="text-sm">Markets Open</span>
          </div>
          <div className="flex items-center space-x-2 text-elite-blue">
            <i className="fas fa-wifi"></i>
            <span className="text-sm">Live Data</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-elite-slate-800/50 backdrop-blur-sm border-elite-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-elite-slate-400">Net Worth</h3>
              <i className="fas fa-chart-line text-elite-blue"></i>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-elite-slate-100 font-mono">
                {formatCurrency(portfolioValue + liquidCash)}
              </p>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-semibold ${dailyChange.amount >= 0 ? 'text-elite-green' : 'text-elite-red'}`}>
                  {dailyChange.amount >= 0 ? '+' : ''}{formatCurrency(dailyChange.amount)}
                </span>
                <span className={`text-xs ${dailyChange.percentage >= 0 ? 'text-elite-green' : 'text-elite-red'}`}>
                  {formatPercent(dailyChange.percentage)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-elite-slate-800/50 backdrop-blur-sm border-elite-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-elite-slate-400">Liquid Cash</h3>
              <i className="fas fa-dollar-sign text-elite-green"></i>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-elite-slate-100 font-mono">
                {formatCurrency(liquidCash)}
              </p>
              <p className="text-elite-slate-400 text-xs">Available for deployment</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-elite-slate-800/50 backdrop-blur-sm border-elite-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-elite-slate-400">Daily Burn Rate</h3>
              <i className="fas fa-fire text-elite-amber"></i>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-elite-slate-100 font-mono">
                {formatCurrency(burnRate)}
              </p>
              <p className="text-elite-slate-400 text-xs">Operating expenses</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-elite-slate-800/50 backdrop-blur-sm border-elite-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-elite-slate-400">Threat Level</h3>
              <i className="fas fa-shield-alt text-yellow-500"></i>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-yellow-500 font-mono">
                {state.player?.threatLevel || "MEDIUM"}
              </p>
              <p className="text-elite-slate-400 text-xs">
                {state.crises.length} active concern{state.crises.length !== 1 ? 's' : ''}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Overview */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <Card className="bg-elite-slate-800/50 backdrop-blur-sm border-elite-slate-700">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <i className="fas fa-chart-area text-elite-blue mr-2"></i>
              Portfolio Performance
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-elite-slate-400">Today</span>
                <span className={`font-semibold ${dailyChange.percentage >= 0 ? 'text-elite-green' : 'text-elite-red'}`}>
                  {formatPercent(dailyChange.percentage)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-elite-slate-400">This Month</span>
                <span className="text-elite-green font-semibold">+2.3%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-elite-slate-400">YTD</span>
                <span className="text-elite-red font-semibold">-1.2%</span>
              </div>
              <div className="w-full bg-elite-slate-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-elite-green to-elite-blue h-2 rounded-full w-3/4"></div>
              </div>
              <p className="text-xs text-elite-slate-400">Performance vs S&P 500</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-elite-slate-800/50 backdrop-blur-sm border-elite-slate-700">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <i className="fas fa-globe text-elite-green mr-2"></i>
              Market Indices
            </h3>
            <div className="space-y-3">
              {[
                { name: "S&P 500", value: "4,621.45", change: "+0.32%", positive: true },
                { name: "NASDAQ", value: "14,421.23", change: "-0.18%", positive: false },
                { name: "Gold", value: "$2,048.30", change: "+0.75%", positive: true },
                { name: "Bitcoin", value: "$42,156.78", change: "+2.1%", positive: true },
              ].map((index) => (
                <div key={index.name} className="flex items-center justify-between">
                  <span className="text-elite-slate-300">{index.name}</span>
                  <div className="text-right">
                    <p className="font-mono text-sm">{index.value}</p>
                    <p className={`text-xs ${index.positive ? 'text-elite-green' : 'text-elite-red'}`}>
                      {index.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card className="bg-elite-slate-800/50 backdrop-blur-sm border-elite-slate-700">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <i className="fas fa-bell text-elite-amber mr-2"></i>
            Recent Activity & Alerts
          </h3>
          <div className="space-y-4">
            {state.portfolio.slice(0, 3).map((holding, index) => (
              <div key={holding.id} className="flex items-start space-x-3 p-3 rounded-lg bg-elite-slate-700/30">
                <div className="w-2 h-2 bg-elite-green rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-elite-slate-300">
                    Portfolio updated: {holding.symbol} position worth {formatCurrency(holding.shares * parseFloat(holding.currentPrice))}
                  </p>
                  <p className="text-xs text-elite-slate-500">
                    {index * 15} minutes ago
                  </p>
                </div>
              </div>
            ))}
            
            {state.crises.slice(0, 2).map((crisis) => (
              <div key={crisis.id} className="flex items-start space-x-3 p-3 rounded-lg bg-elite-slate-700/30">
                <div className="w-2 h-2 bg-elite-amber rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-elite-slate-300">{crisis.title} - Requires immediate attention</p>
                  <p className="text-xs text-elite-slate-500">
                    {crisis.timeRemaining || 0} hours remaining
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
