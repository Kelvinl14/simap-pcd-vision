import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/auth.service';

interface User {
  id: string;
  email: string;
  name: string;
  isFirstAccess: boolean;
  role?: string;
  institutionId?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; isFirstAccess?: boolean; error?: string }>;
  logout: () => void;
  activateAccess: (data: { email: string; cpf: string; activationCode: string; password: string }) => Promise<boolean>;
  requestPasswordReset: (identifier: string) => Promise<boolean>;
  markWelcomeAsSeen: () => void;
  showWelcome: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Verificar sessão existente na inicialização
    const checkSession = async () => {
      const savedUser = localStorage.getItem('simap_user');
      const savedToken = localStorage.getItem('simap_token');
      
      if (savedUser && savedToken) {
        try {
          // Valida a sessão buscando o perfil mais recente
          const profile = await authService.getProfile();
          const updatedUser = {
            ...profile,
            isFirstAccess: false,
          };
          setUser(updatedUser);
          localStorage.setItem('simap_user', JSON.stringify(updatedUser));
        } catch (error) {
          // Token inválido ou expirado
          setUser(null);
          localStorage.removeItem('simap_token');
          localStorage.removeItem('simap_user');
        }
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const login = async (identifier: string, password: string): Promise<{ success: boolean; isFirstAccess?: boolean; error?: string }> => {
    try {
      const data = await authService.login(identifier, password);
      
      localStorage.setItem('simap_token', data.token);
      
      const loggedUser: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        institutionId: data.user.institutionId,
        isFirstAccess: false,
      };
      
      setUser(loggedUser);
      localStorage.setItem('simap_user', JSON.stringify(loggedUser));
      return { success: true, isFirstAccess: false };
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Credenciais inválidas.";
      console.error('Erro no login:', error);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    setUser(null);
    setShowWelcome(false);
    localStorage.removeItem('simap_token');
    localStorage.removeItem('simap_user');
    localStorage.removeItem('simap_welcome_seen');
  };

  const activateAccess = async (data: { email: string; cpf: string; activationCode: string; password: string }): Promise<boolean> => {
    // Simulado para o fluxo visual do MVP, pois o backend não possui esta funcionalidade corporativa
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (data.email && data.cpf.length === 11 && data.activationCode && data.password.length >= 6) {
      const newUser: User = {
        id: 'first-access-mock-id',
        email: data.email,
        name: 'Novo Usuário Ativado',
        isFirstAccess: true,
        role: 'OPERADOR',
      };
      setUser(newUser);
      setShowWelcome(true);
      localStorage.setItem('simap_user', JSON.stringify({ ...newUser, isFirstAccess: false }));
      return true;
    }
    return false;
  };

  const requestPasswordReset = async (identifier: string): Promise<boolean> => {
    // Simulado para fluxo visual do MVP
    await new Promise(resolve => setTimeout(resolve, 1000));
    return identifier.length > 0;
  };

  const markWelcomeAsSeen = () => {
    setShowWelcome(false);
    localStorage.setItem('simap_welcome_seen', 'true');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        activateAccess,
        requestPasswordReset,
        markWelcomeAsSeen,
        showWelcome,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
