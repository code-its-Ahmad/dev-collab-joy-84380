import { useState } from "react";
import { InventoryItem } from "@/contexts/InventoryContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface InventoryListProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
}

export function InventoryList({ items, onEdit, onDelete }: InventoryListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity === 0) {
      return { label: "Out of Stock", variant: "destructive" as const };
    } else if (item.quantity <= item.reorder_level) {
      return { label: "Low Stock", variant: "secondary" as const };
    }
    return { label: "In Stock", variant: "default" as const };
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No inventory items found</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              const status = getStockStatus(item);
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {item.quantity <= item.reorder_level && (
                        <AlertTriangle className="h-4 w-4 text-warning" />
                      )}
                      {item.name}
                    </div>
                  </TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                  <TableCell className="text-right">
                    {item.quantity} {item.unit}
                  </TableCell>
                  <TableCell className="text-right">₨{item.cost_price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">₨{item.selling_price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => onEdit(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => setDeleteId(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  onDelete(deleteId);
                  setDeleteId(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
