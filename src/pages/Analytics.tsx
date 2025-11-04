import { useState, useEffect } from "react";
import { useInventory } from "@/contexts/InventoryContext";
import { useOrders } from "@/contexts/OrdersContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCards } from "@/components/analytics/StatsCards";
import { SalesChart, OrdersChart } from "@/components/analytics/SalesChart";
import { TopItems } from "@/components/analytics/TopItems";
import { AIInsightsWidget } from "@/components/analytics/AIInsightsWidget";
import { Download, Calendar } from "lucide-react";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

export default function Analytics() {
  const { getLowStockItems, items: inventory } = useInventory();
  const { orders } = useOrders();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  // Calculate stats
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
  const lowStockItems = getLowStockItems().length;

  // Generate chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(), -6 + i);
    const dateStr = format(date, "MMM dd");
    const dayOrders = orders.filter(
      (order) => format(new Date(order.createdAt), "MMM dd") === dateStr
    );
    return {
      date: dateStr,
      sales: dayOrders.reduce((sum, order) => sum + order.total, 0),
      orders: dayOrders.length,
    };
  });

  // Calculate top items
  const itemSales = new Map<string, { quantity: number; revenue: number }>();
  orders.forEach((order) => {
    order.items.forEach((item) => {
      const existing = itemSales.get(item.name) || { quantity: 0, revenue: 0 };
      itemSales.set(item.name, {
        quantity: existing.quantity + item.quantity,
        revenue: existing.revenue + item.price * item.quantity,
      });
    });
  });

  const topItems = Array.from(itemSales.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="container px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Analytics & Reports</h1>
          <p className="text-muted-foreground mt-1">Track your business performance and insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <AIInsightsWidget />
          
          <StatsCards
            totalSales={totalSales}
            totalOrders={totalOrders}
            averageOrderValue={averageOrderValue}
            lowStockItems={lowStockItems}
            salesChange={12.5}
            ordersChange={8.3}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <SalesChart data={last7Days} />
            <OrdersChart data={last7Days} />
          </div>

          <TopItems items={topItems} />
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <StatsCards
            totalSales={totalSales}
            totalOrders={totalOrders}
            averageOrderValue={averageOrderValue}
            lowStockItems={lowStockItems}
          />
          <SalesChart data={last7Days} />
          <TopItems items={topItems} />
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Performance</CardTitle>
              <CardDescription>Stock turnover and valuation metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Inventory Value</p>
                  <p className="text-2xl font-bold">
                    ₨ {inventory.reduce((sum, item) => sum + (Number(item.cost_price) * item.quantity), 0).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Items</p>
                  <p className="text-2xl font-bold">{inventory.length}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Low Stock Items</p>
                  <p className="text-2xl font-bold text-destructive">{getLowStockItems().length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
