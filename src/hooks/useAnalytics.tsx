import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AnalyticsData {
  todaySales: number;
  todayOrders: number;
  lowStockCount: number;
  wasteReduction: number;
  salesTrend: number;
  ordersTrend: number;
}

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData>({
    todaySales: 0,
    todayOrders: 0,
    lowStockCount: 0,
    wasteReduction: 42,
    salesTrend: 0,
    ordersTrend: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split("T")[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

      // Fetch today's orders
      const { data: todayOrders, error: todayError } = await supabase
        .from("orders")
        .select("total, created_at")
        .gte("created_at", today);

      if (todayError) throw todayError;

      // Fetch yesterday's orders for comparison
      const { data: yesterdayOrders, error: yesterdayError } = await supabase
        .from("orders")
        .select("total, created_at")
        .gte("created_at", yesterday)
        .lt("created_at", today);

      if (yesterdayError) throw yesterdayError;

      // Fetch low stock items
      const { data: inventory, error: lowStockError } = await supabase
        .from("inventory_items")
        .select("id, quantity, reorder_level");

      if (lowStockError) throw lowStockError;

      const lowStock = inventory?.filter(item => item.quantity <= item.reorder_level) || [];

      const todaySales = todayOrders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;
      const yesterdaySales = yesterdayOrders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;
      const salesTrend = yesterdaySales > 0 ? ((todaySales - yesterdaySales) / yesterdaySales) * 100 : 0;
      const ordersTrend = yesterdayOrders?.length ? ((todayOrders?.length || 0) - yesterdayOrders.length) / yesterdayOrders.length * 100 : 0;

      setData({
        todaySales,
        todayOrders: todayOrders?.length || 0,
        lowStockCount: lowStock.length,
        wasteReduction: 42, // This would come from waste tracking
        salesTrend,
        ordersTrend,
      });
    } catch (error: any) {
      console.error("Failed to fetch analytics:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();

    // Refresh analytics every 5 minutes
    const interval = setInterval(fetchAnalytics, 300000);

    return () => clearInterval(interval);
  }, [fetchAnalytics]);

  return { data, loading, refresh: fetchAnalytics };
}
