import { ALL_STOCKS, MARKET_INDICES, CRYPTO_DATA, COMMODITIES_DATA } from "@shared/market-data-2024";
import { PROPERTY_TYPES, ART_COLLECTIBLES, LUXURY_VEHICLES, PRIVATE_INVESTMENTS, POLITICAL_ACTIONS, CRISIS_SCENARIOS } from "@shared/game-features";

type Campaign = { player: any; portfolio: any[]; watchlist: any[]; crises: any[]; investments: any[] };
const KEY = "the-elite-static-campaign-v1";
const read = (): Campaign | null => { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; } };
const save = (campaign: Campaign) => localStorage.setItem(KEY, JSON.stringify(campaign));
const response = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
const quote = (symbol: string) => {
  const stock = ALL_STOCKS.find(item => item.symbol === symbol);
  if (stock) return stock;
  const basic = MARKET_INDICES[symbol as keyof typeof MARKET_INDICES] || CRYPTO_DATA[symbol as keyof typeof CRYPTO_DATA] || COMMODITIES_DATA[symbol as keyof typeof COMMODITIES_DATA];
  if (basic) return { symbol, companyName: basic.name, price: basic.price, change: basic.change, changePercent: basic.changePercent, volume: 0, marketCap: "—", peRatio: null, high52w: basic.price, low52w: basic.price, sector: "Other", industry: "Other" };
  return null;
};

export async function staticGameApi(input: RequestInfo | URL, init?: RequestInit): Promise<Response | null> {
  const url = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url, window.location.origin);
  if (!url.pathname.startsWith("/api/")) return null;
  const method = init?.method || "GET";
  let body: any = {};
  try { body = init?.body ? JSON.parse(String(init.body)) : {}; } catch { body = {}; }
  const path = url.pathname;
  let campaign = read();
  if (path === "/api/players" && method === "POST") {
    const player = { ...body, id: crypto.randomUUID(), netWorth: "50000000000", liquidCash: "3200000000", dailyBurnRate: "42000000", threatLevel: "MEDIUM", gameActive: true, createdAt: new Date().toISOString() };
    campaign = { player, portfolio: ["AAPL", "TSLA"].map(symbol => { const stock = quote(symbol)!; return { id: crypto.randomUUID(), playerId: player.id, symbol, companyName: stock.companyName, shares: symbol === "AAPL" ? 2000000 : 1500000, avgCostBasis: String(stock.price), currentPrice: String(stock.price) }; }), watchlist: ["AAPL", "TSLA", "MSFT"].map(symbol => ({ symbol, companyName: quote(symbol)?.companyName || symbol })), crises: [], investments: [] };
    const crisis = CRISIS_SCENARIOS[body.crisis === "scandal" ? 3 : 0];
    if (crisis) campaign.crises.push({ id: crypto.randomUUID(), playerId: player.id, type: crisis.id, title: crisis.title, description: crisis.description, severity: crisis.severity, status: "ACTIVE", timeRemaining: crisis.timeLimit, availableActions: crisis.actions, createdAt: new Date().toISOString() });
    save(campaign); return response(player);
  }
  if (path === "/api/market/stocks") return response(ALL_STOCKS);
  if (path === "/api/market/overview") return response({ indices: Object.entries(MARKET_INDICES).map(([symbol, item]) => ({ symbol, ...item })), topGainers: ALL_STOCKS.slice(0, 5), topLosers: ALL_STOCKS.slice(-5), crypto: Object.entries(CRYPTO_DATA).map(([symbol, item]) => ({ symbol, ...item })), commodities: Object.entries(COMMODITIES_DATA).map(([symbol, item]) => ({ symbol, ...item })) });
  if (path === "/api/market/sectors") return response([]);
  const quoteMatch = path.match(/^\/api\/market\/quote\/([^/]+)$/);
  if (quoteMatch) { const data = quote(decodeURIComponent(quoteMatch[1]).toUpperCase()); return data ? response(data) : response({ message: "Symbol not found" }, 404); }
  if (path === "/api/real-estate") return response(PROPERTY_TYPES);
  if (path === "/api/art-collectibles") return response(ART_COLLECTIBLES);
  if (path === "/api/luxury-vehicles") return response(LUXURY_VEHICLES);
  if (path === "/api/private-investments") return response(PRIVATE_INVESTMENTS);
  if (path === "/api/political-actions") return response(POLITICAL_ACTIONS);
  if (path === "/api/rivals") return response([{ id: "rival-1", name: "The Disruptor", archetype: "Disruptor", netWorth: "238200000000", threatLevel: "HIGH", rivalryScore: 87, recentActivity: "Acquired a major semiconductor stake", activityTimestamp: new Date().toISOString() }, { id: "rival-2", name: "The Conqueror", archetype: "Conqueror", netWorth: "171600000000", threatLevel: "MEDIUM", rivalryScore: 64, recentActivity: "Expanded global infrastructure holdings", activityTimestamp: new Date().toISOString() }]);
  if (!campaign) return response({ message: "Start a campaign first" }, 404);
  const playerId = campaign.player.id;
  if (path === `/api/players/${playerId}` && method === "PUT") { campaign.player = { ...campaign.player, ...body }; save(campaign); return response(campaign.player); }
  if (path === `/api/players/${playerId}/portfolio` && method === "GET") return response(campaign.portfolio);
  if (path === `/api/players/${playerId}/watchlist`) return response(campaign.watchlist);
  if (path === `/api/players/${playerId}/crises`) return response(campaign.crises);
  const holdingMatch = path.match(/^\/api\/players\/[^/]+\/portfolio\/([^/]+)$/);
  if (holdingMatch && method === "PUT") { const index = campaign.portfolio.findIndex(item => item.id === holdingMatch[1]); if (index < 0) return response({ message: "Holding not found" }, 404); campaign.portfolio[index] = { ...campaign.portfolio[index], ...body }; save(campaign); return response(campaign.portfolio[index]); }
  if (path === `/api/players/${playerId}/portfolio` && method === "POST") { const stock = quote(body.symbol); if (!stock) return response({ message: "Symbol not found" }, 404); const holding = { ...body, id: crypto.randomUUID(), playerId, companyName: stock.companyName }; campaign.portfolio.push(holding); save(campaign); return response(holding); }
  const crisisMatch = path.match(/^\/api\/crises\/([^/]+)\/resolve$/);
  if (crisisMatch) { const crisis = campaign.crises.find(item => item.id === crisisMatch[1]); if (!crisis) return response({ message: "Situation not found" }, 404); crisis.status = "RESOLVED"; crisis.resolution = body.action; campaign.crises = campaign.crises.filter(item => item.id !== crisisMatch[1]); save(campaign); return response(crisis); }
  if (path === `/api/players/${playerId}/investments` && method === "POST") { campaign.investments.push(body); save(campaign); return response({ success: true, ...body }); }
  return response({ message: "This action is not available in the browser edition" }, 404);
}
