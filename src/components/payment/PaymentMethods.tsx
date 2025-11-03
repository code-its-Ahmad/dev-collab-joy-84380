import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Smartphone, Wallet, Banknote } from "lucide-react";

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  enabled: boolean;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "cash",
    name: "Cash",
    icon: <Banknote className="h-6 w-6" />,
    description: "Accept cash payments",
    enabled: true,
  },
  {
    id: "jazzcash",
    name: "JazzCash",
    icon: <Smartphone className="h-6 w-6" />,
    description: "Mobile wallet payments",
    enabled: true,
  },
  {
    id: "easypaisa",
    name: "EasyPaisa",
    icon: <Wallet className="h-6 w-6" />,
    description: "Digital wallet payments",
    enabled: true,
  },
  {
    id: "raast",
    name: "Raast",
    icon: <CreditCard className="h-6 w-6" />,
    description: "Instant bank transfers",
    enabled: true,
  },
];

interface PaymentMethodsProps {
  onSelect: (method: string) => void;
  selected?: string;
}

export function PaymentMethods({ onSelect, selected }: PaymentMethodsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {paymentMethods.map((method) => (
        <Card
          key={method.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selected === method.id ? "ring-2 ring-primary" : ""
          } ${!method.enabled ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => method.enabled && onSelect(method.id)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${selected === method.id ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                {method.icon}
              </div>
              <div>
                <CardTitle className="text-base">{method.name}</CardTitle>
                <CardDescription className="text-xs">{method.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          {!method.enabled && (
            <CardContent className="pt-0">
              <p className="text-xs text-muted-foreground">Coming soon</p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
