import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface InsightsSummary {
  totalSales: number;
  totalOrders: number;
  lowStockCount: number;
}

export function useAIInsights() {
  const [insights, setInsights] = useState<string>("");
  const [summary, setSummary] = useState<InsightsSummary | null>(null);
  const [loading, setLoading] = useState(false);

  const generateInsights = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke("ai-insights");

      if (error) throw error;

      setInsights(data.insights);
      setSummary(data.summary);
      toast.success("AI insights generated successfully");
    } catch (error: any) {
      console.error("Failed to generate insights:", error);
      toast.error(error.message || "Failed to generate insights");
    } finally {
      setLoading(false);
    }
  }, []);

  return { insights, summary, loading, generateInsights };
}
