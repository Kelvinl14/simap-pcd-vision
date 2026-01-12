import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  isFirstAccess: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; isFirstAccess?: boolean }>;
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
    // Check for existing session
    const savedUser = localStorage.getItem('simap_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (identifier: string, password: string): Promise<{ success: boolean; isFirstAccess?: boolean }> => {
    // Simulated login - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (identifier && password.length >= 6) {
      const mockUser: User = {
        id: '1',
        email: identifier.includes('@') ? identifier : `${identifier}@secretaria.gov.br`,
        name: 'Usuário do Sistema',
        isFirstAccess: false,
      };
      
      setUser(mockUser);
      localStorage.setItem('simap_user', JSON.stringify(mockUser));
      return { success: true, isFirstAccess: false };
    }
    
    return { success: false };
  };

  const logout = () => {
    setUser(null);
    setShowWelcome(false);
    localStorage.removeItem('simap_user');
    localStorage.removeItem('simap_welcome_seen');
  };

  const activateAccess = async (data: { email: string; cpf: string; activationCode: string; password: string }): Promise<boolean> => {
    // Simulated first access activation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (data.email && data.cpf.length === 11 && data.activationCode && data.password.length >= 6) {
      const newUser: User = {
        id: '1',
        email: data.email,
        name: 'Novo Usuário',
        isFirstAccess: true,
      };
      
      setUser(newUser);
      setShowWelcome(true);
      localStorage.setItem('simap_user', JSON.stringify({ ...newUser, isFirstAccess: false }));
      return true;
    }
    
    return false;
  };

  const requestPasswordReset = async (identifier: string): Promise<boolean> => {
    // Simulated password reset request
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
