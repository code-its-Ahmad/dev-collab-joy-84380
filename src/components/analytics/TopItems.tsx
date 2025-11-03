import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface TopItem {
  name: string;
  quantity: number;
  revenue: number;
}

interface TopItemsProps {
  items: TopItem[];
}

export function TopItems({ items }: TopItemsProps) {
  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Top Selling Items</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          {items.slice(0, 5).map((item, index) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="font-mono">
                  #{index + 1}
                </Badge>
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.quantity} sold</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">₨{item.revenue.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={items.slice(0, 5)}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
