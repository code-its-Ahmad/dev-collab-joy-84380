import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Phone, Hash, ChevronRight, Printer, X } from "lucide-react";
import { Order } from "@/contexts/POSContext";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

interface OrderCardEnhancedProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: Order["status"]) => void;
  onDelete?: (orderId: string) => void;
}

const statusConfig: Record<
  Order["status"],
  { label: string; color: string; nextStatus?: Order["status"]; nextLabel?: string }
> = {
  pending: {
    label: "Pending",
    color: "bg-secondary text-secondary-foreground",
    nextStatus: "preparing",
    nextLabel: "Start Preparing",
  },
  preparing: {
    label: "Preparing",
    color: "bg-primary text-primary-foreground",
    nextStatus: "ready",
    nextLabel: "Mark Ready",
  },
  ready: {
    label: "Ready",
    color: "bg-accent text-accent-foreground",
    nextStatus: "completed",
    nextLabel: "Complete Order",
  },
  completed: {
    label: "Completed",
    color: "bg-muted text-muted-foreground",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-destructive text-destructive-foreground",
  },
};

export function OrderCardEnhanced({ order, onUpdateStatus, onDelete }: OrderCardEnhancedProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const status = statusConfig[order.status];

  const handlePrint = () => {
    toast.success("Receipt sent to printer");
    // In production, this would integrate with receipt printer
  };

  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleDragMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setDragX(touch.clientX);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragX(0);
    
    // If dragged far enough to the right, move to next status
    if (dragX > 100 && status.nextStatus) {
      onUpdateStatus(order.id, status.nextStatus);
    }
  };

  const timeAgo = () => {
    const minutes = Math.floor((Date.now() - order.createdAt.getTime()) / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <Card
      className={cn(
        "hover:shadow-lg transition-all cursor-grab active:cursor-grabbing",
        isDragging && "scale-105 shadow-xl"
      )}
      onTouchStart={handleDragStart}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
      style={{
        transform: isDragging ? `translateX(${Math.min(dragX / 4, 30)}px)` : undefined,
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-heading text-lg font-bold text-foreground">
                {order.id}
              </h3>
              <Badge className={cn(status.color, "text-xs")}>
                {status.label}
              </Badge>
            </div>
            
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-3 w-3" />
                <span className="font-medium text-foreground">{order.customerName}</span>
              </div>
              
              {order.customerPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  <span>{order.customerPhone}</span>
                </div>
              )}
              
              {order.tableNumber && (
                <div className="flex items-center gap-2">
                  <Hash className="h-3 w-3" />
                  <span>Table {order.tableNumber}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                <span>{timeAgo()} • {format(order.createdAt, "hh:mm a")}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4" />
            </Button>
            {order.status === "completed" && onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => onDelete(order.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Order Items */}
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm py-2 border-b last:border-0"
            >
              <div className="flex-1">
                <span className="font-medium text-foreground">
                  {item.quantity}x {item.name}
                </span>
                {item.notes && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Note: {item.notes}
                  </p>
                )}
              </div>
              <span className="font-medium">₨ {(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Total and Payment */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div>
            <p className="text-sm text-muted-foreground">Payment: {order.paymentMethod}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-lg font-bold text-foreground">₨ {order.total.toLocaleString()}</p>
          </div>
        </div>

        {/* Order Notes */}
        {order.notes && (
          <div className="p-3 rounded-lg bg-muted text-sm">
            <p className="font-medium text-foreground mb-1">Order Notes:</p>
            <p className="text-muted-foreground">{order.notes}</p>
          </div>
        )}

        {/* Action Buttons */}
        {status.nextStatus && (
          <Button
            className="w-full h-12 gap-2"
            onClick={() => onUpdateStatus(order.id, status.nextStatus!)}
          >
            {status.nextLabel}
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
