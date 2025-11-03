import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MenuItem } from "@/pages/pos/POSPage";
import { cn } from "@/lib/utils";

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden transition-all hover:shadow-md",
        !item.available && "opacity-50"
      )}
    >
      <CardContent className="p-0">
        <div className="aspect-square bg-muted flex items-center justify-center text-muted-foreground">
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm">No image</span>
          )}
        </div>
        <div className="p-3 space-y-2">
          <div>
            <h4 className="font-medium text-foreground line-clamp-1">{item.name}</h4>
            <p className="text-lg font-bold text-primary">₨ {item.price}</p>
          </div>
          <Button
            size="sm"
            className="w-full h-11"
            onClick={() => onAddToCart(item)}
            disabled={!item.available}
          >
            <Plus className="mr-2 h-4 w-4" />
            {item.available ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
