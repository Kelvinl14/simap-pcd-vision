import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthLogo } from '@/components/auth/AuthLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Info, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function FirstAccess() {
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [activationCode, setActivationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { activateAccess } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
    setCpf(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (cpf.length !== 11) {
      setError('O CPF deve ter 11 dígitos.');
      return;
    }

    setIsLoading(true);

    try {
      const success = await activateAccess({ email, cpf, activationCode, password });
      
      if (success) {
        toast({
          title: 'Acesso ativado com sucesso!',
          description: 'Seja bem-vindo ao SIMAP-PCD.',
        });
        navigate('/bem-vindo');
      } else {
        setError('Não foi possível ativar o acesso. Verifique os dados informados.');
      }
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-8 pb-8 px-8">
          <AuthLogo />
          
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold text-foreground mb-2">
              Primeiro Acesso
            </h1>
            <p className="text-sm text-muted-foreground">
              Configure sua senha para acessar o sistema pela primeira vez
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
              <Label htmlFor="email" className="text-sm font-medium">
                E-MAIL
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu E-MAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf" className="text-sm font-medium">
                CPF
              </Label>
              {/* <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Info className="h-3 w-3" />
                <span>Digite apenas os números do seu CPF (11 dígitos)</span>
              </div> */}
              <Input
                id="cpf"
                type="text"
                placeholder="Digite seu CPF"
                value={cpf}
                onChange={handleCpfChange}
                className="h-11"
                maxLength={11}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="activationCode" className="text-sm font-medium">
                Código de Ativação
              </Label>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Info className="h-3 w-3" />
                <span>O código de ativação fornecido pela Secretaria</span>
              </div>
              <Input
                id="activationCode"
                type="text"
                placeholder="Digite o código de ativação"
                value={activationCode}
                onChange={(e) => setActivationCode(e.target.value)}
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Nova Senha
              </Label>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Info className="h-3 w-3" />
                <span>Use pelo menos 6 caracteres. Com letras e números</span>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Crie sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirmar Nova Senha
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Digite a senha novamente"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-11 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-sm font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Ativando...' : 'Ativar Acesso'}
            </Button>
          </form>

          <div className="mt-6 flex flex-col items-center gap-6">
            <div className="flex items-center justify-center gap-2 w-full h-px bg-muted">
              <p className="text-sm text-muted-foreground">
                Não tem o Código de Ativação?
              </p>
              <a href="/contact" className="text-sm text-primary hover:underline">
                Contate a Secretaria
              </a>
            </div>
            
            <Link
              to="/login"
              className="text-sm text-primary hover:underline"
            >
              Voltar para Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
