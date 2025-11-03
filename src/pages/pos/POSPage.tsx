import { useState } from "react";
import { MenuCategories } from "@/components/pos/MenuCategories";
import { MenuItemsGrid } from "@/components/pos/MenuItemsGrid";
import { ShoppingCart } from "@/components/pos/ShoppingCart";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { toast } from "sonner";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

const mockMenuItems: MenuItem[] = [
  { id: "1", name: "Chicken Biryani", price: 450, category: "mains", available: true },
  { id: "2", name: "Beef Nihari", price: 650, category: "mains", available: true },
  { id: "3", name: "Karahi Gosht", price: 800, category: "mains", available: true },
  { id: "4", name: "Chapli Kebab", price: 350, category: "appetizers", available: true },
  { id: "5", name: "Samosa", price: 50, category: "appetizers", available: true },
  { id: "6", name: "Pakora", price: 100, category: "appetizers", available: false },
  { id: "7", name: "Mango Lassi", price: 150, category: "drinks", available: true },
  { id: "8", name: "Fresh Lime", price: 100, category: "drinks", available: true },
  { id: "9", name: "Gulab Jamun", price: 150, category: "desserts", available: true },
  { id: "10", name: "Kheer", price: 120, category: "desserts", available: true },
];

export default function POSPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = mockMenuItems.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (item: MenuItem) => {
    setCartItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast.success(`${item.name} added to cart`);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems((prev) => prev.filter((i) => i.id !== itemId));
    } else {
      setCartItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
    toast.info("Cart cleared");
  };

  const handleVoiceInput = () => {
    toast.info("Voice input feature coming soon!");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem-5rem)] lg:flex-row">
      {/* Left Sidebar - Categories */}
      <div className="lg:w-64 border-b lg:border-r lg:border-b-0 bg-card">
        <div className="p-4">
          <Button
            variant="outline"
            className="w-full mb-4"
            onClick={handleVoiceInput}
          >
            <Mic className="mr-2 h-4 w-4" />
            Voice Input
          </Button>
          <MenuCategories
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
      </div>

      {/* Center - Menu Items */}
      <div className="flex-1 overflow-y-auto p-4">
        <MenuItemsGrid
          items={filteredItems}
          onAddToCart={addToCart}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Right Sidebar - Shopping Cart */}
      <div className="lg:w-96 border-t lg:border-l lg:border-t-0 bg-card">
        <ShoppingCart
          items={cartItems}
          onUpdateQuantity={updateQuantity}
          onClear={clearCart}
        />
      </div>
    </div>
  );
}
