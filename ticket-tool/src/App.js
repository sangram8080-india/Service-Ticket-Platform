import React, { Suspense, lazy } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import ProtectedRoute from "./Components/ProtectRoutes";
import LoadingSpinner from "./Components/common/LoadingSpinner";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ErrorBoundary from "./Components/ErrorBoundary";
import AccessDenied from "./Pages/AccessDenied";
import "leaflet/dist/leaflet.css";

// ---------- Public Pages ----------
const Home = lazy(() => import("./Pages/Home"));
const Login = lazy(() => import("./Pages/Login"));
const AdminLogin = lazy(() => import("./Pages/Admin/AdminLogin"));
const Register = lazy(() => import("./Pages/SignUp"));
const ForgotPassword = lazy(() => import("./Pages/ForgetPassword"));
const NotFound = lazy(() => import("./Pages/NotFound"));
const AboutUsPage = lazy(() => import("./Pages/AboutUsPage"));
const ContactUs = lazy(() => import("./Pages/ContactUs"));
const ServicePage = lazy(() => import("./Pages/ServicePage"));

// ---------- User Portal ----------
const UserPortalLayout = lazy(() => import("./Pages/User/UserPortalLayout"));
const UserDashboard = lazy(() => import("./Pages/User/Dashboard"));
const Profile = lazy(() => import("./Pages/User/Profile"));
const Tickets = lazy(() => import("./Pages/User/Tickets"));
const TicketDetails = lazy(() => import("./Pages/User/TicketDetails"));
const NewTicket = lazy(() => import("./Pages/User/NewTicket"));

// ---------- Employee Portal ----------
const EmployeePortalLayout = lazy(() =>
  import("./Pages/Employee/EmployeePortalLayout")
);
const EmployeeDashboard = lazy(() => import("./Pages/Employee/Dashboard"));
const EmployeeTasks = lazy(() => import("./Pages/Employee/Tasks"));
const EmployeeCalendar = lazy(() => import("./Pages/Employee/Calendar"));
const EmployeeMessages = lazy(() => import("./Pages/Employee/Messages"));
const EmployeePerformance = lazy(() =>
  import("./Pages/Employee/Performance")
);

// ---------- Admin Portal ----------
const AdminPortalLayout = lazy(() =>
  import("./Pages/Admin/AdminPortalLayout")
);
const AdminDashboard = lazy(() => import("./Pages/Admin/Dashboard"));
const UserManagement = lazy(() => import("./Pages/Admin/UserManagement"));
const TicketManagement = lazy(() => import("./Pages/Admin/TicketManagement"));
const Analytics = lazy(() => import("./Pages/Admin/Analytics"));
const SystemSettings = lazy(() => import("./Pages/Admin/Settings"));
const LiveTracking = lazy(() => import("./Pages/Admin/LiveTracking"));
const AdminChat = lazy(() => import("./Pages/Admin/AdminChat"));

// ---------- Layout Wrapper ----------
const PublicLayout = () => (
  <div className="flex flex-col min-h-screen">
    <main className="flex-grow">
      <Outlet />
    </main>
  </div>
);

// ---------- Home Redirect Component (Updated) ----------
const HomeRedirect = () => {
  const { user } = useAuth();

  if (user) {
    switch (user.role) {
      case "ADMIN":
        return <Navigate to="/admin-portal/dashboard" replace />;
      case "EMPLOYEE":
        return <Navigate to="/employee-portal/dashboard" replace />;
      case "USER":
        return <Navigate to="/user-portal/dashboard" replace />;
      default:
        return <Home />;
    }
  }
  return <Home />;
};

// ---------- App Component ----------
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-screen">
                <LoadingSpinner />
              </div>
            }
          >
            <Routes>
              {/* ---------- Public Routes ---------- */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/about" element={<AboutUsPage />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/services" element={<ServicePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/access-denied" element={<AccessDenied />} />
              </Route>

              {/* ---------- User Portal ---------- */}
              <Route
                path="/user-portal/*"
                element={
                  <ProtectedRoute allowedRoles={["USER", "EMPLOYEE"]}>
                    <UserPortalLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<UserDashboard />} />
                <Route path="tickets" element={<Tickets />} />
                <Route path="tickets/:ticketId" element={<TicketDetails />} />
                <Route path="new-ticket" element={<NewTicket />} />
                <Route path="profile" element={<Profile />} />
              </Route>

              {/* ---------- Employee Portal ---------- */}
              <Route
                path="/employee-portal/*"
                element={
                  <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
                    <EmployeePortalLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<EmployeeDashboard />} />
                <Route path="tasks" element={<EmployeeTasks />} />
                <Route path="calendar" element={<EmployeeCalendar />} />
                <Route path="messages" element={<EmployeeMessages />} />
                <Route path="performance" element={<EmployeePerformance />} />
                <Route path="profile" element={<Profile />} />
              </Route>

              {/* ---------- Admin Portal ---------- */}
              <Route
                path="/admin-portal/*"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <AdminPortalLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="tickets" element={<TicketManagement />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<SystemSettings />} />
                <Route path="live-tracking" element={<LiveTracking />} />
                <Route path="chat" element={<AdminChat />} />
              </Route>

              {/* ---------- Redirects ---------- */}
              <Route path="/" element={<HomeRedirect />} />
              <Route
                path="/admin"
                element={<Navigate to="/admin/login" replace />}
              />

              {/* ---------- 404 Page ---------- */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;