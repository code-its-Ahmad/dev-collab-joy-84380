import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MenuItem } from "@/pages/pos/POSPage";
import { Edit, Trash2, Power } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface MenuItemsListProps {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string) => void;
}

export function MenuItemsList({
  items,
  onEdit,
  onDelete,
  onToggleAvailability,
}: MenuItemsListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No items in this category</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-heading font-semibold text-lg">{item.name}</h3>
                  <Badge variant={item.available ? "default" : "secondary"}>
                    {item.available ? "Available" : "Out of Stock"}
                  </Badge>
                </div>
                <p className="text-xl font-bold text-primary">₨ {item.price}</p>
                <p className="text-sm text-muted-foreground capitalize mt-1">
                  {item.category}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onToggleAvailability(item.id)}
                  className={item.available ? "" : "text-muted-foreground"}
                >
                  <Power className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => onEdit(item)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{item.name}"? This action cannot be
                        undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(item.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
