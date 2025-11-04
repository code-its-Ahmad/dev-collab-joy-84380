import { useState, useEffect } from "react";
import { MenuCategories } from "@/components/pos/MenuCategories";
import { MenuItemsGrid } from "@/components/pos/MenuItemsGrid";
import { ShoppingCartNew } from "@/components/pos/ShoppingCartNew";
import { Button } from "@/components/ui/button";
import { Mic, Scan, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { usePOS, MenuItem } from "@/contexts/POSContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function POSPageNew() {
  const { addToCart, menuItems, fetchMenuItems, loading } = usePOS();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && item.available;
  });

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        toast.success(`Searching for: ${transcript}`);
      };
      
      recognition.onerror = () => {
        toast.error("Voice input failed. Please try again.");
      };
      
      recognition.start();
      toast.info("Listening...");
    } else {
      toast.error("Voice input not supported in this browser");
    }
  };

  const handleBarcodeScan = async () => {
    setIsScanning(true);
    try {
      // Simulate barcode scanning - in production, this would use camera API
      const barcodeResult = prompt("Enter barcode number (or scan):");
      if (barcodeResult) {
        // Search for item by barcode
        const item = menuItems.find(i => i.id === barcodeResult);
        if (item) {
          addToCart(item);
          toast.success(`Added ${item.name} to cart`);
        } else {
          toast.error("Item not found");
        }
      }
    } catch (error) {
      toast.error("Barcode scanning failed");
    } finally {
      setIsScanning(false);
    }
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
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : (
          <MenuItemsGrid
            items={filteredItems}
            onAddToCart={addToCart}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}
      </div>

      {/* Right Sidebar - Shopping Cart */}
      <div className="lg:w-96 border-t lg:border-l lg:border-t-0 bg-card">
        <ShoppingCartNew />
      </div>
    </div>
  );
}
