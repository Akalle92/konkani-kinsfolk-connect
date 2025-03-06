
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ClerkAuthProvider } from "./contexts/auth/ClerkAuthContext";
import MainLayout from "./components/layouts/MainLayout";

import Index from "./pages/Index";
import ClerkAuth from "./pages/ClerkAuth";
import Trees from "./pages/Trees";
import TreeView from "./pages/TreeView";
import Dashboard from "./pages/Dashboard";

import "./App.css";

// Create a client for React Query with better error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <ClerkAuthProvider>
          <Toaster richColors position="top-right" />
          <Routes>
            {/* Public routes that don't require authentication */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<ClerkAuth />} />
            
            {/* Protected routes that require authentication */}
            <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
            <Route path="/trees" element={<MainLayout><Trees /></MainLayout>} />
            <Route path="/trees/:id" element={<MainLayout><TreeView /></MainLayout>} />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ClerkAuthProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
