import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { MenuItemCard } from "./MenuItemCard";
import { MenuItem } from "@/pages/pos/POSPage";

interface MenuItemsGridProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function MenuItemsGrid({
  items,
  onAddToCart,
  searchQuery,
  onSearchChange,
}: MenuItemsGridProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search menu items..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-12 text-base"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No items found</p>
        </div>
      )}
    </div>
  );
}
