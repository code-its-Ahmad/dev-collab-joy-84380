import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, CreditCard, Link2, Database, Bell, Globe, Smartphone } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "sonner";

export default function SettingsPage() {
  const { isUrdu, language, setLanguage } = useLanguage();
  const [businessName, setBusinessName] = useState("My Restaurant");
  const [email, setEmail] = useState("owner@restaurant.com");
  const [phone, setPhone] = useState("+92 300 1234567");
  const [address, setAddress] = useState("123 Main Street, Karachi");
  const [taxId, setTaxId] = useState("12345-6789012-3");
  const [currency, setCurrency] = useState("PKR");
  const [timezone, setTimezone] = useState("Asia/Karachi");
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [orderAlerts, setOrderAlerts] = useState(true);

  const handleSave = () => {
    toast.success(isUrdu ? "ترتیبات محفوظ ہو گئیں" : "Settings saved successfully");
  };

  return (
    <div className="container px-4 py-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">
          {isUrdu ? "ترتیبات" : "Settings"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {isUrdu ? "اپنی ایپلیکیشن کو مرتب کریں" : "Manage your application preferences"}
        </p>
      </div>

      <Tabs defaultValue="business" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="business">
            <Building2 className="h-4 w-4 mr-2" />
            {isUrdu ? "کاروبار" : "Business"}
          </TabsTrigger>
          <TabsTrigger value="payments">
            <CreditCard className="h-4 w-4 mr-2" />
            {isUrdu ? "ادائیگیاں" : "Payments"}
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Link2 className="h-4 w-4 mr-2" />
            {isUrdu ? "انضمام" : "Integrations"}
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            {isUrdu ? "اطلاعات" : "Notifications"}
          </TabsTrigger>
          <TabsTrigger value="system">
            <Database className="h-4 w-4 mr-2" />
            {isUrdu ? "نظام" : "System"}
          </TabsTrigger>
        </TabsList>

        {/* Business Settings */}
        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{isUrdu ? "کاروباری معلومات" : "Business Information"}</CardTitle>
              <CardDescription>
                {isUrdu ? "اپنے کاروبار کی تفصیلات کو اپ ڈیٹ کریں" : "Update your business details"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">{isUrdu ? "کاروبار کا نام" : "Business Name"}</Label>
                <Input
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{isUrdu ? "ای میل" : "Email"}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{isUrdu ? "فون نمبر" : "Phone Number"}</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">{isUrdu ? "پتہ" : "Address"}</Label>
                <Textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxId">{isUrdu ? "ٹیکس ID (FBR)" : "Tax ID (FBR)"}</Label>
                <Input
                  id="taxId"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                />
              </div>

              <Button onClick={handleSave} className="w-full">
                {isUrdu ? "محفوظ کریں" : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{isUrdu ? "ادائیگی کے طریقے" : "Payment Methods"}</CardTitle>
              <CardDescription>
                {isUrdu ? "ادائیگی کے اختیارات کو ترتیب دیں" : "Configure payment options"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-green-100 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">JazzCash</p>
                    <p className="text-sm text-muted-foreground">Mobile wallet payments</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-blue-100 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">EasyPaisa</p>
                    <p className="text-sm text-muted-foreground">Mobile wallet payments</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-purple-100 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Raast</p>
                    <p className="text-sm text-muted-foreground">Instant bank transfers</p>
                  </div>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">Cash</p>
                    <p className="text-sm text-muted-foreground">Cash on delivery/pickup</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{isUrdu ? "انضمام" : "Integrations"}</CardTitle>
              <CardDescription>
                {isUrdu ? "تیسرے فریق کی خدمات سے منسلک کریں" : "Connect third-party services"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-red-100 flex items-center justify-center">
                    <Database className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium">FBR Tax System</p>
                    <p className="text-sm text-muted-foreground">Automatic tax reporting</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  {isUrdu ? "ترتیب دیں" : "Configure"}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-blue-100 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Weather API</p>
                    <p className="text-sm text-muted-foreground">Weather-based forecasting</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  {isUrdu ? "ترتیب دیں" : "Configure"}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-green-100 flex items-center justify-center">
                    <Smartphone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">SMS Gateway</p>
                    <p className="text-sm text-muted-foreground">Order notifications</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  {isUrdu ? "ترتیب دیں" : "Configure"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{isUrdu ? "اطلاعات کی ترتیبات" : "Notification Preferences"}</CardTitle>
              <CardDescription>
                {isUrdu ? "آپ کیسے اطلاعات وصول کرنا چاہتے ہیں" : "Choose how you receive notifications"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">{isUrdu ? "چینلز" : "Channels"}</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notif">{isUrdu ? "ای میل اطلاعات" : "Email Notifications"}</Label>
                  <Switch
                    id="email-notif"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-notif">{isUrdu ? "SMS اطلاعات" : "SMS Notifications"}</Label>
                  <Switch
                    id="sms-notif"
                    checked={smsNotifications}
                    onCheckedChange={setSmsNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notif">{isUrdu ? "پش اطلاعات" : "Push Notifications"}</Label>
                  <Switch
                    id="push-notif"
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">{isUrdu ? "الرٹس" : "Alerts"}</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="stock-alerts">{isUrdu ? "کم اسٹاک الرٹس" : "Low Stock Alerts"}</Label>
                  <Switch
                    id="stock-alerts"
                    checked={lowStockAlerts}
                    onCheckedChange={setLowStockAlerts}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="order-alerts">{isUrdu ? "نئے آرڈر الرٹس" : "New Order Alerts"}</Label>
                  <Switch
                    id="order-alerts"
                    checked={orderAlerts}
                    onCheckedChange={setOrderAlerts}
                  />
                </div>
              </div>

              <Button onClick={handleSave} className="w-full">
                {isUrdu ? "محفوظ کریں" : "Save Preferences"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{isUrdu ? "نظام کی ترتیبات" : "System Settings"}</CardTitle>
              <CardDescription>
                {isUrdu ? "عمومی ایپلیکیشن کی ترتیبات" : "General application settings"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">{isUrdu ? "زبان" : "Language"}</Label>
                <Select value={language} onValueChange={(v) => setLanguage(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ur">اردو (Urdu)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">{isUrdu ? "کرنسی" : "Currency"}</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PKR">PKR - Pakistani Rupee</SelectItem>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">{isUrdu ? "ٹائم زون" : "Timezone"}</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Karachi">Asia/Karachi (PKT)</SelectItem>
                    <SelectItem value="Asia/Dubai">Asia/Dubai (GST)</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 space-y-2">
                <Button variant="outline" className="w-full">
                  {isUrdu ? "ڈیٹا کا بیک اپ" : "Backup Data"}
                </Button>
                <Button variant="outline" className="w-full">
                  {isUrdu ? "ڈیٹا برآمد کریں" : "Export Data"}
                </Button>
              </div>

              <Button onClick={handleSave} className="w-full">
                {isUrdu ? "محفوظ کریں" : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
