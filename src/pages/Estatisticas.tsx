import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Filter } from "lucide-react";
import { generatePDFReport } from "@/lib/pdf-export";
import autoTable from "jspdf-autotable";
import { StatCard } from "@/components/dashboard/StatCard";
import { Users, HeartPulse, FileCheck, ChartLine, UserPlus } from "lucide-react";


// Mock Data
const MOCK_STATS = {
  monthlyRegistrations: [
    { name: "Jan", total: 45 },
    { name: "Fev", total: 52 },
    { name: "Mar", total: 38 },
    { name: "Abr", total: 65 },
    { name: "Mai", total: 48 },
    { name: "Jun", total: 72 },
  ],
  disabilityDistribution: [
    { name: "Física", value: 120, color: "#0088FE" },
    { name: "Visual", value: 80, color: "#00C49F" },
    { name: "Auditiva", value: 60, color: "#FFBB28" },
    { name: "Intelectual", value: 40, color: "#FF8042" },
    { name: "Múltipla", value: 30, color: "#8884d8" },
  ],
  ageGroups: [
    { name: "0-18", value: 50 },
    { name: "19-30", value: 80 },
    { name: "31-50", value: 100 },
    { name: "51-65", value: 70 },
    { name: "65+", value: 30 },
  ],
  regions: [
    { name: "Centro", value: 85 },
    { name: "Nova Caxias", value: 65 },
    { name: "Cohab", value: 45 },
    { name: "Vila Alecrim", value: 35 },
  ],
  evolution: [
    { year: "2020", count: 150 },
    { year: "2021", count: 230 },
    { year: "2022", count: 350 },
    { year: "2023", count: 480 },
    { year: "2024", count: 620 },
  ],
};

const Estatisticas = () => {
  const [filters, setFilters] = useState({
    year: "2024",
    region: "all",
    disability: "all",
  });

  const handleExport = () => {
    const doc = generatePDFReport({
      title: "Relatório Estatístico",
      subtitle: `Gerado com base nos filtros: Ano ${filters.year}`,
      type: "estatistico",
    });

    // Add Summary Table
    autoTable(doc, {
      startY: ((doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 60) + 20,
      head: [["Indicador", "Valor"]],
      body: [
        ["Total de Registros", "330"],
        ["Deficiência Predominante", "Física (36%)"],
        ["Região com Maior Densidade", "Centro"],
        ["Média de Idade", "34 anos"],
      ],
    });

    doc.save("relatorio-estatistico.pdf");
  };

  return (
    <div className="space-y-6 animate-fade-in">

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="page-title">Estatísticas</h1>
          <p className="page-description">
            Análises detalhadas e indicadores da população cadastrada.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-2 md:w-auto">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filtros:</span>
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:flex-1">
              <Select
                value={filters.year}
                onValueChange={(v) => setFilters({ ...filters, year: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.region}
                onValueChange={(v) => setFilters({ ...filters, region: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Região" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Regiões</SelectItem>
                  <SelectItem value="centro">Centro</SelectItem>
                  <SelectItem value="norte">Zona Norte</SelectItem>
                  <SelectItem value="sul">Zona Sul</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.disability}
                onValueChange={(v) => setFilters({ ...filters, disability: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de Deficiência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="fisica">Física</SelectItem>
                  <SelectItem value="visual">Visual</SelectItem>
                  <SelectItem value="auditiva">Auditiva</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
        <StatCard
          title="Total de Cadastros"
          value="456"
          icon={<Users className="h-full w-full" />}
          trend={{ value: 12, label: "vs. mês anterior" }}
        />
        <StatCard
          title="Tipo Predominante"
          value="Física"
          icon={<HeartPulse className="h-full w-full" />}
          description="36% do total"
        />
        <StatCard
          title="Faixa Etária Principal"
          value="31-50"
          icon={<UserPlus className="h-full w-full " />}
          description="Anos"
        />
        <StatCard
          title="Região Mais Densa"
          value="Centro"
          icon={<ChartLine className="h-full w-full" />}
          description="85 cadastros"
        />  
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Registros Mensais</CardTitle>
            <CardDescription>Novos cadastros por mês em {filters.year}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_STATS.monthlyRegistrations}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Deficiência</CardTitle>
            <CardDescription>Proporção entre os tipos cadastrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MOCK_STATS.disabilityDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {MOCK_STATS.disabilityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Evolução Anual</CardTitle>
            <CardDescription>Crescimento da base de dados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_STATS.evolution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição Geográfica</CardTitle>
            <CardDescription>Concentração por região</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_STATS.regions} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo Detalhado</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Indicador</TableHead>
                <TableHead>Detalhes</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Total de Registros</TableCell>
                <TableCell>Cadastros ativos no sistema</TableCell>
                <TableCell className="text-right">330</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Média de Idade</TableCell>
                <TableCell>Base completa</TableCell>
                <TableCell className="text-right">34 anos</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Instituições Parceiras</TableCell>
                <TableCell>Com vínculos ativos</TableCell>
                <TableCell className="text-right">12</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Atendimentos/Mês</TableCell>
                <TableCell>Média dos últimos 6 meses</TableCell>
                <TableCell className="text-right">45</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Estatisticas;
