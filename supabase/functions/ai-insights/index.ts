import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing required environment variables");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch recent business data
    const today = new Date().toISOString().split("T")[0];
    const lastWeek = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];

    const [ordersResult, inventoryResult] = await Promise.all([
      supabase
        .from("orders")
        .select("total, status, created_at")
        .gte("created_at", lastWeek),
      supabase
        .from("inventory_items")
        .select("name, quantity, reorder_level, category")
        .lte("quantity", supabase.rpc("reorder_level"))
        .limit(10),
    ]);

    if (ordersResult.error) throw ordersResult.error;
    if (inventoryResult.error) throw inventoryResult.error;

    const orders = ordersResult.data || [];
    const lowStockItems = inventoryResult.data || [];

    // Prepare context for AI
    const totalSales = orders.reduce((sum, o) => sum + Number(o.total), 0);
    const todayOrders = orders.filter((o) => o.created_at.startsWith(today));
    const completedOrders = orders.filter((o) => o.status === "completed");

    const context = `
Business Performance (Last 7 Days):
- Total Orders: ${orders.length}
- Completed Orders: ${completedOrders.length}
- Total Revenue: ₨ ${totalSales.toLocaleString()}
- Today's Orders: ${todayOrders.length}
- Low Stock Items: ${lowStockItems.length}

Low Stock Alert:
${lowStockItems.map((item) => `- ${item.name}: ${item.quantity} units (reorder at ${item.reorder_level})`).join("\n")}

Provide 3-5 actionable business insights and recommendations based on this data.
`;

    console.log("Generating AI insights with context:", context.substring(0, 200) + "...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You are a business intelligence analyst for a restaurant. Provide clear, actionable insights in 3-5 bullet points.",
          },
          { role: "user", content: context },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const insights = data.choices?.[0]?.message?.content || "No insights generated";

    return new Response(
      JSON.stringify({ insights, summary: { totalSales, totalOrders: orders.length, lowStockCount: lowStockItems.length } }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("AI insights error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
