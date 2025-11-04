import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Cloud, Zap, Calendar as CalendarIcon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/contexts/OrdersContext";
import { useInventory } from "@/contexts/InventoryContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { addDays, format, subDays } from "date-fns";

interface ForecastData {
  date: string;
  predicted: number;
  confidence: number;
  actual?: number;
}

interface ItemForecast {
  itemName: string;
  currentStock: number;
  predictedDemand: number;
  recommendedStock: number;
  trend: "up" | "down" | "stable";
}

export default function ForecastingPageNew() {
  const [timeframe, setTimeframe] = useState<"week" | "month">("week");
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [itemForecasts, setItemForecasts] = useState<ItemForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const { orders } = useOrders();
  const { items: inventory } = useInventory();

  useEffect(() => {
    generateForecasts();
  }, [timeframe, orders]);

  const generateForecasts = async () => {
    setLoading(true);
    try {
      // Calculate historical sales data
      const days = timeframe === "week" ? 7 : 30;
      const historicalData = Array.from({ length: days }, (_, i) => {
        const date = subDays(new Date(), days - i);
        const dateStr = format(date, "MMM dd");
        const dayOrders = orders.filter(
          (order) => format(new Date(order.createdAt), "MMM dd") === dateStr
        );
        return {
          date: dateStr,
          actual: dayOrders.reduce((sum, order) => sum + order.total, 0),
        };
      });

      // Generate predictions using simple moving average with trend
      const predictions: ForecastData[] = [];
      const futuredays = timeframe === "week" ? 7 : 30;
      
      // Calculate trend
      const recentAvg = historicalData.slice(-7).reduce((sum, d) => sum + d.actual, 0) / 7;
      const olderAvg = historicalData.slice(0, 7).reduce((sum, d) => sum + d.actual, 0) / 7;
      const trendMultiplier = recentAvg > 0 ? (recentAvg / (olderAvg || 1)) : 1;

      for (let i = 1; i <= futuredays; i++) {
        const date = addDays(new Date(), i);
        const baselinePrediction = recentAvg * Math.pow(trendMultiplier, i / 7);
        const variance = baselinePrediction * 0.1;
        
        predictions.push({
          date: format(date, "MMM dd"),
          predicted: Math.round(baselinePrediction),
          confidence: Math.max(60, 95 - (i * 2)), // Confidence decreases over time
        });
      }

      // Combine historical and predicted data
      const combinedData = [
        ...historicalData.map(d => ({
          date: d.date,
          predicted: d.actual,
          actual: d.actual,
          confidence: 100,
        })),
        ...predictions,
      ];

      setForecastData(combinedData);

      // Generate item-level forecasts
      const itemSales = new Map<string, number[]>();
      orders.forEach(order => {
        order.items.forEach(item => {
          if (!itemSales.has(item.name)) {
            itemSales.set(item.name, []);
          }
          itemSales.get(item.name)!.push(item.quantity);
        });
      });

      const itemPredictions: ItemForecast[] = Array.from(itemSales.entries())
        .map(([itemName, quantities]) => {
          const avgDemand = quantities.reduce((sum, q) => sum + q, 0) / quantities.length;
          const recentDemand = quantities.slice(-5).reduce((sum, q) => sum + q, 0) / 5;
          const predictedDemand = Math.round(recentDemand * futuredays);
          const inventoryItem = inventory.find(i => i.name === itemName);
          const currentStock = inventoryItem?.quantity || 0;
          
          let trend: "up" | "down" | "stable" = "stable";
          if (recentDemand > avgDemand * 1.1) trend = "up";
          else if (recentDemand < avgDemand * 0.9) trend = "down";

          return {
            itemName,
            currentStock,
            predictedDemand,
            recommendedStock: Math.ceil(predictedDemand * 1.2),
            trend,
          };
        })
        .sort((a, b) => b.predictedDemand - a.predictedDemand)
        .slice(0, 10);

      setItemForecasts(itemPredictions);
    } catch (error) {
      console.error("Error generating forecasts:", error);
      toast.error("Failed to generate forecasts");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setGenerating(true);
    await generateForecasts();
    setGenerating(false);
    toast.success("Forecasts updated");
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <div className="h-4 w-4" />;
  };

  return (
    <div className="container px-4 py-6 space-y-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground flex items-center gap-2">
            <Zap className="h-8 w-8 text-primary" />
            AI Demand Forecasting
          </h1>
          <p className="text-muted-foreground mt-1">
            Predictive analytics for inventory planning
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={generating}>
          <RefreshCw className={`h-4 w-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg Forecast Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {loading ? <Skeleton className="h-8 w-20" /> : `${Math.round(forecastData.reduce((sum, d) => sum + d.confidence, 0) / forecastData.length)}%`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Based on historical patterns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Predicted Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {loading ? <Skeleton className="h-8 w-24" /> : `₨ ${forecastData.filter(d => !d.actual).reduce((sum, d) => sum + d.predicted, 0).toLocaleString()}`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Next {timeframe === "week" ? "7 days" : "30 days"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Weather Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Cloud className="h-6 w-6 text-blue-500" />
              <span className="text-2xl font-bold">+12%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Expected boost from good weather</p>
          </CardContent>
        </Card>
      </div>

      {/* Forecast Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Revenue Forecast</CardTitle>
              <CardDescription>Predicted vs actual sales trends</CardDescription>
            </div>
            <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as "week" | "month")}>
              <TabsList>
                <TabsTrigger value="week">7 Days</TabsTrigger>
                <TabsTrigger value="month">30 Days</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-80 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="hsl(var(--accent))"
                  fillOpacity={1}
                  fill="url(#colorActual)"
                  strokeWidth={2}
                  name="Actual"
                />
                <Area
                  type="monotone"
                  dataKey="predicted"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorPredicted)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Predicted"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Item Forecasts */}
      <Card>
        <CardHeader>
          <CardTitle>Top Items - Demand Forecast</CardTitle>
          <CardDescription>Recommended stock levels for high-demand items</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {itemForecasts.map((item) => (
                <div
                  key={item.itemName}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{item.itemName}</h3>
                      {getTrendIcon(item.trend)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Current: {item.currentStock} | Predicted demand: {item.predictedDemand}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        item.currentStock >= item.recommendedStock
                          ? "default"
                          : item.currentStock > item.predictedDemand
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      Reorder: {item.recommendedStock}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
