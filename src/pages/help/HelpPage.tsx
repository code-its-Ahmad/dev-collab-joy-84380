import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, BookOpen, Video, MessageCircle, Mail, Phone, ExternalLink } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "How do I add new menu items?",
    answer: "Navigate to the Menu Management page from the More menu, click 'Add Item', fill in the details including name, price, category, and upload an image. Click Save to add the item to your menu.",
  },
  {
    question: "How does the waste optimizer work?",
    answer: "The waste optimizer uses AI to analyze your inventory and predict which items are at risk of expiring. It provides actionable recommendations like applying discounts, donating to food banks, or using items immediately in special dishes.",
  },
  {
    question: "Can I process orders offline?",
    answer: "Yes! TadbeerPOS works offline and will automatically sync your data when you reconnect to the internet. All orders, inventory changes, and customer data are stored locally.",
  },
  {
    question: "How accurate is demand forecasting?",
    answer: "Our AI forecasting achieves 85-90% accuracy by analyzing historical sales data, weather patterns, local events, and seasonal trends. The system learns and improves over time.",
  },
  {
    question: "Which payment methods are supported?",
    answer: "We support JazzCash, EasyPaisa, Raast for digital payments, as well as traditional cash payments. You can enable/disable payment methods in Settings.",
  },
];

