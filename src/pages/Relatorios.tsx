import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Download,
  Printer,
  Calendar,
  BarChart3,
  Users,
  MapPin,
  FileSpreadsheet,
} from "lucide-react";

const reportTypes = [
  {
    id: "geral",
    title: "Relatório Geral",
    description: "Visão completa de todos os cadastros do sistema",
    icon: FileText,
  },
  {
    id: "deficiencia",
    title: "Por Tipo de Deficiência",
    description: "Cadastros agrupados por tipo de deficiência",
    icon: Users,
  },
  {
    id: "regiao",
    title: "Por Região",
    description: "Distribuição geográfica dos cadastros",
    icon: MapPin,
  },
  {
    id: "estatistico",
    title: "Estatístico",
    description: "Análise estatística com gráficos e indicadores",
    icon: BarChart3,
  },
];

const recentReports = [
  {
    id: 1,
    name: "Relatório Mensal - Novembro 2024",
    type: "Geral",
    date: "01/12/2024",
    size: "2.4 MB",
  },
  {
    id: 2,
    name: "Cadastros por Região - Q4 2024",
    type: "Regional",
    date: "28/11/2024",
    size: "1.8 MB",
  },
  {
    id: 3,
    name: "Análise Estatística Anual",
    type: "Estatístico",
    date: "25/11/2024",
    size: "3.2 MB",
  },
];

export default function Relatorios() {
  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Relatórios</h1>
        <p className="page-description">
          Gere e exporte relatórios detalhados do sistema
        </p>
      </div>

      {/* Report Types */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">Tipos de Relatório</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <Card
                key={report.id}
                className="cursor-pointer transition-all hover:border-primary hover:shadow-md"
              >
                <CardHeader className="pb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-base">{report.title}</CardTitle>
                  <CardDescription className="mt-1 text-sm">
                    {report.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Generate Report Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Gerar Novo Relatório</CardTitle>
          <CardDescription>
            Configure os parâmetros para gerar um relatório personalizado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="form-group">
              <Label htmlFor="tipo-relatorio">Tipo de Relatório</Label>
              <Select>
                <SelectTrigger id="tipo-relatorio">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="geral">Relatório Geral</SelectItem>
                  <SelectItem value="deficiencia">Por Tipo de Deficiência</SelectItem>
                  <SelectItem value="regiao">Por Região</SelectItem>
                  <SelectItem value="estatistico">Estatístico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="form-group">
              <Label htmlFor="data-inicio">Data Início</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="data-inicio" type="date" className="pl-9" />
              </div>
            </div>

            <div className="form-group">
              <Label htmlFor="data-fim">Data Fim</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="data-fim" type="date" className="pl-9" />
              </div>
            </div>

            <div className="form-group">
              <Label htmlFor="formato">Formato</Label>
              <Select>
                <SelectTrigger id="formato">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Gerar e Baixar
            </Button>
            <Button variant="outline" className="gap-2">
              <Printer className="h-4 w-4" />
              Visualizar Impressão
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Relatórios Recentes</CardTitle>
          <CardDescription>
            Últimos relatórios gerados pelo sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {report.type} • {report.date} • {report.size}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Baixar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
