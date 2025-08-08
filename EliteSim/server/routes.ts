import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertPlayerSchema, 
  insertPortfolioHoldingSchema, 
  insertStockWatchlistSchema,
  insertCrisisSchema 
} from "@shared/schema";
import { ALL_STOCKS, MARKET_INDICES, CRYPTO_DATA, COMMODITIES_DATA } from "@shared/market-data-2024";
import { CRISIS_SCENARIOS, PROPERTY_TYPES, ART_COLLECTIBLES, LUXURY_VEHICLES, PRIVATE_INVESTMENTS, POLITICAL_ACTIONS } from "@shared/game-features";

// Simulate market movements with realistic patterns
function simulateMarketMovement(basePrice: number, volatility: number = 0.02): { price: number; change: number; changePercent: number } {
  const randomFactor = (Math.random() - 0.5) * 2; // -1 to 1
  const change = basePrice * volatility * randomFactor;
  const newPrice = Math.max(0.01, basePrice + change);
  const changePercent = (change / basePrice) * 100;
  
  return {
    price: Number(newPrice.toFixed(2)),
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2))
  };
}

function getStockData(symbol: string) {
  // Check if it's a real stock from our 2024 data
  const stock = ALL_STOCKS.find(s => s.symbol === symbol);
  if (stock) {
    const movement = simulateMarketMovement(stock.price, 0.015);
    return {
      symbol: stock.symbol,
      companyName: stock.companyName,
      price: movement.price,
      change: movement.change,
      changePercent: movement.changePercent,
      volume: stock.volume + Math.floor((Math.random() - 0.5) * stock.volume * 0.1),
      marketCap: stock.marketCap,
      peRatio: stock.peRatio,
      high52w: stock.high52w,
      low52w: stock.low52w,
      sector: stock.sector,
      industry: stock.industry
    };
  }

  // Check indices
  const index = MARKET_INDICES[symbol as keyof typeof MARKET_INDICES];
  if (index) {
    const movement = simulateMarketMovement(index.price, 0.008);
    return {
      symbol,
      companyName: index.name,
      price: movement.price,
      change: movement.change,
      changePercent: movement.changePercent,
      volume: Math.floor(Math.random() * 50000000),
      marketCap: null,
      peRatio: null,
      high52w: null,
      low52w: null
    };
  }

  // Check crypto
  const crypto = CRYPTO_DATA[symbol as keyof typeof CRYPTO_DATA];
  if (crypto) {
    const movement = simulateMarketMovement(crypto.price, 0.05);
    return {
      symbol,
      companyName: crypto.name,
      price: movement.price,
      change: movement.change,
      changePercent: movement.changePercent,
      volume: Math.floor(Math.random() * 10000000),
      marketCap: null,
      peRatio: null,
      high52w: null,
      low52w: null
    };
  }

  // Check commodities
  const commodity = COMMODITIES_DATA[symbol as keyof typeof COMMODITIES_DATA];
  if (commodity) {
    const movement = simulateMarketMovement(commodity.price, 0.025);
    return {
      symbol,
      companyName: commodity.name,
      price: movement.price,
      change: movement.change,
      changePercent: movement.changePercent,
      volume: Math.floor(Math.random() * 1000000),
      marketCap: null,
      peRatio: null,
      high52w: null,
      low52w: null
    };
  }

  throw new Error(`Stock symbol ${symbol} not found in 2024 market data`);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Player management
  app.post("/api/players", async (req, res) => {
    try {
      const validatedData = insertPlayerSchema.parse(req.body);
      const player = await storage.createPlayer(validatedData);
      
      // Initialize with some default holdings and watchlist
      const defaultHoldings = [
        { symbol: "AAPL", companyName: "Apple Inc.", shares: 2000000, avgCostBasis: "182.15" },
        { symbol: "TSLA", companyName: "Tesla Inc.", shares: 1500000, avgCostBasis: "245.20" }
      ];

      for (const holding of defaultHoldings) {
        await storage.createPortfolioHolding({
          playerId: player.id,
          ...holding,
          currentPrice: "0"
        });
      }

      const defaultWatchlist = [
        { symbol: "AAPL", companyName: "Apple Inc." },
        { symbol: "TSLA", companyName: "Tesla Inc." },
        { symbol: "MSFT", companyName: "Microsoft Corp." }
      ];

      for (const item of defaultWatchlist) {
        await storage.addToWatchlist({
          playerId: player.id,
          ...item
        });
      }

      // Create initial crisis
      await storage.createCrisis({
        playerId: player.id,
        type: "hostile-takeover",
        title: "Hostile Takeover Attempt",
        description: "Blackstone Group has initiated a hostile bid for your flagship company TechNova at $45/share (20% premium). Your board is divided, and shareholders are showing interest.",
        severity: "CRITICAL",
        timeRemaining: 72,
        availableActions: [
          { id: "defensive-strategy", label: "Deploy Poison Pill Defense", cost: 500000000 },
          { id: "counter-offer", label: "Launch Counter-Offer", cost: 2000000000 },
          { id: "white-knight", label: "Find White Knight", cost: 100000000 },
          { id: "negotiate", label: "Negotiate Terms", cost: 0 }
        ]
      });

      res.json(player);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create player" });
    }
  });

  app.get("/api/players/:id", async (req, res) => {
    try {
      const player = await storage.getPlayer(req.params.id);
      if (!player) {
        return res.status(404).json({ message: "Player not found" });
      }
      res.json(player);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch player" });
    }
  });

  app.put("/api/players/:id", async (req, res) => {
    try {
      const updates = req.body;
      const player = await storage.updatePlayer(req.params.id, updates);
      res.json(player);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to update player" });
    }
  });

  // Portfolio management
  app.get("/api/players/:playerId/portfolio", async (req, res) => {
    try {
      const holdings = await storage.getPortfolioHoldings(req.params.playerId);
      
      // Update current prices for all holdings using 2024 data
      for (const holding of holdings) {
        try {
          const stockData = getStockData(holding.symbol);
          await storage.updatePortfolioHolding(holding.id, {
            currentPrice: stockData.price.toString()
          });
          holding.currentPrice = stockData.price.toString();
        } catch (error) {
          console.error(`Failed to update price for ${holding.symbol}:`, error);
        }
      }

      res.json(holdings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });

  app.post("/api/players/:playerId/portfolio", async (req, res) => {
    try {
      const validatedData = insertPortfolioHoldingSchema.parse({
        ...req.body,
        playerId: req.params.playerId
      });
      
      // Get current price from 2024 data
      const stockData = getStockData(validatedData.symbol);
      
      const holding = await storage.createPortfolioHolding({
        ...validatedData,
        companyName: stockData.companyName,
        currentPrice: stockData.price.toString()
      });

      res.json(holding);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create portfolio holding" });
    }
  });

  // Watchlist management
  app.get("/api/players/:playerId/watchlist", async (req, res) => {
    try {
      const watchlist = await storage.getWatchlist(req.params.playerId);
      res.json(watchlist);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch watchlist" });
    }
  });

  app.post("/api/players/:playerId/watchlist", async (req, res) => {
    try {
      const validatedData = insertStockWatchlistSchema.parse({
        ...req.body,
        playerId: req.params.playerId
      });

      const overview = await fetchCompanyOverview(validatedData.symbol);
      const watchlistItem = await storage.addToWatchlist({
        ...validatedData,
        companyName: overview.name
      });

      res.json(watchlistItem);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to add to watchlist" });
    }
  });

  // Market data - using pre-loaded 2024 data
  app.get("/api/market/stocks", (req, res) => {
    // Return all available stocks with current prices
    const stocksWithPrices = ALL_STOCKS.map(stock => {
      const movement = simulateMarketMovement(stock.price, 0.015);
      return {
        ...stock,
        price: movement.price,
        change: movement.change,
        changePercent: movement.changePercent,
        volume: stock.volume + Math.floor((Math.random() - 0.5) * stock.volume * 0.1)
      };
    });
    
    res.json(stocksWithPrices);
  });

  app.get("/api/market/quote/:symbol", async (req, res) => {
    try {
      const stockData = getStockData(req.params.symbol.toUpperCase());
      
      const marketData = await storage.upsertMarketData({
        symbol: stockData.symbol,
        price: stockData.price.toString(),
        change: stockData.change.toString(),
        changePercent: stockData.changePercent.toString(),
        volume: stockData.volume,
        marketCap: stockData.marketCap,
        peRatio: stockData.peRatio?.toString(),
        high52w: stockData.high52w?.toString(),
        low52w: stockData.low52w?.toString()
      });

      res.json({
        ...marketData,
        companyName: stockData.companyName
      });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to fetch market data" });
    }
  });

  app.get("/api/market/watchlist-quotes", async (req, res) => {
    try {
      const symbols = req.query.symbols as string;
      if (!symbols) {
        return res.status(400).json({ message: "symbols parameter required" });
      }

      const symbolList = symbols.split(",");
      const quotes = [];

      for (const symbol of symbolList) {
        try {
          const stockData = getStockData(symbol.toUpperCase());
          quotes.push({
            symbol: stockData.symbol,
            companyName: stockData.companyName,
            price: stockData.price,
            change: stockData.change,
            changePercent: stockData.changePercent,
            volume: stockData.volume
          });
        } catch (error) {
          console.error(`Failed to fetch quote for ${symbol}:`, error);
        }
      }

      res.json(quotes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch market quotes" });
    }
  });

  // Stock quote endpoint
  app.get("/api/stocks/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const stockData = getStockData(symbol.toUpperCase());
      res.json(stockData);
    } catch (error) {
      console.error("Error fetching stock data:", error);
      res.status(404).json({ error: error.message });
    }
  });

  // Market overview endpoint
  app.get("/api/market/overview", async (req, res) => {
    try {
      const overview = {
        indices: Object.entries(MARKET_INDICES).map(([symbol, data]) => {
          const movement = simulateMarketMovement(data.price, 0.005);
          return { symbol, name: data.name, ...movement };
        }),
        topGainers: ALL_STOCKS
          .map(stock => {
            const movement = simulateMarketMovement(stock.price, 0.02);
            return { ...stock, ...movement };
          })
          .sort((a, b) => b.changePercent - a.changePercent)
          .slice(0, 5),
        topLosers: ALL_STOCKS
          .map(stock => {
            const movement = simulateMarketMovement(stock.price, 0.02);
            return { ...stock, ...movement };
          })
          .sort((a, b) => a.changePercent - b.changePercent)
          .slice(0, 5),
        crypto: Object.entries(CRYPTO_DATA).map(([symbol, data]) => {
          const movement = simulateMarketMovement(data.price, 0.03);
          return { symbol, name: data.name, ...movement };
        }),
        commodities: Object.entries(COMMODITIES_DATA).map(([symbol, data]) => {
          const movement = simulateMarketMovement(data.price, 0.015);
          return { symbol, name: data.name, ...movement };
        })
      };
      res.json(overview);
    } catch (error) {
      console.error("Error fetching market overview:", error);
      res.status(500).json({ error: "Failed to fetch market overview" });
    }
  });

  // Sector performance endpoint
  app.get("/api/market/sectors", async (req, res) => {
    try {
      const sectors = ALL_STOCKS.reduce((acc, stock) => {
        if (!acc[stock.sector]) {
          acc[stock.sector] = [];
        }
        const movement = simulateMarketMovement(stock.price, 0.015);
        acc[stock.sector].push({ ...stock, ...movement });
        return acc;
      }, {} as Record<string, any[]>);

      const sectorPerformance = Object.entries(sectors).map(([sector, stocks]) => {
        const avgChange = stocks.reduce((sum, stock) => sum + stock.changePercent, 0) / stocks.length;
        const totalMarketCap = stocks.reduce((sum, stock) => {
          const capValue = parseFloat(stock.marketCap.replace(/[^0-9.]/g, ''));
          const multiplier = stock.marketCap.includes('T') ? 1000000000000 : 
                          stock.marketCap.includes('B') ? 1000000000 : 1000000;
          return sum + (capValue * multiplier);
        }, 0);

        return {
          sector,
          changePercent: Number(avgChange.toFixed(2)),
          marketCap: totalMarketCap,
          stockCount: stocks.length,
          topStock: stocks.sort((a, b) => b.changePercent - a.changePercent)[0]
        };
      });

      res.json(sectorPerformance.sort((a, b) => b.changePercent - a.changePercent));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sector performance" });
    }
  });

  // Crisis management
  app.get("/api/players/:playerId/crises", async (req, res) => {
    try {
      const crises = await storage.getActiveCrises(req.params.playerId);
      res.json(crises);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch crises" });
    }
  });

  app.post("/api/crises/:crisisId/resolve", async (req, res) => {
    try {
      const { action } = req.body;
      const crisis = await storage.getCrisis(req.params.crisisId);
      
      if (!crisis) {
        return res.status(404).json({ message: "Crisis not found" });
      }

      const updatedCrisis = await storage.updateCrisis(req.params.crisisId, {
        status: "RESOLVED",
        resolution: action
      });

      res.json(updatedCrisis);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to resolve crisis" });
    }
  });

  // Rivals
  app.get("/api/rivals", async (req, res) => {
    try {
      const rivals = await storage.getRivals();
      res.json(rivals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch rivals" });
    }
  });

  // Real Estate Empire endpoints
  app.get("/api/real-estate", async (req, res) => {
    try {
      res.json(PROPERTY_TYPES);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch real estate data" });
    }
  });

  // Art & Collectibles endpoints
  app.get("/api/art-collectibles", async (req, res) => {
    try {
      res.json(ART_COLLECTIBLES);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch art & collectibles data" });
    }
  });

  // Luxury Vehicles endpoints
  app.get("/api/luxury-vehicles", async (req, res) => {
    try {
      res.json(LUXURY_VEHICLES);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch luxury vehicles data" });
    }
  });

  // Private Investments endpoints
  app.get("/api/private-investments", async (req, res) => {
    try {
      res.json(PRIVATE_INVESTMENTS);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch private investments data" });
    }
  });

  // Political Actions endpoints
  app.get("/api/political-actions", async (req, res) => {
    try {
      res.json(POLITICAL_ACTIONS);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch political actions data" });
    }
  });

  // Enhanced Crisis Management
  app.get("/api/crisis-scenarios", async (req, res) => {
    try {
      res.json(CRISIS_SCENARIOS);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch crisis scenarios" });
    }
  });

  // Generate random crisis for player
  app.post("/api/players/:playerId/generate-crisis", async (req, res) => {
    try {
      const randomCrisis = CRISIS_SCENARIOS[Math.floor(Math.random() * CRISIS_SCENARIOS.length)];
      const crisis = await storage.createCrisis({
        playerId: req.params.playerId,
        title: randomCrisis.title,
        description: randomCrisis.description,
        severity: randomCrisis.severity as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
        timeLimit: randomCrisis.timeLimit,
        isResolved: false
      });
      res.json(crisis);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to generate crisis" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
