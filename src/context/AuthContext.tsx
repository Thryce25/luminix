'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName?: string, lastName?: string, phoneNumber?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithMagicLink: (email: string) => Promise<{ error: any }>;
  signInWithGoogle: (mode?: 'signin' | 'signup') => Promise<{ error: any }>;
  signInWithGitHub: (mode?: 'signin' | 'signup') => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (data: { firstName?: string; lastName?: string }) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Handle OAuth sign in - create profile if needed
      if (event === 'SIGNED_IN' && session?.user) {
        const provider = session.user.app_metadata.provider;
        
        // If it's an OAuth provider (google, github), create/verify profile
        if (provider === 'google' || provider === 'github') {
          // Try to extract phone number from OAuth metadata
          const phoneNumber = session.user.user_metadata?.phone_number || 
                             session.user.user_metadata?.phone || 
                             null;
          
          const response = await fetch('/api/auth/oauth-callback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: session.user.id,
              email: session.user.email,
              firstName: session.user.user_metadata?.full_name?.split(' ')[0] || session.user.user_metadata?.name?.split(' ')[0] || '',
              lastName: session.user.user_metadata?.full_name?.split(' ')[1] || session.user.user_metadata?.name?.split(' ')[1] || '',
              phoneNumber: phoneNumber,
            }),
          });

          const data = await response.json();
          
          // Store flag if user needs to provide phone number
          if (data.needsPhone && typeof window !== 'undefined') {
            localStorage.setItem('needsPhoneNumber', 'true');
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string, phoneNumber?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName || '',
          last_name: lastName || '',
          phone_number: phoneNumber || '',
          display_name: firstName || email.split('@')[0],
        },
      },
    });

    if (!error && data.user) {
      // Create user profile in database
      await fetch('/api/auth/create-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: data.user.id,
          email: data.user.email,
          firstName: firstName || '',
          lastName: lastName || '',
          phoneNumber: phoneNumber || '',
        }),
      });
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signInWithMagicLink = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/account`,
      },
    });
    return { error };
  };

  const signInWithGoogle = async (mode: 'signin' | 'signup' = 'signin') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/account?oauth_mode=${mode}`,
        scopes: 'profile email https://www.googleapis.com/auth/user.phonenumbers.read',
      },
    });
    return { error };
  };

  const signInWithGitHub = async (mode: 'signin' | 'signup' = 'signin') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/account?oauth_mode=${mode}`,
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (data: { firstName?: string; lastName?: string }) => {
    const { error } = await supabase.auth.updateUser({
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
        display_name: data.firstName || user?.email?.split('@')[0],
      },
    });
    return { error };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signInWithMagicLink,
        signInWithGoogle,
        signInWithGitHub,
        signOut,
        updateProfile,
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
