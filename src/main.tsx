import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { InventoryProvider } from "./contexts/InventoryContext";
import { OrdersProvider } from "./contexts/OrdersContext";
import { POSProvider } from "./contexts/POSContext";

createRoot(document.getElementById("root")!).render(
  <POSProvider>
    <OrdersProvider>
      <InventoryProvider>
        <App />
      </InventoryProvider>
    </OrdersProvider>
  </POSProvider>
);
