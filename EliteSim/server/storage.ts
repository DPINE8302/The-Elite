import { 
  type User, 
  type InsertUser, 
  type Player, 
  type InsertPlayer,
  type PortfolioHolding,
  type InsertPortfolioHolding,
  type StockWatchlist,
  type InsertStockWatchlist,
  type Crisis,
  type InsertCrisis,
  type MarketData,
  type InsertMarketData,
  type Rival
} from "@shared/schema";
import { ALL_STOCKS, MARKET_INDICES, CRYPTO_DATA, COMMODITIES_DATA } from "@shared/market-data-2024";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Player operations
  getPlayer(id: string): Promise<Player | undefined>;
  getPlayerByUserId(userId: string): Promise<Player | undefined>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayer(id: string, updates: Partial<Player>): Promise<Player>;
  
  // Portfolio operations
  getPortfolioHoldings(playerId: string): Promise<PortfolioHolding[]>;
  getPortfolioHolding(playerId: string, symbol: string): Promise<PortfolioHolding | undefined>;
  createPortfolioHolding(holding: InsertPortfolioHolding): Promise<PortfolioHolding>;
  updatePortfolioHolding(id: string, updates: Partial<PortfolioHolding>): Promise<PortfolioHolding>;
  deletePortfolioHolding(id: string): Promise<void>;
  
  // Watchlist operations
  getWatchlist(playerId: string): Promise<StockWatchlist[]>;
  addToWatchlist(watchlistItem: InsertStockWatchlist): Promise<StockWatchlist>;
  removeFromWatchlist(playerId: string, symbol: string): Promise<void>;
  
  // Crisis operations
  getActiveCrises(playerId: string): Promise<Crisis[]>;
  getCrisis(id: string): Promise<Crisis | undefined>;
  createCrisis(crisis: InsertCrisis): Promise<Crisis>;
  updateCrisis(id: string, updates: Partial<Crisis>): Promise<Crisis>;
  
  // Market data operations
  getMarketData(symbol: string): Promise<MarketData | undefined>;
  getMarketDataMultiple(symbols: string[]): Promise<MarketData[]>;
  upsertMarketData(marketData: InsertMarketData): Promise<MarketData>;
  
  // Rivals operations
  getRivals(): Promise<Rival[]>;
  updateRival(id: string, updates: Partial<Rival>): Promise<Rival>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private players: Map<string, Player> = new Map();
  private portfolioHoldings: Map<string, PortfolioHolding> = new Map();
  private watchlists: Map<string, StockWatchlist> = new Map();
  private crises: Map<string, Crisis> = new Map();
  private marketData: Map<string, MarketData> = new Map();
  private rivals: Map<string, Rival> = new Map();

  constructor() {
    this.initializeRivals();
    this.initializeMarketData();
  }

  private initializeRivals() {
    const rivalData = [
      {
        id: randomUUID(),
        name: "Elon Musk",
        archetype: "The Disruptor",
        netWorth: "238200000000",
        threatLevel: "HIGH",
        rivalryScore: 87,
        recentActivity: "Acquired 15% stake in semiconductor startup NeuralChip",
        activityTimestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        id: randomUUID(),
        name: "Jeff Bezos",
        archetype: "The Conqueror",
        netWorth: "171600000000",
        threatLevel: "MEDIUM",
        rivalryScore: 64,
        recentActivity: "Increased Blue Origin investment by $2.8B for Mars mission",
        activityTimestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
      }
    ];

    rivalData.forEach(rival => this.rivals.set(rival.id, rival as Rival));
  }

  private initializeMarketData() {
    // Initialize with real 2024 stock data
    ALL_STOCKS.forEach(stock => {
      const marketData: MarketData = {
        id: randomUUID(),
        symbol: stock.symbol,
        price: stock.price.toString(),
        change: stock.change.toString(),
        changePercent: stock.changePercent.toString(),
        volume: stock.volume,
        marketCap: stock.marketCap,
        peRatio: stock.peRatio?.toString() || null,
        high52w: stock.high52w.toString(),
        low52w: stock.low52w.toString(),
        lastUpdated: new Date()
      };
      this.marketData.set(stock.symbol, marketData);
    });

    // Add market indices
    Object.entries(MARKET_INDICES).forEach(([symbol, data]) => {
      const marketData: MarketData = {
        id: randomUUID(),
        symbol,
        price: data.price.toString(),
        change: data.change.toString(),
        changePercent: data.changePercent.toString(),
        volume: null,
        marketCap: null,
        peRatio: null,
        high52w: null,
        low52w: null,
        lastUpdated: new Date()
      };
      this.marketData.set(symbol, marketData);
    });

    // Add crypto data
    Object.entries(CRYPTO_DATA).forEach(([symbol, data]) => {
      const marketData: MarketData = {
        id: randomUUID(),
        symbol,
        price: data.price.toString(),
        change: data.change.toString(),
        changePercent: data.changePercent.toString(),
        volume: null,
        marketCap: null,
        peRatio: null,
        high52w: null,
        low52w: null,
        lastUpdated: new Date()
      };
      this.marketData.set(symbol, marketData);
    });

    // Add commodities data
    Object.entries(COMMODITIES_DATA).forEach(([symbol, data]) => {
      const marketData: MarketData = {
        id: randomUUID(),
        symbol,
        price: data.price.toString(),
        change: data.change.toString(),
        changePercent: data.changePercent.toString(),
        volume: null,
        marketCap: null,
        peRatio: null,
        high52w: null,
        low52w: null,
        lastUpdated: new Date()
      };
      this.marketData.set(symbol, marketData);
    });
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Player operations
  async getPlayer(id: string): Promise<Player | undefined> {
    return this.players.get(id);
  }

  async getPlayerByUserId(userId: string): Promise<Player | undefined> {
    return Array.from(this.players.values()).find(player => player.userId === userId);
  }

  async createPlayer(insertPlayer: InsertPlayer): Promise<Player> {
    const id = randomUUID();
    const player: Player = { 
      ...insertPlayer, 
      id, 
      createdAt: new Date() 
    };
    this.players.set(id, player);
    return player;
  }

  async updatePlayer(id: string, updates: Partial<Player>): Promise<Player> {
    const existing = this.players.get(id);
    if (!existing) throw new Error("Player not found");
    
    const updated = { ...existing, ...updates };
    this.players.set(id, updated);
    return updated;
  }

  // Portfolio operations
  async getPortfolioHoldings(playerId: string): Promise<PortfolioHolding[]> {
    return Array.from(this.portfolioHoldings.values()).filter(holding => holding.playerId === playerId);
  }

  async getPortfolioHolding(playerId: string, symbol: string): Promise<PortfolioHolding | undefined> {
    return Array.from(this.portfolioHoldings.values()).find(
      holding => holding.playerId === playerId && holding.symbol === symbol
    );
  }

  async createPortfolioHolding(insertHolding: InsertPortfolioHolding): Promise<PortfolioHolding> {
    const id = randomUUID();
    const holding: PortfolioHolding = { 
      ...insertHolding, 
      id, 
      lastUpdated: new Date() 
    };
    this.portfolioHoldings.set(id, holding);
    return holding;
  }

  async updatePortfolioHolding(id: string, updates: Partial<PortfolioHolding>): Promise<PortfolioHolding> {
    const existing = this.portfolioHoldings.get(id);
    if (!existing) throw new Error("Portfolio holding not found");
    
    const updated = { ...existing, ...updates, lastUpdated: new Date() };
    this.portfolioHoldings.set(id, updated);
    return updated;
  }

  async deletePortfolioHolding(id: string): Promise<void> {
    this.portfolioHoldings.delete(id);
  }

  // Watchlist operations
  async getWatchlist(playerId: string): Promise<StockWatchlist[]> {
    return Array.from(this.watchlists.values()).filter(item => item.playerId === playerId);
  }

  async addToWatchlist(insertWatchlistItem: InsertStockWatchlist): Promise<StockWatchlist> {
    const id = randomUUID();
    const watchlistItem: StockWatchlist = { 
      ...insertWatchlistItem, 
      id, 
      addedAt: new Date() 
    };
    this.watchlists.set(id, watchlistItem);
    return watchlistItem;
  }

  async removeFromWatchlist(playerId: string, symbol: string): Promise<void> {
    const item = Array.from(this.watchlists.entries()).find(
      ([_, item]) => item.playerId === playerId && item.symbol === symbol
    );
    if (item) {
      this.watchlists.delete(item[0]);
    }
  }

  // Crisis operations
  async getActiveCrises(playerId: string): Promise<Crisis[]> {
    return Array.from(this.crises.values()).filter(
      crisis => crisis.playerId === playerId && crisis.status === "ACTIVE"
    );
  }

  async getCrisis(id: string): Promise<Crisis | undefined> {
    return this.crises.get(id);
  }

  async createCrisis(insertCrisis: InsertCrisis): Promise<Crisis> {
    const id = randomUUID();
    const crisis: Crisis = { 
      ...insertCrisis, 
      id, 
      createdAt: new Date() 
    };
    this.crises.set(id, crisis);
    return crisis;
  }

  async updateCrisis(id: string, updates: Partial<Crisis>): Promise<Crisis> {
    const existing = this.crises.get(id);
    if (!existing) throw new Error("Crisis not found");
    
    const updated = { ...existing, ...updates };
    if (updates.status === "RESOLVED" || updates.status === "FAILED") {
      updated.resolvedAt = new Date();
    }
    this.crises.set(id, updated);
    return updated;
  }

  // Market data operations
  async getMarketData(symbol: string): Promise<MarketData | undefined> {
    return this.marketData.get(symbol);
  }

  async getMarketDataMultiple(symbols: string[]): Promise<MarketData[]> {
    return symbols.map(symbol => this.marketData.get(symbol)).filter(Boolean) as MarketData[];
  }

  async upsertMarketData(insertMarketData: InsertMarketData): Promise<MarketData> {
    const existing = this.marketData.get(insertMarketData.symbol);
    const id = existing?.id || randomUUID();
    
    const marketData: MarketData = { 
      ...insertMarketData, 
      id, 
      lastUpdated: new Date() 
    };
    this.marketData.set(insertMarketData.symbol, marketData);
    return marketData;
  }

  // Rivals operations
  async getRivals(): Promise<Rival[]> {
    return Array.from(this.rivals.values());
  }

  async updateRival(id: string, updates: Partial<Rival>): Promise<Rival> {
    const existing = this.rivals.get(id);
    if (!existing) throw new Error("Rival not found");
    
    const updated = { ...existing, ...updates };
    this.rivals.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
