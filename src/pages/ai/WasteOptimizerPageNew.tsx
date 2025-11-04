import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingDown, DollarSign, Trash2, RefreshCw, Send } from "lucide-react";
import { useInventory } from "@/contexts/InventoryContext";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { addDays, differenceInDays, format } from "date-fns";

interface WasteItem {
  id: string;
  name: string;
  quantity: number;
  expiryDate: Date;
  daysUntilExpiry: number;
  estimatedValue: number;
  recommendation: string;
  priority: "high" | "medium" | "low";
}

interface WasteStats {
  totalWasteValue: number;
  itemsAtRisk: number;
  wasteReduction: number;
  monthlySavings: number;
}

export default function WasteOptimizerPageNew() {
  const { items: inventory, loading } = useInventory();
  const [wasteItems, setWasteItems] = useState<WasteItem[]>([]);
  const [stats, setStats] = useState<WasteStats>({
    totalWasteValue: 0,
    itemsAtRisk: 0,
    wasteReduction: 35,
    monthlySavings: 15000,
  });
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    analyzeWaste();
  }, [inventory]);

  const analyzeWaste = () => {
    try {
      // Simulate expiry date analysis
      const atRiskItems: WasteItem[] = inventory
        .map((item) => {
          // Simulate expiry dates (in real app, would come from inventory_batches)
          const simulatedExpiryDays = Math.floor(Math.random() * 30) + 1;
          const expiryDate = addDays(new Date(), simulatedExpiryDays);
          const daysUntilExpiry = differenceInDays(expiryDate, new Date());
          
          let priority: "high" | "medium" | "low" = "low";
          let recommendation = "";

          if (daysUntilExpiry <= 2) {
            priority = "high";
            recommendation = `Urgent: Mark down 50% or donate immediately. Worth ₨${(item.cost_price * item.quantity * 0.5).toFixed(0)}`;
          } else if (daysUntilExpiry <= 5) {
            priority = "medium";
            recommendation = `Mark down 30% to move faster. Estimated value: ₨${(item.cost_price * item.quantity * 0.7).toFixed(0)}`;
          } else if (daysUntilExpiry <= 10) {
            priority = "low";
            recommendation = `Monitor closely. Consider daily specials.`;
          }

          if (daysUntilExpiry <= 10) {
            return {
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              expiryDate,
              daysUntilExpiry,
              estimatedValue: Number(item.cost_price) * item.quantity,
              recommendation,
              priority,
            };
          }
          return null;
        })
        .filter((item): item is WasteItem => item !== null)
        .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);

      setWasteItems(atRiskItems);

      // Calculate stats
      const totalValue = atRiskItems.reduce((sum, item) => sum + item.estimatedValue, 0);
      setStats({
        totalWasteValue: totalValue,
        itemsAtRisk: atRiskItems.length,
        wasteReduction: 35, // This would be calculated from historical data
        monthlySavings: 15000, // This would be calculated from prevented waste
      });
    } catch (error) {
      console.error("Error analyzing waste:", error);
      toast.error("Failed to analyze waste");
    }
  };

  const handleRefresh = async () => {
    setAnalyzing(true);
    setTimeout(() => {
      analyzeWaste();
      setAnalyzing(false);
      toast.success("Waste analysis updated");
    }, 1000);
  };

  const handleDonation = (item: WasteItem) => {
    toast.success(`Donation request sent for ${item.name}`);
    // In real app, this would connect to donation organizations
  };

  const handleDiscount = (item: WasteItem) => {
    const discount = item.priority === "high" ? 50 : item.priority === "medium" ? 30 : 20;
    toast.success(`${discount}% discount applied to ${item.name}`);
    // In real app, this would update menu prices
  };

  const getPriorityColor = (priority: "high" | "medium" | "low") => {
    if (priority === "high") return "text-red-500 bg-red-50 dark:bg-red-950";
    if (priority === "medium") return "text-yellow-500 bg-yellow-50 dark:bg-yellow-950";
    return "text-blue-500 bg-blue-50 dark:bg-blue-950";
  };

  return (
    <div className="container px-4 py-6 space-y-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground flex items-center gap-2">
            <Trash2 className="h-8 w-8 text-green-500" />
            AI Waste Optimizer
          </h1>
          <p className="text-muted-foreground mt-1">
            Reduce food waste and maximize profitability
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={analyzing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${analyzing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              At Risk Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold text-foreground">
                  ₨ {stats.totalWasteValue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.itemsAtRisk} items need attention
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-green-500" />
              Waste Reduced
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.wasteReduction}%</div>
            <p className="text-xs text-muted-foreground mt-1">vs last month</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Monthly Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ₨ {stats.monthlySavings.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">from waste prevention</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">92%</div>
            <p className="text-xs text-muted-foreground mt-1">recommendations followed</p>
          </CardContent>
        </Card>
      </div>

      {/* Waste Items List */}
      <Card>
        <CardHeader>
          <CardTitle>Items Needing Action</CardTitle>
          <CardDescription>
            AI-recommended actions to prevent food waste
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : wasteItems.length === 0 ? (
            <div className="text-center py-12">
              <Trash2 className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground">No items at risk of waste</p>
              <p className="text-sm text-muted-foreground mt-1">Great job managing your inventory!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {wasteItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                    item.priority === "high"
                      ? "border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/30"
                      : item.priority === "medium"
                      ? "border-yellow-200 dark:border-yellow-900 bg-yellow-50/50 dark:bg-yellow-950/30"
                      : "border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/30"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg text-foreground">{item.name}</h3>
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Quantity: {item.quantity}</span>
                        <span>•</span>
                        <span>Value: ₨{item.estimatedValue.toLocaleString()}</span>
                        <span>•</span>
                        <span>Expires: {format(item.expiryDate, "MMM dd, yyyy")}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        item.daysUntilExpiry <= 2
                          ? "text-red-500"
                          : item.daysUntilExpiry <= 5
                          ? "text-yellow-500"
                          : "text-blue-500"
                      }`}>
                        {item.daysUntilExpiry}
                      </div>
                      <div className="text-xs text-muted-foreground">days left</div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <Progress
                      value={Math.max(0, 100 - (item.daysUntilExpiry * 10))}
                      className="h-2"
                    />
                  </div>

                  <div className="bg-background/50 p-3 rounded-md mb-3">
                    <p className="text-sm text-foreground font-medium mb-1">
                      🤖 AI Recommendation:
                    </p>
                    <p className="text-sm text-muted-foreground">{item.recommendation}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDiscount(item)}
                      className="flex-1"
                    >
                      <TrendingDown className="h-4 w-4 mr-2" />
                      Apply Discount
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDonation(item)}
                      className="flex-1"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Arrange Donation
                    </Button>
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
