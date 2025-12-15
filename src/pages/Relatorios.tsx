import { useState } from "react";
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
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  generateGeralReport,
  generateDeficienciaReport,
  generateRegiaoReport,
  generateEstatisticoReport,
} from "@/lib/pdf-export";

const reportTypes = [
  {
    id: "geral",
    title: "Relatório Geral",
    description: "Visão completa de todos os cadastros do sistema",
    icon: FileText,
    generator: generateGeralReport,
  },
  {
    id: "deficiencia",
    title: "Por Tipo de Deficiência",
    description: "Cadastros agrupados por tipo de deficiência",
    icon: Users,
    generator: generateDeficienciaReport,
  },
  {
    id: "regiao",
    title: "Por Região",
    description: "Distribuição geográfica dos cadastros",
    icon: MapPin,
    generator: generateRegiaoReport,
  },
  {
    id: "estatistico",
    title: "Estatístico",
    description: "Análise estatística com gráficos e indicadores",
    icon: BarChart3,
    generator: generateEstatisticoReport,
  },
];

const recentReports = [
  {
    id: 1,
    name: "Relatório Mensal - Novembro 2024",
    type: "Geral",
    date: "01/12/2024",
    size: "2.4 MB",
    generator: generateGeralReport,
  },
  {
    id: 2,
    name: "Cadastros por Região - Q4 2024",
    type: "Regional",
    date: "28/11/2024",
    size: "1.8 MB",
    generator: generateRegiaoReport,
  },
  {
    id: 3,
    name: "Análise Estatística Anual",
    type: "Estatístico",
    date: "25/11/2024",
    size: "3.2 MB",
    generator: generateEstatisticoReport,
  },
];

export default function Relatorios() {
  const [selectedType, setSelectedType] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingCardId, setGeneratingCardId] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    if (!selectedType) {
      toast.error("Selecione um tipo de relatório");
      return;
    }

    setIsGenerating(true);
    
    // Simulate loading for better UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const report = reportTypes.find((r) => r.id === selectedType);
      if (report) {
        report.generator();
        toast.success(`${report.title} gerado com sucesso!`);
      }
    } catch (error) {
      toast.error("Erro ao gerar relatório");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickGenerate = async (reportId: string, generator: () => void) => {
    setGeneratingCardId(reportId);
    
    await new Promise((resolve) => setTimeout(resolve, 600));

    try {
      generator();
      const report = reportTypes.find((r) => r.id === reportId);
      toast.success(`${report?.title || "Relatório"} gerado com sucesso!`);
    } catch (error) {
      toast.error("Erro ao gerar relatório");
    } finally {
      setGeneratingCardId(null);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Relatórios</h1>
        <p className="page-description">
          Gere e exporte relatórios detalhados em PDF com gráficos e tabelas
        </p>
      </div>

      {/* Report Types */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">Tipos de Relatório</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            const isLoading = generatingCardId === report.id;
            return (
              <Card
                key={report.id}
                className="cursor-pointer transition-all hover:border-primary hover:shadow-md group"
                onClick={() => !isLoading && handleQuickGenerate(report.id, report.generator)}
              >
                <CardHeader className="pb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-base">{report.title}</CardTitle>
                  <CardDescription className="mt-1 text-sm">
                    {isLoading ? "Gerando PDF..." : report.description}
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
            Configure os parâmetros para gerar um relatório personalizado em PDF
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="form-group">
              <Label htmlFor="tipo-relatorio">Tipo de Relatório</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
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
              <Select defaultValue="pdf">
                <SelectTrigger id="formato">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel" disabled>Excel (.xlsx) - Em breve</SelectItem>
                  <SelectItem value="csv" disabled>CSV - Em breve</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button 
              className="gap-2" 
              onClick={handleGenerateReport}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {isGenerating ? "Gerando..." : "Gerar e Baixar PDF"}
            </Button>
            <Button variant="outline" className="gap-2" disabled>
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
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => report.generator()}
                  >
                    <Download className="h-4 w-4" />
                    Baixar PDF
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