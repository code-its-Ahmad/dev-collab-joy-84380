import { Alert, AlertDescription } from "@/components/ui/alert";
import { WifiOff, Wifi } from "lucide-react";
import { useOfflineSync } from "@/hooks/useOfflineSync";

export function OfflineIndicator() {
  const { isOnline, pendingSync } = useOfflineSync();

  if (isOnline && !pendingSync) return null;

  return (
    <Alert className={`fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 ${isOnline ? 'bg-primary/10 border-primary' : 'bg-destructive/10 border-destructive'}`}>
      <div className="flex items-center gap-2">
        {isOnline ? (
          <>
            <Wifi className="h-4 w-4 text-primary animate-pulse" />
            <AlertDescription className="text-primary">
              Syncing offline changes...
            </AlertDescription>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">
              You're offline. Changes will sync automatically when reconnected.
            </AlertDescription>
          </>
        )}
      </div>
    </Alert>
  );
}
