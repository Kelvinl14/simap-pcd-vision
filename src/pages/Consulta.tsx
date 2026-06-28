import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { pcdService, Pcd, DisabilityType } from "@/services/pcd.service";
import { generatePDFReport } from "@/lib/pdf-export";
import autoTable from "jspdf-autotable";

const labelMap: Record<string, string> = {
  FISICA: "Física",
  VISUAL: "Visual",
  AUDITIVA: "Auditiva",
  INTELECTUAL: "Intelectual",
  MULTIPLA: "Múltipla",
  PSICOSSOCIAL: "Psicossocial",
};

const statusConfig = {
  ativo: { label: "Ativo", className: "bg-success/10 text-success border-success/20" },
  pendente: { label: "Pendente", className: "bg-warning/10 text-warning border-warning/20" },
  inativo: { label: "Inativo", className: "bg-muted text-muted-foreground border-muted" },
};

type PatientFilters = {
  page: number;
  limit: number;
  search?: string;
  disabilityType?: DisabilityType;
  city?: string;
};

export default function Consulta() {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pcds, setPcds] = useState<Pcd[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados de paginação e filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filterDisability, setFilterDisability] = useState<string>("todos");
  const [filterCity, setFilterCity] = useState<string>("todas");

  const fetchPcds = async () => {
    setIsLoading(true);
    try {
      const filters: PatientFilters = {
        page: currentPage,
        limit: 8,
      };

      if (searchTerm) {
        filters.search = searchTerm;
      }

      if (filterDisability !== "todos") {
        filters.disabilityType = filterDisability as DisabilityType;
      }

      if (filterCity !== "todas") {
        filters.city = filterCity;
      }

      const response = await pcdService.findAll(filters);
      setPcds(response.data);
      setTotalPages(response.meta.totalPages);
      setTotalCount(response.meta.total);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro de comuninicação.";
      toast({
        title: "Erro ao buscar dados",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPcds();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, currentPage, filterDisability, filterCity]);

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir permanentemente este cadastro de PCD?")) {
      try {
        await pcdService.remove(id);
        toast({
          title: "Cadastro excluído",
          description: "O registro de PCD foi removido com sucesso.",
        });
        fetchPcds();
      } catch (error: unknown) {
        const message =
        error instanceof Error
          ? error.message
          : "Erro não foi possivel remover";
        toast({
          title: "Erro ao excluir",
          description: message,
          variant: "destructive",
        });
      }
    }
  };

  const handleExport = (pcd: Pcd) => {
    const doc = generatePDFReport({
      title: `Ficha Cadastral - ${pcd.name}`,
      subtitle: `CPF: ${pcd.cpf}`,
      type: "geral",
    });

    const defStr = pcd.disabilities
      .map((d) => `${labelMap[d.type]} (CID: ${d.cid || "N/A"})`)
      .join(", ");

    autoTable(doc, {
      startY: ((doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 60) + 20,
      head: [["Campo", "Informação"]],
      body: [
        ["Nome Completo", pcd.name],
        ["CPF", pcd.cpf],
        ["CNS", pcd.cns || "N/A"],
        ["Data de Nascimento", pcd.birthDate ? new Date(pcd.birthDate).toLocaleDateString('pt-BR') : "N/A"],
        ["Sexo", pcd.sex || "N/A"],
        ["Telefone", pcd.phone || "N/A"],
        ["E-mail", pcd.email || "N/A"],
        ["Deficiência", defStr],
        ["Endereço", `${pcd.street || ""}, ${pcd.number || ""}, ${pcd.neighborhood || ""}`],
        ["Cidade/UF", `${pcd.city} / ${pcd.state}`],
        ["Instituição Vinculada", pcd.institution?.name || "N/A"],
        ["Observações", pcd.observations || "N/A"],
      ],
    });

    doc.save(`ficha-${pcd.name.toLowerCase().replace(/ /g, "-")}.pdf`);
  };

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
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reseta para primeira página na busca
                }}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtros
              {(filterDisability !== "todos" || filterCity !== "todas") && (
                <Badge variant="secondary">Ativo</Badge>
              )}
            </Button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 grid gap-4 border-t pt-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="form-group">
                <Label htmlFor="filter-deficiencia">Tipo de Deficiência</Label>
                <Select
                  value={filterDisability}
                  onValueChange={(v) => {
                    setFilterDisability(v);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger id="filter-deficiencia">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="FISICA">Física</SelectItem>
                    <SelectItem value="VISUAL">Visual</SelectItem>
                    <SelectItem value="AUDITIVA">Auditiva</SelectItem>
                    <SelectItem value="INTELECTUAL">Intelectual</SelectItem>
                    <SelectItem value="MULTIPLA">Múltipla</SelectItem>
                    <SelectItem value="PSICOSSOCIAL">Psicossocial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="form-group">
                <Label htmlFor="filter-regiao">Cidade</Label>
                <Select
                  value={filterCity}
                  onValueChange={(v) => {
                    setFilterCity(v);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger id="filter-regiao">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="Teresina">Teresina</SelectItem>
                    <SelectItem value="Caxias">Caxias</SelectItem>
                    <SelectItem value="Timon">Timon</SelectItem>
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
              Resultados ({totalCount} registros)
            </CardTitle>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-10 text-muted-foreground">Buscando cadastros de PCDs...</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Nome</th>
                  <th scope="col">CPF</th>
                  <th scope="col">Deficiência</th>
                  <th scope="col">Cidade</th>
                  <th scope="col">Status</th>
                  <th scope="col">Cadastro</th>
                  <th scope="col" className="w-12">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {pcds.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-muted-foreground">
                      Nenhuma pessoa cadastrada ou correspondente aos filtros.
                    </td>
                  </tr>
                ) : (
                  pcds.map((item) => {
                    const status = statusConfig["ativo"]; // No MVP as PCDs salvas estão ativas
                    const defType = item.disabilities[0]?.type;
                    const defLabel = labelMap[defType] || defType || "Não Informado";
                    const dateStr = new Date(item.createdAt).toLocaleDateString('pt-BR');

                    return (
                      <tr key={item.id}>
                        <td className="font-medium">{item.name}</td>
                        <td className="font-mono text-muted-foreground">{item.cpf}</td>
                        <td>{defLabel}</td>
                        <td>{item.city}</td>
                        <td>
                          <Badge variant="outline" className={status.className}>
                            {status.label}
                          </Badge>
                        </td>
                        <td className="text-muted-foreground">{dateStr}</td>
                        <td>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                aria-label={`Ações para ${item.name}`}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover">
                              <DropdownMenuItem onClick={() => handleExport(item)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Visualizar Ficha (PDF)
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate(`/cadastro?id=${item.id}`)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDelete(item.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                aria-label="Página anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button 
                  key={i} 
                  variant="outline" 
                  size="sm" 
                  className={currentPage === i + 1 ? "bg-primary text-primary-foreground" : ""}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button 
                variant="outline" 
                size="icon" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                aria-label="Próxima página"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
