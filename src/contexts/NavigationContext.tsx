import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface NavigationContextType {
  breadcrumbs: Array<{ label: string; path: string }>;
  setBreadcrumbs: (breadcrumbs: Array<{ label: string; path: string }>) => void;
  goBack: () => void;
  canGoBack: boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{ label: string; path: string }>>([]);

  const goBack = useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  }, [navigate]);

  const canGoBack = window.history.length > 1;

  return (
    <NavigationContext.Provider value={{ breadcrumbs, setBreadcrumbs, goBack, canGoBack }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}
