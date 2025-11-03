import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { toast } from "sonner";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
  description?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
  notes?: string;
}

export interface Customer {
  name: string;
  phone?: string;
  tableNumber?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone?: string;
  tableNumber?: string;
  items: Array<{ name: string; quantity: number; price: number; notes?: string }>;
  total: number;
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled";
  createdAt: Date;
  paymentMethod: "cash" | "jazzcash" | "easypaisa" | "raast";
  notes?: string;
}

interface POSContextType {
  cartItems: CartItem[];
  customer: Customer | null;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateItemNotes: (itemId: string, notes: string) => void;
  clearCart: () => void;
  setCustomer: (customer: Customer) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  createOrder: (paymentMethod: Order["paymentMethod"], notes?: string) => Order | null;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export function POSProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customer, setCustomerState] = useState<Customer | null>(null);

  const addToCart = useCallback((item: MenuItem) => {
    if (!item.available) {
      toast.error(`${item.name} is currently unavailable`);
      return;
    }

    setCartItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
      if (existingItem) {
        toast.success(`Increased ${item.name} quantity`);
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      toast.success(`${item.name} added to cart`);
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCartItems((prev) => {
      const item = prev.find((i) => i.id === itemId);
      if (item) {
        toast.info(`${item.name} removed from cart`);
      }
      return prev.filter((i) => i.id !== itemId);
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(itemId);
    } else {
      setCartItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
      );
    }
  }, [removeFromCart]);

  const updateItemNotes = useCallback((itemId: string, notes: string) => {
    setCartItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, notes } : i))
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setCustomerState(null);
    toast.info("Cart cleared");
  }, []);

  const setCustomer = useCallback((customer: Customer) => {
    setCustomerState(customer);
  }, []);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const getCartCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  const createOrder = useCallback(
    (paymentMethod: Order["paymentMethod"], notes?: string): Order | null => {
      if (cartItems.length === 0) {
        toast.error("Cart is empty");
        return null;
      }

      if (!customer) {
        toast.error("Please add customer information");
        return null;
      }

      const order: Order = {
        id: `ORD-${Date.now().toString().slice(-6)}`,
        customerName: customer.name,
        customerPhone: customer.phone,
        tableNumber: customer.tableNumber,
        items: cartItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          notes: item.notes,
        })),
        total: getCartTotal(),
        status: "pending",
        createdAt: new Date(),
        paymentMethod,
        notes,
      };

      clearCart();
      toast.success(`Order ${order.id} created successfully!`);
      return order;
    },
    [cartItems, customer, getCartTotal, clearCart]
  );

  return (
    <POSContext.Provider
      value={{
        cartItems,
        customer,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateItemNotes,
        clearCart,
        setCustomer,
        getCartTotal,
        getCartCount,
        createOrder,
      }}
    >
      {children}
    </POSContext.Provider>
  );
}

export function usePOS() {
  const context = useContext(POSContext);
  if (context === undefined) {
    throw new Error("usePOS must be used within a POSProvider");
  }
  return context;
}
