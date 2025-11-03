import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/pages/orders/OrdersPage";
import { Clock, User, Phone, CreditCard, Printer } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, newStatus: Order["status"]) => void;
}

const statusColors = {
  pending: "bg-secondary text-secondary-foreground",
  preparing: "bg-accent text-accent-foreground",
  ready: "bg-primary text-primary-foreground",
  completed: "bg-muted text-muted-foreground",
};

const nextStatus = {
  pending: "preparing" as const,
  preparing: "ready" as const,
  ready: "completed" as const,
  completed: "completed" as const,
};

export function OrderCard({ order, onUpdateStatus }: OrderCardProps) {
  const handleStatusUpdate = () => {
    const newStatus = nextStatus[order.status];
    onUpdateStatus(order.id, newStatus);
    toast.success(`Order ${order.id} marked as ${newStatus}`);
  };

  const handlePrint = () => {
    toast.info("Print functionality coming soon!");
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-lg">{order.id}</h3>
              <Badge className={statusColors[order.status]}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{format(order.createdAt, "HH:mm")}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{order.customerName}</span>
              </div>
              {order.customerPhone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>{order.customerPhone}</span>
                </div>
              )}
            </div>
          </div>
          <Button variant="outline" size="icon" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>
                {item.quantity}x {item.name}
              </span>
              <span className="font-medium">₨ {item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-2 text-sm">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground capitalize">
              {order.paymentMethod}
            </span>
          </div>
          <div className="text-lg font-bold">₨ {order.total}</div>
        </div>

        {order.status !== "completed" && (
          <Button className="w-full" onClick={handleStatusUpdate}>
            Mark as {nextStatus[order.status]}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
