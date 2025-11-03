import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", label: "All Items" },
  { id: "mains", label: "Main Dishes" },
  { id: "appetizers", label: "Appetizers" },
  { id: "drinks", label: "Drinks" },
  { id: "desserts", label: "Desserts" },
];

interface MenuCategoriesProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function MenuCategories({ selectedCategory, onSelectCategory }: MenuCategoriesProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-heading font-semibold text-sm text-muted-foreground uppercase mb-3">
        Categories
      </h3>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "ghost"}
          className={cn(
            "w-full justify-start h-12 text-base",
            selectedCategory === category.id && "bg-primary text-primary-foreground"
          )}
          onClick={() => onSelectCategory(category.id)}
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
}
