import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import VerifyOtp from "./pages/VerifyOtp";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Home from "./pages/dashboard/Home";
import Compare from "./pages/dashboard/Compare";
import Favorites from "./pages/dashboard/Favorites";
import Cart from "./pages/dashboard/Cart";
import Settings from "./pages/dashboard/Settings";
import NotFound from "./pages/NotFound";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/dashboard" element={<DashboardLayout><Home /></DashboardLayout>} />
            <Route path="/dashboard/compare" element={<DashboardLayout><Compare /></DashboardLayout>} />
            <Route path="/dashboard/favorites" element={<DashboardLayout><Favorites /></DashboardLayout>} />
            <Route path="/dashboard/cart" element={<DashboardLayout><Cart /></DashboardLayout>} />
            <Route path="/dashboard/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
