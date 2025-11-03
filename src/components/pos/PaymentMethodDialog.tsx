import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreditCard, Banknote, Smartphone, Building } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PaymentMethodDialogProps {
  total: number;
  disabled: boolean;
  customerName: string;
  customerPhone: string;
}

const paymentMethods = [
  { id: "cash", label: "Cash", icon: Banknote },
  { id: "jazzcash", label: "JazzCash", icon: Smartphone },
  { id: "easypaisa", label: "EasyPaisa", icon: Smartphone },
  { id: "raast", label: "Raast", icon: Building },
];

export function PaymentMethodDialog({
  total,
  disabled,
  customerName,
  customerPhone,
}: PaymentMethodDialogProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("cash");
  const [open, setOpen] = useState(false);

  const handleProcessOrder = () => {
    toast.success("Order processed successfully!", {
      description: `Payment via ${selectedMethod.toUpperCase()} - ₨ ${total.toFixed(2)}`,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full h-14 text-lg" disabled={disabled}>
          <CreditCard className="mr-2 h-5 w-5" />
          Process Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Select Payment Method</DialogTitle>
          <DialogDescription>
            Choose how the customer wants to pay ₨ {total.toFixed(2)}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 py-4">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={cn(
                "flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all hover:border-primary/50",
                selectedMethod === method.id
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card"
              )}
            >
              <method.icon
                className={cn(
                  "h-8 w-8 mb-2",
                  selectedMethod === method.id ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span className="font-medium text-sm">{method.label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          {customerName && <p>Customer: {customerName}</p>}
          {customerPhone && <p>Phone: {customerPhone}</p>}
        </div>

        <Button size="lg" className="w-full" onClick={handleProcessOrder}>
          Complete Payment
        </Button>
      </DialogContent>
    </Dialog>
  );
}
