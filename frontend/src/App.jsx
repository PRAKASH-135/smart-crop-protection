import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Logs from "./pages/Logs";
import AnalyticsPage from "./pages/AnalyticsPage";
import CropRules from "./pages/CropRules";
import Settings from "./pages/Settings";

import Login from "./pages/Login";
import Register from "./pages/Register";

function DashboardLayout() {
  return (
    <div className="app-shell">

      <Sidebar />

      <main className="main-content">
        <Outlet />
      </main>

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ================================
            PUBLIC PAGES
           ================================ */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* ================================
            PROTECTED DASHBOARD
           ================================ */}

        <Route element={<ProtectedRoute />}>

          <Route element={<DashboardLayout />}>

            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/logs"
              element={<Logs />}
            />

            <Route
              path="/analytics"
              element={<AnalyticsPage />}
            />

            <Route
              path="/crop-rules"
              element={<CropRules />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />

          </Route>

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;