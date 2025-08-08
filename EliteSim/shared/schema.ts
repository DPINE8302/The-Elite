import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const players = pgTable("players", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  lineage: text("lineage").notNull(), // 'old-money' | 'new-money'
  archetype: text("archetype").notNull(), // 'disruptor' | 'oracle' | 'conqueror' | 'tastemaker'
  netWorth: decimal("net_worth", { precision: 15, scale: 2 }).notNull().default("50000000000"),
  liquidCash: decimal("liquid_cash", { precision: 15, scale: 2 }).notNull().default("3200000000"),
  dailyBurnRate: decimal("daily_burn_rate", { precision: 12, scale: 2 }).notNull().default("42000000"),
  threatLevel: text("threat_level").notNull().default("MEDIUM"),
  gameActive: boolean("game_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const portfolioHoldings = pgTable("portfolio_holdings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").references(() => players.id).notNull(),
  symbol: text("symbol").notNull(),
  companyName: text("company_name").notNull(),
  shares: integer("shares").notNull(),
  avgCostBasis: decimal("avg_cost_basis", { precision: 10, scale: 2 }).notNull(),
  currentPrice: decimal("current_price", { precision: 10, scale: 2 }).notNull().default("0"),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

export const stockWatchlist = pgTable("stock_watchlist", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").references(() => players.id).notNull(),
  symbol: text("symbol").notNull(),
  companyName: text("company_name").notNull(),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

export const rivals = pgTable("rivals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  archetype: text("archetype").notNull(),
  netWorth: decimal("net_worth", { precision: 15, scale: 2 }).notNull(),
  threatLevel: text("threat_level").notNull(),
  rivalryScore: integer("rivalry_score").notNull(),
  recentActivity: text("recent_activity"),
  activityTimestamp: timestamp("activity_timestamp").defaultNow().notNull(),
});

export const crises = pgTable("crises", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").references(() => players.id).notNull(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  severity: text("severity").notNull(), // 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  status: text("status").notNull().default("ACTIVE"), // 'ACTIVE' | 'RESOLVED' | 'FAILED'
  timeRemaining: integer("time_remaining"), // hours
  availableActions: jsonb("available_actions").notNull(),
  consequences: jsonb("consequences"),
  resolution: text("resolution"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
});

export const marketData = pgTable("market_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  symbol: text("symbol").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  change: decimal("change", { precision: 10, scale: 2 }).notNull(),
  changePercent: decimal("change_percent", { precision: 6, scale: 3 }).notNull(),
  volume: integer("volume"),
  marketCap: text("market_cap"),
  peRatio: decimal("pe_ratio", { precision: 8, scale: 2 }),
  high52w: decimal("high_52w", { precision: 10, scale: 2 }),
  low52w: decimal("low_52w", { precision: 10, scale: 2 }),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
  createdAt: true,
});

export const insertPortfolioHoldingSchema = createInsertSchema(portfolioHoldings).omit({
  id: true,
  lastUpdated: true,
});

export const insertStockWatchlistSchema = createInsertSchema(stockWatchlist).omit({
  id: true,
  addedAt: true,
});

export const insertCrisisSchema = createInsertSchema(crises).omit({
  id: true,
  createdAt: true,
  resolvedAt: true,
});

export const insertMarketDataSchema = createInsertSchema(marketData).omit({
  id: true,
  lastUpdated: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof players.$inferSelect;
export type InsertPortfolioHolding = z.infer<typeof insertPortfolioHoldingSchema>;
export type PortfolioHolding = typeof portfolioHoldings.$inferSelect;
export type InsertStockWatchlist = z.infer<typeof insertStockWatchlistSchema>;
export type StockWatchlist = typeof stockWatchlist.$inferSelect;
export type InsertCrisis = z.infer<typeof insertCrisisSchema>;
export type Crisis = typeof crises.$inferSelect;
export type InsertMarketData = z.infer<typeof insertMarketDataSchema>;
export type MarketData = typeof marketData.$inferSelect;
export type Rival = typeof rivals.$inferSelect;
