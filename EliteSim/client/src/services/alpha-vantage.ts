export interface StockQuote {
  symbol: string;
  companyName: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: string;
  peRatio?: number;
  high52w?: number;
  low52w?: number;
}

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

class AlphaVantageService {
  private baseUrl = "/api/market";

  async getStockQuote(symbol: string): Promise<StockQuote> {
    const response = await fetch(`${this.baseUrl}/quote/${symbol}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch quote for ${symbol}: ${response.statusText}`);
    }
    return response.json();
  }

  async getWatchlistQuotes(symbols: string[]): Promise<MarketData[]> {
    const response = await fetch(`${this.baseUrl}/watchlist-quotes?symbols=${symbols.join(",")}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch watchlist quotes: ${response.statusText}`);
    }
    return response.json();
  }
}

export const alphaVantageService = new AlphaVantageService();
