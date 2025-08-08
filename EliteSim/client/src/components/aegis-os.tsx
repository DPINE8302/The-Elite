import { useGameContext } from "@/context/game-context";
import Dashboard from "./dashboard";
import Markets from "./markets";
import Portfolio from "./portfolio";
import Rivals from "./rivals";
import Crisis from "./crisis";
import WealthEmpire from "./wealth-empire";

export default function AegisOS() {
  const { state, setCurrentSection } = useGameContext();

  const navItems = [
    { id: "dashboard", label: "Command Dashboard", icon: "fas fa-chart-line" },
    { id: "markets", label: "Capital Markets", icon: "fas fa-chart-bar" },
    { id: "portfolio", label: "Portfolio", icon: "fas fa-wallet" },
    { id: "wealth-empire", label: "Wealth Empire", icon: "fas fa-crown" },
    { id: "rivals", label: "Rivals Monitor", icon: "fas fa-users" },
    { id: "crisis", label: "Crisis Center", icon: "fas fa-exclamation-triangle" },
  ];

  const renderCurrentSection = () => {
    switch (state.currentSection) {
      case "dashboard":
        return <Dashboard />;
      case "markets":
        return <Markets />;
      case "portfolio":
        return <Portfolio />;
      case "wealth-empire":
        return <WealthEmpire playerId={state.player?.id || ""} />;
      case "rivals":
        return <Rivals />;
      case "crisis":
        return <Crisis />;
      default:
        return <Dashboard />;
    }
  };

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(1)}B`;
    }
    if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(1)}M`;
    }
    return `$${num.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-elite-slate-900 text-elite-slate-100">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-elite-slate-800/90 backdrop-blur-sm border-r border-elite-slate-700 z-40">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-elite-gradient rounded-lg flex items-center justify-center">
              <i className="fas fa-crown text-white"></i>
            </div>
            <div>
              <h2 className="font-bold text-lg">AEGIS OS</h2>
              <p className="text-xs text-elite-slate-400">v2.1.0</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentSection(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  state.currentSection === item.id
                    ? "bg-elite-blue/20 text-elite-blue border border-elite-blue/30"
                    : "hover:bg-elite-slate-700/50 text-elite-slate-300"
                }`}
              >
                <i className={`${item.icon} w-5`}></i>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-elite-slate-700/50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold">
                    {state.player?.name?.split(" ").map(n => n[0]).join("") || "JD"}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-sm">{state.player?.name || "John Doe"}</p>
                  <p className="text-xs text-elite-slate-400">
                    {state.player?.archetype?.replace(/([A-Z])/g, " $1").trim() || "The Oracle"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 min-h-screen">
        {renderCurrentSection()}
      </div>
    </div>
  );
}
