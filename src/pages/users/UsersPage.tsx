import { useState, useEffect } from "react";
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
import { UserPlus, Search, Edit, Trash2, Shield, Loader2 } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { userCreationSchema } from "@/lib/userValidation";
import { handleError } from "@/lib/errorHandler";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "owner" | "manager" | "staff";
  status: "active" | "inactive";
  createdAt: Date;
  businessName?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "staff" as "owner" | "manager" | "staff",
  });
  const { isUrdu } = useLanguage();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*");

      if (profilesError) throw profilesError;

      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      const usersWithRoles = profilesData.map((profile) => {
        const userRole = rolesData.find((r) => r.user_id === profile.id);
        return {
          id: profile.id,
          name: profile.display_name,
          email: profile.id, // We'll need to fetch from auth.users or store email separately
          phone: profile.phone,
          role: (userRole?.role || "staff") as "owner" | "manager" | "staff",
          status: "active" as const,
          createdAt: new Date(profile.created_at),
          businessName: profile.business_name,
        };
      });

      setUsers(usersWithRoles);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

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
      };
      return urduRoles[role];
    }
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const handleAddUser = async () => {
    // Validate user input with Zod
    try {
      userCreationSchema.parse(newUser);
    } catch (error: any) {
      const firstError = error.errors?.[0]?.message;
      toast.error(firstError || "Invalid input");
      return;
    }

    setSubmitting(true);
    try {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          data: {
            display_name: newUser.name,
            phone: newUser.phone,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Assign role (already validated by Zod)
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert([{
            user_id: authData.user.id,
            role: newUser.role,
          }]);

        if (roleError) throw roleError;

        toast.success(isUrdu ? "صارف شامل کیا گیا" : "User added successfully");
        setIsAddDialogOpen(false);
        setNewUser({ name: "", email: "", phone: "", password: "", role: "staff" });
        fetchUsers();
      }
    } catch (error: any) {
      handleError(error, 'Add user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm(isUrdu ? "کیا آپ واقعی اس صارف کو حذف کرنا چاہتے ہیں؟" : "Are you sure you want to delete this user?")) {
      return;
    }

    try {
      // First check if user is owner (server-side validation)
      const { data: roleData, error: roleCheckError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (roleCheckError) throw roleCheckError;

      if (roleData?.role === 'owner') {
        toast.error(isUrdu ? "مالک کو حذف نہیں کیا جا سکتا" : "Cannot delete owner account");
        return;
      }

      // Delete user_roles and profiles
      const { error: roleError } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);

      if (roleError) throw roleError;

      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (profileError) throw profileError;

      toast.success(isUrdu ? "صارف حذف کیا گیا" : "User deleted successfully");
      fetchUsers();
    } catch (error: any) {
      handleError(error, 'Delete user');
    }
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
                <Label htmlFor="password">{isUrdu ? "پاس ورڈ" : "Password"} *</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder={isUrdu ? "پاس ورڈ درج کریں" : "Enter password"}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">{isUrdu ? "کردار" : "Role"}</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value: "owner" | "manager" | "staff") => setNewUser({ ...newUser, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manager">{getRoleLabel("manager")}</SelectItem>
                    <SelectItem value="staff">{getRoleLabel("staff")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={submitting}>
                {isUrdu ? "منسوخ" : "Cancel"}
              </Button>
              <Button onClick={handleAddUser} disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
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
          )}
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
