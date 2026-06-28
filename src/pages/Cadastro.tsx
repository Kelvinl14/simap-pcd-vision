

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { pcdService, CreatePcdInput, DisabilityType, DisabilityDegree, Sex } from "@/services/pcd.service";
import { institutionsService, Institution } from "@/services/institutions.service";

const deficiencyTypes = [
  { id: "fisica", label: "Física", backend: "FISICA" },
  { id: "visual", label: "Visual", backend: "VISUAL" },
  { id: "auditiva", label: "Auditiva", backend: "AUDITIVA" },
  { id: "intelectual", label: "Intelectual", backend: "INTELECTUAL" },
  { id: "multipla", label: "Múltipla", backend: "MULTIPLA" },
  { id: "autismo", label: "Transtorno do Espectro Autista (TEA)", backend: "PSICOSSOCIAL" },
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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pcdId = searchParams.get("id");

  const [activeTab, setActiveTab] = useState("dados-pessoais");
  const [selectedDeficiencies, setSelectedDeficiencies] = useState<string[]>([]);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Estados dos campos do formulário
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    rg: "",
    nascimento: "",
    sexo: "masculino",
    telefone: "",
    email: "",
    responsavel: "",
    
    // Endereço
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "Teresina",
    estado: "PI",
    
    // Deficiência detalhe
    cid: "",
    grau: "moderado",
    origem: "congenita",
    descricao: "",

    // Necessidades adicionais
    beneficios: "nenhum",
    observacoes: "",
    institutionId: "",
  });

  // Carregar dados iniciais (instituições e PCD se for edição)
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const insts = await institutionsService.findAll();
        setInstitutions(insts);

        if (pcdId) {
          const pcd = await pcdService.findOne(pcdId);
          
          // Fazer parse do observations
          let rgParsed = "";
          let respParsed = "";
          let origParsed = "congenita";
          let benParsed = "nenhum";
          let needsParsed: string[] = [];

          if (pcd.observations) {
            try {
              const obsData = JSON.parse(pcd.observations);
              rgParsed = obsData.rg || "";
              respParsed = obsData.responsavel || "";
              origParsed = obsData.origemDeficiencia || "congenita";
              benParsed = obsData.beneficios || "nenhum";
              needsParsed = obsData.necessidadesEspeciais || [];
              setSelectedNeeds(needsParsed);
            } catch (e) {
              // Fallback se não for JSON válido (observações antigas)
              const rgMatch = pcd.observations.match(/RG:\s*([^\s\]]+)/);
              if (rgMatch) rgParsed = rgMatch[1];
            }
          }

          // Preencher campos de deficiência
          const mainDisability = pcd.disabilities[0];
          
          // Mapear deficiências selecionadas
          const defs: string[] = [];
          pcd.disabilities.forEach((d) => {
            const match = deficiencyTypes.find((t) => t.backend === d.type);
            if (match) defs.push(match.id);
          });
          setSelectedDeficiencies(defs);

          setFormData({
            nome: pcd.name,
            cpf: pcd.cpf,
            rg: rgParsed,
            nascimento: pcd.birthDate ? pcd.birthDate.substring(0, 10) : "",
            sexo: pcd.sex?.toLowerCase() || "masculino",
            telefone: pcd.phone || "",
            email: pcd.email || "",
            responsavel: respParsed,
            cep: pcd.zipCode || "",
            logradouro: pcd.street || "",
            numero: pcd.number || "",
            complemento: pcd.observations?.includes("Complemento:") ? (pcd.observations.match(/Complemento:\s*([^\s\]]+)/)?.[1] || "") : "",
            bairro: pcd.neighborhood || "",
            cidade: pcd.city,
            estado: pcd.state,
            cid: mainDisability?.cid || "",
            grau: mainDisability?.degree?.toLowerCase() || "moderado",
            origem: origParsed,
            descricao: mainDisability?.description || "",
            beneficios: benParsed,
            observacoes: pcd.observations || "",
            institutionId: pcd.institutionId || "",
          });
        }
      } catch (error: unknown) {
        const message =
        error instanceof Error
          ? error.message
          : "Tente novamente mais tarde.";
        toast({
          title: "Erro ao carregar dados",
          description: message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [pcdId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedDeficiencies.length === 0) {
      toast({
        title: "Campo obrigatório",
        description: "Selecione ao menos um tipo de deficiência.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Concatenar campos adicionais no observations como JSON estruturado para integridade de UI
      const metaObservations = JSON.stringify({
        rg: formData.rg,
        responsavel: formData.responsavel,
        origemDeficiencia: formData.origem,
        beneficios: formData.beneficios,
        necessidadesEspeciais: selectedNeeds,
        complemento: formData.complemento,
        textoAdicional: formData.observacoes,
      });

      // Mapear disabilities da tela para o formato do backend
      const disabilitiesPayload = selectedDeficiencies.map((defId) => {
        const typeConfig = deficiencyTypes.find((t) => t.id === defId);
        
        let backendDegree = "MODERADO";
        if (formData.grau === "leve") backendDegree = "LEVE";
        if (formData.grau === "severo" || formData.grau === "profundo") backendDegree = "SEVERO";

        return {
          type: (typeConfig?.backend || "FISICA") as DisabilityType,
          degree: backendDegree as DisabilityDegree,
          cid: formData.cid || undefined,
          description: formData.descricao || undefined,
        };
      });

      let backendSex = "OUTRO";
      if (formData.sexo === "masculino") backendSex = "MASCULINO";
      if (formData.sexo === "feminino") backendSex = "FEMININO";

      const payload: CreatePcdInput = {
        name: formData.nome,
        cpf: formData.cpf.replace(/[^\d]/g, ""), // Remover máscaras
        cns: undefined,
        birthDate: formData.nascimento ? new Date(formData.nascimento).toISOString() : undefined,
        sex: backendSex as Sex,
        phone: formData.telefone || undefined,
        email: formData.email || undefined,
        zipCode: formData.cep || undefined,
        street: formData.logradouro || undefined,
        number: formData.numero || undefined,
        neighborhood: formData.bairro || undefined,
        city: formData.cidade,
        state: formData.estado,
        institutionId: formData.institutionId || undefined,
        observations: metaObservations,
        disabilities: disabilitiesPayload,
      };

      if (pcdId) {
        await pcdService.update(pcdId, payload);
        toast({
          title: "Cadastro atualizado",
          description: "Os dados da PCD foram salvos com sucesso.",
        });
      } else {
        await pcdService.create(payload);
        toast({
          title: "Cadastro realizado",
          description: "Os dados da PCD foram salvos com sucesso.",
        });
      }
      navigate("/consulta");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro ao enviar requisição.";
      toast({
        title: "Erro ao salvar",
        description: message,
        variant: "destructive",
      });
    }
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

  if (isLoading) {
    return (
      <div className="animate-fade-in flex flex-col justify-center items-center h-[500px]">
        <span className="text-muted-foreground text-lg">Carregando formulário...</span>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">{pcdId ? "Editar Cadastro de PCD" : "Cadastro de PCD"}</h1>
        <p className="page-description">
          {pcdId ? "Atualize as informações cadastrais" : "Registre uma nova pessoa com deficiência no sistema"}
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
                    <Input 
                      id="nome" 
                      placeholder="Digite o nome completo" 
                      required 
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <Label htmlFor="cpf">CPF * (Apenas números)</Label>
                    <Input 
                      id="cpf" 
                      placeholder="00000000000" 
                      required 
                      value={formData.cpf}
                      onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                      disabled={!!pcdId} // Não permite alterar o CPF em edição (chave de unicidade do banco)
                    />
                  </div>

                  <div className="form-group">
                    <Label htmlFor="rg">RG</Label>
                    <Input 
                      id="rg" 
                      placeholder="Digite o RG" 
                      value={formData.rg}
                      onChange={(e) => setFormData({ ...formData, rg: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <Label htmlFor="nascimento">Data de Nascimento *</Label>
                    <Input 
                      id="nascimento" 
                      type="date" 
                      required 
                      value={formData.nascimento}
                      onChange={(e) => setFormData({ ...formData, nascimento: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <Label htmlFor="sexo">Sexo *</Label>
                    <Select
                      value={formData.sexo}
                      onValueChange={(v) => setFormData({ ...formData, sexo: v })}
                    >
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
                    <Input 
                      id="telefone" 
                      placeholder="(86) 99999-9999" 
                      required 
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <Label htmlFor="email">E-mail</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="exemplo@email.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group sm:col-span-2">
                    <Label htmlFor="responsavel">Nome do Responsável (se menor ou incapaz)</Label>
                    <Input 
                      id="responsavel" 
                      placeholder="Nome completo do responsável" 
                      value={formData.responsavel}
                      onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                    />
                  </div>

                  <div className="form-group sm:col-span-2">
                    <Label htmlFor="institutionId">Instituição Vinculada</Label>
                    <Select
                      value={formData.institutionId}
                      onValueChange={(v) => setFormData({ ...formData, institutionId: v })}
                    >
                      <SelectTrigger id="institutionId">
                        <SelectValue placeholder="Selecione a instituição que realizou o atendimento" />
                      </SelectTrigger>
                      <SelectContent>
                        {institutions.map((inst) => (
                          <SelectItem key={inst.id} value={inst.id}>
                            {inst.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Input 
                      id="cep" 
                      placeholder="64000-000" 
                      required 
                      value={formData.cep}
                      onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <Label htmlFor="bairro">Bairro *</Label>
                    <Input 
                      id="bairro" 
                      placeholder="Digite o bairro" 
                      required 
                      value={formData.bairro}
                      onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                    />
                  </div>

                  <div className="form-group sm:col-span-2">
                    <Label htmlFor="logradouro">Logradouro *</Label>
                    <Input 
                      id="logradouro" 
                      placeholder="Rua, Avenida, etc." 
                      required 
                      value={formData.logradouro}
                      onChange={(e) => setFormData({ ...formData, logradouro: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <Label htmlFor="numero">Número *</Label>
                    <Input 
                      id="numero" 
                      placeholder="Nº" 
                      required 
                      value={formData.numero}
                      onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <Label htmlFor="complemento">Complemento</Label>
                    <Input 
                      id="complemento" 
                      placeholder="Apto, Bloco, etc." 
                      value={formData.complemento}
                      onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <Label htmlFor="cidade">Cidade *</Label>
                    <Input 
                      id="cidade" 
                      placeholder="Digite a cidade" 
                      required 
                      value={formData.cidade}
                      onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <Label htmlFor="estado">Estado *</Label>
                    <Input 
                      id="estado" 
                      placeholder="UF" 
                      required 
                      maxLength={2}
                      value={formData.estado}
                      onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    />
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
                    <Input 
                      id="cid" 
                      placeholder="Ex: G80.0" 
                      value={formData.cid}
                      onChange={(e) => setFormData({ ...formData, cid: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <Label htmlFor="grau">Grau da Deficiência</Label>
                    <Select
                      value={formData.grau}
                      onValueChange={(v) => setFormData({ ...formData, grau: v })}
                    >
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
                    <Select
                      value={formData.origem}
                      onValueChange={(v) => setFormData({ ...formData, origem: v })}
                    >
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
                      value={formData.descricao}
                      onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
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
                    <Select
                      value={formData.beneficios}
                      onValueChange={(v) => setFormData({ ...formData, beneficios: v })}
                    >
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
                      value={formData.observacoes}
                      onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
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
              <Button type="button" variant="outline" onClick={() => navigate("/consulta")}>
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
