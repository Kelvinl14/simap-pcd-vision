import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Save, X, ChevronRight, ChevronLeft, User, MapPin, Accessibility, FileText } from "lucide-react";

const deficiencyTypes = [
  { id: "fisica", label: "Física" },
  { id: "visual", label: "Visual" },
  { id: "auditiva", label: "Auditiva" },
  { id: "intelectual", label: "Intelectual" },
  { id: "multipla", label: "Múltipla" },
  { id: "autismo", label: "Transtorno do Espectro Autista (TEA)" },
];

const needsOptions = [
  { id: "transporte", label: "Transporte adaptado" },
  { id: "acompanhante", label: "Acompanhante" },
  { id: "medicamentos", label: "Medicamentos contínuos" },
  { id: "equipamentos", label: "Equipamentos especiais" },
  { id: "fisioterapia", label: "Fisioterapia" },
  { id: "fonoaudiologia", label: "Fonoaudiologia" },
  { id: "psicologia", label: "Acompanhamento psicológico" },
];

export default function Cadastro() {
  const [activeTab, setActiveTab] = useState("dados-pessoais");
  const [selectedDeficiencies, setSelectedDeficiencies] = useState<string[]>([]);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Cadastro realizado",
      description: "Os dados foram salvos com sucesso.",
    });
  };

  const tabs = ["dados-pessoais", "endereco", "deficiencia", "necessidades"];
  const currentIndex = tabs.indexOf(activeTab);

  const nextTab = () => {
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const prevTab = () => {
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Cadastro de PCD</h1>
        <p className="page-description">
          Registre uma nova pessoa com deficiência no sistema
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <CardHeader className="border-b">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="dados-pessoais" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Dados Pessoais</span>
                </TabsTrigger>
                <TabsTrigger value="endereco" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="hidden sm:inline">Endereço</span>
                </TabsTrigger>
                <TabsTrigger value="deficiencia" className="flex items-center gap-2">
                  <Accessibility className="h-4 w-4" />
                  <span className="hidden sm:inline">Deficiência</span>
                </TabsTrigger>
                <TabsTrigger value="necessidades" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Necessidades</span>
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent className="pt-6">
              {/* Dados Pessoais */}
              <TabsContent value="dados-pessoais" className="space-y-6 mt-0">
                <CardDescription>
                  Informações básicas de identificação
                </CardDescription>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="form-group sm:col-span-2">
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input id="nome" placeholder="Digite o nome completo" required />
                  </div>

                  <div className="form-group">
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input id="cpf" placeholder="000.000.000-00" required />
                  </div>

                  <div className="form-group">
                    <Label htmlFor="rg">RG</Label>
                    <Input id="rg" placeholder="Digite o RG" />
                  </div>

                  <div className="form-group">
                    <Label htmlFor="nascimento">Data de Nascimento *</Label>
                    <Input id="nascimento" type="date" required />
                  </div>

                  <div className="form-group">
                    <Label htmlFor="sexo">Sexo *</Label>
                    <Select>
                      <SelectTrigger id="sexo">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="feminino">Feminino</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                        <SelectItem value="nao-informar">Prefiro não informar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="form-group">
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input id="telefone" placeholder="(00) 00000-0000" required />
                  </div>

                  <div className="form-group">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" placeholder="exemplo@email.com" />
                  </div>

                  <div className="form-group sm:col-span-2">
                    <Label htmlFor="responsavel">Nome do Responsável (se menor ou incapaz)</Label>
                    <Input id="responsavel" placeholder="Nome completo do responsável" />
                  </div>
                </div>
              </TabsContent>

              {/* Endereço */}
              <TabsContent value="endereco" className="space-y-6 mt-0">
                <CardDescription>
                  Endereço residencial completo
                </CardDescription>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="form-group">
                    <Label htmlFor="cep">CEP *</Label>
                    <Input id="cep" placeholder="00000-000" required />
                  </div>

                  <div className="form-group">
                    <Label htmlFor="regiao">Região *</Label>
                    <Select>
                      <SelectTrigger id="regiao">
                        <SelectValue placeholder="Selecione a região" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="centro">Centro</SelectItem>
                        <SelectItem value="norte">Norte</SelectItem>
                        <SelectItem value="sul">Sul</SelectItem>
                        <SelectItem value="leste">Leste</SelectItem>
                        <SelectItem value="oeste">Oeste</SelectItem>
                        <SelectItem value="rural">Zona Rural</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="form-group sm:col-span-2">
                    <Label htmlFor="logradouro">Logradouro *</Label>
                    <Input id="logradouro" placeholder="Rua, Avenida, etc." required />
                  </div>

                  <div className="form-group">
                    <Label htmlFor="numero">Número *</Label>
                    <Input id="numero" placeholder="Nº" required />
                  </div>

                  <div className="form-group">
                    <Label htmlFor="complemento">Complemento</Label>
                    <Input id="complemento" placeholder="Apto, Bloco, etc." />
                  </div>

                  <div className="form-group">
                    <Label htmlFor="bairro">Bairro *</Label>
                    <Input id="bairro" placeholder="Digite o bairro" required />
                  </div>

                  <div className="form-group">
                    <Label htmlFor="cidade">Cidade *</Label>
                    <Input id="cidade" placeholder="Digite a cidade" required />
                  </div>
                </div>
              </TabsContent>

              {/* Deficiência */}
              <TabsContent value="deficiencia" className="space-y-6 mt-0">
                <CardDescription>
                  Informações sobre a deficiência
                </CardDescription>

                <div className="space-y-4">
                  <div className="form-group">
                    <Label>Tipo(s) de Deficiência *</Label>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {deficiencyTypes.map((type) => (
                        <div
                          key={type.id}
                          className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-muted/50"
                        >
                          <Checkbox
                            id={type.id}
                            checked={selectedDeficiencies.includes(type.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedDeficiencies([...selectedDeficiencies, type.id]);
                              } else {
                                setSelectedDeficiencies(
                                  selectedDeficiencies.filter((d) => d !== type.id)
                                );
                              }
                            }}
                          />
                          <Label htmlFor={type.id} className="cursor-pointer font-normal">
                            {type.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <Label htmlFor="cid">CID-10 (Código)</Label>
                    <Input id="cid" placeholder="Ex: G80.0" />
                  </div>

                  <div className="form-group">
                    <Label htmlFor="grau">Grau da Deficiência</Label>
                    <Select>
                      <SelectTrigger id="grau">
                        <SelectValue placeholder="Selecione o grau" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="leve">Leve</SelectItem>
                        <SelectItem value="moderado">Moderado</SelectItem>
                        <SelectItem value="severo">Severo</SelectItem>
                        <SelectItem value="profundo">Profundo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="form-group">
                    <Label htmlFor="origem">Origem da Deficiência</Label>
                    <Select>
                      <SelectTrigger id="origem">
                        <SelectValue placeholder="Selecione a origem" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="congenita">Congênita</SelectItem>
                        <SelectItem value="adquirida">Adquirida</SelectItem>
                        <SelectItem value="desconhecida">Desconhecida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="form-group">
                    <Label htmlFor="descricao">Descrição Detalhada</Label>
                    <Textarea
                      id="descricao"
                      placeholder="Descreva detalhes relevantes sobre a condição..."
                      rows={4}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Necessidades */}
              <TabsContent value="necessidades" className="space-y-6 mt-0">
                <CardDescription>
                  Necessidades especiais e observações
                </CardDescription>

                <div className="space-y-4">
                  <div className="form-group">
                    <Label>Necessidades Especiais</Label>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {needsOptions.map((need) => (
                        <div
                          key={need.id}
                          className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-muted/50"
                        >
                          <Checkbox
                            id={need.id}
                            checked={selectedNeeds.includes(need.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedNeeds([...selectedNeeds, need.id]);
                              } else {
                                setSelectedNeeds(selectedNeeds.filter((n) => n !== need.id));
                              }
                            }}
                          />
                          <Label htmlFor={need.id} className="cursor-pointer font-normal">
                            {need.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <Label htmlFor="beneficios">Benefícios Recebidos</Label>
                    <Select>
                      <SelectTrigger id="beneficios">
                        <SelectValue placeholder="Selecione o benefício" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bpc">BPC - Benefício de Prestação Continuada</SelectItem>
                        <SelectItem value="aposentadoria">Aposentadoria por Invalidez</SelectItem>
                        <SelectItem value="auxilio">Auxílio-Doença</SelectItem>
                        <SelectItem value="nenhum">Nenhum</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="form-group">
                    <Label htmlFor="observacoes">Observações Adicionais</Label>
                    <Textarea
                      id="observacoes"
                      placeholder="Informações complementares importantes..."
                      rows={4}
                    />
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>

          {/* Actions */}
          <div className="flex items-center justify-between border-t p-4">
            <Button
              type="button"
              variant="outline"
              onClick={prevTab}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>

            <div className="flex gap-2">
              <Button type="button" variant="outline">
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              {currentIndex === tabs.length - 1 ? (
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Cadastro
                </Button>
              ) : (
                <Button type="button" onClick={nextTab}>
                  Próximo
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}
