import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { Header } from "./Header";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { OfflineIndicator } from "./OfflineIndicator";
import { Suspense } from "react";
import { LoadingScreen } from "@/components/ui/loading-spinner";

export function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <Suspense fallback={<LoadingScreen />}>
        <main className="flex-1 pb-20 md:pb-8">
          <Outlet />
        </main>
      </Suspense>
      <BottomNav />
      <FloatingActionButton />
      <OfflineIndicator />
    </div>
  );
}
