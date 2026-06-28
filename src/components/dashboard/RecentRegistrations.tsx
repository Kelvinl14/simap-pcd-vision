import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { dashboardService, RecentPcd } from "@/services/dashboard.service";

const labelMap: Record<string, string> = {
  FISICA: "Física",
  VISUAL: "Visual",
  AUDITIVA: "Auditiva",
  INTELECTUAL: "Intelectual",
  MULTIPLA: "Múltipla",
  PSICOSSOCIAL: "Psicossocial",
};

const statusConfig = {
  ativo: { label: "Ativo", className: "status-active" },
  pendente: { label: "Pendente", className: "status-pending" },
  inativo: { label: "Inativo", className: "status-inactive" },
};

export function RecentRegistrations() {
  const [recentData, setRecentData] = useState<RecentPcd[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const data = await dashboardService.getRecent();
        setRecentData(data);
      } catch (error) {
        console.error("Erro ao carregar cadastros recentes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecent();
  }, []);

  const formatCpf = (cpf: string) => {
    if (cpf.length === 11) {
      return `***.***.${cpf.substring(6, 9)}-${cpf.substring(9, 11)}`;
    }
    return cpf;
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-6 flex flex-col justify-center items-center h-[200px]">
        <span className="text-muted-foreground">Carregando cadastros recentes...</span>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center justify-between border-b p-4">
        <div>
          <h3 className="font-semibold">Cadastros Recentes</h3>
          <p className="text-sm text-muted-foreground">
            Últimos 5 cadastros realizados
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.location.href = '/consulta'}>
          Ver todos
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Nome</th>
              <th scope="col">CPF</th>
              <th scope="col">Deficiência</th>
              <th scope="col">Status</th>
              <th scope="col">Data</th>
              <th scope="col" className="w-12">
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {recentData.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-muted-foreground">
                  Nenhum cadastro recente encontrado.
                </td>
              </tr>
            ) : (
              recentData.map((item) => {
                const status = statusConfig["ativo"]; // Tudo que está no banco do MVP é ativo
                const defType = item.disabilities[0]?.type;
                const defLabel = labelMap[defType] || defType || "Não Informado";
                const dateStr = new Date(item.createdAt).toLocaleDateString('pt-BR');

                return (
                  <tr key={item.id}>
                    <td className="font-medium">{item.name}</td>
                    <td className="font-mono text-muted-foreground">{formatCpf(item.cpf)}</td>
                    <td>{defLabel}</td>
                    <td>
                      <span className={`status-badge ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="text-muted-foreground">{dateStr}</td>
                    <td>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        aria-label={`Ver detalhes de ${item.name}`}
                        onClick={() => window.location.href = `/consulta`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
