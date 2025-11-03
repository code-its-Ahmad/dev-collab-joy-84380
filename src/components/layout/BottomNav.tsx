import { NavLink } from "react-router-dom";
import { Home, ShoppingCart, Package, BarChart3, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Dashboard", icon: Home },
  { path: "/pos", label: "POS", icon: ShoppingCart },
  { path: "/inventory", label: "Inventory", icon: Package },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/more", label: "More", icon: Menu },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card shadow-lg">
      <div className="flex items-center justify-around h-20 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all min-w-[64px]",
                "hover:bg-accent/50",
                isActive
                  ? "text-primary bg-accent"
                  : "text-muted-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn("h-6 w-6", isActive && "text-primary")} />
                <span className="text-xs font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
