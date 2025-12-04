import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
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
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <MainLayout>
                <Dashboard />
              </MainLayout>
            }
          />
          <Route
            path="/cadastro"
            element={
              <MainLayout>
                <Cadastro />
              </MainLayout>
            }
          />
          <Route
            path="/consulta"
            element={
              <MainLayout>
                <Consulta />
              </MainLayout>
            }
          />
          <Route
            path="/relatorios"
            element={
              <MainLayout>
                <Relatorios />
              </MainLayout>
            }
          />
          <Route
            path="/configuracoes"
            element={
              <MainLayout>
                <Configuracoes />
              </MainLayout>
            }
          />
          <Route
            path="/mapa"
            element={
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
            }
          />
          <Route
            path="/estatisticas"
            element={
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
            }
          />
          <Route
            path="/instituicoes"
            element={
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
            }
          />
          <Route
            path="/usuarios"
            element={
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
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
