'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AccountPageClient() {
  const { user, loading, signIn, signUp, signInWithGoogle, signInWithGitHub, signOut } = useAuth();
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        setSuccess('Signed in successfully!');
        setTimeout(() => router.push('/account'), 1000);
      } else {
        const { error } = await signUp(email, password, firstName, lastName);
        if (error) throw error;
        setSuccess('Account created! Check your email to confirm.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      setIsSubmitting(false);
    }
  };

  const handleGitHubSignIn = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      const { error } = await signInWithGitHub();
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with GitHub');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl gradient-text animate-pulse">Loading...</div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in-up opacity-0 stagger-1">
          <h1 className="font-serif text-5xl md:text-6xl mb-4 gradient-text">My Account</h1>
          <p className="text-mist-lilac/60 text-lg">Welcome back to the shadows</p>
        </div>

        <div className="card-gothic p-8 md:p-12 animate-scale-in">
          <div className="space-y-8">
            {/* Profile Section */}
            <div className="border-b border-burnt-lilac/20 pb-8">
              <h2 className="text-2xl font-serif mb-6 text-burnt-lilac">Profile Information</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-burnt-lilac" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div>
                    <p className="text-sm text-mist-lilac/60">Email</p>
                    <p className="text-mist-lilac">{user.email}</p>
                  </div>
                </div>
                
                {user.user_metadata?.first_name && (
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-burnt-lilac" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-mist-lilac/60">Name</p>
                      <p className="text-mist-lilac">{user.user_metadata.first_name} {user.user_metadata.last_name}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <button
                onClick={handleSignOut}
                className="w-full btn-gothic-outline flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-lg">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in-up opacity-0 stagger-1">
        <h1 className="font-serif text-5xl md:text-6xl mb-4 gradient-text">
          {isLogin ? 'Welcome Back' : 'Join Us'}
        </h1>
        <p className="text-mist-lilac/60">
          {isLogin ? 'Sign in to your account' : 'Create your account'}
        </p>
      </div>

      <div className="card-gothic p-8 animate-scale-in">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 backdrop-blur-sm animate-fade-in">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 backdrop-blur-sm animate-fade-in">
            {success}
          </div>
        )}

        {/* OAuth Buttons */}
        <div className="space-y-3 mb-6">
              <button
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <button
                onClick={handleGitHubSignIn}
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-[#24292F] text-white rounded-lg font-semibold hover:bg-[#2f363d] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                </svg>
                Continue with GitHub
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-burnt-lilac/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#0a0a0a] text-mist-lilac/60">Or {isLogin ? 'sign in' : 'create account'} with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm mb-2 text-burnt-lilac font-medium">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 bg-black/40 border border-burnt-lilac/30 rounded-lg focus:border-burnt-lilac focus:outline-none transition-all duration-300 text-mist-lilac placeholder-mist-lilac/40"
                      placeholder="First"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-burnt-lilac font-medium">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-3 bg-black/40 border border-burnt-lilac/30 rounded-lg focus:border-burnt-lilac focus:outline-none transition-all duration-300 text-mist-lilac placeholder-mist-lilac/40"
                      placeholder="Last"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm mb-2 text-burnt-lilac font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-black/40 border border-burnt-lilac/30 rounded-lg focus:border-burnt-lilac focus:outline-none transition-all duration-300 text-mist-lilac placeholder-mist-lilac/40"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-burnt-lilac font-medium">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-black/40 border border-burnt-lilac/30 rounded-lg focus:border-burnt-lilac focus:outline-none transition-all duration-300 text-mist-lilac placeholder-mist-lilac/40"
                  placeholder="Min. 6 characters"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-gothic disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSuccess('');
                }}
                className="text-burnt-lilac hover:text-mist-lilac transition-colors font-medium"
              >
                {isLogin ? "Don't have an account? Join us" : 'Already have an account? Sign in'}
              </button>
            </div>
      </div>
    </div>
  );
}
