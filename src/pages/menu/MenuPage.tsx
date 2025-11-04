import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Printer } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MenuItemDialog } from "@/components/menu/MenuItemDialog";
import { MenuItemsList } from "@/components/menu/MenuItemsList";
import { MenuItem } from "@/pages/pos/POSPage";
import { toast } from "sonner";
import { usePOS } from "@/contexts/POSContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function MenuPage() {
  const { menuItems, fetchMenuItems, loading } = usePOS();
  const [localMenuItems, setLocalMenuItems] = useState<MenuItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    setLocalMenuItems(menuItems);
  }, [menuItems]);

  const handleAddItem = async (item: Omit<MenuItem, "id">) => {
    try {
      // This would be handled by the backend
      toast.success("Menu item added successfully");
      fetchMenuItems();
    } catch (error) {
      toast.error("Failed to add menu item");
    }
  };

  const handleEditItem = async (item: MenuItem) => {
    try {
      // This would be handled by the backend
      toast.success("Menu item updated successfully");
      fetchMenuItems();
    } catch (error) {
      toast.error("Failed to update menu item");
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      // This would be handled by the backend
      toast.success("Menu item deleted");
      fetchMenuItems();
    } catch (error) {
      toast.error("Failed to delete menu item");
    }
  };

  const handleToggleAvailability = async (id: string) => {
    try {
      // This would be handled by the backend
      setLocalMenuItems(
        localMenuItems.map((item) =>
          item.id === id ? { ...item, available: !item.available } : item
        )
      );
      toast.success("Availability updated");
    } catch (error) {
      toast.error("Failed to update availability");
    }
  };

  const openEditDialog = (item: MenuItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handlePrintMenu = () => {
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error("Please allow popups to print");
        return;
      }
      
      // Generate print content
      const content = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Menu - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; color: #1B5E20; }
            .category { margin: 20px 0; }
            .category h2 { color: #FF8F00; border-bottom: 2px solid #FF8F00; }
            .menu-item { margin: 10px 0; padding: 10px; border: 1px solid #ddd; }
            .item-name { font-weight: bold; font-size: 18px; }
            .item-price { color: #1B5E20; font-weight: bold; float: right; }
            .item-description { color: #666; font-size: 14px; }
            .unavailable { opacity: 0.5; }
          </style>
        </head>
        <body>
          <h1>Menu - TadbeerPOS</h1>
          ${["mains", "appetizers", "drinks", "desserts", "breads"].map(cat => {
            const items = getItemsByCategory(cat);
            if (items.length === 0) return '';
            return `
              <div class="category">
                <h2>${cat.toUpperCase()}</h2>
                ${items.map(item => `
                  <div class="menu-item ${!item.available ? 'unavailable' : ''}">
                    <div class="item-name">${item.name}
                      <span class="item-price">₨ ${item.price}</span>
                    </div>
                    
                    ${!item.available ? '<div style="color: red; font-size: 12px;">Currently Unavailable</div>' : ''}
                  </div>
                `).join('')}
              </div>
            `;
          }).join('')}
          <script>window.print(); window.onafterprint = () => window.close();</script>
        </body>
        </html>
      `;
      
      printWindow.document.write(content);
      printWindow.document.close();
      toast.success("Print dialog opened");
    } catch (error) {
      console.error("Print error:", error);
      toast.error("Failed to print menu");
    }
  };

  const getItemsByCategory = (category: string) =>
    localMenuItems.filter((item) => item.category === category);

  if (loading) {
    return (
      <div className="container px-4 py-6 space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="container px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Menu Management</h1>
          <p className="text-muted-foreground mt-1">Manage your restaurant menu items</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrintMenu}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="mains">Mains</TabsTrigger>
          <TabsTrigger value="appetizers">Appetizers</TabsTrigger>
          <TabsTrigger value="drinks">Drinks</TabsTrigger>
          <TabsTrigger value="desserts">Desserts</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <MenuItemsList
            items={localMenuItems}
            onEdit={openEditDialog}
            onDelete={handleDeleteItem}
            onToggleAvailability={handleToggleAvailability}
          />
        </TabsContent>

        <TabsContent value="mains" className="mt-6">
          <MenuItemsList
            items={getItemsByCategory("mains")}
            onEdit={openEditDialog}
            onDelete={handleDeleteItem}
            onToggleAvailability={handleToggleAvailability}
          />
        </TabsContent>

        <TabsContent value="appetizers" className="mt-6">
          <MenuItemsList
            items={getItemsByCategory("appetizers")}
            onEdit={openEditDialog}
            onDelete={handleDeleteItem}
            onToggleAvailability={handleToggleAvailability}
          />
        </TabsContent>

        <TabsContent value="drinks" className="mt-6">
          <MenuItemsList
            items={getItemsByCategory("drinks")}
            onEdit={openEditDialog}
            onDelete={handleDeleteItem}
            onToggleAvailability={handleToggleAvailability}
          />
        </TabsContent>

        <TabsContent value="desserts" className="mt-6">
          <MenuItemsList
            items={getItemsByCategory("desserts")}
            onEdit={openEditDialog}
            onDelete={handleDeleteItem}
            onToggleAvailability={handleToggleAvailability}
          />
        </TabsContent>
      </Tabs>

      <MenuItemDialog
        open={isDialogOpen}
        onClose={closeDialog}
        onSubmit={editingItem ? handleEditItem : handleAddItem}
        item={editingItem}
      />
    </div>
  );
}
