import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, UserPlus, Map, FileBarChart, Search, Lightbulb } from 'lucide-react';

export default function Welcome() {
  const navigate = useNavigate();
  const { markWelcomeAsSeen } = useAuth();

  const handleContinue = () => {
    markWelcomeAsSeen();
    navigate('/');
  };

  const features = [
    {
      icon: UserPlus,
      title: 'Cadastrar PCDs',
      description: 'Registre informações de pessoas com deficiência de forma simples e segura',
    },
    {
      icon: Map,
      title: 'Visualizar no Mapa',
      description: 'Veja a distribuição geográfica dos cadastros em um mapa interativo',
    },
    {
      icon: FileBarChart,
      title: 'Gerar Relatórios',
      description: 'Crie relatórios e estatísticas para análise e tomada de decisões',
    },
    {
      icon: Search,
      title: 'Consultar Cadastros',
      description: 'Busque e visualize cadastros existentes de forma rápida',
    },
  ];

  return (
    <AuthLayout>
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-8 pb-8 px-8">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold text-foreground mb-3">
              Bem-vindo ao SIMAP-PCD!
            </h1>
            <p className="text-sm text-muted-foreground">
              Este sistema ajuda a cadastrar, mapear e analisar dados de pessoas com deficiência em nosso município.
            </p>
          </div>

          <div className="mb-6">
            <p className="text-sm font-medium text-foreground mb-4">
              O que você pode fazer:
            </p>
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 mb-6">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0 text-amber-600" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Dica importante</p>
                <p className="text-xs">
                  Este é seu primeiro acesso. Explore o sistema com calma. Você pode salvar cadastros e continuar depois. Se tiver dúvidas, cada tela tem textos de ajuda.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleContinue}
            className="w-full h-11 text-sm font-medium"
          >
            Ir para o Sistema
          </Button>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
