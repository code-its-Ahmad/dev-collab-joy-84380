import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingDown, AlertTriangle, CheckCircle, Clock, 
  DollarSign, Leaf, ShoppingCart, Gift, TrendingUp,
  Calendar, Package
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "sonner";

interface WasteItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expiryDate: Date;
  daysUntilExpiry: number;
  costPrice: number;
  suggestedAction: "discount" | "donate" | "use" | "monitor";
  priority: "high" | "medium" | "low";
}

interface WasteStats {
  totalWasteValue: number;
  itemsAtRisk: number;
  potentialSavings: number;
  wasteReduction: number;
}

const mockWasteItems: WasteItem[] = [
  {
    id: "1",
    name: "Chicken Breast",
    quantity: 5,
    unit: "kg",
    expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    daysUntilExpiry: 2,
    costPrice: 800,
    suggestedAction: "discount",
    priority: "high",
  },
  {
    id: "2",
    name: "Tomatoes",
    quantity: 3,
    unit: "kg",
    expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    daysUntilExpiry: 1,
    costPrice: 150,
    suggestedAction: "use",
    priority: "high",
  },
  {
    id: "3",
    name: "Yogurt",
    quantity: 8,
    unit: "containers",
    expiryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    daysUntilExpiry: 4,
    costPrice: 400,
    suggestedAction: "monitor",
    priority: "medium",
  },
  {
    id: "4",
    name: "Bread",
    quantity: 12,
    unit: "loaves",
    expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    daysUntilExpiry: 3,
    costPrice: 600,
    suggestedAction: "discount",
    priority: "medium",
  },
];

const mockStats: WasteStats = {
  totalWasteValue: 1950,
  itemsAtRisk: 4,
  potentialSavings: 1365,
  wasteReduction: 42,
};

export default function WasteOptimizerPage() {
  const [wasteItems] = useState<WasteItem[]>(mockWasteItems);
  const [stats] = useState<WasteStats>(mockStats);
  const { isUrdu } = useLanguage();

  const handleAction = (item: WasteItem, action: string) => {
    toast.success(
      isUrdu
        ? `${item.name} کے لیے ${action} لاگو کیا گیا`
        : `${action} applied for ${item.name}`
    );
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "discount":
        return <DollarSign className="h-4 w-4" />;
      case "donate":
        return <Gift className="h-4 w-4" />;
      case "use":
        return <ShoppingCart className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <div className="container px-4 py-6 space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">
          {isUrdu ? "فضلہ آپٹیمائزر" : "Waste Optimizer"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {isUrdu
            ? "AI سے چلنے والی بصیرت کے ساتھ کھانے کی بربادی کو کم کریں"
            : "Reduce food waste with AI-powered insights"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              {isUrdu ? "رسک میں اشیاء" : "Items at Risk"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.itemsAtRisk}</div>
            <Progress value={65} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-red-500" />
              {isUrdu ? "ضائع ہونے کی قیمت" : "Waste Value"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              PKR {stats.totalWasteValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {isUrdu ? "اگلے 7 دنوں میں" : "In next 7 days"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-green-500" />
              {isUrdu ? "ممکنہ بچت" : "Potential Savings"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              PKR {stats.potentialSavings.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {isUrdu ? "تجاویز کو لاگو کریں" : "Apply recommendations"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-blue-500" />
              {isUrdu ? "فضلہ میں کمی" : "Waste Reduction"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.wasteReduction}%</div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">
                {isUrdu ? "+12% پچھلے مہینے سے" : "+12% from last month"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Waste Items Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            {isUrdu ? "تمام" : "All"} ({wasteItems.length})
          </TabsTrigger>
          <TabsTrigger value="high">
            {isUrdu ? "اعلی" : "High"} ({wasteItems.filter((i) => i.priority === "high").length})
          </TabsTrigger>
          <TabsTrigger value="medium">
            {isUrdu ? "درمیانی" : "Medium"} ({wasteItems.filter((i) => i.priority === "medium").length})
          </TabsTrigger>
          <TabsTrigger value="low">
            {isUrdu ? "کم" : "Low"} ({wasteItems.filter((i) => i.priority === "low").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {wasteItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <Badge variant={getPriorityColor(item.priority)}>
                        {item.priority.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">
                          {isUrdu ? "مقدار" : "Quantity"}
                        </p>
                        <p className="font-medium">
                          {item.quantity} {item.unit}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          {isUrdu ? "میعاد ختم" : "Expires in"}
                        </p>
                        <p className="font-medium flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {item.daysUntilExpiry} {isUrdu ? "دن" : "days"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          {isUrdu ? "قیمت" : "Value"}
                        </p>
                        <p className="font-medium">PKR {item.costPrice}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          {isUrdu ? "تجویز" : "Action"}
                        </p>
                        <p className="font-medium capitalize flex items-center gap-1">
                          {getActionIcon(item.suggestedAction)}
                          {item.suggestedAction}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {item.suggestedAction === "discount" && (
                        <Button
                          size="sm"
                          onClick={() => handleAction(item, "Apply 20% discount")}
                        >
                          <DollarSign className="h-4 w-4 mr-1" />
                          {isUrdu ? "20% رعایت دیں" : "Apply 20% Discount"}
                        </Button>
                      )}
                      {item.suggestedAction === "use" && (
                        <Button
                          size="sm"
                          onClick={() => handleAction(item, "Use immediately")}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          {isUrdu ? "فوری استعمال" : "Use Immediately"}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAction(item, "Donate to food bank")}
                      >
                        <Gift className="h-4 w-4 mr-1" />
                        {isUrdu ? "عطیہ کریں" : "Donate"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAction(item, "Mark as used")}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {isUrdu ? "نشان زد" : "Mark Used"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="high">
          {wasteItems
            .filter((i) => i.priority === "high")
            .map((item) => (
              <Card key={item.id} className="p-4 mb-4">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  Expires in {item.daysUntilExpiry} days
                </p>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="medium">
          {wasteItems
            .filter((i) => i.priority === "medium")
            .map((item) => (
              <Card key={item.id} className="p-4 mb-4">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  Expires in {item.daysUntilExpiry} days
                </p>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="low">
          <Card className="p-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-muted-foreground">
              {isUrdu ? "کوئی کم ترجیحی اشیاء نہیں" : "No low priority items"}
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
