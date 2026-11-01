import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Building2, 
  Palette, 
  Car, 
  Briefcase, 
  Crown, 
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  Activity,
  Globe,
  Shield,
  Zap,
  Target,
  Users,
  AlertTriangle,
  Star,
  Trophy,
  Gem,
  Plane,
  Ship,
  Home,
  Landmark,
  Coins
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface AssetData {
  id: string;
  name: string;
  price: number;
  category: string;
  location?: string;
  yield?: number;
}

interface WealthEmpireProps {
  playerId: string;
}

export default function WealthEmpire({ playerId }: WealthEmpireProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [selectedCategory, setSelectedCategory] = useState("overview");
  const [investmentAmount, setInvestmentAmount] = useState(1000000);

  // Fetch all wealth management data
  const { data: realEstate = [] } = useQuery<any[]>({
    queryKey: ["/api/real-estate"],
    enabled: true
  });

  const { data: artCollectibles = [] } = useQuery<any[]>({
    queryKey: ["/api/art-collectibles"],
    enabled: true
  });

  const { data: luxuryVehicles = [] } = useQuery<any[]>({
    queryKey: ["/api/luxury-vehicles"],
    enabled: true
  });

  const { data: privateInvestments = [] } = useQuery<any[]>({
    queryKey: ["/api/private-investments"],
    enabled: true
  });

  const { data: politicalActions = [] } = useQuery<any[]>({
    queryKey: ["/api/political-actions"],
    enabled: true
  });

  const { data: marketOverview = {} } = useQuery<any>({
    queryKey: ["/api/market/overview"],
    enabled: true
  });

  const { data: sectorPerformance = [] } = useQuery<any[]>({
    queryKey: ["/api/market/sectors"],
    enabled: true
  });

  // Investment mutation
  const investMutation = useMutation({
    mutationFn: async (data: { type: string; assetId: string; amount: number }) => {
      return apiRequest("POST", `/api/players/${playerId}/investments`, data);
    },
    onSuccess: () => {
      toast({ description: "Investment executed successfully" });
      queryClient.invalidateQueries({ queryKey: [`/api/players/${playerId}`] });
    },
    onError: () => {
      toast({ 
        description: "Investment failed",
        variant: "destructive"
      });
    }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatLargeCurrency = (amount: number) => {
    if (amount >= 1e12) return `$${(amount / 1e12).toFixed(1)}T`;
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
    return formatCurrency(amount);
  };

  const AssetCard = ({ asset, type, icon: Icon }: { asset: any; type: string; icon: any }) => (
    <Card className="h-full transition-all hover:shadow-lg border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Icon className="h-6 w-6 text-blue-400" />
          <Badge variant="outline" className="border-gray-600 text-gray-300">
            {asset.category || asset.stage || asset.type}
          </Badge>
        </div>
        <CardTitle className="text-lg text-white leading-tight">
          {asset.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Price</span>
            <span className="text-white font-mono">
              {formatLargeCurrency(asset.price)}
            </span>
          </div>
          
          {asset.location && (
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Location</span>
              <span className="text-gray-300">{asset.location}</span>
            </div>
          )}
          
          {asset.yield && (
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Yield</span>
              <span className="text-green-400">{(asset.yield * 100).toFixed(1)}%</span>
            </div>
          )}
          
          {asset.sector && (
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Sector</span>
              <span className="text-gray-300">{asset.sector}</span>
            </div>
          )}
          
          {asset.minInvestment && (
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Min Investment</span>
              <span className="text-orange-400">{formatLargeCurrency(asset.minInvestment)}</span>
            </div>
          )}
        </div>
        
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => investMutation.mutate({ 
            type, 
            assetId: asset.id, 
            amount: asset.minInvestment || asset.price 
          })}
          disabled={investMutation.isPending}
        >
          {investMutation.isPending ? "Acquiring..." : "Acquire"}
        </Button>
      </CardContent>
    </Card>
  );

  const MarketOverviewSection = () => (
    <div className="space-y-6">
      {/* Market Indices */}
      <Card className="border-gray-800 bg-gray-900/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            Market Indices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketOverview?.indices && marketOverview.indices.map((index: any) => (
              <div key={index.symbol} className="p-4 bg-gray-800/50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-white">{index.symbol}</span>
                  <Badge variant={index.changePercent > 0 ? "default" : "destructive"}>
                    {index.changePercent > 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
                  </Badge>
                </div>
                <div className="text-2xl font-mono text-white">
                  {formatCurrency(index.price)}
                </div>
                <div className={`text-sm ${index.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {index.change > 0 ? '+' : ''}{formatCurrency(index.change)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Gainers & Losers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-gray-800 bg-gray-900/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              Top Gainers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {marketOverview?.topGainers && marketOverview.topGainers.slice(0, 5).map((stock: any) => (
                <div key={stock.symbol} className="flex justify-between items-center p-3 bg-gray-800/30 rounded">
                  <div>
                    <div className="font-semibold text-white">{stock.symbol}</div>
                    <div className="text-sm text-gray-400">{stock.companyName}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-white">{formatCurrency(stock.price)}</div>
                    <div className="text-green-400 text-sm">+{stock.changePercent.toFixed(2)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-900/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-400" />
              Top Losers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {marketOverview?.topLosers && marketOverview.topLosers.slice(0, 5).map((stock: any) => (
                <div key={stock.symbol} className="flex justify-between items-center p-3 bg-gray-800/30 rounded">
                  <div>
                    <div className="font-semibold text-white">{stock.symbol}</div>
                    <div className="text-sm text-gray-400">{stock.companyName}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-white">{formatCurrency(stock.price)}</div>
                    <div className="text-red-400 text-sm">{stock.changePercent.toFixed(2)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Crypto & Commodities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-gray-800 bg-gray-900/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Coins className="h-5 w-5 text-yellow-400" />
              Cryptocurrency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {marketOverview?.crypto && marketOverview.crypto.map((crypto: any) => (
                <div key={crypto.symbol} className="flex justify-between items-center p-3 bg-gray-800/30 rounded">
                  <div>
                    <div className="font-semibold text-white">{crypto.symbol}</div>
                    <div className="text-sm text-gray-400">{crypto.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-white">{formatCurrency(crypto.price)}</div>
                    <div className={`text-sm ${crypto.changePercent > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {crypto.changePercent > 0 ? '+' : ''}{crypto.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-900/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Landmark className="h-5 w-5 text-amber-400" />
              Commodities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {marketOverview?.commodities && marketOverview.commodities.map((commodity: any) => (
                <div key={commodity.symbol} className="flex justify-between items-center p-3 bg-gray-800/30 rounded">
                  <div>
                    <div className="font-semibold text-white">{commodity.symbol}</div>
                    <div className="text-sm text-gray-400">{commodity.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-white">{formatCurrency(commodity.price)}</div>
                    <div className={`text-sm ${commodity.changePercent > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {commodity.changePercent > 0 ? '+' : ''}{commodity.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Wealth Empire Management
            </h1>
            <p className="text-gray-400">
              Manage your $50B+ portfolio across global asset classes
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-green-500 text-green-400">
              <Activity className="h-3 w-3 mr-1" />
              Markets Open
            </Badge>
            <Badge variant="outline" className="border-blue-500 text-blue-400">
              <Globe className="h-3 w-3 mr-1" />
              Global Portfolio
            </Badge>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className={`grid w-full ${isMobile ? 'grid-cols-3' : 'grid-cols-6'} bg-gray-800`}>
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
              <BarChart3 className="h-4 w-4 mr-1" />
              {!isMobile && "Overview"}
            </TabsTrigger>
            <TabsTrigger value="real-estate" className="data-[state=active]:bg-blue-600">
              <Building2 className="h-4 w-4 mr-1" />
              {!isMobile && "Real Estate"}
            </TabsTrigger>
            <TabsTrigger value="art" className="data-[state=active]:bg-blue-600">
              <Palette className="h-4 w-4 mr-1" />
              {!isMobile && "Art & Collectibles"}
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="data-[state=active]:bg-blue-600">
              <Car className="h-4 w-4 mr-1" />
              {!isMobile && "Vehicles"}
            </TabsTrigger>
            <TabsTrigger value="private" className="data-[state=active]:bg-blue-600">
              <Briefcase className="h-4 w-4 mr-1" />
              {!isMobile && "Private Equity"}
            </TabsTrigger>
            <TabsTrigger value="influence" className="data-[state=active]:bg-blue-600">
              <Crown className="h-4 w-4 mr-1" />
              {!isMobile && "Influence"}
            </TabsTrigger>
          </TabsList>

          {/* Market Overview */}
          <TabsContent value="overview" className="space-y-6">
            <MarketOverviewSection />
          </TabsContent>

          {/* Real Estate Empire */}
          <TabsContent value="real-estate" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {realEstate && realEstate.map((property: any) => (
                <AssetCard 
                  key={property.id} 
                  asset={property} 
                  type="real-estate" 
                  icon={property.category === 'Residential' ? Home : Building2}
                />
              ))}
            </div>
          </TabsContent>

          {/* Art & Collectibles */}
          <TabsContent value="art" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artCollectibles && artCollectibles.map((item: any) => (
                <AssetCard 
                  key={item.id} 
                  asset={item} 
                  type="art-collectibles" 
                  icon={item.category === 'Classic Car' ? Car : Palette}
                />
              ))}
            </div>
          </TabsContent>

          {/* Luxury Vehicles */}
          <TabsContent value="vehicles" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {luxuryVehicles && luxuryVehicles.map((vehicle: any) => (
                <AssetCard 
                  key={vehicle.id} 
                  asset={vehicle} 
                  type="luxury-vehicles" 
                  icon={vehicle.type === 'Private Jet' ? Plane : vehicle.type === 'Superyacht' ? Ship : Car}
                />
              ))}
            </div>
          </TabsContent>

          {/* Private Investments */}
          <TabsContent value="private" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {privateInvestments && privateInvestments.map((investment: any) => (
                <AssetCard 
                  key={investment.id} 
                  asset={investment} 
                  type="private-investments" 
                  icon={Briefcase}
                />
              ))}
            </div>
          </TabsContent>

          {/* Political Influence */}
          <TabsContent value="influence" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {politicalActions && politicalActions.map((action: any) => (
                <AssetCard 
                  key={action.id} 
                  asset={action} 
                  type="political-actions" 
                  icon={Crown}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
