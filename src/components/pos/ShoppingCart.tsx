import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/pages/pos/POSPage";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { PaymentMethodDialog } from "./PaymentMethodDialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ShoppingCartProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onClear: () => void;
}

export function ShoppingCart({ items, onUpdateQuantity, onClear }: ShoppingCartProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.16; // 16% tax
  const total = subtotal + tax;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-xl font-bold">Cart</h2>
          {items.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onClear}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <Label htmlFor="customer-name">Customer Name</Label>
            <Input
              id="customer-name"
              placeholder="Enter name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="h-11"
            />
          </div>
          <div>
            <Label htmlFor="customer-phone">Phone Number</Label>
            <Input
              id="customer-phone"
              placeholder="Enter phone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="h-11"
            />
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Cart is empty</p>
              <p className="text-sm mt-1">Add items to get started</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground line-clamp-1">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">₨ {item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-9 w-9"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="font-medium w-8 text-center">{item.quantity}</span>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-9 w-9"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">₨ {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax (16%)</span>
            <span className="font-medium">₨ {tax.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>₨ {total.toFixed(2)}</span>
          </div>
        </div>

        <PaymentMethodDialog
          total={total}
          disabled={items.length === 0}
          customerName={customerName}
          customerPhone={customerPhone}
        />
      </div>
    </div>
  );
}
