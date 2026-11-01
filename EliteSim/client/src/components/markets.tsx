import { useState, useEffect } from "react";
import { useGameContext } from "@/context/game-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface StockData {
  symbol: string;
  companyName: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  peRatio: number | null;
  high52w: number;
  low52w: number;
  sector: string;
  industry: string;
  dividendYield: number | null;
  beta: number | null;
  eps: number | null;
  revenue: string;
  employees: number;
  founded: number;
  headquarters: string;
  description: string;
}

export default function Markets() {
  const { state, dispatch } = useGameContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchSymbol, setSearchSymbol] = useState("");
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(false);
  const [tradeQuantity, setTradeQuantity] = useState("");
  const [orderType, setOrderType] = useState("market");
  const [selectedSector, setSelectedSector] = useState("all");

  // Fetch all available stocks
  const { data: allStocks = [], isLoading: stocksLoading } = useQuery<StockData[]>({
    queryKey: ['/api/market/stocks'],
    enabled: !!state.player
  });

  // Get stock quote
  const searchStock = async () => {
    if (!searchSymbol.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/market/quote/${searchSymbol.toUpperCase()}`);
      if (response.ok) {
        const stockData = await response.json();
        setSelectedStock(stockData);
      } else {
        throw new Error('Stock not found');
      }
    } catch (error) {
      toast({
        title: "Search Failed",
        description: error instanceof Error ? error.message : "Stock symbol not found",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Quick select stock from the list
  const selectStock = (stock: StockData) => {
    setSelectedStock(stock);
    setSearchSymbol(stock.symbol);
  };

  const executeTrade = async (action: "BUY" | "SELL") => {
    if (!selectedStock || !tradeQuantity || !state.player) {
      toast({
        title: "Invalid Trade",
        description: "Please ensure all trade parameters are filled",
        variant: "destructive",
      });
      return;
    }

    const quantity = parseInt(tradeQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      toast({
        title: "Invalid Quantity",
        description: "Please enter a valid quantity",
        variant: "destructive",
      });
      return;
    }

    try {
      if (action === "BUY") {
        const tradeValue = quantity * selectedStock.price;
        const liquidCash = parseFloat(state.player.liquidCash);
        
        if (tradeValue > liquidCash) {
          toast({
            title: "Insufficient Funds",
            description: `You need $${(tradeValue / 1e6).toFixed(2)}M but only have $${(liquidCash / 1e6).toFixed(2)}M available`,
            variant: "destructive",
          });
          return;
        }

        // Check if we already own this stock
        const existingHolding = state.portfolio.find(h => h.symbol === selectedStock.symbol);
        
        if (existingHolding) {
          // Update existing holding
          const newShares = existingHolding.shares + quantity;
          const newAvgCost = ((existingHolding.shares * parseFloat(existingHolding.avgCostBasis)) + tradeValue) / newShares;
          
        const response = await apiRequest("PUT", `/api/players/${state.player.id}/portfolio/${existingHolding.id}`, {
            shares: newShares,
            avgCostBasis: newAvgCost.toString(),
            currentPrice: selectedStock.price.toString()
          });

        dispatch({ type: "UPDATE_PORTFOLIO_HOLDING", payload: await response.json() });
          
          // Update player cash
          const updatedPlayer = await apiRequest("PUT", `/api/players/${state.player.id}`, {
            liquidCash: (liquidCash - tradeValue).toString()
          });
          dispatch({ type: "UPDATE_PLAYER", payload: await updatedPlayer.json() });
        } else {
          // Create new holding
          const newHolding = await apiRequest("POST", `/api/players/${state.player.id}/portfolio`, {
            symbol: selectedStock.symbol,
            companyName: selectedStock.companyName,
            shares: quantity,
            avgCostBasis: selectedStock.price.toString(),
            currentPrice: selectedStock.price.toString()
          });

          dispatch({ type: "ADD_PORTFOLIO_HOLDING", payload: await newHolding.json() });
          
          // Update player cash
          const updatedPlayer = await apiRequest("PUT", `/api/players/${state.player.id}`, {
            liquidCash: (liquidCash - tradeValue).toString()
          });
          dispatch({ type: "UPDATE_PLAYER", payload: await updatedPlayer.json() });
        }

        // Invalidate portfolio query to refresh data
        queryClient.invalidateQueries({ queryKey: [`/api/players/${state.player.id}/portfolio`] });

        toast({
          title: "Trade Executed",
          description: `Successfully bought ${quantity.toLocaleString()} shares of ${selectedStock.symbol} for $${(tradeValue / 1e6).toFixed(2)}M`,
        });
      }

      setTradeQuantity("");
    } catch (error) {
      toast({
        title: "Trade Failed",
        description: error instanceof Error ? error.message : "Failed to execute trade",
        variant: "destructive",
      });
    }
  };

  // Filter stocks by sector
  const filteredStocks = selectedSector === "all" 
    ? allStocks 
    : allStocks.filter((stock: StockData) => stock.sector === selectedSector);

  const sectors = Array.from(new Set(allStocks.map((stock: StockData) => stock.sector)));

  return (
    <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Capital Markets</h1>
        <div className="text-sm text-gray-400">
          Available Capital: ${(parseFloat(state.player?.liquidCash || "0") / 1e6).toFixed(2)}M
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock Browser */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Available Stocks ({allStocks.length})</CardTitle>
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Filter by sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                {sectors.map(sector => (
                  <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {stocksLoading ? (
                <div className="text-gray-400">Loading stocks...</div>
              ) : (
                filteredStocks.map((stock: StockData) => (
                  <button
                    key={stock.symbol}
                    onClick={() => selectStock(stock)}
                    className={`w-full p-3 rounded text-left transition-colors ${
                      selectedStock?.symbol === stock.symbol 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{stock.symbol}</div>
                        <div className="text-sm text-gray-400 truncate">{stock.companyName}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${stock.price}</div>
                        <div className={`text-sm ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stock Details & Trading */}
        <Card className="lg:col-span-2 bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">Stock Trading</CardTitle>
              <div className="flex gap-2">
                <Input
                  placeholder="Search symbol..."
                  value={searchSymbol}
                  onChange={(e) => setSearchSymbol(e.target.value.toUpperCase())}
                  className="w-48 bg-gray-700 border-gray-600 text-white"
                  onKeyDown={(e) => e.key === "Enter" && searchStock()}
                />
                <Button
                  onClick={searchStock}
                  disabled={loading || !searchSymbol.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? "..." : "Search"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {selectedStock ? (
              <div className="space-y-6">
                {/* Stock Info */}
                <div className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white">{selectedStock.symbol}</h3>
                      <p className="text-gray-300">{selectedStock.companyName}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white">${selectedStock.price.toFixed(2)}</div>
                      <div className={`text-lg flex items-center gap-1 ${selectedStock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {selectedStock.change >= 0 ? '↗' : '↘'}
                        {selectedStock.change >= 0 ? '+' : ''}${selectedStock.change.toFixed(2)} ({selectedStock.changePercent.toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Market Cap</span>
                      <div className="text-white font-semibold">{selectedStock.marketCap}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Volume</span>
                      <div className="text-white font-semibold">{selectedStock.volume?.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">P/E Ratio</span>
                      <div className="text-white font-semibold">{selectedStock.peRatio?.toFixed(1) || 'N/A'}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">52W High</span>
                      <div className="text-white font-semibold">${selectedStock.high52w.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Badge variant="outline" className="text-blue-400 border-blue-400">
                      {selectedStock.sector}
                    </Badge>
                    <Badge variant="outline" className="text-gray-400 border-gray-400">
                      {selectedStock.industry}
                    </Badge>
                  </div>
                  
                  <p className="mt-4 text-sm text-gray-300">{selectedStock.description}</p>
                </div>

                {/* Trading Interface */}
                <div className="p-4 bg-gray-700 rounded-lg">
                  <h4 className="text-lg font-semibold text-white mb-4">Place Order</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Order Type</label>
                      <Select value={orderType} onValueChange={setOrderType}>
                        <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="market">Market Order</SelectItem>
                          <SelectItem value="limit">Limit Order</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Quantity</label>
                      <Input
                        type="number"
                        placeholder="Number of shares"
                        value={tradeQuantity}
                        onChange={(e) => setTradeQuantity(e.target.value)}
                        className="bg-gray-600 border-gray-500 text-white"
                        min="1"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Total Value</label>
                      <div className="p-2 bg-gray-600 border border-gray-500 rounded text-white">
                        ${tradeQuantity ? (parseInt(tradeQuantity) * selectedStock.price).toLocaleString() : '0'}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <Button
                      onClick={() => executeTrade("BUY")}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold"
                      disabled={!tradeQuantity || parseInt(tradeQuantity) <= 0}
                    >
                      BUY {tradeQuantity} Shares
                    </Button>
                    <Button
                      onClick={() => executeTrade("SELL")}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-semibold"
                      disabled={!tradeQuantity || parseInt(tradeQuantity) <= 0}
                    >
                      SELL {tradeQuantity} Shares
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg">Select a stock to view details and trade</div>
                <div className="mt-4 text-sm text-gray-500">
                  Browse {allStocks.length} available stocks or search by symbol
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
