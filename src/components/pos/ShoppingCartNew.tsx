import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Minus, Plus, ShoppingBag, Trash2, User, MessageSquare, X } from "lucide-react";
import { usePOS } from "@/contexts/POSContext";
import { useState } from "react";
import { CustomerInfoDialog } from "./CustomerInfoDialog";
import { PaymentDialog } from "./PaymentDialog";
import { useOrders } from "@/contexts/OrdersContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ShoppingCartNew() {
  const { cartItems, customer, updateQuantity, removeFromCart, clearCart, setCustomer, getCartTotal, getCartCount, createOrder, updateItemNotes } = usePOS();
  const { addOrder } = useOrders();
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);

  const handleCheckout = () => {
    if (!customer) {
      setCustomerDialogOpen(true);
      return;
    }
    setPaymentDialogOpen(true);
  };

  const handlePaymentConfirm = async (paymentMethod: any, notes?: string) => {
    const order = await createOrder(paymentMethod, notes);
    if (order) {
      await addOrder(order);
    }
  };

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center justify-between font-heading">
            <span className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Cart ({getCartCount()})
            </span>
            {cartItems.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearCart}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto space-y-3">
          {/* Customer Info Section */}
          {cartItems.length > 0 && (
            <div className="mb-4 p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCustomerDialogOpen(true)}
                >
                  {customer ? "Edit" : "Add"}
                </Button>
              </div>
              {customer ? (
                <div className="text-sm space-y-1">
                  <p className="font-medium">{customer.name}</p>
                  {customer.phone && <p className="text-muted-foreground">{customer.phone}</p>}
                  {customer.tableNumber && <p className="text-muted-foreground">Table: {customer.tableNumber}</p>}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No customer added</p>
              )}
            </div>
          )}

          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-12">
              <ShoppingBag className="h-16 w-16 mb-4 opacity-20" />
              <p>Your cart is empty</p>
              <p className="text-xs mt-1">Add items to get started</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="p-3 rounded-lg border bg-card space-y-2">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">₨ {item.price} each</p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-10 text-center font-medium">{item.quantity}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="font-bold">₨ {(item.price * item.quantity).toLocaleString()}</p>
                </div>

                {/* Item Notes */}
                {editingNotes === item.id ? (
                  <div className="space-y-2">
                    <Input
                      placeholder="Add special instructions..."
                      defaultValue={item.notes || ""}
                      onBlur={(e) => {
                        updateItemNotes(item.id, e.target.value);
                        setEditingNotes(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          updateItemNotes(item.id, e.currentTarget.value);
                          setEditingNotes(null);
                        }
                      }}
                      autoFocus
                      className="h-8 text-xs"
                    />
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-full text-xs"
                    onClick={() => setEditingNotes(item.id)}
                  >
                    <MessageSquare className="h-3 w-3 mr-2" />
                    {item.notes || "Add note"}
                  </Button>
                )}
              </div>
            ))
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-6 border-t">
          <div className="w-full space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-medium">₨ {getCartTotal().toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-primary">₨ {getCartTotal().toLocaleString()}</span>
            </div>
          </div>
          <Button
            className="w-full h-12"
            disabled={cartItems.length === 0}
            onClick={handleCheckout}
          >
            Proceed to Payment
          </Button>
        </CardFooter>
      </Card>

      <CustomerInfoDialog
        open={customerDialogOpen}
        onClose={() => setCustomerDialogOpen(false)}
        onSubmit={setCustomer}
        initialData={customer}
      />

      <PaymentDialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        onConfirm={handlePaymentConfirm}
        total={getCartTotal()}
      />
    </>
  );
}
