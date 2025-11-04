import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { handleError, handleErrorAndThrow } from "@/lib/errorHandler";

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  sku: string;
  quantity: number;
  unit: string;
  reorder_level: number;
  cost_price: number;
  selling_price: number;
  supplier?: string;
  barcode?: string;
  description?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryBatch {
  id: string;
  inventory_item_id: string;
  batch_number: string;
  quantity: number;
  expiry_date?: string;
  received_date: string;
  created_at: string;
}

interface InventoryContextType {
  items: InventoryItem[];
  loading: boolean;
  fetchItems: () => Promise<void>;
  addItem: (item: Omit<InventoryItem, "id" | "created_at" | "updated_at">) => Promise<void>;
  updateItem: (id: string, updates: Partial<InventoryItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  getLowStockItems: () => InventoryItem[];
  getItemsByCategory: (category: string) => InventoryItem[];
  searchItems: (query: string) => InventoryItem[];
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("inventory_items")
        .select("*")
        .order("name");

      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      handleError(error, "Fetch inventory");
    } finally {
      setLoading(false);
    }
  }, []);

  const addItem = useCallback(async (item: Omit<InventoryItem, "id" | "created_at" | "updated_at">) => {
    try {
      const { data, error } = await supabase
        .from("inventory_items")
        .insert([item])
        .select()
        .single();

      if (error) throw error;
      
      setItems((prev) => [...prev, data]);
      toast.success(`${item.name} added to inventory`);
    } catch (error: any) {
      handleErrorAndThrow(error, "Add inventory item");
    }
  }, []);

  const updateItem = useCallback(async (id: string, updates: Partial<InventoryItem>) => {
    try {
      const { data, error } = await supabase
        .from("inventory_items")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setItems((prev) => prev.map((item) => (item.id === id ? data : item)));
      toast.success("Item updated successfully");
    } catch (error: any) {
      handleErrorAndThrow(error, "Update inventory item");
    }
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from("inventory_items")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Item deleted successfully");
    } catch (error: any) {
      handleErrorAndThrow(error, "Delete inventory item");
    }
  }, []);

  const getLowStockItems = useCallback(() => {
    return items.filter((item) => item.quantity <= item.reorder_level);
  }, [items]);

  const getItemsByCategory = useCallback(
    (category: string) => {
      return items.filter((item) => item.category === category);
    },
    [items]
  );

  const searchItems = useCallback(
    (query: string) => {
      const lowercaseQuery = query.toLowerCase();
      return items.filter(
        (item) =>
          item.name.toLowerCase().includes(lowercaseQuery) ||
          item.sku.toLowerCase().includes(lowercaseQuery) ||
          item.category.toLowerCase().includes(lowercaseQuery)
      );
    },
    [items]
  );

  useEffect(() => {
    fetchItems();

    // Set up real-time subscription
    const channel = supabase
      .channel("inventory_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "inventory_items",
        },
        () => {
          fetchItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchItems]);

  return (
    <InventoryContext.Provider
      value={{
        items,
        loading,
        fetchItems,
        addItem,
        updateItem,
        deleteItem,
        getLowStockItems,
        getItemsByCategory,
        searchItems,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
}
