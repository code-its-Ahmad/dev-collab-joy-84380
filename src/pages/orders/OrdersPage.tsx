import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderCard } from "@/components/orders/OrderCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export interface Order {
  id: string;
  customerName: string;
  customerPhone?: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  status: "pending" | "preparing" | "ready" | "completed";
  createdAt: Date;
  paymentMethod: string;
}

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customerName: "Ahmed Khan",
    customerPhone: "0300-1234567",
    items: [
      { name: "Chicken Biryani", quantity: 2, price: 450 },
      { name: "Mango Lassi", quantity: 2, price: 150 },
    ],
    total: 1200,
    status: "pending",
    createdAt: new Date(),
    paymentMethod: "cash",
  },
  {
    id: "ORD-002",
    customerName: "Sara Ali",
    items: [{ name: "Beef Nihari", quantity: 1, price: 650 }],
    total: 650,
    status: "preparing",
    createdAt: new Date(Date.now() - 900000),
    paymentMethod: "jazzcash",
  },
  {
    id: "ORD-003",
    customerName: "Hassan Raza",
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

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getOrdersByStatus = (status: Order["status"]) =>
    filteredOrders.filter((order) => order.status === status);

  return (
    <div className="container px-4 py-6 space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground mt-1">Manage and track all orders</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search by order ID or customer name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12"
        />
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="preparing">Preparing</TabsTrigger>
          <TabsTrigger value="ready">Ready</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-6">
          {getOrdersByStatus("pending").length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No pending orders</p>
          ) : (
            getOrdersByStatus("pending").map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdateStatus={updateOrderStatus}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="preparing" className="space-y-4 mt-6">
          {getOrdersByStatus("preparing").length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No orders being prepared</p>
          ) : (
            getOrdersByStatus("preparing").map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdateStatus={updateOrderStatus}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="ready" className="space-y-4 mt-6">
          {getOrdersByStatus("ready").length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No orders ready</p>
          ) : (
            getOrdersByStatus("ready").map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdateStatus={updateOrderStatus}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-6">
          {getOrdersByStatus("completed").length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No completed orders</p>
          ) : (
            getOrdersByStatus("completed").map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdateStatus={updateOrderStatus}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
