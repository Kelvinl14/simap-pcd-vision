import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  email: string;
  cpf: string;
  role: 'DEV' | 'ADM' | 'CAD' | 'CON' | 'CNT';
  scope: 'SUPER' | 'FULL' | 'BASIC' | 'READ' | 'FIN';
  first_access: boolean;
  created_at: string;
}

interface AuthContextType {
  user: SupabaseUser | null;
  profile: Profile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; isFirstAccess?: boolean; error?: string }>;
  logout: () => Promise<void>;
  activateAccess: (data: { email: string; cpf: string; activationCode: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  requestPasswordReset: (identifier: string) => Promise<{ success: boolean; error?: string }>;
  markWelcomeAsSeen: () => Promise<void>;
  showWelcome: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  // Fetch user profile from database
  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    return data as Profile | null;
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Use setTimeout to avoid potential deadlock with Supabase client
          setTimeout(async () => {
            const userProfile = await fetchProfile(currentSession.user.id);
            setProfile(userProfile);
            
            // Check if first access welcome should be shown
            if (userProfile?.first_access) {
              setShowWelcome(true);
            }
          }, 0);
        } else {
          setProfile(null);
          setShowWelcome(false);
        }
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id).then((userProfile) => {
          setProfile(userProfile);
          if (userProfile?.first_access) {
            setShowWelcome(true);
          }
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (identifier: string, password: string): Promise<{ success: boolean; isFirstAccess?: boolean; error?: string }> => {
    try {
      // Determine if identifier is email or CPF
      let email = identifier;
      
      // If it's a CPF (only numbers), we need to find the email
      if (/^\d{11}$/.test(identifier)) {
        // Query to find email by CPF - this is a public lookup for login
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('cpf', identifier)
          .maybeSingle();
        
        if (profileError || !profileData) {
          return { success: false, error: 'CPF não encontrado no sistema.' };
        }
        
        email = profileData.email;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: 'CPF/E-mail ou senha inválidos.' };
      }

      if (data.user) {
        const userProfile = await fetchProfile(data.user.id);
        setProfile(userProfile);
        
        return { 
          success: true, 
          isFirstAccess: userProfile?.first_access ?? false 
        };
      }

      return { success: false, error: 'Erro ao fazer login.' };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: 'Ocorreu um erro ao fazer login.' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
    setShowWelcome(false);
  };

  const activateAccess = async (data: { email: string; cpf: string; activationCode: string; password: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      // 1. Validate the activation code
      const { data: codeData, error: codeError } = await supabase
        .from('activation_codes')
        .select('*')
        .eq('code_hash', data.activationCode)
        .eq('revoked', false)
        .maybeSingle();

      if (codeError || !codeData) {
        return { success: false, error: 'Código de ativação inválido.' };
      }

      // Check if code is still valid
      if (codeData.used_count >= codeData.max_uses) {
        return { success: false, error: 'Código de ativação já foi utilizado o máximo de vezes.' };
      }

      if (codeData.expires_at && new Date(codeData.expires_at) < new Date()) {
        return { success: false, error: 'Código de ativação expirado.' };
      }

      // 2. Create the user account
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          return { success: false, error: 'Este e-mail já está cadastrado no sistema.' };
        }
        return { success: false, error: signUpError.message };
      }

      if (!authData.user) {
        return { success: false, error: 'Erro ao criar usuário.' };
      }

      // 3. Create the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: data.email,
          cpf: data.cpf,
          role: codeData.role,
          scope: codeData.scope,
          first_access: true,
        });

      if (profileError) {
        // If profile creation fails, we should handle this
        console.error('Profile creation error:', profileError);
        if (profileError.message.includes('duplicate key') && profileError.message.includes('cpf')) {
          return { success: false, error: 'Este CPF já está cadastrado no sistema.' };
        }
        return { success: false, error: 'Erro ao criar perfil do usuário.' };
      }

      // 4. Increment the used_count of the activation code
      await supabase
        .from('activation_codes')
        .update({ used_count: codeData.used_count + 1 })
        .eq('id', codeData.id);

      // 5. Fetch the profile and set welcome state
      const userProfile = await fetchProfile(authData.user.id);
      setProfile(userProfile);
      setShowWelcome(true);

      return { success: true };
    } catch (err) {
      console.error('Activation error:', err);
      return { success: false, error: 'Ocorreu um erro ao ativar o acesso.' };
    }
  };

  const requestPasswordReset = async (identifier: string): Promise<{ success: boolean; error?: string }> => {
    try {
      let email = identifier;
      
      // If it's a CPF, find the email
      if (/^\d{11}$/.test(identifier)) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('cpf', identifier)
          .maybeSingle();
        
        if (profileError || !profileData) {
          return { success: false, error: 'CPF não encontrado no sistema.' };
        }
        
        email = profileData.email;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/redefinir-senha`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      console.error('Password reset error:', err);
      return { success: false, error: 'Ocorreu um erro ao enviar instruções.' };
    }
  };

  const markWelcomeAsSeen = async () => {
    setShowWelcome(false);
    
    if (user) {
      // Update first_access flag in database
      await supabase
        .from('profiles')
        .update({ first_access: false })
        .eq('id', user.id);
      
      // Update local profile state
      if (profile) {
        setProfile({ ...profile, first_access: false });
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
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
