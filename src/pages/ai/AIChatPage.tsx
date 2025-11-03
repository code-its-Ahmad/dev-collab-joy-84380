import { AIChat } from "@/components/ai/AIChat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AIChatPage() {
  return (
    <div className="container px-4 py-6 max-w-6xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">AI Assistant</h1>
        <p className="text-muted-foreground">Get intelligent insights and recommendations for your business</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="h-[calc(100vh-280px)]">
          <AIChat 
            type="general" 
            title="General Assistant"
            placeholder="Ask about menu planning, operations, or general advice..."
          />
        </TabsContent>

        <TabsContent value="inventory" className="h-[calc(100vh-280px)]">
          <AIChat 
            type="inventory" 
            title="Inventory Optimizer"
            placeholder="Ask about stock levels, reordering, or inventory management..."
          />
        </TabsContent>

        <TabsContent value="sales" className="h-[calc(100vh-280px)]">
          <AIChat 
            type="sales" 
            title="Sales Analyst"
            placeholder="Ask about sales trends, pricing, or revenue optimization..."
          />
        </TabsContent>

        <TabsContent value="forecast" className="h-[calc(100vh-280px)]">
          <AIChat 
            type="forecast" 
            title="Demand Forecaster"
            placeholder="Ask about future demand, seasonal trends, or preparation tips..."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
