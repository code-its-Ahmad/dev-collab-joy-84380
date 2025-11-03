import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Wallet, Smartphone, CreditCard, Banknote } from "lucide-react";
import { Order } from "@/contexts/POSContext";
import { cn } from "@/lib/utils";

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (paymentMethod: Order["paymentMethod"], notes?: string) => void;
  total: number;
}

const paymentMethods: Array<{
  id: Order["paymentMethod"];
  name: string;
  icon: React.ReactNode;
  color: string;
}> = [
  { id: "cash", name: "Cash", icon: <Banknote className="h-6 w-6" />, color: "bg-primary" },
  { id: "jazzcash", name: "JazzCash", icon: <Smartphone className="h-6 w-6" />, color: "bg-red-500" },
  { id: "easypaisa", name: "EasyPaisa", icon: <Smartphone className="h-6 w-6" />, color: "bg-primary" },
  { id: "raast", name: "Raast", icon: <CreditCard className="h-6 w-6" />, color: "bg-accent" },
];

export function PaymentDialog({ open, onClose, onConfirm, total }: PaymentDialogProps) {
  const [selectedMethod, setSelectedMethod] = useState<Order["paymentMethod"]>("cash");
  const [notes, setNotes] = useState("");

  const handleConfirm = () => {
    onConfirm(selectedMethod, notes);
    setNotes("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">Complete Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Total Amount */}
          <div className="bg-muted rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
            <p className="text-3xl font-bold text-foreground">₨ {total.toLocaleString()}</p>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Select Payment Method</Label>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setSelectedMethod(method.id)}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all hover:scale-105",
                    selectedMethod === method.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/50"
                  )}
                >
                  <div
                    className={cn(
                      "p-3 rounded-full text-white",
                      selectedMethod === method.id ? method.color : "bg-muted-foreground"
                    )}
                  >
                    {method.icon}
                  </div>
                  <span className="font-medium text-sm">{method.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Order Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Order Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any special instructions or notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="gap-2">
            <Wallet className="h-4 w-4" />
            Confirm Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
