import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Search, Edit, Trash2, Shield, MoreVertical } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "owner" | "manager" | "staff" | "cashier";
  status: "active" | "inactive";
  createdAt: Date;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Ahmed Khan",
    email: "ahmed@restaurant.com",
    phone: "+92 300 1234567",
    role: "owner",
    status: "active",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "Sara Ali",
    email: "sara@restaurant.com",
    phone: "+92 321 9876543",
    role: "manager",
    status: "active",
    createdAt: new Date("2024-02-15"),
  },
  {
    id: "3",
    name: "Hassan Raza",
    email: "hassan@restaurant.com",
    phone: "+92 333 5556677",
    role: "staff",
    status: "active",
    createdAt: new Date("2024-03-10"),
  },
];

export default function UsersPage() {
  const [users] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "staff" as User["role"],
  });
  const { isUrdu } = useLanguage();

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadgeVariant = (role: User["role"]) => {
    switch (role) {
      case "owner":
        return "default";
      case "manager":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getRoleLabel = (role: User["role"]) => {
    if (isUrdu) {
      const urduRoles: Record<User["role"], string> = {
        owner: "مالک",
        manager: "منیجر",
        staff: "عملہ",
        cashier: "کیشیئر",
      };
      return urduRoles[role];
    }
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast.error(isUrdu ? "براہ کرم تمام فیلڈز بھریں" : "Please fill all fields");
      return;
    }
    toast.success(isUrdu ? "صارف شامل کیا گیا" : "User added successfully");
    setIsAddDialogOpen(false);
    setNewUser({ name: "", email: "", phone: "", role: "staff" });
  };

  const handleDeleteUser = (userId: string) => {
    toast.success(isUrdu ? "صارف حذف کیا گیا" : "User deleted successfully");
  };

  return (
    <div className="container px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            {isUrdu ? "صارف کا انتظام" : "User Management"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isUrdu ? "اپنی ٹیم کو منظم کریں" : "Manage your team members"}
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              {isUrdu ? "صارف شامل کریں" : "Add User"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isUrdu ? "نیا صارف شامل کریں" : "Add New User"}</DialogTitle>
              <DialogDescription>
                {isUrdu ? "ٹیم کے نئے رکن کی تفصیلات درج کریں" : "Enter details for the new team member"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">{isUrdu ? "نام" : "Name"}</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder={isUrdu ? "نام درج کریں" : "Enter name"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{isUrdu ? "ای میل" : "Email"}</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder={isUrdu ? "ای میل درج کریں" : "Enter email"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{isUrdu ? "فون" : "Phone"}</Label>
                <Input
                  id="phone"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  placeholder="+92 300 1234567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">{isUrdu ? "کردار" : "Role"}</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value: User["role"]) => setNewUser({ ...newUser, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manager">{getRoleLabel("manager")}</SelectItem>
                    <SelectItem value="staff">{getRoleLabel("staff")}</SelectItem>
                    <SelectItem value="cashier">{getRoleLabel("cashier")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                {isUrdu ? "منسوخ" : "Cancel"}
              </Button>
              <Button onClick={handleAddUser}>
                {isUrdu ? "شامل کریں" : "Add User"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{isUrdu ? "ٹیم کے اراکین" : "Team Members"}</CardTitle>
              <CardDescription>
                {isUrdu ? `کل ${users.length} صارفین` : `${users.length} total users`}
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isUrdu ? "تلاش کریں..." : "Search..."}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isUrdu ? "صارف" : "User"}</TableHead>
                <TableHead>{isUrdu ? "رابطہ" : "Contact"}</TableHead>
                <TableHead>{isUrdu ? "کردار" : "Role"}</TableHead>
                <TableHead>{isUrdu ? "حیثیت" : "Status"}</TableHead>
                <TableHead>{isUrdu ? "شامل ہوئے" : "Joined"}</TableHead>
                <TableHead className="text-right">{isUrdu ? "اعمال" : "Actions"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {getRoleLabel(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "active" ? "default" : "secondary"}>
                      {isUrdu ? (user.status === "active" ? "فعال" : "غیر فعال") : user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.createdAt.toLocaleDateString(isUrdu ? "ur-PK" : "en-US")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={user.role === "owner"}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Permissions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {isUrdu ? "اجازتیں" : "Permissions"}
          </CardTitle>
          <CardDescription>
            {isUrdu ? "کردار کی بنیاد پر رسائی کنٹرول" : "Role-based access control"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{getRoleLabel("owner")}</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• {isUrdu ? "مکمل رسائی" : "Full access"}</li>
                    <li>• {isUrdu ? "صارفین کا انتظام" : "Manage users"}</li>
                    <li>• {isUrdu ? "ترتیبات" : "Settings"}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{getRoleLabel("manager")}</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• {isUrdu ? "انوینٹری" : "Inventory"}</li>
                    <li>• {isUrdu ? "آرڈرز" : "Orders"}</li>
                    <li>• {isUrdu ? "رپورٹس" : "Reports"}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{getRoleLabel("staff")}</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• {isUrdu ? "POS" : "POS"}</li>
                    <li>• {isUrdu ? "آرڈرز" : "Orders"}</li>
                    <li>• {isUrdu ? "بنیادی" : "Basic"}</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
