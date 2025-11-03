import { useState } from "react";
import { useInventory } from "@/contexts/InventoryContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InventoryItemDialog } from "@/components/inventory/InventoryItemDialog";
import { InventoryList } from "@/components/inventory/InventoryList";
import { Plus, Search, Download, Upload, ScanLine } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function Inventory() {
  const { items, loading, addItem, updateItem, deleteItem, getLowStockItems, searchItems } = useInventory();
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const handleSave = async (itemData: any) => {
    try {
      if (editingItem) {
        await updateItem(editingItem.id, itemData);
      } else {
        await addItem(itemData);
      }
      setEditingItem(null);
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteItem(id);
  };

  const handleScanBarcode = () => {
    toast.info("Barcode scanner feature coming soon!");
  };

  const filteredItems = searchQuery ? searchItems(searchQuery) : items;
  const lowStockItems = getLowStockItems();
  const displayItems = activeTab === "low-stock" ? lowStockItems : filteredItems;

  const stats = {
    total: items.length,
    lowStock: lowStockItems.length,
    outOfStock: items.filter((item) => item.quantity === 0).length,
    totalValue: items.reduce((sum, item) => sum + item.quantity * item.cost_price, 0),
  };

  return (
    <div className="container px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-muted-foreground mt-1">Manage your stock and track inventory levels</p>
        </div>
        <Button onClick={() => { setEditingItem(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.lowStock}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.outOfStock}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₨{stats.totalValue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, SKU, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleScanBarcode}>
            <ScanLine className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Upload className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Items ({items.length})</TabsTrigger>
          <TabsTrigger value="low-stock">Low Stock ({lowStockItems.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : (
            <InventoryList items={displayItems} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </TabsContent>
        <TabsContent value="low-stock" className="mt-6">
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : (
            <InventoryList items={displayItems} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </TabsContent>
      </Tabs>

      <InventoryItemDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        item={editingItem}
      />
    </div>
  );
}
