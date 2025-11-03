import { useState } from "react";
import { MenuCategories } from "@/components/pos/MenuCategories";
import { MenuItemsGrid } from "@/components/pos/MenuItemsGrid";
import { ShoppingCartNew } from "@/components/pos/ShoppingCartNew";
import { Button } from "@/components/ui/button";
import { Mic, Scan } from "lucide-react";
import { toast } from "sonner";
import { usePOS, MenuItem } from "@/contexts/POSContext";

const mockMenuItems: MenuItem[] = [
  { id: "1", name: "Chicken Biryani", price: 450, category: "mains", available: true, description: "Aromatic rice with tender chicken" },
  { id: "2", name: "Beef Nihari", price: 650, category: "mains", available: true, description: "Slow-cooked beef in rich gravy" },
  { id: "3", name: "Karahi Gosht", price: 800, category: "mains", available: true, description: "Spicy mutton karahi" },
  { id: "4", name: "Chapli Kebab", price: 350, category: "appetizers", available: true, description: "Traditional Pashtun kebab" },
  { id: "5", name: "Samosa", price: 50, category: "appetizers", available: true, description: "Crispy fried pastry" },
  { id: "6", name: "Pakora", price: 100, category: "appetizers", available: false, description: "Mixed vegetable fritters" },
  { id: "7", name: "Mango Lassi", price: 150, category: "drinks", available: true, description: "Refreshing yogurt drink" },
  { id: "8", name: "Fresh Lime", price: 100, category: "drinks", available: true, description: "Fresh lime soda" },
  { id: "9", name: "Gulab Jamun", price: 150, category: "desserts", available: true, description: "Sweet milk solids" },
  { id: "10", name: "Kheer", price: 120, category: "desserts", available: true, description: "Rice pudding" },
  { id: "11", name: "Chicken Tikka", price: 400, category: "appetizers", available: true, description: "Grilled marinated chicken" },
  { id: "12", name: "Seekh Kebab", price: 380, category: "appetizers", available: true, description: "Spiced minced meat kebab" },
  { id: "13", name: "Daal Makhani", price: 280, category: "mains", available: true, description: "Creamy black lentils" },
  { id: "14", name: "Palak Paneer", price: 320, category: "mains", available: true, description: "Spinach with cottage cheese" },
  { id: "15", name: "Butter Naan", price: 60, category: "breads", available: true, description: "Soft leavened bread" },
  { id: "16", name: "Garlic Naan", price: 80, category: "breads", available: true, description: "Naan with garlic" },
];

export default function POSPageNew() {
  const { addToCart } = usePOS();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = mockMenuItems.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleVoiceInput = () => {
    toast.info("Voice input feature coming soon!");
  };

  const handleBarcodeScan = () => {
    toast.info("Barcode scanner feature coming soon!");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem-5rem)] lg:flex-row animate-fade-in">
      {/* Left Sidebar - Categories */}
      <div className="lg:w-64 border-b lg:border-r lg:border-b-0 bg-card">
        <div className="p-4 space-y-3">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-10"
              onClick={handleVoiceInput}
            >
              <Mic className="mr-2 h-4 w-4" />
              Voice
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-10"
              onClick={handleBarcodeScan}
            >
              <Scan className="mr-2 h-4 w-4" />
              Scan
            </Button>
          </div>
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
        <ShoppingCartNew />
      </div>
    </div>
  );
}
