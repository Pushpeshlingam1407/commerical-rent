import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";

import { Login } from "./pages/auth/Login";
import { Signup } from "./pages/auth/Signup";

import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { UserManagement } from "./pages/admin/UserManagement";
import { AllProperties } from "./pages/admin/AllProperties";

import {
  OwnerDashboard,
  OwnerProperties,
  TenantDashboard,
  TenantBrowse,
  TenantPayments,
  LeaseManagerDashboard,
  AdminLeases,
  AdminDisputes,
} from "./pages/Dashboards";
import { TenantDisputes } from "./pages/tenant/TenantDisputes";
import { OwnerDisputes } from "./pages/owner/OwnerDisputes";
import { LeaseApprovals } from "./pages/manager/LeaseApprovals";
import { LeaseAnalytics } from "./pages/manager/LeaseAnalytics";
import { ActiveLeases } from "./pages/manager/ActiveLeases";
import { LeaseDetails } from "./pages/manager/LeaseDetails";
import { DisputeDashboard } from "./pages/manager/DisputeDashboard";
import { PendingDisputes } from "./pages/manager/PendingDisputes";
import { ResolvedDisputes } from "./pages/manager/ResolvedDisputes";

const theme = createTheme({
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  palette: {
    primary: {
      main: "#4F46E5",
    },
    secondary: {
      main: "#10B981",
    },
    background: {
      default: "#F3F4F6",
    },
  },
  shape: {
    borderRadius: 8,
  },
});

const RoleBasedRedirect: React.FC = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case "ADMIN":
      return <Navigate to="/admin" replace />;
    case "PROPERTY_OWNER":
      return <Navigate to="/owner" replace />;
    case "TENANT":
      return <Navigate to="/tenant" replace />;
    case "LEASE_MANAGER":
      return <Navigate to="/manager/leases" replace />;
    case "DISPUTE_MANAGER":
      return <Navigate to="/manager/disputes" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <RoleBasedRedirect />
          </ProtectedRoute>
        }
      />

      <Route element={<Layout />}>
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/properties" element={<AllProperties />} />
          <Route path="/admin/leases" element={<AdminLeases />} />
          <Route path="/admin/disputes" element={<AdminDisputes />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["PROPERTY_OWNER"]} />}>
          <Route path="/owner" element={<OwnerDashboard />} />
          <Route path="/owner/properties" element={<OwnerProperties />} />
          <Route path="/owner/disputes" element={<OwnerDisputes />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["TENANT"]} />}>
          <Route path="/tenant" element={<TenantDashboard />} />
          <Route path="/tenant/browse" element={<TenantBrowse />} />
          <Route path="/tenant/payments" element={<TenantPayments />} />
          <Route path="/tenant/disputes" element={<TenantDisputes />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["LEASE_MANAGER"]} />}>
          <Route path="/manager/leases" element={<LeaseManagerDashboard />} />
          <Route path="/manager/approvals" element={<LeaseApprovals />} />
          <Route path="/manager/active" element={<ActiveLeases />} />
          <Route path="/manager/analytics" element={<LeaseAnalytics />} />
          <Route path="/manager/lease/:id" element={<LeaseDetails />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["DISPUTE_MANAGER"]} />}>
          <Route
            path="/manager/disputes"
            element={<DisputeDashboard />}
          />
          <Route
            path="/manager/pending"
            element={<PendingDisputes />}
          />
          <Route
            path="/manager/resolved"
            element={<ResolvedDisputes />}
          />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <ToastContainer position="bottom-right" theme="colored" />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
