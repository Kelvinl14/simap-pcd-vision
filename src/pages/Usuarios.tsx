// Mock Data


const MOCK_USERS = [
  {
    id: 1,
    name: "Administrador Sistema",
    email: "admin@simap.gov.br",
    role: "admin",
    institution: "Prefeitura Municipal",
    status: "active",
    initials: "AD",
  },
  {
    id: 2,
    name: "Maria Silva",
    email: "maria.silva@apae.org.br",
    role: "operator",
    institution: "APAE Caxias",
    status: "active",
    initials: "MS",
  },
  {
    id: 3,
    name: "João Santos",
    email: "joao.santos@saude.gov.br",
    role: "viewer",
    institution: "CAPS II",
    status: "inactive",
    initials: "JS",
  },
  {
    id: 4,
    name: "Ana Oliveira",
    email: "ana.oliveira@escola.gov.br",
    role: "operator",
    institution: "Escola Municipal Inclusiva",
    status: "active",
    initials: "AO",
  },
];
import { useEffect, useState } from "react";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Shield, Building, MoreHorizontal, UserPlus, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { usersService, User, CreateUserInput } from "@/services/users.service";
import { institutionsService, Institution } from "@/services/institutions.service";

const roleLabelMap: Record<string, string> = {
  ADMINISTRADOR: "Administrador",
  GESTOR: "Gestor",
  OPERADOR: "Operador",
  CONSULTA: "Visualizador",
};

const roleSelectMap: Record<string, string> = {
  admin: "ADMINISTRADOR",
  operator: "OPERADOR",
  viewer: "CONSULTA",
};

const reverseRoleSelectMap: Record<string, string> = {
  ADMINISTRADOR: "admin",
  OPERADOR: "operator",
  CONSULTA: "viewer",
  GESTOR: "operator", // Gestor mapeado visualmente para operador no MVP frontend
};

type UserPayload = {
  name: string;
  email: string;
  role: CreateUserInput["role"];
  institutionId?: string;
  active: boolean;
  password?: string;
};

const Usuarios = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados do formulário
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "operator",
    institutionId: "",
    active: "active",
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [usersData, instsData] = await Promise.all([
        usersService.findAll(),
        institutionsService.findAll(),
      ]);
      setUsers(usersData);
      setInstitutions(instsData);
    } catch (error: unknown) {
       const message =
        error instanceof Error
          ? error.message
          : "Erro de conexão";
          toast({
        title: "Erro ao carregar dados",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = users.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.institution?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "operator",
      institutionId: "",
      active: "active",
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      password: "", // Senha vazia na edição a menos que queira redefinir
      role: reverseRoleSelectMap[user.role] || "operator",
      institutionId: user.institutionId || "",
      active: user.active ? "active" : "inactive",
    });
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();

    try {
      const backendRole =
        roleSelectMap[formData.role] as CreateUserInput["role"];

      const payload: UserPayload = {
        name: formData.name,
        email: formData.email,
        role: backendRole,
        institutionId: formData.institutionId || undefined,
        active: formData.active === "active",
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      if (editingId) {
        await usersService.update(editingId, payload);
        toast({
          title: "Usuário atualizado",
          description:
            "Os dados e permissões foram atualizados com sucesso.",
        });
      } else {
        if (!formData.password) {
          toast({
            title: "Erro de validação",
            description:
              "A senha é obrigatória para novos usuários.",
            variant: "destructive",
          });
          return;
        }

        await usersService.create(payload);
        toast({
          title: "Usuário criado",
          description: "Usuário cadastrado com sucesso no sistema.",
        });
      }

      setIsDialogOpen(false);
      fetchData();
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


  const handleToggleBlock = async (user: User) => {
    try {
      await usersService.update(user.id, { active: !user.active });
      toast({
        title: user.active ? "Acesso bloqueado" : "Acesso liberado",
        description: `O usuário ${user.name} foi ${user.active ? "bloqueado" : "desbloqueado"}.`,
      });
      fetchData();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível alterar o status.";
      toast({
        title: "Erro",
        description: message,
        variant: "destructive",
      });
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMINISTRADOR":
        return <Badge variant="default">Administrador</Badge>;
      case "GESTOR":
        return <Badge variant="secondary">Gestor</Badge>;
      case "OPERADOR":
        return <Badge variant="secondary">Operador</Badge>;
      case "CONSULTA":
        return <Badge variant="outline">Visualizador</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="page-title">Usuários</h1>
          <p className="page-description">
            Gestão de acesso e permissões do sistema.
          </p>
        </div>
        <Button onClick={handleOpenCreate}>
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Usuários do Sistema</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuário..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <CardDescription>
            Lista de usuários com acesso ao painel administrativo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-6 text-muted-foreground">Carregando usuários do sistema...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Instituição</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Nenhum usuário encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={`https://avatar.vercel.sh/${item.email}`} />
                            <AvatarFallback>{getInitials(item.name)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">{item.name}</span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {item.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          {getRoleBadge(item.role)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building className="h-4 w-4" />
                          {item.institution?.name || "Todas (Acesso Geral)"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                          item.active 
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }`}>
                          {item.active ? "Ativo" : "Bloqueado"}
                        </div>
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
                              Editar permissões
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className={item.active ? "text-destructive" : "text-green-600"}
                              onClick={() => handleToggleBlock(item)}
                            >
                              {item.active ? "Bloquear acesso" : "Desbloquear acesso"}
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Usuário" : "Gerenciar Usuário"}</DialogTitle>
            <DialogDescription>
              Configure os dados de acesso e permissões do usuário.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input 
                  id="name" 
                  placeholder="Nome do usuário" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail Corporativo</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="usuario@instituicao.com" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha {editingId ? "(Deixe em branco para manter)" : "*"}</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Digite a senha de acesso" 
                  required={!editingId}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Perfil de Acesso</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(v) => setFormData({ ...formData, role: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="operator">Operador</SelectItem>
                      <SelectItem value="viewer">Visualizador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.active}
                    onValueChange={(v) => setFormData({ ...formData, active: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Bloqueado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="institution">Instituição Vinculada</Label>
                <Select
                  value={formData.institutionId}
                  onValueChange={(v) => setFormData({ ...formData, institutionId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas (Acesso Geral)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas (Acesso Geral)</SelectItem>
                    {institutions.map((inst) => (
                      <SelectItem key={inst.id} value={inst.id}>
                        {inst.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Alterações</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Usuarios;
