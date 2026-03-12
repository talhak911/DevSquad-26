import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { Toaster } from "react-hot-toast";
import getTheme from "./theme";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Members from "./pages/Members";

const THEME_KEY = "portal_theme";

const AppLayout: React.FC<{ mode: "light" | "dark"; toggleMode: () => void }> = ({ mode, toggleMode }) => {
  const location = useLocation();
  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "var(--color-bg)", display: "flex", flexDirection: "column" }}>
      {!isAuthPage && <Navbar mode={mode} toggleMode={toggleMode} />}
      <Box sx={{ flex: 1 }}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes — all authenticated users */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />

          {/* Company only */}
          <Route
            path="/members"
            element={
              <ProtectedRoute allowedRoles={["company"]}>
                <Members />
              </ProtectedRoute>
            }
          />

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Box>
    </Box>
  );
};

const App: React.FC = () => {
  const [mode, setMode] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return (saved as "light" | "dark") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
    localStorage.setItem(THEME_KEY, mode);
  }, [mode]);

  const toggleMode = () => setMode((m) => (m === "light" ? "dark" : "light"));
  const theme = getTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: mode === "dark" ? "#1e2a3a" : "#ffffff",
            color: mode === "dark" ? "#f1f5f9" : "#0f172a",
            border: mode === "dark" ? "1px solid #1e293b" : "1px solid #e2e8f0",
            borderRadius: "12px",
            fontSize: "0.875rem",
            fontWeight: 500,
          },
        }}
      />
      <AuthProvider>
        <BrowserRouter>
          <AppLayout mode={mode} toggleMode={toggleMode} />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
