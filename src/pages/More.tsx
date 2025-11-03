import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, Menu as MenuIcon, Settings, HelpCircle, Users, Bot, TrendingUp, Utensils, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const menuSections = [
  {
    title: "AI Features",
    items: [
      { label: "AI Assistant", icon: Bot, path: "/ai-chat" },
      { label: "Waste Optimizer", icon: TrendingUp, path: "/waste-optimizer" },
      { label: "Demand Forecasting", icon: TrendingUp, path: "/forecasting" },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Menu Management", icon: Utensils, path: "/menu" },
      { label: "Orders History", icon: MenuIcon, path: "/orders" },
      { label: "User Management", icon: Users, path: "/users" },
    ],
  },
  {
    title: "Settings & Support",
    items: [
      { label: "Settings", icon: Settings, path: "/settings" },
      { label: "Help & Support", icon: HelpCircle, path: "/help" },
    ],
  },
];

export default function More() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/auth/login');
  };

  return (
    <div className="container px-4 py-6 space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">More</h1>
        <p className="text-muted-foreground mt-1">Additional features and settings</p>
        {user && (
          <p className="text-sm text-muted-foreground mt-2">
            Logged in as: <span className="font-medium text-foreground">{user.email}</span>
          </p>
        )}
      </div>

      {menuSections.map((section) => (
        <Card key={section.title}>
          <CardHeader>
            <CardTitle className="font-heading text-lg">{section.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {section.items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium text-foreground">{item.label}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            ))}
          </CardContent>
        </Card>
      ))}
      
      <Card>
        <CardContent className="pt-6">
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
