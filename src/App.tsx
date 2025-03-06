
import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Trees from "@/pages/Trees";
import TreePage from "@/pages/TreePage";
import TreeView from "@/pages/TreeView";
import Auth from "@/pages/Auth";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import MainLayout from "@/components/layouts/MainLayout";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Dashboard routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trees" element={<Trees />} />
          <Route path="/trees/:id" element={<TreePage />} />
          <Route path="/trees/:id/legacy" element={<TreeView />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
