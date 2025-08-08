import { createContext, useContext, useReducer, useCallback, useEffect } from "react";
import type { Player, PortfolioHolding, StockWatchlist, Crisis, Rival } from "@shared/schema";

interface GameState {
  player: Player | null;
  portfolio: PortfolioHolding[];
  watchlist: StockWatchlist[];
  crises: Crisis[];
  rivals: Rival[];
  currentSection: string;
  gameActive: boolean;
  loading: boolean;
  error: string | null;
}

type GameAction =
  | { type: "SET_PLAYER"; payload: Player }
  | { type: "SET_PORTFOLIO"; payload: PortfolioHolding[] }
  | { type: "SET_WATCHLIST"; payload: StockWatchlist[] }
  | { type: "SET_CRISES"; payload: Crisis[] }
  | { type: "SET_RIVALS"; payload: Rival[] }
  | { type: "SET_CURRENT_SECTION"; payload: string }
  | { type: "SET_GAME_ACTIVE"; payload: boolean }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "UPDATE_PORTFOLIO_HOLDING"; payload: PortfolioHolding }
  | { type: "ADD_PORTFOLIO_HOLDING"; payload: PortfolioHolding }
  | { type: "REMOVE_PORTFOLIO_HOLDING"; payload: string }
  | { type: "ADD_WATCHLIST_ITEM"; payload: StockWatchlist }
  | { type: "REMOVE_WATCHLIST_ITEM"; payload: string }
  | { type: "UPDATE_CRISIS"; payload: Crisis };

const initialState: GameState = {
  player: null,
  portfolio: [],
  watchlist: [],
  crises: [],
  rivals: [],
  currentSection: "dashboard",
  gameActive: false,
  loading: false,
  error: null,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SET_PLAYER":
      return { ...state, player: action.payload };
    case "SET_PORTFOLIO":
      return { ...state, portfolio: action.payload };
    case "SET_WATCHLIST":
      return { ...state, watchlist: action.payload };
    case "SET_CRISES":
      return { ...state, crises: action.payload };
    case "SET_RIVALS":
      return { ...state, rivals: action.payload };
    case "SET_CURRENT_SECTION":
      return { ...state, currentSection: action.payload };
    case "SET_GAME_ACTIVE":
      return { ...state, gameActive: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "UPDATE_PORTFOLIO_HOLDING":
      return {
        ...state,
        portfolio: state.portfolio.map(holding =>
          holding.id === action.payload.id ? action.payload : holding
        ),
      };
    case "ADD_PORTFOLIO_HOLDING":
      return {
        ...state,
        portfolio: [...state.portfolio, action.payload],
      };
    case "REMOVE_PORTFOLIO_HOLDING":
      return {
        ...state,
        portfolio: state.portfolio.filter(holding => holding.id !== action.payload),
      };
    case "ADD_WATCHLIST_ITEM":
      return {
        ...state,
        watchlist: [...state.watchlist, action.payload],
      };
    case "REMOVE_WATCHLIST_ITEM":
      return {
        ...state,
        watchlist: state.watchlist.filter(item => item.symbol !== action.payload),
      };
    case "UPDATE_CRISIS":
      return {
        ...state,
        crises: state.crises.map(crisis =>
          crisis.id === action.payload.id ? action.payload : crisis
        ),
      };
    default:
      return state;
  }
}

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  setCurrentSection: (section: string) => void;
  calculatePortfolioValue: () => number;
  calculateDailyChange: () => { amount: number; percentage: number };
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameContextProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const setCurrentSection = useCallback((section: string) => {
    dispatch({ type: "SET_CURRENT_SECTION", payload: section });
  }, []);

  const calculatePortfolioValue = useCallback(() => {
    return state.portfolio.reduce((total, holding) => {
      const currentPrice = parseFloat(holding.currentPrice) || 0;
      return total + (holding.shares * currentPrice);
    }, 0);
  }, [state.portfolio]);

  const calculateDailyChange = useCallback(() => {
    const totalValue = calculatePortfolioValue();
    const totalCost = state.portfolio.reduce((total, holding) => {
      const avgCost = parseFloat(holding.avgCostBasis) || 0;
      return total + (holding.shares * avgCost);
    }, 0);

    const amount = totalValue - totalCost;
    const percentage = totalCost > 0 ? (amount / totalCost) * 100 : 0;

    return { amount, percentage };
  }, [state.portfolio, calculatePortfolioValue]);

  // Auto-refresh market data every 30 seconds when game is active
  useEffect(() => {
    if (!state.gameActive || !state.player) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/players/${state.player!.id}/portfolio`);
        if (response.ok) {
          const portfolio = await response.json();
          dispatch({ type: "SET_PORTFOLIO", payload: portfolio });
        }
      } catch (error) {
        console.error("Failed to refresh portfolio:", error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [state.gameActive, state.player]);

  const contextValue: GameContextType = {
    state,
    dispatch,
    setCurrentSection,
    calculatePortfolioValue,
    calculateDailyChange,
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameContextProvider");
  }
  return context;
}
