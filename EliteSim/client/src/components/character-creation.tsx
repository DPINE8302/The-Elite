import { useState } from "react";
import { useEffect } from "react";
import { useGameContext } from "@/context/game-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CharacterSelections {
  lineage: "old-money" | "new-money" | null;
  archetype: "disruptor" | "oracle" | "conqueror" | "tastemaker" | null;
  crisis: "hostile-takeover" | "scandal" | null;
}

export default function CharacterCreation() {
  const { dispatch } = useGameContext();
  const { toast } = useToast();
  const [selections, setSelections] = useState<CharacterSelections>({
    lineage: null,
    archetype: null,
    crisis: null,
  });
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [savedCampaign, setSavedCampaign] = useState(false);

  useEffect(() => {
    setSavedCampaign(Boolean(localStorage.getItem("the-elite-player-id")));
  }, []);

  const handleSelectionClick = (type: keyof CharacterSelections, value: string) => {
    setSelections(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const isSelectionActive = (type: keyof CharacterSelections, value: string) => {
    return selections[type] === value;
  };

  const canStartSimulation = selections.lineage && selections.archetype && selections.crisis;

  const startSimulation = async () => {
    if (!canStartSimulation) {
      toast({
        title: "Incomplete Selection",
        description: "Please make all required selections before starting the simulation.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const playerData = {
        userId: "local-player",
        name: name.trim() || "Alex Morgan",
        lineage: selections.lineage!,
        archetype: selections.archetype!,
        crisis: selections.crisis,
      };

      const response = await apiRequest("POST", "/api/players", playerData);
      const player = await response.json();

      localStorage.setItem("the-elite-player-id", player.id);

      dispatch({ type: "SET_PLAYER", payload: player });
      dispatch({ type: "SET_GAME_ACTIVE", payload: true });

      // Load initial data
      const [portfolioRes, watchlistRes, crisesRes, rivalsRes] = await Promise.all([
        fetch(`/api/players/${player.id}/portfolio`),
        fetch(`/api/players/${player.id}/watchlist`),
        fetch(`/api/players/${player.id}/crises`),
        fetch("/api/rivals")
      ]);

      if (portfolioRes.ok) {
        const portfolio = await portfolioRes.json();
        dispatch({ type: "SET_PORTFOLIO", payload: portfolio });
      }
      if (!portfolioRes.ok || !watchlistRes.ok || !crisesRes.ok || !rivalsRes.ok) {
        throw new Error("Your campaign started, but some intelligence could not be loaded. Refresh and try again.");
      }

      if (watchlistRes.ok) {
        const watchlist = await watchlistRes.json();
        dispatch({ type: "SET_WATCHLIST", payload: watchlist });
      }

      if (crisesRes.ok) {
        const crises = await crisesRes.json();
        dispatch({ type: "SET_CRISES", payload: crises });
      }

      if (rivalsRes.ok) {
        const rivals = await rivalsRes.json();
        dispatch({ type: "SET_RIVALS", payload: rivals });
      }

      toast({
        title: "Simulation Started",
        description: "Welcome to The Elite. Your empire awaits.",
      });

    } catch (error) {
      toast({
        title: "Failed to Start Simulation",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-elite-slate-900 flex items-center justify-center overflow-y-auto px-4 py-10">
      <div className="max-w-5xl w-full mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-6xl font-bold text-elite-gradient mb-4">THE ELITE</h1>
          <p className="text-xl text-elite-slate-400 mb-2">A Simulation of Consequence</p>
          <p className="text-elite-slate-500">Wealth is a weapon. Power is a cage. Legacy is the only game.</p>
        </div>

        <Card className="bg-elite-slate-800/50 backdrop-blur-sm border-elite-slate-700 animate-slide-up">
          <CardContent className="p-8">
            <label className="mb-7 block max-w-md text-left text-sm font-medium text-elite-slate-300">
              Your name
              <input value={name} onChange={event => setName(event.target.value)} maxLength={40} placeholder="Alex Morgan" className="mt-2 w-full rounded-lg border border-elite-slate-600 bg-elite-slate-900/80 px-4 py-3 text-elite-slate-100 placeholder:text-elite-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </label>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Lineage Selection */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-elite-blue mb-4">Choose Your Lineage</h3>
                
                <div className="space-y-4">
                  <div 
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all bg-elite-slate-800/30 hover:bg-elite-slate-800/60 ${
                      isSelectionActive('lineage', 'old-money') 
                        ? 'border-elite-blue' 
                        : 'border-elite-slate-600 hover:border-elite-blue'
                    }`}
                    onClick={() => handleSelectionClick('lineage', 'old-money')}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-elite-slate-100">Old Money</h4>
                      <span className="text-2xl">🏛️</span>
                    </div>
                    <p className="text-elite-slate-400 text-sm mb-3">The Custodian - $50B inherited fortune</p>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center text-elite-green">
                        <i className="fas fa-plus w-4"></i>
                        <span>High prestige & political access</span>
                      </div>
                      <div className="flex items-center text-elite-red">
                        <i className="fas fa-minus w-4"></i>
                        <span>Low liquidity & board resistance</span>
                      </div>
                    </div>
                  </div>

                  <div 
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all bg-elite-slate-800/30 hover:bg-elite-slate-800/60 ${
                      isSelectionActive('lineage', 'new-money') 
                        ? 'border-elite-blue' 
                        : 'border-elite-slate-600 hover:border-elite-blue'
                    }`}
                    onClick={() => handleSelectionClick('lineage', 'new-money')}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-elite-slate-100">New Money</h4>
                      <span className="text-2xl">🚀</span>
                    </div>
                    <p className="text-elite-slate-400 text-sm mb-3">The Architect - $50B from IPO</p>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center text-elite-green">
                        <i className="fas fa-plus w-4"></i>
                        <span>High liquidity & total control</span>
                      </div>
                      <div className="flex items-center text-elite-red">
                        <i className="fas fa-minus w-4"></i>
                        <span>Volatile wealth & establishment suspicion</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Archetype Selection */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-elite-purple mb-4">Choose Your Archetype</h3>
                
                <div className="space-y-3">
                  {[
                    { id: "disruptor", name: "The Disruptor", icon: "⚡", desc: "High-risk innovation & reality distortion field" },
                    { id: "oracle", name: "The Oracle", icon: "🔮", desc: "Value investing & deep analysis abilities" },
                    { id: "conqueror", name: "The Conqueror", icon: "⚔️", desc: "Corporate warfare & hostile takeovers" },
                    { id: "tastemaker", name: "The Tastemaker", icon: "🎭", desc: "Cultural dominance & brand aura" }
                  ].map((archetype) => (
                    <div 
                      key={archetype.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all bg-elite-slate-800/30 hover:bg-elite-slate-800/60 ${
                        isSelectionActive('archetype', archetype.id) 
                          ? 'border-elite-purple' 
                          : 'border-elite-slate-600 hover:border-elite-purple'
                      }`}
                      onClick={() => handleSelectionClick('archetype', archetype.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{archetype.name}</h4>
                        <span>{archetype.icon}</span>
                      </div>
                      <p className="text-xs text-elite-slate-400">{archetype.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Initial Crisis Selection */}
            <div className="mt-8 pt-8 border-t border-elite-slate-700">
              <h3 className="text-xl font-semibold text-elite-amber mb-4">Your First Crisis</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div 
                  className={`p-4 rounded-lg border cursor-pointer transition-all bg-elite-slate-800/30 ${
                    isSelectionActive('crisis', 'hostile-takeover') 
                      ? 'border-elite-amber' 
                      : 'border-elite-slate-600 hover:border-elite-amber'
                  }`}
                  onClick={() => handleSelectionClick('crisis', 'hostile-takeover')}
                >
                  <h4 className="font-semibold text-elite-amber mb-2">Hostile Takeover Attempt</h4>
                  <p className="text-xs text-elite-slate-400">A rival consortium is trying to acquire your flagship company at a 20% premium</p>
                </div>
                <div 
                  className={`p-4 rounded-lg border cursor-pointer transition-all bg-elite-slate-800/30 ${
                    isSelectionActive('crisis', 'scandal') 
                      ? 'border-elite-amber' 
                      : 'border-elite-slate-600 hover:border-elite-amber'
                  }`}
                  onClick={() => handleSelectionClick('crisis', 'scandal')}
                >
                  <h4 className="font-semibold text-elite-amber mb-2">Personal Scandal</h4>
                  <p className="text-xs text-elite-slate-400">Leaked documents suggest tax avoidance - media firestorm incoming</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <Button 
                onClick={startSimulation}
                disabled={!canStartSimulation || loading}
                className="bg-elite-gradient hover:opacity-90 px-8 py-3 text-lg font-semibold transition-all transform hover:scale-105"
              >
                {loading ? "Initializing..." : "Begin Simulation"}
              </Button>
            </div>
            {savedCampaign && <p className="mt-5 text-center text-xs text-elite-slate-400">A previous campaign is saved on this device.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
