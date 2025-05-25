import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Game } from "./components/Game";
import { SoundManager } from "./components/SoundManager";
import LandingPage from "./pages/landing";
import "@fontsource/inter";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full h-screen bg-background text-foreground font-sans">
        <Suspense 
          fallback={
            <div className="flex items-center justify-center h-full">
              <div className="text-2xl font-bold">Loading Hustler Team...</div>
            </div>
          }
        >
          <LandingPage />
        </Suspense>
      </div>
    </QueryClientProvider>
  );
}

export default App;
