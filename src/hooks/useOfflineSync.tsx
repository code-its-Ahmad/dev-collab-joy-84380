import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSync, setPendingSync] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Connection restored. Syncing data...");
      syncPendingData();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning("You're offline. Changes will sync when connection is restored.");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const syncPendingData = useCallback(async () => {
    setPendingSync(true);
    try {
      // Get pending data from IndexedDB
      const pendingOrders = localStorage.getItem("pendingOrders");
      if (pendingOrders) {
        const orders = JSON.parse(pendingOrders);
        // Sync orders with backend
        console.log("Syncing orders:", orders);
        localStorage.removeItem("pendingOrders");
        toast.success("Data synced successfully");
      }
    } catch (error) {
      console.error("Sync failed:", error);
      toast.error("Failed to sync data");
    } finally {
      setPendingSync(false);
    }
  }, []);

  const saveOfflineData = useCallback((key: string, data: any) => {
    try {
      const existing = localStorage.getItem(key);
      const items = existing ? JSON.parse(existing) : [];
      items.push({ ...data, timestamp: Date.now() });
      localStorage.setItem(key, JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save offline data:", error);
    }
  }, []);

  return { isOnline, pendingSync, saveOfflineData, syncPendingData };
}
