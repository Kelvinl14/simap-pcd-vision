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
                    <div className="animate-fade-in">
                      <div className="page-header">
                        <h1 className="page-title">Mapa de PCDs</h1>
                        <p className="page-description">
                          Visualização geográfica dos cadastros
                        </p>
                      </div>
                      <div className="flex h-96 items-center justify-center rounded-lg border bg-muted/50">
                        <p className="text-muted-foreground">Mapa em desenvolvimento</p>
                      </div>
                    </div>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/estatisticas"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <div className="animate-fade-in">
                      <div className="page-header">
                        <h1 className="page-title">Estatísticas</h1>
                        <p className="page-description">
                          Análises e indicadores detalhados
                        </p>
                      </div>
                      <div className="flex h-96 items-center justify-center rounded-lg border bg-muted/50">
                        <p className="text-muted-foreground">Estatísticas em desenvolvimento</p>
                      </div>
                    </div>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/instituicoes"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <div className="animate-fade-in">
                      <div className="page-header">
                        <h1 className="page-title">Instituições</h1>
                        <p className="page-description">
                          Gestão de instituições parceiras
                        </p>
                      </div>
                      <div className="flex h-96 items-center justify-center rounded-lg border bg-muted/50">
                        <p className="text-muted-foreground">Módulo em desenvolvimento</p>
                      </div>
                    </div>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/usuarios"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <div className="animate-fade-in">
                      <div className="page-header">
                        <h1 className="page-title">Usuários</h1>
                        <p className="page-description">
                          Gerenciamento de usuários do sistema
                        </p>
                      </div>
                      <div className="flex h-96 items-center justify-center rounded-lg border bg-muted/50">
                        <p className="text-muted-foreground">Módulo em desenvolvimento</p>
                      </div>
                    </div>
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
