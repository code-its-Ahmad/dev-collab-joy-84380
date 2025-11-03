import { Bell, Globe, Menu as MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const { language, toggleLanguage, isUrdu } = useLanguage();
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    { id: 1, title: "Tomatoes expiring in 2 days", type: "warning" },
    { id: 2, title: "Low stock: Rice", type: "alert" },
    { id: 3, title: "FBR Report Due", type: "info" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm backdrop-blur-sm bg-card/95">
      <div className="container flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
            <span className="text-primary-foreground font-heading font-bold text-xl">ت</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-heading font-bold text-xl text-foreground">TadbeerPOS</h1>
            <p className="text-xs text-muted-foreground">Smart Restaurant Management</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative hover:bg-accent"
                aria-label="Change language"
              >
                <Globe className="h-5 w-5" />
                <span className="absolute -bottom-1 -right-1 text-[10px] font-bold bg-primary text-primary-foreground rounded-full h-4 w-4 flex items-center justify-center">
                  {language.toUpperCase()}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => toggleLanguage()}>
                <span className="flex items-center gap-2">
                  {isUrdu ? "🇬🇧 English" : "🇵🇰 اردو"}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative hover:bg-accent"
                aria-label="View notifications"
              >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse"
                  >
                    {notifications.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Notifications</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                  >
                    <p className="text-sm font-medium">{notif.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 capitalize">{notif.type}</p>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
