import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Send, Mic, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/useLanguage";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestions = [
  "What are today's top selling items?",
  "Suggest ways to reduce food waste",
  "How can I optimize my inventory?",
  "What should I reorder this week?",
];

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your TadbeerPOS AI assistant. I can help you with inventory management, sales insights, waste reduction, and business optimization. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isUrdu } = useLanguage();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response (replace with actual AI integration)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateResponse(input),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes("sales") || lowerQuery.includes("selling")) {
      return "Based on your sales data, Chicken Biryani and Beef Nihari are your top performers this week. Sales have increased by 23% compared to last week. Consider promoting Karahi Gosht during peak hours to boost revenue further.";
    } else if (lowerQuery.includes("waste") || lowerQuery.includes("reduce")) {
      return "I've analyzed your inventory patterns. Here are key recommendations:\n\n1. Reduce vegetable orders by 15% - you have 40% spoilage rate\n2. Implement FIFO (First In, First Out) for dairy products\n3. Consider offering 20% discount on items expiring within 2 days\n4. Partner with local food banks for excess inventory\n\nThese changes could reduce waste by 35-40%.";
    } else if (lowerQuery.includes("inventory") || lowerQuery.includes("optimize")) {
      return "Your inventory analysis shows:\n\n• Low stock alert: Rice (2 bags remaining)\n• Overstocked: Cooking oil (15 bottles, avg usage 3/week)\n• Optimal levels: Chicken, spices, vegetables\n\nRecommendation: Adjust reorder points based on 7-day moving average to prevent stockouts and reduce holding costs by 20%.";
    } else if (lowerQuery.includes("reorder")) {
      return "Based on demand forecasting, here's your recommended reorder list for this week:\n\n1. Rice - 10 bags (running low, high demand)\n2. Chicken - 15 kg (stable demand)\n3. Tomatoes - 5 kg (seasonal availability)\n4. Yogurt - 8 containers (increased demand)\n\nEstimated cost: PKR 25,500\nDelivery suggested: Wednesday to avoid weekend stockouts.";
    } else {
      return "I can help you with:\n\n• Sales analytics and insights\n• Inventory optimization\n• Waste reduction strategies\n• Demand forecasting\n• Supplier recommendations\n• Menu pricing optimization\n\nWhat would you like to know more about?";
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error("Voice input not supported in this browser");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = isUrdu ? 'ur-PK' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      toast.info(isUrdu ? "سن رہا ہے..." : "Listening...");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error(isUrdu ? "آواز کی ان پٹ ناکام" : "Voice input failed");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <div className="container px-4 py-6 max-w-4xl mx-auto h-[calc(100vh-8rem)]">
      <Card className="h-full flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="font-heading text-xl">
                {isUrdu ? "AI اسسٹنٹ" : "AI Assistant"}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {isUrdu ? "آپ کا ذہین کاروباری مشیر" : "Your intelligent business advisor"}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea ref={scrollRef} className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className={message.role === "assistant" ? "bg-primary/10" : "bg-accent"}>
                      {message.role === "assistant" ? (
                        <Bot className="h-5 w-5 text-primary" />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`flex-1 max-w-[80%] ${
                      message.role === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`inline-block p-3 rounded-lg ${
                        message.role === "assistant"
                          ? "bg-accent text-foreground"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 px-3">
                      {message.timestamp.toLocaleTimeString(isUrdu ? "ur-PK" : "en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10">
                      <Bot className="h-5 w-5 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-accent p-3 rounded-lg">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {messages.length === 1 && (
            <div className="p-4 border-t bg-accent/50">
              <p className="text-sm font-medium mb-2 text-muted-foreground">
                {isUrdu ? "تجاویز کردہ سوالات:" : "Suggested questions:"}
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={handleVoiceInput}
                disabled={isListening || isLoading}
                className="flex-shrink-0"
              >
                <Mic className={`h-5 w-5 ${isListening ? "text-red-500 animate-pulse" : ""}`} />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder={isUrdu ? "اپنا سوال ٹائپ کریں..." : "Type your message..."}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="flex-shrink-0"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
