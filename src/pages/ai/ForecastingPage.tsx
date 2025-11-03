import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, Cloud, DollarSign, Package, 
  Calendar, AlertCircle, CheckCircle2, ArrowUpRight,
  ArrowDownRight, ShoppingBag
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";

interface ForecastData {
  date: string;
  predicted: number;
  actual?: number;
  confidence: number;
}

interface ItemForecast {
  id: string;
  name: string;
  currentStock: number;
  predictedDemand: number;
  recommendedOrder: number;
  trend: "up" | "down" | "stable";
  confidence: number;
}

const mockWeeklyData: ForecastData[] = [
  { date: "Mon", predicted: 45000, actual: 43000, confidence: 92 },
  { date: "Tue", predicted: 38000, actual: 39000, confidence: 89 },
  { date: "Wed", predicted: 42000, actual: 41000, confidence: 91 },
  { date: "Thu", predicted: 52000, actual: 54000, confidence: 88 },
  { date: "Fri", predicted: 68000, confidence: 85 },
  { date: "Sat", predicted: 75000, confidence: 87 },
  { date: "Sun", predicted: 65000, confidence: 86 },
];

const mockMonthlyData: ForecastData[] = [
  { date: "Week 1", predicted: 185000, actual: 183000, confidence: 90 },
  { date: "Week 2", predicted: 195000, actual: 198000, confidence: 88 },
  { date: "Week 3", predicted: 210000, actual: 207000, confidence: 89 },
  { date: "Week 4", predicted: 225000, confidence: 87 },
];

const mockItemForecasts: ItemForecast[] = [
  {
    id: "1",
    name: "Chicken Biryani",
    currentStock: 15,
    predictedDemand: 85,
    recommendedOrder: 70,
    trend: "up",
    confidence: 94,
  },
  {
    id: "2",
    name: "Beef Nihari",
    currentStock: 8,
    predictedDemand: 42,
    recommendedOrder: 34,
    trend: "stable",
    confidence: 88,
  },
  {
    id: "3",
    name: "Karahi Gosht",
    currentStock: 22,
    predictedDemand: 38,
    recommendedOrder: 16,
    trend: "down",
    confidence: 86,
  },
];

export default function ForecastingPage() {
  const [timeframe, setTimeframe] = useState<"week" | "month">("week");
  const { isUrdu } = useLanguage();

  const data = timeframe === "week" ? mockWeeklyData : mockMonthlyData;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case "down":
        return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      default:
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-blue-600";
    }
  };

  return (
    <div className="container px-4 py-6 space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">
          {isUrdu ? "مانگ کی پیش گوئی" : "Demand Forecasting"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {isUrdu
            ? "AI سے چلنے والی پیشن گوئیوں کے ساتھ آگے کی منصوبہ بندی کریں"
            : "Plan ahead with AI-powered predictions"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {isUrdu ? "اس ہفتے کی پیشن گوئی" : "This Week"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">PKR 340K</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3" />
              +15% {isUrdu ? "پچھلے ہفتے سے" : "from last week"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              {isUrdu ? "موسم کا اثر" : "Weather Impact"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">+12%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {isUrdu ? "ٹھنڈا موسم متوقع" : "Cool weather expected"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              {isUrdu ? "آرڈر کی سفارشات" : "Order Recommendations"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">12</div>
            <p className="text-xs text-muted-foreground mt-1">
              {isUrdu ? "اشیاء دوبارہ آرڈر کریں" : "items to reorder"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              {isUrdu ? "اعتماد کی سطح" : "Confidence"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">89%</div>
            <p className="text-xs text-green-600 mt-1">
              {isUrdu ? "اعلیٰ درستگی" : "High accuracy"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Forecasting Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-heading">
                {isUrdu ? "سیلز کی پیشن گوئی" : "Sales Forecast"}
              </CardTitle>
              <CardDescription>
                {isUrdu ? "پیشن گوئی بمقابلہ حقیقی سیلز" : "Predicted vs Actual Sales"}
              </CardDescription>
            </div>
            <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as any)}>
              <TabsList>
                <TabsTrigger value="week">{isUrdu ? "ہفتہ" : "Week"}</TabsTrigger>
                <TabsTrigger value="month">{isUrdu ? "مہینہ" : "Month"}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                name="Actual"
              />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Predicted"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Item Forecasts */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">
            {isUrdu ? "اشیاء کی پیشن گوئی" : "Item Forecasts"}
          </CardTitle>
          <CardDescription>
            {isUrdu ? "اگلے 7 دنوں کی مانگ" : "Next 7 days demand prediction"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockItemForecasts.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold text-foreground">{item.name}</h3>
                    {getTrendIcon(item.trend)}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">
                        {isUrdu ? "موجودہ اسٹاک" : "Current Stock"}
                      </p>
                      <p className="font-medium text-lg">{item.currentStock}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">
                        {isUrdu ? "پیشن گوئی شدہ مانگ" : "Predicted Demand"}
                      </p>
                      <p className={`font-medium text-lg ${getTrendColor(item.trend)}`}>
                        {item.predictedDemand}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">
                        {isUrdu ? "تجویز کردہ آرڈر" : "Recommended Order"}
                      </p>
                      <p className="font-medium text-lg text-primary">
                        {item.recommendedOrder}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">
                        {isUrdu ? "اعتماد" : "Confidence"}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-lg">{item.confidence}%</p>
                        <Badge variant="secondary" className="text-xs">
                          {item.confidence >= 90 ? "High" : "Medium"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm">
                      <Package className="h-4 w-4 mr-1" />
                      {isUrdu ? "دوبارہ آرڈر کریں" : "Reorder Now"}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Calendar className="h-4 w-4 mr-1" />
                      {isUrdu ? "شیڈول کریں" : "Schedule"}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg font-heading">
                {isUrdu ? "AI بصیرت" : "AI Insights"}
              </CardTitle>
              <CardDescription className="mt-2 space-y-2">
                <p>
                  • {isUrdu 
                    ? "آئندہ ہفتے کے آخر میں 15% زیادہ مانگ متوقع ہے"
                    : "15% higher demand expected next weekend due to local event"}
                </p>
                <p>
                  • {isUrdu
                    ? "ٹھنڈا موسم گرم کھانوں کی فروخت میں 12% اضافہ کر سکتا ہے"
                    : "Cool weather may increase hot food sales by 12%"}
                </p>
                <p>
                  • {isUrdu
                    ? "چکن بریانی کی تاریخی طور پر جمعرات کو زیادہ فروخت ہوتی ہے"
                    : "Chicken Biryani historically sells 40% more on Thursdays"}
                </p>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
