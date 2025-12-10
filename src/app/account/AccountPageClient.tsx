'use client';

import { useState } from 'react';
import { useCustomer } from '@/context/CustomerContext';
import { useWishlist } from '@/context/WishlistContext';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/shopify';

export default function AccountPageClient() {
  const { customer, loading, isAuthenticated, login, register, logout, getAccountUrl } = useCustomer();
  const { items: wishlistItems, removeItem: removeFromWishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerFirstName, setRegisterFirstName] = useState('');
  const [registerLastName, setRegisterLastName] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFormLoading(true);

    const result = await login(loginEmail, loginPassword);
    
    if (!result.success) {
      setError(result.error || 'Failed to login');
    }
    
    setFormLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setFormLoading(true);

    if (registerPassword.length < 5) {
      setError('Password must be at least 5 characters');
      setFormLoading(false);
      return;
    }

    const result = await register(registerEmail, registerPassword, registerFirstName, registerLastName);
    
    if (!result.success) {
      setError(result.error || 'Failed to create account');
    } else {
      setSuccess('Account created successfully! You are now signed in.');
      // Clear the form
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterFirstName('');
      setRegisterLastName('');
    }
    
    setFormLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-12 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-burnt-lilac border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Logged in view - Dashboard
  if (isAuthenticated && customer) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif text-mist-lilac">
                Welcome back, {customer.firstName || customer.displayName || 'there'}!
              </h1>
              <p className="text-mist-lilac/60 mt-1">{customer.email}</p>
            </div>
            <div className="flex gap-3">
              <a
                href={getAccountUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gothic-outline px-4 py-2 text-sm"
              >
                Manage on Shopify
              </a>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm text-mist-lilac/70 hover:text-mist-lilac transition-colors border border-deep-purple/30 rounded-lg hover:border-burnt-lilac/50"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            <a
              href={getAccountUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 border border-deep-purple/30 rounded-lg hover:border-burnt-lilac/50 transition-colors group bg-deep-purple/10"
            >
              <svg className="w-8 h-8 text-burnt-lilac mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-lg font-medium text-mist-lilac group-hover:text-burnt-lilac transition-colors">Order History</h3>
              <p className="text-mist-lilac/50 text-sm mt-1">View and track your orders</p>
            </a>

            <a
              href={getAccountUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 border border-deep-purple/30 rounded-lg hover:border-burnt-lilac/50 transition-colors group bg-deep-purple/10"
            >
              <svg className="w-8 h-8 text-burnt-lilac mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="text-lg font-medium text-mist-lilac group-hover:text-burnt-lilac transition-colors">Addresses</h3>
              <p className="text-mist-lilac/50 text-sm mt-1">Manage shipping addresses</p>
            </a>

            <Link
              href="/wishlist"
              className="p-6 border border-deep-purple/30 rounded-lg hover:border-burnt-lilac/50 transition-colors group bg-deep-purple/10"
            >
              <svg className="w-8 h-8 text-burnt-lilac mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h3 className="text-lg font-medium text-mist-lilac group-hover:text-burnt-lilac transition-colors">Wishlist</h3>
              <p className="text-mist-lilac/50 text-sm mt-1">{wishlistItems.length} saved items</p>
            </Link>
          </div>

          {/* Wishlist Preview */}
          {wishlistItems.length > 0 && (
            <div className="border-t border-deep-purple/30 pt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif text-mist-lilac">Your Wishlist</h2>
                <Link href="/wishlist" className="text-burnt-lilac hover:text-mist-lilac text-sm transition-colors">
                  View All ({wishlistItems.length}) →
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {wishlistItems.slice(0, 4).map((item) => (
                  <div key={item.id} className="group relative">
                    <Link href={`/products/${item.handle}`}>
                      <div className="aspect-square relative overflow-hidden rounded-lg bg-deep-purple/20">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-mist-lilac/30">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-mist-lilac truncate">{item.title}</p>
                        <p className="text-sm text-burnt-lilac">{formatPrice(item.price)}</p>
                      </div>
                    </Link>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove from wishlist"
                    >
                      <svg className="w-4 h-4 text-mist-lilac" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Not logged in - Show login/register forms
  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif text-mist-lilac mb-2">
            My Account
          </h1>
          <p className="text-mist-lilac/60">
            Sign in to access your orders and wishlist
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-deep-purple/30 mb-6">
          <button
            onClick={() => { setActiveTab('login'); setError(null); setSuccess(null); }}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'login'
                ? 'text-burnt-lilac border-burnt-lilac'
                : 'text-mist-lilac/60 border-transparent hover:text-mist-lilac'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setActiveTab('register'); setError(null); setSuccess(null); }}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'register'
                ? 'text-burnt-lilac border-burnt-lilac'
                : 'text-mist-lilac/60 border-transparent hover:text-mist-lilac'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
            {success}
          </div>
        )}

        {/* Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-sm text-mist-lilac/70 mb-1">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-deep-purple/20 border border-deep-purple/30 rounded-lg text-mist-lilac placeholder-mist-lilac/40 focus:outline-none focus:border-burnt-lilac/50 transition-colors"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="block text-sm text-mist-lilac/70 mb-1">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-deep-purple/20 border border-deep-purple/30 rounded-lg text-mist-lilac placeholder-mist-lilac/40 focus:outline-none focus:border-burnt-lilac/50 transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={formLoading}
              className="w-full btn-gothic py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        )}

        {/* Register Form */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="register-firstname" className="block text-sm text-mist-lilac/70 mb-1">
                  First Name
                </label>
                <input
                  id="register-firstname"
                  type="text"
                  value={registerFirstName}
                  onChange={(e) => setRegisterFirstName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-deep-purple/20 border border-deep-purple/30 rounded-lg text-mist-lilac placeholder-mist-lilac/40 focus:outline-none focus:border-burnt-lilac/50 transition-colors"
                  placeholder="First"
                />
              </div>
              <div>
                <label htmlFor="register-lastname" className="block text-sm text-mist-lilac/70 mb-1">
                  Last Name
                </label>
                <input
                  id="register-lastname"
                  type="text"
                  value={registerLastName}
                  onChange={(e) => setRegisterLastName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-deep-purple/20 border border-deep-purple/30 rounded-lg text-mist-lilac placeholder-mist-lilac/40 focus:outline-none focus:border-burnt-lilac/50 transition-colors"
                  placeholder="Last"
                />
              </div>
            </div>
            <div>
              <label htmlFor="register-email" className="block text-sm text-mist-lilac/70 mb-1">
                Email
              </label>
              <input
                id="register-email"
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-deep-purple/20 border border-deep-purple/30 rounded-lg text-mist-lilac placeholder-mist-lilac/40 focus:outline-none focus:border-burnt-lilac/50 transition-colors"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label htmlFor="register-password" className="block text-sm text-mist-lilac/70 mb-1">
                Password
              </label>
              <input
                id="register-password"
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
                minLength={5}
                className="w-full px-4 py-3 bg-deep-purple/20 border border-deep-purple/30 rounded-lg text-mist-lilac placeholder-mist-lilac/40 focus:outline-none focus:border-burnt-lilac/50 transition-colors"
                placeholder="Min. 5 characters"
              />
            </div>
            <button
              type="submit"
              disabled={formLoading}
              className="w-full btn-gothic py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        )}

        {/* Wishlist Preview for non-logged in users */}
        {wishlistItems.length > 0 && (
          <div className="mt-12 pt-8 border-t border-deep-purple/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-serif text-mist-lilac">Your Wishlist</h3>
              <Link href="/wishlist" className="text-burnt-lilac hover:text-mist-lilac text-sm transition-colors">
                View All →
              </Link>
            </div>
            <p className="text-mist-lilac/50 text-sm">
              You have {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved. Sign in to sync your wishlist across devices.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
