import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthLogo } from '@/components/auth/AuthLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Info, AlertCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { requestPasswordReset } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await requestPasswordReset(identifier);
      
      if (success) {
        navigate('/instrucoes-enviadas');
      } else {
        setError('Não foi possível enviar as instruções. Verifique os dados informados.');
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
              Esqueci Minha Senha
            </h1>
            <p className="text-sm text-muted-foreground">
              Não se preocupe! Vamos enviar instruções para você criar uma nova senha.
            </p>
          </div>

          <div className="mb-6 p-4 rounded-lg bg-muted/50 border">
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
              <span>
                Digite seu CPF ou e-mail institucional cadastrado. Você receberá um e-mail com as instruções para redefinir sua senha.
              </span>
            </div>
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

            <Button
              type="submit"
              className="w-full h-11 text-sm font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Enviar Instruções'}
            </Button>
          </form>

          <div className="mt-6 flex justify-center">
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
