import { useState } from "react";
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

const Instituicoes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredData = MOCK_INSTITUTIONS.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDialogOpen(false);
    toast({
      title: "Instituição salva",
      description: "Os dados foram atualizados com sucesso.",
    });
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
        <Button onClick={() => setIsDialogOpen(true)}>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Região</TableHead>
                <TableHead>Contatos</TableHead>
                <TableHead className="text-center">Cadastros</TableHead>
                <TableHead className="text-center">Relatórios</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      {item.name}
                    </div>
                  </TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {item.region}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {item.contact}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="gap-1">
                      <Users className="h-3 w-3" />
                      {item.registrations}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="gap-1">
                      <FileText className="h-3 w-3" />
                      {item.reports}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.status === "active" ? "default" : "secondary"}>
                      {item.status === "active" ? "Ativo" : "Inativo"}
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
                        <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                          Editar detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem>Ver cadastros vinculados</DropdownMenuItem>
                        <DropdownMenuItem>Relatórios enviados</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Desativar instituição
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Cadastro de Instituição</DialogTitle>
            <DialogDescription>
              Preencha os dados da nova instituição parceira.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Instituição</Label>
                  <Input id="name" placeholder="Ex: APAE Centro" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saude">Saúde (CAPS/UBS)</SelectItem>
                      <SelectItem value="educacao">Educação (Escola)</SelectItem>
                      <SelectItem value="ong">ONG/Associação</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Endereço Completo</Label>
                <Input id="address" placeholder="Rua, Número, Bairro" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="region">Região</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="centro">Centro</SelectItem>
                      <SelectItem value="norte">Zona Norte</SelectItem>
                      <SelectItem value="sul">Zona Sul</SelectItem>
                      <SelectItem value="leste">Zona Leste</SelectItem>
                      <SelectItem value="oeste">Zona Oeste</SelectItem>
                      <SelectItem value="rural">Zona Rural</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Telefone de Contato</Label>
                  <Input id="contact" placeholder="(99) 0000-0000" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsible">Responsável Técnico</Label>
                <Input id="responsible" placeholder="Nome do responsável" />
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
