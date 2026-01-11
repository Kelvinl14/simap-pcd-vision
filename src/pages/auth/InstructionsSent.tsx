import React from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, AlertCircle } from 'lucide-react';

export default function InstructionsSent() {
  return (
    <AuthLayout>
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-8 pb-8 px-8 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-xl bg-green-500 flex items-center justify-center">
              <Mail className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-xl font-semibold text-green-600 mb-3">
            Instruções Enviadas!
          </h1>
          
          <p className="text-sm text-muted-foreground mb-6">
            Se os dados estiverem corretos, você receberá um e-mail com as instruções para criar uma nova senha.
          </p>

          <div className="p-4 rounded-lg bg-muted/50 border mb-6 text-left">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Não recebeu o e-mail?</p>
                <p>
                  Verifique a caixa de spam ou entre em contato com a Secretaria para obter ajuda.
                </p>
              </div>
            </div>
          </div>

          <Button asChild className="w-full h-11 text-sm font-medium">
            <Link to="/login">Voltar para Login</Link>
          </Button>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
