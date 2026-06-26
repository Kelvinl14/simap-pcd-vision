import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";

// Auth pages
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import InstructionsSent from "./pages/auth/InstructionsSent";
import FirstAccess from "./pages/auth/FirstAccess";
import Welcome from "./pages/auth/Welcome";

// App pages
import Dashboard from "./pages/Dashboard";
import Cadastro from "./pages/Cadastro";
import Consulta from "./pages/Consulta";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";
import Mapa from "./pages/Mapa";
import Estatisticas from "./pages/Estatisticas";
import Usuarios from "./pages/Usuarios";
import Instituicoes from "./pages/Instituicoes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/esqueci-senha" element={<ForgotPassword />} />
            <Route path="/instrucoes-enviadas" element={<InstructionsSent />} />
            <Route path="/primeiro-acesso" element={<FirstAccess />} />
            <Route path="/bem-vindo" element={<Welcome />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cadastro"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Cadastro />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/consulta"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Consulta />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/relatorios"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Relatorios />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/configuracoes"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Configuracoes />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/mapa"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Mapa />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/estatisticas"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Estatisticas />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/instituicoes"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Instituicoes />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/usuarios"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Usuarios />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
