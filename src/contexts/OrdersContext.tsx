import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { Order } from "./POSContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface OrdersContextType {
  orders: Order[];
  loading: boolean;
  addOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order["status"]) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  getOrdersByStatus: (status: Order["status"]) => Order[];
  getOrderById: (orderId: string) => Order | undefined;
  refreshOrders: () => Promise<void>;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshOrders = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const transformedOrders: Order[] = (data || []).map((order: any) => ({
        id: order.order_number,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        tableNumber: order.table_number,
        items: order.order_items.map((item: any) => ({
          name: item.item_name,
          quantity: item.quantity,
          price: item.unit_price,
          notes: item.notes,
        })),
        total: order.total,
        status: order.status as Order["status"],
        createdAt: new Date(order.created_at),
        paymentMethod: order.payment_method as Order["paymentMethod"],
        notes: order.notes,
      }));

      setOrders(transformedOrders);
    } catch (error: any) {
      toast.error("Failed to fetch orders: " + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addOrder = useCallback(async (order: Order) => {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_number: order.id,
          customer_name: order.customerName,
          customer_phone: order.customerPhone,
          table_number: order.tableNumber,
          subtotal: order.total,
          total: order.total,
          status: order.status,
          payment_method: order.paymentMethod,
          payment_status: "pending",
          notes: order.notes,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = order.items.map((item) => ({
        order_id: orderData.id,
        item_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
        notes: item.notes,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      await refreshOrders();
      toast.success(`Order ${order.id} created successfully!`);
    } catch (error: any) {
      toast.error("Failed to create order: " + error.message);
      throw error;
    }
  }, [refreshOrders]);

  const updateOrderStatus = useCallback(async (orderId: string, status: Order["status"]) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ 
          status,
          completed_at: status === "completed" ? new Date().toISOString() : null
        })
        .eq("order_number", orderId);

      if (error) throw error;
      
      const statusMessages: Record<Order["status"], string> = {
        pending: "Order marked as pending",
        preparing: "Order is now being prepared",
        ready: "Order is ready for pickup/delivery",
        completed: "Order completed successfully",
        cancelled: "Order has been cancelled",
      };
      
      toast.success(statusMessages[status]);
      await refreshOrders();
    } catch (error: any) {
      toast.error("Failed to update order: " + error.message);
      throw error;
    }
  }, [refreshOrders]);

  const deleteOrder = useCallback(async (orderId: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("order_number", orderId);

      if (error) throw error;

      toast.info("Order deleted");
      await refreshOrders();
    } catch (error: any) {
      toast.error("Failed to delete order: " + error.message);
      throw error;
    }
  }, [refreshOrders]);

  const getOrdersByStatus = useCallback(
    (status: Order["status"]) => {
      return orders.filter((order) => order.status === status);
    },
    [orders]
  );

  const getOrderById = useCallback(
    (orderId: string) => {
      return orders.find((order) => order.id === orderId);
    },
    [orders]
  );

  useEffect(() => {
    refreshOrders();

    // Set up real-time subscription for orders
    const channel = supabase
      .channel("orders_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        () => {
          refreshOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshOrders]);

  return (
    <OrdersContext.Provider
      value={{
        orders,
        loading,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        getOrdersByStatus,
        getOrderById,
        refreshOrders,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
}
