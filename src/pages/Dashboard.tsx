import { useEffect, useState } from "react";
import { Users, UserPlus, FileCheck, Clock, Accessibility } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentRegistrations } from "@/components/dashboard/RecentRegistrations";
import { DeficiencyChart } from "@/components/dashboard/DeficiencyChart";
import { RegionChart } from "@/components/dashboard/RegionChart";
import { dashboardService, DashboardSummary } from "@/services/dashboard.service";

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await dashboardService.getSummary();
        setSummary(data);
      } catch (error) {
        console.error("Erro ao carregar sumário:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">
          Visão geral do sistema de mapeamento de pessoas com deficiência
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
        <StatCard
          title="Total de Cadastros"
          value={isLoading ? "..." : summary?.totalPcds.toLocaleString() || "0"}
          icon={<Users className="h-full w-full" />}
          trend={{ value: 100, label: "ativos no sistema" }}
        />
        <StatCard
          title="Novos este Mês"
          value={isLoading ? "..." : summary?.newThisMonth.toLocaleString() || "0"}
          icon={<UserPlus className="h-full w-full" />}
          trend={{ value: 100, label: "cadastros recentes" }}
        />
        <StatCard
          title="Instituições Parceiras"
          value={isLoading ? "..." : summary?.totalInstitutions.toLocaleString() || "0"}
          icon={<FileCheck className="h-full w-full" />}
          description="Unidades registradas"
        />
        <StatCard
          title="Usuários Ativos"
          value={isLoading ? "..." : summary?.totalUsers.toLocaleString() || "0"}
          icon={<Clock className="h-full w-full" />}
          description="Acessos no sistema"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <DeficiencyChart />
        <RegionChart />
      </div>

      {/* Recent Registrations */}
      <RecentRegistrations />

      {/* Quick Access */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="mb-4 font-semibold">Acesso Rápido</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href="/cadastro"
            className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4 transition-all hover:bg-muted hover:shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Novo Cadastro</p>
              <p className="text-sm text-muted-foreground">Registrar PCD</p>
            </div>
          </a>
          <a
            href="/consulta"
            className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4 transition-all hover:bg-muted hover:shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <Accessibility className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Consultar</p>
              <p className="text-sm text-muted-foreground">Buscar cadastros</p>
            </div>
          </a>
          <a
            href="/relatorios"
            className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4 transition-all hover:bg-muted hover:shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success text-success-foreground">
              <FileCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Relatórios</p>
              <p className="text-sm text-muted-foreground">Gerar documentos</p>
            </div>
          </a>
          <a
            href="/mapa"
            className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4 transition-all hover:bg-muted hover:shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning text-warning-foreground">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Mapa</p>
              <p className="text-sm text-muted-foreground">Visualização</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
