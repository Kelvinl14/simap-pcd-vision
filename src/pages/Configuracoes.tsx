import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Bell, Shield, Database, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Configuracoes() {
  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "As alterações foram aplicadas com sucesso.",
    });
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Configurações</h1>
        <p className="page-description">
          Gerencie as configurações do sistema SIMAP-PCD
        </p>
      </div>

      <Tabs defaultValue="instituicao" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-none">
          <TabsTrigger value="instituicao" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Instituição</span>
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="seguranca" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Segurança</span>
          </TabsTrigger>
          <TabsTrigger value="sistema" className="gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Sistema</span>
          </TabsTrigger>
        </TabsList>

        {/* Instituição */}
        <TabsContent value="instituicao">
          <Card>
            <CardHeader>
              <CardTitle>Dados da Instituição</CardTitle>
              <CardDescription>
                Informações da secretaria e órgão responsável
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="form-group sm:col-span-2">
                  <Label htmlFor="nome-orgao">Nome do Órgão</Label>
                  <Input
                    id="nome-orgao"
                    defaultValue="Secretaria Municipal de Assistência Social"
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input id="cnpj" defaultValue="00.000.000/0001-00" />
                </div>

                <div className="form-group">
                  <Label htmlFor="telefone-inst">Telefone</Label>
                  <Input id="telefone-inst" defaultValue="(00) 0000-0000" />
                </div>

                <div className="form-group sm:col-span-2">
                  <Label htmlFor="endereco-inst">Endereço</Label>
                  <Input
                    id="endereco-inst"
                    defaultValue="Av. Principal, 1000 - Centro"
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="email-inst">E-mail Institucional</Label>
                  <Input
                    id="email-inst"
                    type="email"
                    defaultValue="contato@secretaria.gov.br"
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="responsavel-inst">Responsável</Label>
                  <Input id="responsavel-inst" defaultValue="Maria Silva" />
                </div>
              </div>

              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notificações */}
        <TabsContent value="notificacoes">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>
                Configure como você deseja receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notificações por E-mail</p>
                    <p className="text-sm text-muted-foreground">
                      Receba atualizações por e-mail
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Novos Cadastros</p>
                    <p className="text-sm text-muted-foreground">
                      Notificar quando um novo cadastro for realizado
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Cadastros Pendentes</p>
                    <p className="text-sm text-muted-foreground">
                      Lembrete diário de cadastros aguardando análise
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Relatórios Automáticos</p>
                    <p className="text-sm text-muted-foreground">
                      Receber relatório semanal por e-mail
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>

              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Salvar Preferências
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Segurança */}
        <TabsContent value="seguranca">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>
                Gerencie a segurança e acesso ao sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="form-group">
                  <Label htmlFor="sessao-timeout">Tempo de Sessão (minutos)</Label>
                  <Select defaultValue="30">
                    <SelectTrigger id="sessao-timeout" className="w-full sm:w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                      <SelectItem value="120">2 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Autenticação em Dois Fatores</p>
                    <p className="text-sm text-muted-foreground">
                      Adiciona uma camada extra de segurança
                    </p>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Registrar Atividades</p>
                    <p className="text-sm text-muted-foreground">
                      Manter log de todas as ações no sistema
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mascarar CPF nas Listagens</p>
                    <p className="text-sm text-muted-foreground">
                      Exibir CPF parcialmente oculto (***.***.***-XX)
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sistema */}
        <TabsContent value="sistema">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
              <CardDescription>
                Parâmetros gerais e manutenção
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="form-group">
                  <Label htmlFor="itens-pagina">Itens por Página</Label>
                  <Select defaultValue="20">
                    <SelectTrigger id="itens-pagina">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 itens</SelectItem>
                      <SelectItem value="20">20 itens</SelectItem>
                      <SelectItem value="50">50 itens</SelectItem>
                      <SelectItem value="100">100 itens</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="form-group">
                  <Label htmlFor="formato-data">Formato de Data</Label>
                  <Select defaultValue="dd/mm/yyyy">
                    <SelectTrigger id="formato-data">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/mm/yyyy">DD/MM/AAAA</SelectItem>
                      <SelectItem value="mm/dd/yyyy">MM/DD/AAAA</SelectItem>
                      <SelectItem value="yyyy-mm-dd">AAAA-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="form-group">
                  <Label htmlFor="backup">Backup Automático</Label>
                  <Select defaultValue="diario">
                    <SelectTrigger id="backup">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diario">Diário</SelectItem>
                      <SelectItem value="semanal">Semanal</SelectItem>
                      <SelectItem value="mensal">Mensal</SelectItem>
                      <SelectItem value="desativado">Desativado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="form-group">
                  <Label htmlFor="retencao">Retenção de Logs</Label>
                  <Select defaultValue="90">
                    <SelectTrigger id="retencao">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 dias</SelectItem>
                      <SelectItem value="60">60 dias</SelectItem>
                      <SelectItem value="90">90 dias</SelectItem>
                      <SelectItem value="365">1 ano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <h4 className="font-medium">Informações do Sistema</h4>
                <div className="mt-2 grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Versão:</span>
                    <span>1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Última Atualização:</span>
                    <span>04/12/2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total de Registros:</span>
                    <span>3.456</span>
                  </div>
                </div>
              </div>

              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
