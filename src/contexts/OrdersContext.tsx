import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Order } from "./POSContext";
import { toast } from "sonner";

interface OrdersContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  deleteOrder: (orderId: string) => void;
  getOrdersByStatus: (status: Order["status"]) => Order[];
  getOrderById: (orderId: string) => Order | undefined;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

// Mock initial orders for demo
const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customerName: "Ahmed Khan",
    customerPhone: "0300-1234567",
    tableNumber: "5",
    items: [
      { name: "Chicken Biryani", quantity: 2, price: 450 },
      { name: "Mango Lassi", quantity: 2, price: 150 },
    ],
    total: 1200,
    status: "pending",
    createdAt: new Date(Date.now() - 300000),
    paymentMethod: "cash",
  },
  {
    id: "ORD-002",
    customerName: "Sara Ali",
    customerPhone: "0321-9876543",
    items: [{ name: "Beef Nihari", quantity: 1, price: 650 }],
    total: 650,
    status: "preparing",
    createdAt: new Date(Date.now() - 900000),
    paymentMethod: "jazzcash",
  },
  {
    id: "ORD-003",
    customerName: "Hassan Raza",
    tableNumber: "12",
    items: [
      { name: "Karahi Gosht", quantity: 1, price: 800 },
      { name: "Chapli Kebab", quantity: 3, price: 350 },
    ],
    total: 1850,
    status: "ready",
    createdAt: new Date(Date.now() - 1800000),
    paymentMethod: "easypaisa",
  },
];

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const addOrder = useCallback((order: Order) => {
    setOrders((prev) => [order, ...prev]);
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
    
    const statusMessages: Record<Order["status"], string> = {
      pending: "Order marked as pending",
      preparing: "Order is now being prepared",
      ready: "Order is ready for pickup/delivery",
      completed: "Order completed successfully",
      cancelled: "Order has been cancelled",
    };
    
    toast.success(statusMessages[status]);
  }, []);

  const deleteOrder = useCallback((orderId: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
    toast.info("Order deleted");
  }, []);

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

  return (
    <OrdersContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        getOrdersByStatus,
        getOrderById,
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