const urduFaqs: FAQ[] = [
  {
    question: "میں نئے مینو آئٹمز کیسے شامل کروں؟",
    answer: "مزید مینو سے مینو مینجمنٹ صفحہ پر جائیں، 'آئٹم شامل کریں' پر کلک کریں، نام، قیمت، زمرہ سمیت تفصیلات بھریں، اور تصویر اپ لوڈ کریں۔ اپنے مینو میں آئٹم شامل کرنے کے لیے محفوظ کریں پر کلک کریں۔",
  },
  {
    question: "فضلہ آپٹیمائزر کیسے کام کرتا ہے؟",
    answer: "فضلہ آپٹیمائزر AI استعمال کرتا ہے آپ کی انوینٹری کا تجزیہ کرنے اور پیش گوئی کرنے کے لیے کہ کون سی اشیاء ختم ہونے کے خطرے میں ہیں۔ یہ قابل عمل سفارشات فراہم کرتا ہے جیسے رعایت دینا، فوڈ بینکس کو عطیہ کرنا، یا خاص پکوانوں میں فوری طور پر اشیاء استعمال کرنا۔",
  },
  {
    question: "کیا میں آف لائن آرڈرز پروسیس کر سکتا ہوں؟",
    answer: "جی ہاں! TadbeerPOS آف لائن کام کرتا ہے اور جب آپ انٹرنیٹ سے دوبارہ منسلک ہوں گے تو خودکار طور پر آپ کا ڈیٹا sync کرے گا۔ تمام آرڈرز، انوینٹری کی تبدیلیاں، اور کسٹمر ڈیٹا مقامی طور پر محفوظ ہوتا ہے۔",
  },
  {
    question: "مانگ کی پیش گوئی کتنی درست ہے؟",
    answer: "ہماری AI پیش گوئی تاریخی سیلز ڈیٹا، موسم کے پیٹرن، مقامی تقریبات، اور موسمی رجحانات کا تجزیہ کرکے 85-90% درستگی حاصل کرتی ہے۔ سسٹم وقت کے ساتھ سیکھتا اور بہتر ہوتا ہے۔",
  },
  {
    question: "کون سے ادائیگی کے طریقے سپورٹ ہیں؟",
    answer: "ہم ڈیجیٹل ادائیگیوں کے لیے JazzCash، EasyPaisa، Raast، اور روایتی نقد ادائیگیوں کو سپورٹ کرتے ہیں۔ آپ ترتیبات میں ادائیگی کے طریقوں کو فعال/غیر فعال کر سکتے ہیں۔",
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { isUrdu } = useLanguage();

  const currentFaqs = isUrdu ? urduFaqs : faqs;

  const filteredFaqs = currentFaqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container px-4 py-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">
          {isUrdu ? "مدد اور سپورٹ" : "Help & Support"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {isUrdu ? "رہنما، دستاویزات، اور سپورٹ" : "Guides, documentation, and support"}
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={isUrdu ? "مدد تلاش کریں..." : "Search for help..."}
          className="pl-10 h-12 text-lg"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">
              {isUrdu ? "لائیو چیٹ" : "Live Chat"}
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              {isUrdu ? "فوری مدد حاصل کریں" : "Get instant help"}
            </p>
            <Button variant="outline" size="sm">
              {isUrdu ? "چیٹ شروع کریں" : "Start Chat"}
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">
              {isUrdu ? "ای میل سپورٹ" : "Email Support"}
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              {isUrdu ? "ہمیں ای میل کریں" : "Email us"}
            </p>
            <Button variant="outline" size="sm">
              support@tadbeerpos.com
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">
              {isUrdu ? "فون سپورٹ" : "Phone Support"}
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              {isUrdu ? "ہمیں کال کریں" : "Call us"}
            </p>
            <Button variant="outline" size="sm">
              +92 300 1234567
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="faq" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="faq">
            <BookOpen className="h-4 w-4 mr-2" />
            {isUrdu ? "عمومی سوالات" : "FAQ"}
          </TabsTrigger>
          <TabsTrigger value="guides">
            <Video className="h-4 w-4 mr-2" />
            {isUrdu ? "رہنما" : "Guides"}
          </TabsTrigger>
          <TabsTrigger value="docs">
            <ExternalLink className="h-4 w-4 mr-2" />
            {isUrdu ? "دستاویزات" : "Docs"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{isUrdu ? "اکثر پوچھے گئے سوالات" : "Frequently Asked Questions"}</CardTitle>
              <CardDescription>
                {isUrdu ? "عام سوالات کے جوابات تلاش کریں" : "Find answers to common questions"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guides" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded bg-red-100 flex items-center justify-center flex-shrink-0">
                    <Video className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">
                      {isUrdu ? "شروعات کی رہنما" : "Getting Started"}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {isUrdu ? "TadbeerPOS کی بنیادی باتیں سیکھیں" : "Learn the basics of TadbeerPOS"}
                    </p>
                    <Button variant="link" className="p-0">
                      {isUrdu ? "ویڈیو دیکھیں" : "Watch Video"} →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Video className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">
                      {isUrdu ? "انوینٹری مینجمنٹ" : "Inventory Management"}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {isUrdu ? "اسٹاک کو مؤثر طریقے سے منظم کریں" : "Manage stock effectively"}
                    </p>
                    <Button variant="link" className="p-0">
                      {isUrdu ? "ویڈیو دیکھیں" : "Watch Video"} →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Video className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">
                      {isUrdu ? "AI خصوصیات" : "AI Features"}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {isUrdu ? "AI ٹولز استعمال کریں" : "Use AI-powered tools"}
                    </p>
                    <Button variant="link" className="p-0">
                      {isUrdu ? "ویڈیو دیکھیں" : "Watch Video"} →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Video className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">
                      {isUrdu ? "رپورٹس اور تجزیات" : "Reports & Analytics"}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {isUrdu ? "کاروباری بصیرت حاصل کریں" : "Get business insights"}
                    </p>
                    <Button variant="link" className="p-0">
                      {isUrdu ? "ویڈیو دیکھیں" : "Watch Video"} →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="docs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{isUrdu ? "دستاویزات" : "Documentation"}</CardTitle>
              <CardDescription>
                {isUrdu ? "تفصیلی تکنیکی دستاویزات" : "Detailed technical documentation"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <a
                href="#"
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div>
                  <p className="font-medium">{isUrdu ? "API دستاویزات" : "API Documentation"}</p>
                  <p className="text-sm text-muted-foreground">
                    {isUrdu ? "ڈویلپرز کے لیے" : "For developers"}
                  </p>
                </div>
                <ExternalLink className="h-5 w-5 text-muted-foreground" />
              </a>

              <a
                href="#"
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div>
                  <p className="font-medium">{isUrdu ? "صارف گائیڈ" : "User Guide"}</p>
                  <p className="text-sm text-muted-foreground">
                    {isUrdu ? "مکمل صارف دستورالعمل" : "Complete user manual"}
                  </p>
                </div>
                <ExternalLink className="h-5 w-5 text-muted-foreground" />
              </a>

              <a
                href="#"
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div>
                  <p className="font-medium">{isUrdu ? "رہائی کے نوٹس" : "Release Notes"}</p>
                  <p className="text-sm text-muted-foreground">
                    {isUrdu ? "نئی خصوصیات اور اپ ڈیٹس" : "New features and updates"}
                  </p>
                </div>
                <ExternalLink className="h-5 w-5 text-muted-foreground" />
              </a>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
