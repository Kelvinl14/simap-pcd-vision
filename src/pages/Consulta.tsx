import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Download,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockData = [
  {
    id: 1,
    nome: "João Carlos Santos",
    cpf: "123.456.789-12",
    deficiencia: "Física",
    regiao: "Centro",
    status: "ativo",
    cadastro: "15/01/2024",
  },
  {
    id: 2,
    nome: "Ana Maria Oliveira",
    cpf: "234.567.890-23",
    deficiencia: "Visual",
    regiao: "Norte",
    status: "ativo",
    cadastro: "20/02/2024",
  },
  {
    id: 3,
    nome: "Pedro Henrique Lima",
    cpf: "345.678.901-34",
    deficiencia: "Auditiva",
    regiao: "Sul",
    status: "pendente",
    cadastro: "10/03/2024",
  },
  {
    id: 4,
    nome: "Mariana Costa Silva",
    cpf: "456.789.012-45",
    deficiencia: "Intelectual",
    regiao: "Leste",
    status: "ativo",
    cadastro: "05/04/2024",
  },
  {
    id: 5,
    nome: "Carlos Eduardo Reis",
    cpf: "567.890.123-56",
    deficiencia: "Múltipla",
    regiao: "Oeste",
    status: "inativo",
    cadastro: "12/05/2024",
  },
  {
    id: 6,
    nome: "Fernanda Souza Lima",
    cpf: "678.901.234-67",
    deficiencia: "TEA",
    regiao: "Centro",
    status: "ativo",
    cadastro: "18/06/2024",
  },
  {
    id: 7,
    nome: "Ricardo Almeida Santos",
    cpf: "789.012.345-78",
    deficiencia: "Física",
    regiao: "Rural",
    status: "pendente",
    cadastro: "25/07/2024",
  },
  {
    id: 8,
    nome: "Juliana Martins Costa",
    cpf: "890.123.456-89",
    deficiencia: "Visual",
    regiao: "Norte",
    status: "ativo",
    cadastro: "01/08/2024",
  },
];

const statusConfig = {
  ativo: { label: "Ativo", className: "bg-success/10 text-success border-success/20" },
  pendente: { label: "Pendente", className: "bg-warning/10 text-warning border-warning/20" },
  inativo: { label: "Inativo", className: "bg-muted text-muted-foreground border-muted" },
};

export default function Consulta() {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = mockData.filter(
    (item) =>
      item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cpf.includes(searchTerm)
  );

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Consulta de PCDs</h1>
        <p className="page-description">
          Pesquise e gerencie os cadastros de pessoas com deficiência
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou CPF..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtros
              {showFilters && <Badge variant="secondary">3</Badge>}
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 grid gap-4 border-t pt-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="form-group">
                <Label htmlFor="filter-deficiencia">Tipo de Deficiência</Label>
                <Select>
                  <SelectTrigger id="filter-deficiencia">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="fisica">Física</SelectItem>
                    <SelectItem value="visual">Visual</SelectItem>
                    <SelectItem value="auditiva">Auditiva</SelectItem>
                    <SelectItem value="intelectual">Intelectual</SelectItem>
                    <SelectItem value="multipla">Múltipla</SelectItem>
                    <SelectItem value="tea">TEA</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="form-group">
                <Label htmlFor="filter-regiao">Região</Label>
                <Select>
                  <SelectTrigger id="filter-regiao">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="centro">Centro</SelectItem>
                    <SelectItem value="norte">Norte</SelectItem>
                    <SelectItem value="sul">Sul</SelectItem>
                    <SelectItem value="leste">Leste</SelectItem>
                    <SelectItem value="oeste">Oeste</SelectItem>
                    <SelectItem value="rural">Rural</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="form-group">
                <Label htmlFor="filter-status">Status</Label>
                <Select>
                  <SelectTrigger id="filter-status">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="form-group">
                <Label htmlFor="filter-periodo">Período de Cadastro</Label>
                <Select>
                  <SelectTrigger id="filter-periodo">
                    <SelectValue placeholder="Todo período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todo período</SelectItem>
                    <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                    <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                    <SelectItem value="90dias">Últimos 90 dias</SelectItem>
                    <SelectItem value="1ano">Último ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              Resultados ({filteredData.length} registros)
            </CardTitle>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">CPF</th>
                <th scope="col">Deficiência</th>
                <th scope="col">Região</th>
                <th scope="col">Status</th>
                <th scope="col">Cadastro</th>
                <th scope="col" className="w-12">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => {
                const status = statusConfig[item.status as keyof typeof statusConfig];
                return (
                  <tr key={item.id}>
                    <td className="font-medium">{item.nome}</td>
                    <td className="font-mono text-muted-foreground">{item.cpf}</td>
                    <td>{item.deficiencia}</td>
                    <td>{item.regiao}</td>
                    <td>
                      <Badge variant="outline" className={status.className}>
                        {status.label}
                      </Badge>
                    </td>
                    <td className="text-muted-foreground">{item.cadastro}</td>
                    <td>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            aria-label={`Ações para ${item.nome}`}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Exportar PDF
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Mostrando 1-8 de {filteredData.length} registros
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" disabled aria-label="Página anterior">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="icon" aria-label="Próxima página">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
