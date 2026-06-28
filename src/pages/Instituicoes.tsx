import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, Search, MapPin, Phone, Users, FileText, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

// Mock Data
const MOCK_INSTITUTIONS = [
  {
    id: 1,
    name: "APAE Caxias",
    type: "ONG",
    region: "Centro",
    address: "Rua das Flores, 123",
    contact: "(99) 3333-4444",
    registrations: 150,
    reports: 12,
    status: "active",
  },
  {
    id: 2,
    name: "CAPS II",
    type: "Saúde",
    region: "Nova Caxias",
    address: "Av. Principal, 500",
    contact: "(99) 3333-5555",
    registrations: 85,
    reports: 8,
    status: "active",
  },
  {
    id: 3,
    name: "Escola Municipal Inclusiva",
    type: "Educação",
    region: "Cohab",
    address: "Rua da Escola, 45",
    contact: "(99) 3333-6666",
    registrations: 45,
    reports: 5,
    status: "active",
  },
  {
    id: 4,
    name: "Associação dos Deficientes Visuais",
    type: "ONG",
    region: "Vila Alecrim",
    address: "Travessa da Luz, 12",
    contact: "(99) 3333-7777",
    registrations: 32,
    reports: 3,
    status: "inactive",
  },
];


import { institutionsService, Institution } from "@/services/institutions.service";

const Instituicoes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados do formulário
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    cnpj: "",
    type: "ong",
    address: "",
    region: "centro",
    contact: "",
    responsible: "",
    email: "",
  });

  const fetchInstitutions = async () => {
    setIsLoading(true);
    try {
      const data = await institutionsService.findAll();
      setInstitutions(data);
    } catch (error: unknown) {
       const message =
        error instanceof Error
          ? error.message
          : "Erro ao carregar instituições.";
      toast({
        title: "Erro",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const filteredData = institutions.filter((item) => {
    const term = searchTerm.toLowerCase();
    const isNameMatch = item.name.toLowerCase().includes(term);
    const isCnpjMatch = item.cnpj.includes(term);
    const isRegionMatch = (item.neighborhood || "").toLowerCase().includes(term);
    const isCityMatch = (item.city || "").toLowerCase().includes(term);
    
    return isNameMatch || isCnpjMatch || isRegionMatch || isCityMatch;
  });

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      name: "",
      cnpj: "",
      type: "ong",
      address: "",
      region: "centro",
      contact: "",
      responsible: "",
      email: "",
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (inst: Institution) => {
    setEditingId(inst.id);
    setFormData({
      name: inst.name,
      cnpj: inst.cnpj,
      type: inst.name.toLowerCase().includes("escola") ? "educacao" : inst.name.toLowerCase().includes("caps") ? "saude" : "ong",
      address: inst.street || "",
      region: inst.neighborhood?.toLowerCase() || "centro",
      contact: inst.phone || "",
      responsible: inst.responsible || "",
      email: inst.email || "",
    });
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        cnpj: formData.cnpj,
        phone: formData.contact || undefined,
        email: formData.email || undefined,
        street: formData.address || undefined,
        neighborhood: formData.region,
        city: "Teresina", // Cidades do seed padrão
        state: "PI",
        responsible: formData.responsible || undefined,
      };

      if (editingId) {
        await institutionsService.update(editingId, payload);
        toast({
          title: "Instituição atualizada",
          description: "Os dados foram atualizados com sucesso.",
        });
      } else {
        await institutionsService.create(payload);
        toast({
          title: "Instituição cadastrada",
          description: "Instituição parceira salva com sucesso.",
        });
      }
      setIsDialogOpen(false);
      fetchInstitutions();
    } catch (error: unknown) {
       const message =
        error instanceof Error
          ? error.message
          : "Erro ao conectar com a API.";
      toast({
        title: "Erro ao salvar",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      await institutionsService.remove(id);
      toast({
        title: "Instituição desativada",
        description: "Status alterado para inativo.",
      });
      fetchInstitutions();
    } catch (error: unknown) {
       const message =
        error instanceof Error
          ? error.message
          : "Não foi possível desativar.";
      toast({
        title: "Erro",
        description: message,
        variant: "destructive",
      });
    }
  };

  // Mapeia o tipo para renderização com base no nome
  const getInstTypeLabel = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("escola") || n.includes("educa")) return "Educação";
    if (n.includes("caps") || n.includes("ubs") || n.includes("saude")) return "Saúde";
    return "ONG/Associação";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="page-title">Instituições</h1>
          <p className="page-description">
            Gerenciamento de instituições parceiras e unidades de atendimento.
          </p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Instituição
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Instituições Cadastradas</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar instituição..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <CardDescription>
            Lista de todas as instituições vinculadas ao sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-6 text-muted-foreground">Carregando instituições parceiras...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Região</TableHead>
                  <TableHead>Contatos</TableHead>
                  <TableHead className="text-center">Cadastros</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      Nenhuma instituição encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {item.name}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{item.cnpj}</TableCell>
                      <TableCell>{getInstTypeLabel(item.name)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {item.neighborhood || item.city}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {item.phone || item.email || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="gap-1">
                          <Users className="h-3 w-3" />
                          {item._count?.pcds || 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.active ? "default" : "secondary"}>
                          {item.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleOpenEdit(item)}>
                              Editar detalhes
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDeactivate(item.id)}
                            >
                              Desativar instituição
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Instituição" : "Cadastro de Instituição"}</DialogTitle>
            <DialogDescription>
              Preencha os dados da instituição parceira no sistema.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Instituição *</Label>
                  <Input 
                    id="name" 
                    placeholder="Ex: APAE Centro" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ *</Label>
                  <Input 
                    id="cnpj" 
                    placeholder="12.345.678/0001-99" 
                    required 
                    value={formData.cnpj}
                    onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="contato@instituicao.org" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Telefone de Contato</Label>
                  <Input 
                    id="contact" 
                    placeholder="(86) 3221-0000" 
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Endereço Completo</Label>
                <Input 
                  id="address" 
                  placeholder="Rua, Número" 
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="region">Região (Bairro)</Label>
                  <Select 
                    value={formData.region}
                    onValueChange={(v) => setFormData({ ...formData, region: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="centro">Centro</SelectItem>
                      <SelectItem value="zona norte">Zona Norte</SelectItem>
                      <SelectItem value="zona sul">Zona Sul</SelectItem>
                      <SelectItem value="zona leste">Zona Leste</SelectItem>
                      <SelectItem value="zona oeste">Zona Oeste</SelectItem>
                      <SelectItem value="zona rural">Zona Rural</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responsible">Responsável Técnico</Label>
                  <Input 
                    id="responsible" 
                    placeholder="Nome do responsável" 
                    value={formData.responsible}
                    onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Instituição</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Instituicoes;
