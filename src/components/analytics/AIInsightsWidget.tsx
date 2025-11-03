import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";
import { useAIInsights } from "@/hooks/useAIInsights";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function AIInsightsWidget() {
  const { insights, summary, loading, generateInsights } = useAIInsights();

  useEffect(() => {
    generateInsights();
  }, []);

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Business Insights
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={generateInsights}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ) : insights ? (
          <div className="prose prose-sm max-w-none">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4 border border-primary/20">
              <p className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
                {insights}
              </p>
            </div>
            {summary && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center p-3 rounded-lg bg-muted">
                  <p className="text-2xl font-bold text-primary">₨ {summary.totalSales.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">Total Sales</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted">
                  <p className="text-2xl font-bold text-primary">{summary.totalOrders}</p>
                  <p className="text-xs text-muted-foreground mt-1">Orders</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted">
                  <p className="text-2xl font-bold text-destructive">{summary.lowStockCount}</p>
                  <p className="text-xs text-muted-foreground mt-1">Low Stock</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            Click "Refresh" to generate AI-powered insights for your business
          </p>
        )}
      </CardContent>
    </Card>
  );
}
