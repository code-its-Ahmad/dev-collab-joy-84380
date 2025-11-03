import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderCardEnhanced } from "@/components/orders/OrderCardEnhanced";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { useOrders } from "@/contexts/OrdersContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function OrdersPageNew() {
  const { orders, updateOrderStatus, deleteOrder } = useOrders();
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (dateFilter === "today") {
      const today = new Date().toDateString();
      return matchesSearch && order.createdAt.toDateString() === today;
    }

    return matchesSearch;
  });

  const getOrdersByStatus = (status: any) =>
    filteredOrders.filter((order) => order.status === status);

  const statusCounts = {
    pending: getOrdersByStatus("pending").length,
    preparing: getOrdersByStatus("preparing").length,
    ready: getOrdersByStatus("ready").length,
    completed: getOrdersByStatus("completed").length,
  };

  return (
    <div className="container px-4 py-6 space-y-6 max-w-7xl mx-auto animate-fade-in">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground mt-1">Manage and track all orders</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by order ID or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>
        
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-full sm:w-40 h-12">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="pending" className="relative py-3">
            <div className="flex flex-col items-center gap-1">
              <span>Pending</span>
              {statusCounts.pending > 0 && (
                <Badge variant="secondary" className="h-5 min-w-5 px-1 text-xs">
                  {statusCounts.pending}
                </Badge>
              )}
            </div>
          </TabsTrigger>
          <TabsTrigger value="preparing" className="relative py-3">
            <div className="flex flex-col items-center gap-1">
              <span>Preparing</span>
              {statusCounts.preparing > 0 && (
                <Badge variant="secondary" className="h-5 min-w-5 px-1 text-xs">
                  {statusCounts.preparing}
                </Badge>
              )}
            </div>
          </TabsTrigger>
          <TabsTrigger value="ready" className="relative py-3">
            <div className="flex flex-col items-center gap-1">
              <span>Ready</span>
              {statusCounts.ready > 0 && (
                <Badge variant="secondary" className="h-5 min-w-5 px-1 text-xs">
                  {statusCounts.ready}
                </Badge>
              )}
            </div>
          </TabsTrigger>
          <TabsTrigger value="completed" className="relative py-3">
            <div className="flex flex-col items-center gap-1">
              <span>Completed</span>
              {statusCounts.completed > 0 && (
                <Badge variant="secondary" className="h-5 min-w-5 px-1 text-xs">
                  {statusCounts.completed}
                </Badge>
              )}
            </div>
          </TabsTrigger>
        </TabsList>

        {["pending", "preparing", "ready", "completed"].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4 mt-6">
            {getOrdersByStatus(status).length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No {status} orders</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Swipe orders right to move them to the next status
                </p>
              </div>
            ) : (
              getOrdersByStatus(status).map((order) => (
                <OrderCardEnhanced
                  key={order.id}
                  order={order}
                  onUpdateStatus={updateOrderStatus}
                  onDelete={status === "completed" ? deleteOrder : undefined}
                />
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
