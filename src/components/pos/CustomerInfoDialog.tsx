import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, Hash } from "lucide-react";
import { Customer } from "@/contexts/POSContext";

interface CustomerInfoDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (customer: Customer) => void;
  initialData?: Customer | null;
}

export function CustomerInfoDialog({ open, onClose, onSubmit, initialData }: CustomerInfoDialogProps) {
  const [customer, setCustomer] = useState<Customer>({
    name: initialData?.name || "",
    phone: initialData?.phone || "",
    tableNumber: initialData?.tableNumber || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name.trim()) {
      return;
    }
    onSubmit(customer);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Customer Information</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Customer Name *
            </Label>
            <Input
              id="name"
              placeholder="Enter customer name"
              value={customer.name}
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="03XX-XXXXXXX"
              value={customer.phone}
              onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="table" className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Table Number
            </Label>
            <Input
              id="table"
              placeholder="Table number (optional)"
              value={customer.tableNumber}
              onChange={(e) => setCustomer({ ...customer, tableNumber: e.target.value })}
              className="h-12"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Customer Info</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
