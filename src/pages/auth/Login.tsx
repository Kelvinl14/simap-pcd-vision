import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthLogo } from '@/components/auth/AuthLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('expired') === 'true') {
      setError('Sessão expirada. Por favor, faça login novamente.');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(identifier, password);
      
      if (result.success) {
        toast({
          title: 'Login realizado com sucesso!',
          description: 'Bem-vindo ao SIMAP-PCD.',
        });
        navigate('/');
      } else {
        setError(result.error || 'E-mail ou senha inválidos. Verifique seus dados e tente novamente.');
      }
    } catch (err: any) {
      setError('Ocorreu um erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-8 pb-8 px-8">
          <AuthLogo />
          
          <div className="text-center mb-8">
            <h1 className="text-xl font-semibold text-foreground mb-1">
              Sistema Integrado de Mapeamento
            </h1>
            <p className="text-sm text-muted-foreground">
              Mapeamento de Pessoas com Deficiência
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-sm font-medium">
                CPF ou E-mail Institucional
              </Label>
              {/* <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Info className="h-3 w-3" />
                <span>Digite seu CPF sem pontos ou traços</span>
              </div> */}
              <Input
                id="identifier"
                type="text"
                placeholder="Digite seu CPF ou e-mail"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
                required
              />
              {/* <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Info className="h-3 w-3" />
                <span>Sua senha é a mesma cadastrada pela Secretaria</span>
              </div> */}
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-sm font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar no Sistema'}
            </Button>
          </form>

          <div className="mt-6 flex flex-col items-center gap-2">
            <Link
              to="/esqueci-senha"
              className="text-sm text-primary hover:underline"
            >
              Esqueci minha senha
            </Link>
            <Link
              to="/primeiro-acesso"
              className="text-sm text-primary hover:underline"
            >
              Primeiro acesso
            </Link>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
