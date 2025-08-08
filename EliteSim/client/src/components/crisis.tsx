import { useState } from "react";
import { useGameContext } from "@/context/game-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Crisis() {
  const { state, dispatch } = useGameContext();
  const { toast } = useToast();
  const [resolvingCrisis, setResolvingCrisis] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    if (amount >= 1e9) {
      return `$${(amount / 1e9).toFixed(1)}B`;
    }
    if (amount >= 1e6) {
      return `$${(amount / 1e6).toFixed(1)}M`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toUpperCase()) {
      case "CRITICAL":
        return "from-elite-red/20 to-red-800/20 border-red-700/50";
      case "HIGH":
        return "from-elite-amber/20 to-amber-800/20 border-amber-700/50";
      case "MEDIUM":
        return "from-elite-blue/20 to-blue-800/20 border-blue-700/50";
      case "LOW":
        return "from-elite-green/20 to-green-800/20 border-green-700/50";
      default:
        return "from-elite-slate-800/20 to-elite-slate-700/20 border-elite-slate-600/50";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toUpperCase()) {
      case "CRITICAL":
        return { icon: "fas fa-exclamation-triangle", color: "bg-elite-red" };
      case "HIGH":
        return { icon: "fas fa-exclamation", color: "bg-elite-amber" };
      case "MEDIUM":
        return { icon: "fas fa-info-circle", color: "bg-elite-blue" };
      case "LOW":
        return { icon: "fas fa-check-circle", color: "bg-elite-green" };
      default:
        return { icon: "fas fa-question", color: "bg-elite-slate-600" };
    }
  };

  const getActionButtonColor = (actionId: string) => {
    switch (actionId) {
      case "defensive-strategy":
      case "pr-response":
        return "bg-elite-blue hover:bg-elite-blue/90";
      case "counter-offer":
      case "legal-action":
        return "bg-elite-green hover:bg-elite-green/90";
      case "white-knight":
      case "distraction":
        return "bg-elite-purple hover:bg-elite-purple/90";
      case "negotiate":
      case "monitor":
        return "bg-elite-slate-600 hover:bg-elite-slate-500";
      default:
        return "bg-elite-slate-600 hover:bg-elite-slate-500";
    }
  };

  const getTimeRemaining = (timeRemaining: number | null) => {
    if (!timeRemaining) return "No deadline";
    
    if (timeRemaining <= 24) {
      return `${timeRemaining} hours remaining`;
    }
    
    const days = Math.floor(timeRemaining / 24);
    const hours = timeRemaining % 24;
    
    if (hours === 0) {
      return `${days} day${days !== 1 ? 's' : ''} remaining`;
    }
    
    return `${days}d ${hours}h remaining`;
  };

  const resolveCrisis = async (crisisId: string, actionId: string) => {
    if (!state.player) return;

    setResolvingCrisis(crisisId);
    try {
      const response = await apiRequest("POST", `/api/crises/${crisisId}/resolve`, {
        action: actionId
      });

      const resolvedCrisis = await response.json();
      dispatch({ type: "UPDATE_CRISIS", payload: resolvedCrisis });

      // Remove resolved crisis from active list
      const updatedCrises = state.crises.filter(crisis => crisis.id !== crisisId);
      dispatch({ type: "SET_CRISES", payload: updatedCrises });

      toast({
        title: "Crisis Resolved",
        description: `Successfully handled the crisis with action: ${actionId.replace('-', ' ')}`,
      });

      // Trigger consequence effects (in a real game, this would affect player stats)
      // For now, we'll just show the success message

    } catch (error) {
      toast({
        title: "Resolution Failed",
        description: error instanceof Error ? error.message : "Failed to resolve crisis",
        variant: "destructive",
      });
    } finally {
      setResolvingCrisis(null);
    }
  };

  const activeCrises = state.crises.filter(crisis => crisis.status === "ACTIVE");
  const resolvedCrises = state.crises.filter(crisis => crisis.status === "RESOLVED" || crisis.status === "FAILED");

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Crisis Management Center</h1>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full animate-pulse ${
            activeCrises.length > 0 ? 'bg-elite-amber' : 'bg-elite-green'
          }`}></div>
          <span className={`font-semibold ${
            activeCrises.length > 0 ? 'text-elite-amber' : 'text-elite-green'
          }`}>
            {activeCrises.length} Active Situation{activeCrises.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Active Crises */}
      {activeCrises.length > 0 ? (
        <div className="space-y-6 mb-8">
          {activeCrises.map((crisis) => {
            const severityGradient = getSeverityColor(crisis.severity);
            const severityIcon = getSeverityIcon(crisis.severity);
            const availableActions = Array.isArray(crisis.availableActions) 
              ? crisis.availableActions 
              : [];

            return (
              <Card 
                key={crisis.id} 
                className={`bg-gradient-to-r ${severityGradient} backdrop-blur-sm border animate-slide-up`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 ${severityIcon.color} rounded-full flex items-center justify-center`}>
                        <i className={`${severityIcon.icon} text-white text-sm`}></i>
                      </div>
                      <div>
                        <h3 className={`text-lg font-bold ${
                          crisis.severity === "CRITICAL" ? "text-elite-red" : 
                          crisis.severity === "HIGH" ? "text-elite-amber" : 
                          "text-elite-blue"
                        }`}>
                          {crisis.title}
                        </h3>
                        <p className="text-elite-slate-400 text-sm">
                          {crisis.severity} • Immediate Action Required
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        crisis.severity === "CRITICAL" ? "text-elite-red" : "text-elite-amber"
                      }`}>
                        {getTimeRemaining(crisis.timeRemaining)}
                      </p>
                      <p className="text-elite-slate-400 text-sm">Before deadline</p>
                    </div>
                  </div>

                  <div className="bg-elite-slate-800/50 rounded-lg p-4 mb-4">
                    <p className="text-elite-slate-300 mb-3">{crisis.description}</p>
                    
                    {/* Crisis-specific metrics could be displayed here */}
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-elite-slate-400">Severity Level</p>
                        <p className={`font-bold ${
                          crisis.severity === "CRITICAL" ? "text-elite-red" :
                          crisis.severity === "HIGH" ? "text-elite-amber" :
                          "text-elite-blue"
                        }`}>
                          {crisis.severity}
                        </p>
                      </div>
                      <div>
                        <p className="text-elite-slate-400">Time Pressure</p>
                        <p className="font-bold text-elite-amber">
                          {crisis.timeRemaining && crisis.timeRemaining <= 24 ? "URGENT" : "MODERATE"}
                        </p>
                      </div>
                      <div>
                        <p className="text-elite-slate-400">Options Available</p>
                        <p className="font-bold text-elite-blue">{availableActions.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {availableActions.map((action: any) => (
                      <Button
                        key={action.id}
                        onClick={() => resolveCrisis(crisis.id, action.id)}
                        disabled={resolvingCrisis === crisis.id}
                        className={`${getActionButtonColor(action.id)} text-sm font-semibold transition-colors`}
                      >
                        {resolvingCrisis === crisis.id ? (
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                        ) : null}
                        {action.label}
                        {action.cost && action.cost > 0 ? ` (${formatCurrency(action.cost)})` : ''}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="bg-elite-slate-800/50 backdrop-blur-sm border-elite-slate-700 mb-8">
          <CardContent className="p-12 text-center">
            <i className="fas fa-shield-alt text-6xl text-elite-green mb-4"></i>
            <h3 className="text-2xl font-bold text-elite-green mb-2">All Clear</h3>
            <p className="text-elite-slate-400">
              No active crises detected. Your empire is operating smoothly.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Crisis History */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Crisis History</h3>
        <Card className="bg-elite-slate-800/50 backdrop-blur-sm border-elite-slate-700">
          <CardContent className="p-6">
            {resolvedCrises.length > 0 ? (
              <div className="space-y-4">
                {resolvedCrises.map((crisis) => (
                  <div key={crisis.id} className="flex items-center justify-between p-3 rounded-lg bg-elite-slate-700/30">
                    <div>
                      <p className={`font-semibold ${
                        crisis.status === "RESOLVED" ? "text-elite-green" : "text-elite-red"
                      }`}>
                        {crisis.title} - {crisis.status === "RESOLVED" ? "Resolved" : "Failed"}
                      </p>
                      <p className="text-elite-slate-400 text-sm">
                        {crisis.resolution ? `Action taken: ${crisis.resolution.replace('-', ' ')}` : 'No action recorded'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-elite-slate-400 text-sm">
                        {crisis.resolvedAt ? new Date(crisis.resolvedAt).toLocaleDateString() : 'Unknown date'}
                      </p>
                      <p className={`text-xs font-semibold ${
                        crisis.status === "RESOLVED" ? "text-elite-green" : "text-elite-red"
                      }`}>
                        {crisis.status === "RESOLVED" ? "Success" : "Failed"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <i className="fas fa-history text-4xl text-elite-slate-600 mb-4"></i>
                <p className="text-elite-slate-400">No crisis history available yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Crisis Management Tips */}
      <Card className="bg-elite-slate-800/50 backdrop-blur-sm border-elite-slate-700 mt-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <i className="fas fa-lightbulb text-elite-amber mr-2"></i>
            Crisis Management Insights
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-elite-blue mb-2">Quick Response Strategy</h4>
              <p className="text-elite-slate-400">
                Critical situations require immediate action. Delay often compounds the problem and limits your options.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-elite-purple mb-2">Resource Allocation</h4>
              <p className="text-elite-slate-400">
                More expensive solutions often provide better long-term outcomes and protect your reputation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
