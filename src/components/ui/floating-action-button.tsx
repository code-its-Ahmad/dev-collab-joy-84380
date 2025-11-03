import { Plus } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface FloatingActionButtonProps {
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
  label?: string;
}

export function FloatingActionButton({ 
  onClick, 
  className, 
  icon = <Plus className="h-6 w-6" />,
  label = "New Order"
}: FloatingActionButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate("/pos");
    }
  };

  return (
    <Button
      onClick={handleClick}
      size="lg"
      className={cn(
        "fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all z-40",
        "md:h-16 md:w-16 md:bottom-8 md:right-8",
        "group",
        className
      )}
      aria-label={label}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="hidden group-hover:inline-block text-sm font-medium whitespace-nowrap md:text-base">
          {label}
        </span>
      </div>
    </Button>
  );
}
