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
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error("Please allow popups to print receipt");
        return;
      }
      
      const content = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Receipt - ${order.id}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Courier New', monospace; padding: 20px; width: 300px; }
            .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
            .header h1 { font-size: 20px; }
            .info { margin: 10px 0; font-size: 12px; }
            .items { border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 10px 0; }
            .item { display: flex; justify-content: space-between; margin: 5px 0; font-size: 12px; }
            .totals { margin-top: 10px; font-size: 14px; }
            .total-line { display: flex; justify-content: space-between; margin: 3px 0; }
            .grand-total { font-weight: bold; font-size: 16px; border-top: 2px solid #000; padding-top: 5px; margin-top: 5px; }
            .footer { text-align: center; margin-top: 20px; font-size: 10px; border-top: 1px dashed #000; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>TadbeerPOS</h1>
            <p>Receipt</p>
          </div>
          <div class="info">
            <div>Order #: ${order.id}</div>
            <div>Date: ${new Date(order.createdAt).toLocaleString()}</div>
            <div>Customer: ${order.customerName}</div>
            ${order.customerPhone ? `<div>Phone: ${order.customerPhone}</div>` : ''}
          </div>
          <div class="items">
            ${order.items.map(item => `
              <div class="item">
                <span>${item.quantity}x ${item.name}</span>
                <span>₨ ${(item.price * item.quantity).toFixed(2)}</span>
              </div>
              
            `).join('')}
          </div>
          <div class="totals">
            <div class="total-line grand-total">
              <span>Total:</span>
              <span>₨ ${order.total.toFixed(2)}</span>
            </div>
          </div>
          <div class="info">
            <div>Payment: ${order.paymentMethod.toUpperCase()}</div>
          </div>
          <div class="footer">
            <p>Thank you for your business!</p>
            <p>www.tadbeerpos.com</p>
          </div>
          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => window.close(), 100);
            };
          </script>
        </body>
        </html>
      `;
      
      printWindow.document.write(content);
      printWindow.document.close();
      toast.success("Receipt sent to printer");
    } catch (error) {
      console.error("Print error:", error);
      toast.error("Failed to print receipt");
    }
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
