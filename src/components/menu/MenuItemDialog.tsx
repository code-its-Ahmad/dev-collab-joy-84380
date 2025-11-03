import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MenuItem } from "@/pages/pos/POSPage";

const menuItemSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  price: z.coerce.number().min(0, "Price must be positive"),
  category: z.enum(["mains", "appetizers", "drinks", "desserts"]),
  available: z.boolean(),
});

type MenuItemFormData = z.infer<typeof menuItemSchema>;

interface MenuItemDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (item: any) => void;
  item?: MenuItem | null;
}

export function MenuItemDialog({ open, onClose, onSubmit, item }: MenuItemDialogProps) {
  const form = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: "",
      price: 0,
      category: "mains",
      available: true,
    },
  });

  useEffect(() => {
    if (item) {
      form.reset({
        name: item.name,
        price: item.price,
        category: item.category as any,
        available: item.available,
      });
    } else {
      form.reset({
        name: "",
        price: 0,
        category: "mains",
        available: true,
      });
    }
  }, [item, form]);

  const handleSubmit = (data: MenuItemFormData) => {
    if (item) {
      onSubmit({ ...item, ...data });
    } else {
      onSubmit(data);
    }
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-heading">
            {item ? "Edit Menu Item" : "Add Menu Item"}
          </DialogTitle>
          <DialogDescription>
            {item ? "Update the menu item details" : "Add a new item to your menu"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter item name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (₨)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="mains">Main Dishes</SelectItem>
                      <SelectItem value="appetizers">Appetizers</SelectItem>
                      <SelectItem value="drinks">Drinks</SelectItem>
                      <SelectItem value="desserts">Desserts</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="available"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Available</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Mark if this item is currently available
                    </div>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                {item ? "Update" : "Add"} Item
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
