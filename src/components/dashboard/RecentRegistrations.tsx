import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

const recentData = [
  {
    id: 1,
    name: "João Carlos Santos",
    cpf: "***.***.***-12",
    deficiency: "Física",
    status: "ativo",
    date: "04/12/2024",
  },
  {
    id: 2,
    name: "Ana Maria Oliveira",
    cpf: "***.***.***-34",
    deficiency: "Visual",
    status: "pendente",
    date: "03/12/2024",
  },
  {
    id: 3,
    name: "Pedro Henrique Lima",
    cpf: "***.***.***-56",
    deficiency: "Auditiva",
    status: "ativo",
    date: "02/12/2024",
  },
  {
    id: 4,
    name: "Mariana Costa Silva",
    cpf: "***.***.***-78",
    deficiency: "Intelectual",
    status: "ativo",
    date: "01/12/2024",
  },
  {
    id: 5,
    name: "Carlos Eduardo Reis",
    cpf: "***.***.***-90",
    deficiency: "Múltipla",
    status: "pendente",
    date: "30/11/2024",
  },
];

const statusConfig = {
  ativo: { label: "Ativo", className: "status-active" },
  pendente: { label: "Pendente", className: "status-pending" },
  inativo: { label: "Inativo", className: "status-inactive" },
};

export function RecentRegistrations() {
  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center justify-between border-b p-4">
        <div>
          <h3 className="font-semibold">Cadastros Recentes</h3>
          <p className="text-sm text-muted-foreground">
            Últimos 5 cadastros realizados
          </p>
        </div>
        <Button variant="outline" size="sm">
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
            {recentData.map((item) => {
              const status = statusConfig[item.status as keyof typeof statusConfig];
              return (
                <tr key={item.id}>
                  <td className="font-medium">{item.name}</td>
                  <td className="font-mono text-muted-foreground">{item.cpf}</td>
                  <td>{item.deficiency}</td>
                  <td>
                    <span className={`status-badge ${status.className}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="text-muted-foreground">{item.date}</td>
                  <td>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      aria-label={`Ver detalhes de ${item.name}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
