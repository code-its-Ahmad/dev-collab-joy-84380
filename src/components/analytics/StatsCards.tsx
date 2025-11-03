import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, AlertTriangle } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  format?: "currency" | "number" | "percentage";
}

function StatCard({ title, value, change, icon, format = "number" }: StatCardProps) {
  const formattedValue = 
    format === "currency" ? `₨${value}` :
    format === "percentage" ? `${value}%` :
    value;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue}</div>
        {change !== undefined && (
          <p className={`text-xs flex items-center gap-1 mt-1 ${change >= 0 ? "text-success" : "text-destructive"}`}>
            {change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(change)}% from last period
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface StatsCardsProps {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  lowStockItems: number;
  salesChange?: number;
  ordersChange?: number;
}

export function StatsCards({
  totalSales,
  totalOrders,
  averageOrderValue,
  lowStockItems,
  salesChange,
  ordersChange,
}: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Sales"
        value={totalSales.toFixed(2)}
        change={salesChange}
        icon={<DollarSign className="h-4 w-4" />}
        format="currency"
      />
      <StatCard
        title="Total Orders"
        value={totalOrders}
        change={ordersChange}
        icon={<ShoppingCart className="h-4 w-4" />}
      />
      <StatCard
        title="Avg. Order Value"
        value={averageOrderValue.toFixed(2)}
        icon={<Package className="h-4 w-4" />}
        format="currency"
      />
      <StatCard
        title="Low Stock Items"
        value={lowStockItems}
        icon={<AlertTriangle className="h-4 w-4" />}
      />
    </div>
  );
}
