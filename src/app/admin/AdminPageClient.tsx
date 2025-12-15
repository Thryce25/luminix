'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

type AdminTab = 'users' | 'wishlists' | 'shopify';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  created_at: string;
}

interface Wishlist {
  id: string;
  user_id: string;
  product_id: string;
  product_handle: string;
  product_title: string;
  created_at: string;
}

export default function AdminPageClient() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [loading, setLoading] = useState(false);
  
  // Users data
  const [users, setUsers] = useState<User[]>([]);
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  
  const supabase = createClient();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'KISHORE@173') {
      setIsAuthenticated(true);
      setError('');
      fetchUsers();
    } else {
      setError('Invalid password');
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setUsers(data.users || []);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      alert('Error loading users: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlists = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            phone_number,
            email
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setWishlists(data || []);
    } catch (err: any) {
      console.error('Error fetching wishlists:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This will delete both their auth account and profile data.')) return;
    
    try {
      const response = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      alert('User deleted successfully');
      fetchUsers();
    } catch (err: any) {
      alert('Error deleting user: ' + err.message);
    }
  };

  const deleteWishlistItem = async (wishlistId: string) => {
    if (!confirm('Are you sure you want to delete this wishlist item?')) return;
    
    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('id', wishlistId);
      
      if (error) throw error;
      alert('Wishlist item deleted successfully');
      fetchWishlists();
    } catch (err: any) {
      alert('Error deleting wishlist item: ' + err.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated && activeTab === 'users') {
      fetchUsers();
    } else if (isAuthenticated && activeTab === 'wishlists') {
      fetchWishlists();
    }
  }, [activeTab, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="font-serif text-4xl md:text-5xl mb-4 gradient-text">Admin Panel</h1>
            <p className="text-mist-lilac/60">Enter password to continue</p>
          </div>

          <div className="card-gothic p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm mb-2 text-burnt-lilac font-medium">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 pr-12 bg-black/40 border border-burnt-lilac/30 rounded-lg focus:border-burnt-lilac focus:outline-none transition-all duration-300 text-mist-lilac"
                    placeholder="Enter admin password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-mist-lilac/60 hover:text-burnt-lilac transition-colors p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="w-full btn-gothic">
                Access Admin Panel
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl gradient-text mb-2">Admin Panel</h1>
            <p className="text-mist-lilac/60">Manage your Luminix data</p>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="btn-gothic-outline py-2 px-4 text-sm">
              Back to Site
            </Link>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="btn-gothic-outline py-2 px-4 text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-2 overflow-x-auto">
          {[
            { id: 'users' as AdminTab, label: 'Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
            { id: 'wishlists' as AdminTab, label: 'Wishlists', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
            { id: 'shopify' as AdminTab, label: 'Shopify', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-burnt-lilac text-white shadow-lg shadow-burnt-lilac/30'
                  : 'bg-white/5 text-mist-lilac hover:bg-white/10 border border-white/10'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="card-gothic p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif text-burnt-lilac">Users ({users.length})</h2>
              <button onClick={fetchUsers} className="btn-gothic-outline py-2 px-4 text-sm">
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-burnt-lilac border-t-transparent rounded-full mx-auto"></div>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12 text-mist-lilac/60">
                No users found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-burnt-lilac/20">
                      <th className="text-left py-3 px-4 text-burnt-lilac font-medium">Email</th>
                      <th className="text-left py-3 px-4 text-burnt-lilac font-medium">Name</th>
                      <th className="text-left py-3 px-4 text-burnt-lilac font-medium">Phone</th>
                      <th className="text-left py-3 px-4 text-burnt-lilac font-medium">Created</th>
                      <th className="text-left py-3 px-4 text-burnt-lilac font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 px-4 text-mist-lilac">{user.email}</td>
                        <td className="py-3 px-4 text-mist-lilac">
                          {user.first_name} {user.last_name}
                        </td>
                        <td className="py-3 px-4 text-mist-lilac">
                          {user.phone_number || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-mist-lilac/60 text-sm">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Wishlists Tab */}
        {activeTab === 'wishlists' && (
          <div className="card-gothic p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif text-burnt-lilac">Wishlists ({wishlists.length})</h2>
              <button onClick={fetchWishlists} className="btn-gothic-outline py-2 px-4 text-sm">
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-burnt-lilac border-t-transparent rounded-full mx-auto"></div>
              </div>
            ) : wishlists.length === 0 ? (
              <div className="text-center py-12 text-mist-lilac/60">
                No wishlist items found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-burnt-lilac/20">
                      <th className="text-left py-3 px-4 text-burnt-lilac font-medium">Product</th>
                      <th className="text-left py-3 px-4 text-burnt-lilac font-medium">User Name</th>
                      <th className="text-left py-3 px-4 text-burnt-lilac font-medium">Phone</th>
                      <th className="text-left py-3 px-4 text-burnt-lilac font-medium">Email</th>
                      <th className="text-left py-3 px-4 text-burnt-lilac font-medium">Created</th>
                      <th className="text-left py-3 px-4 text-burnt-lilac font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wishlists.map((item: any) => (
                      <tr key={item.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 px-4">
                          <div>
                            <div className="text-mist-lilac font-medium">{item.product_title}</div>
                            <div className="text-mist-lilac/60 text-sm">{item.product_handle}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-mist-lilac">
                          {item.profiles?.first_name} {item.profiles?.last_name}
                        </td>
                        <td className="py-3 px-4 text-mist-lilac">
                          {item.profiles?.phone_number || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-mist-lilac/80 text-sm">
                          {item.profiles?.email}
                        </td>
                        <td className="py-3 px-4 text-mist-lilac/60 text-sm">
                          {new Date(item.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => deleteWishlistItem(item.id)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Shopify Tab */}
        {activeTab === 'shopify' && (
          <div className="card-gothic p-6">
            <h2 className="text-2xl font-serif text-burnt-lilac mb-6">Shopify Management</h2>
            
            <div className="space-y-6">
              <div className="p-6 bg-white/5 rounded-lg border border-burnt-lilac/20">
                <h3 className="text-lg font-semibold text-burnt-lilac mb-2">Product Management</h3>
                <p className="text-mist-lilac/60 mb-4">
                  Manage your products directly in your Shopify admin panel for better inventory control and product updates.
                </p>
                <a
                  href="https://wpcsae-vx.myshopify.com/admin/products"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block btn-gothic py-2 px-4 text-sm"
                >
                  Open Shopify Admin
                </a>
              </div>

              <div className="p-6 bg-white/5 rounded-lg border border-burnt-lilac/20">
                <h3 className="text-lg font-semibold text-burnt-lilac mb-2">Store Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-mist-lilac/60">Store Domain:</span>
                    <span className="text-mist-lilac font-mono">wpcsae-vx.myshopify.com</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-mist-lilac/60">Storefront API:</span>
                    <span className="text-green-400">Connected</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-mist-lilac/60">Website:</span>
                    <span className="text-mist-lilac">www.luminixclothing.com</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <div className="flex gap-3">
                  <svg className="w-6 h-6 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-amber-300 mb-1">Important Note</h4>
                    <p className="text-amber-200/80 text-sm">
                      Product data is managed through Shopify. Use the Shopify Admin panel to add, edit, or remove products. Changes will automatically sync to your website.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
