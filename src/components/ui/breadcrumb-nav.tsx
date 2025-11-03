import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Breadcrumb {
  label: string;
  path: string;
}

interface BreadcrumbNavProps {
  items: Breadcrumb[];
  className?: string;
}

export function BreadcrumbNav({ items, className }: BreadcrumbNavProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-2 text-sm", className)}>
      <Link
        to="/"
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={item.path} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            {isLast ? (
              <span className="font-medium text-foreground">{item.label}</span>
            ) : (
              <Link
                to={item.path}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
