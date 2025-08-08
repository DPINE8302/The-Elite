import { useGameContext } from "@/context/game-context";
import { Card, CardContent } from "@/components/ui/card";

export default function Rivals() {
  const { state } = useGameContext();

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(1)}B`;
    }
    if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(1)}M`;
    }
    return `$${num.toLocaleString()}`;
  };

  const getThreatColor = (level: string) => {
    switch (level.toUpperCase()) {
      case "HIGH":
        return "text-elite-red";
      case "MEDIUM":
        return "text-elite-amber";
      case "LOW":
        return "text-elite-green";
      default:
        return "text-elite-slate-400";
    }
  };

  const getRivalryColor = (score: number) => {
    if (score >= 80) return "text-elite-red";
    if (score >= 60) return "text-elite-amber";
    return "text-elite-green";
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("");
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return "Just now";
    if (hours === 1) return "1 hour ago";
    return `${hours} hours ago`;
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Rivals Monitor</h1>

      {/* Rivals Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {state.rivals.map((rival) => (
          <Card key={rival.id} className="bg-elite-slate-800/50 backdrop-blur-sm border-elite-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-elite-red to-red-700 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{getInitials(rival.name)}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{rival.name}</h3>
                    <p className="text-elite-slate-400 text-sm">{rival.archetype}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold">{formatCurrency(rival.netWorth)}</p>
                  <p className="text-elite-red text-sm">-2.1%</p>
                </div>
              </div>

              {rival.recentActivity && (
                <div className="space-y-3 mb-4">
                  <div className="bg-elite-slate-700/30 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <i className="fas fa-exclamation-triangle text-elite-amber"></i>
                      <span className="text-sm font-semibold">Recent Activity</span>
                    </div>
                    <p className="text-xs text-elite-slate-400">{rival.recentActivity}</p>
                    <p className="text-xs text-elite-slate-500">
                      {getTimeAgo(rival.activityTimestamp)}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-elite-slate-400">Threat Level</p>
                  <p className={`font-semibold ${getThreatColor(rival.threatLevel)}`}>
                    {rival.threatLevel}
                  </p>
                </div>
                <div>
                  <p className="text-elite-slate-400">Rivalry Score</p>
                  <p className={`font-semibold ${getRivalryColor(rival.rivalryScore)}`}>
                    {rival.rivalryScore}/100
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add more rivals placeholder */}
        <Card className="bg-elite-slate-800/50 backdrop-blur-sm border-elite-slate-700 border-dashed">
          <CardContent className="p-6 flex items-center justify-center h-full">
            <div className="text-center">
              <i className="fas fa-plus text-4xl text-elite-slate-600 mb-4"></i>
              <p className="text-elite-slate-400">More rivals will emerge as your empire grows</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rivalry Intelligence */}
      <Card className="bg-elite-slate-800/50 backdrop-blur-sm border-elite-slate-700 mt-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <i className="fas fa-brain text-elite-purple mr-2"></i>
            Rivalry Intelligence
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-elite-blue">87</p>
              <p className="text-sm text-elite-slate-400">Average Threat Score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-elite-amber">3</p>
              <p className="text-sm text-elite-slate-400">Active Conflicts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-elite-green">12</p>
              <p className="text-sm text-elite-slate-400">Intelligence Reports</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
