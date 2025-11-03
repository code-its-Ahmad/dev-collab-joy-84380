import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Package, FileText, TrendingUp, AlertCircle, Sparkles, ArrowUpRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useInventory } from "@/contexts/InventoryContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const navigate = useNavigate();
  const { isUrdu } = useLanguage();
  const { data: analytics, loading: analyticsLoading } = useAnalytics();
  const { items: inventory, loading: inventoryLoading } = useInventory();
  
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening";
  const businessName = "TadbeerPOS";

  const lowStockItems = inventory.filter(item => item.quantity <= item.reorder_level);
  const expiringItems = inventory.filter(item => {
    // Mock expiring logic - in real app would check batch expiry dates
    return Math.random() > 0.9;
  });

  return (
    <div className="container px-4 py-6 space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Welcome Section with Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 p-6 md:p-8 border border-primary/20">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <p className="text-sm font-medium text-primary">{greeting}</p>
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
            {businessName}
          </h1>
          <p className="text-muted-foreground">Here's what's happening with your business today</p>
        </div>
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -left-8 -top-8 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* AI Insights Widget */}
      <Alert className="border-accent bg-accent/10">
        <AlertCircle className="h-4 w-4 text-accent" />
        <AlertDescription className="text-sm">
          <strong>AI Insight:</strong> Your lunch rush is predicted to be 20% higher today based on weather patterns. Consider preparing extra inventory.
        </AlertDescription>
      </Alert>

      {/* Sales Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/analytics")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Today's Sales
              <ArrowUpRight className="h-4 w-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold text-foreground">₨ {analytics.todaySales.toLocaleString()}</div>
                <p className={`text-xs mt-1 flex items-center gap-1 ${analytics.salesTrend >= 0 ? 'text-primary' : 'text-destructive'}`}>
                  <TrendingUp className="h-3 w-3" />
                  {analytics.salesTrend >= 0 ? '+' : ''}{analytics.salesTrend.toFixed(1)}% from yesterday
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/orders")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Orders
              <ArrowUpRight className="h-4 w-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-foreground">{analytics.todayOrders}</div>
                <p className={`text-xs mt-1 flex items-center gap-1 ${analytics.ordersTrend >= 0 ? 'text-primary' : 'text-destructive'}`}>
                  <TrendingUp className="h-3 w-3" />
                  {analytics.ordersTrend >= 0 ? '+' : ''}{analytics.ordersTrend.toFixed(0)} from yesterday
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/inventory")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Low Stock Items
              <ArrowUpRight className="h-4 w-4 text-destructive" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {inventoryLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <>
                <div className="text-2xl font-bold text-destructive">{lowStockItems.length}</div>
                <p className="text-xs text-destructive mt-1">Needs attention</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/analytics")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Waste Reduced
              <ArrowUpRight className="h-4 w-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{analytics.wasteReduction}%</div>
            <p className="text-xs text-muted-foreground mt-1">vs last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="font-heading flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <Button 
            onClick={() => navigate("/pos")}
            className="h-auto py-4 flex-col gap-2 hover:scale-105 transition-transform" 
            variant="default"
          >
            <Plus className="h-6 w-6" />
            <span>New Order</span>
          </Button>
          <Button 
            onClick={() => navigate("/inventory")}
            className="h-auto py-4 flex-col gap-2 hover:scale-105 transition-transform" 
            variant="secondary"
          >
            <Package className="h-6 w-6" />
            <span>View Inventory</span>
          </Button>
          <Button 
            onClick={() => navigate("/orders")}
            className="h-auto py-4 flex-col gap-2 hover:scale-105 transition-transform" 
            variant="outline"
          >
            <FileText className="h-6 w-6" />
            <span>Orders</span>
          </Button>
          <Button 
            onClick={() => navigate("/analytics")}
            className="h-auto py-4 flex-col gap-2 hover:scale-105 transition-transform" 
            variant="outline"
          >
            <TrendingUp className="h-6 w-6" />
            <span>Analytics</span>
          </Button>
        </CardContent>
      </Card>

      {/* Pending Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading flex items-center justify-between">
            Pending Alerts
            <span className="bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full">
              {lowStockItems.length + expiringItems.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {inventoryLoading ? (
            <>
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </>
          ) : (
            <>
              {expiringItems.slice(0, 2).map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors cursor-pointer" onClick={() => navigate("/inventory")}>
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{item.name} expiring soon</p>
                    <p className="text-xs text-muted-foreground mt-1">Consider marking down or using soon</p>
                  </div>
                </div>
              ))}
              {lowStockItems.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors cursor-pointer" onClick={() => navigate("/inventory")}>
                  <AlertCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">Low stock: {item.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Current: {item.quantity} {item.unit}, Reorder at: {item.reorder_level} {item.unit}
                    </p>
                  </div>
                </div>
              ))}
              {lowStockItems.length === 0 && expiringItems.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No alerts at the moment</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
