import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Printer } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MenuItemDialog } from "@/components/menu/MenuItemDialog";
import { MenuItemsList } from "@/components/menu/MenuItemsList";
import { MenuItem } from "@/pages/pos/POSPage";
import { toast } from "sonner";

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

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const handleAddItem = (item: Omit<MenuItem, "id">) => {
    const newItem: MenuItem = {
      ...item,
      id: Date.now().toString(),
    };
    setMenuItems([...menuItems, newItem]);
    toast.success("Menu item added successfully");
  };

  const handleEditItem = (item: MenuItem) => {
    setMenuItems(menuItems.map((i) => (i.id === item.id ? item : i)));
    toast.success("Menu item updated successfully");
  };

  const handleDeleteItem = (id: string) => {
    setMenuItems(menuItems.filter((i) => i.id !== id));
    toast.success("Menu item deleted");
  };

  const handleToggleAvailability = (id: string) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
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
    toast.info("Print menu functionality coming soon!");
  };

  const getItemsByCategory = (category: string) =>
    menuItems.filter((item) => item.category === category);

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
            items={menuItems}
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
