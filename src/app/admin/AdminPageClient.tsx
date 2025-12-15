'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

type AdminTab = 'users' | 'wishlists' | 'carts' | 'shopify';

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
  const [cartUsers, setCartUsers] = useState<User[]>([]);
  const [customMessage, setCustomMessage] = useState(
    `Hi {name}! 👋\n\n` +
    `We noticed you have items in your cart at Luminix Clothing. 🖤\n\n` +
    `Complete your purchase now and embrace the darkness with our exclusive gothic fashion collection!\n\n` +
    `Shop now: https://www.luminixclothing.com/cart\n\n` +
    `Need help? Reply to this message! ✨`
  );
  
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

  const fetchCartUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/carts');
      const data = await response.json();
      
      if (data.message) {
        // Table not set up yet
        console.warn(data.message);
      }
      
      setCartUsers(data.users || []);
    } catch (err: any) {
      console.error('Error fetching cart users:', err);
      setCartUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const sendWhatsAppMessage = (phone: string, name: string) => {
    if (!phone || phone === 'NOT_PROVIDED') {
      alert('This user does not have a phone number');
      return;
    }

    // Replace {name} placeholder with actual name
    const personalizedMessage = customMessage.replace(/{name}/g, name);
    const message = encodeURIComponent(personalizedMessage);

    // Remove any non-digit characters and ensure it starts with country code
    const cleanPhone = phone.replace(/\D/g, '');
    const phoneWithCountryCode = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    
    window.open(`https://wa.me/${phoneWithCountryCode}?text=${message}`, '_blank');
  };

  const resetMessageTemplate = () => {
    setCustomMessage(
      `Hi {name}! 👋\n\n` +
      `We noticed you have items in your cart at Luminix Clothing. 🖤\n\n` +
      `Complete your purchase now and embrace the darkness with our exclusive gothic fashion collection!\n\n` +
      `Shop now: https://www.luminixclothing.com/cart\n\n` +
      `Need help? Reply to this message! ✨`
    );
  };

  const sendToAllCustomers = () => {
    const usersWithPhone = cartUsers.filter(
      user => user.phone_number && user.phone_number !== 'NOT_PROVIDED'
    );

    if (usersWithPhone.length === 0) {
      alert('No customers with valid phone numbers found.');
      return;
    }

    const confirmMessage = `This will open ${usersWithPhone.length} WhatsApp chat(s) in new tabs. Your browser may block some pop-ups. Continue?`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    // Open WhatsApp for each user with a small delay to prevent browser blocking
    usersWithPhone.forEach((user, index) => {
      setTimeout(() => {
        const name = user.first_name || user.email.split('@')[0];
        const personalizedMessage = customMessage.replace(/{name}/g, name);
        const message = encodeURIComponent(personalizedMessage);
        
        const cleanPhone = user.phone_number!.replace(/\D/g, '');
        const phoneWithCountryCode = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
        
        window.open(`https://wa.me/${phoneWithCountryCode}?text=${message}`, '_blank');
      }, index * 500); // 500ms delay between each window
    });

    alert(`Opening ${usersWithPhone.length} WhatsApp chat(s). Please allow pop-ups if prompted.`);
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
    } else if (isAuthenticated && activeTab === 'carts') {
      fetchCartUsers();
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
            { id: 'carts' as AdminTab, label: 'Cart Reminders', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' },
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

        {/* Cart Reminders Tab */}
        {activeTab === 'carts' && (
          <div className="card-gothic p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-serif text-burnt-lilac">Cart Reminders</h2>
                <p className="text-mist-lilac/60 text-sm mt-1">Send WhatsApp messages to customers</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={sendToAllCustomers}
                  disabled={cartUsers.filter(u => u.phone_number && u.phone_number !== 'NOT_PROVIDED').length === 0}
                  className="btn-gothic py-2 px-4 text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                  Send to All ({cartUsers.filter(u => u.phone_number && u.phone_number !== 'NOT_PROVIDED').length})
                </button>
                <button onClick={fetchCartUsers} className="btn-gothic-outline py-2 px-4 text-sm">
                  Refresh
                </button>
              </div>
            </div>

            {/* Message Template Customization */}
            <div className="mb-6 p-6 bg-white/5 rounded-lg border border-burnt-lilac/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-burnt-lilac">Message Template</h3>
                <button
                  onClick={resetMessageTemplate}
                  className="text-sm text-mist-lilac/70 hover:text-burnt-lilac transition-colors flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset to Default
                </button>
              </div>
              
              <div className="mb-3">
                <label className="block text-sm text-mist-lilac/80 mb-2">
                  Customize your WhatsApp message. Use <code className="px-1.5 py-0.5 bg-burnt-lilac/20 text-burnt-lilac rounded text-xs">&#123;name&#125;</code> as placeholder for customer name.
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 bg-black/40 border border-burnt-lilac/30 rounded-lg focus:border-burnt-lilac focus:outline-none transition-all duration-300 text-mist-lilac text-sm font-mono resize-none"
                  placeholder="Enter your custom message..."
                />
              </div>
              
              <div className="flex items-start gap-2 text-xs text-mist-lilac/60">
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>This message will be used for all WhatsApp reminders. The &#123;name&#125; will be automatically replaced with each customer's name.</p>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-burnt-lilac border-t-transparent rounded-full mx-auto"></div>
              </div>
            ) : cartUsers.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-4">
                  <svg className="w-16 h-16 mx-auto text-mist-lilac/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <p className="text-mist-lilac/60 text-lg mb-2">No Active Carts</p>
                <p className="text-mist-lilac/40 text-sm mb-4">Users with items in their cart will appear here</p>
                <div className="inline-block bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-3 text-left max-w-md mx-auto">
                  <div className="flex gap-2 items-start">
                    <svg className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-amber-300 text-sm font-semibold mb-1">Setup Required</p>
                      <p className="text-amber-200/80 text-xs">
                        If you haven't set up the cart tracking table yet, please execute <code className="px-1.5 py-0.5 bg-black/30 rounded">supabase-cart-tracking.sql</code> in your Supabase dashboard.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {cartUsers.map((user: any) => (
                  <div key={user.id} className="bg-white/5 border border-burnt-lilac/20 rounded-lg p-4 hover:border-burnt-lilac/40 transition-all">
                    {/* User Info Header */}
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-3 pb-3 border-b border-white/10">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-burnt-lilac mb-1">
                          {user.first_name || user.last_name ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'Guest User'}
                        </h3>
                        <div className="space-y-1 text-sm">
                          <p className="text-mist-lilac/70">{user.email}</p>
                          {user.phone_number && user.phone_number !== 'NOT_PROVIDED' ? (
                            <div className="flex items-center gap-2">
                              <span className="text-mist-lilac font-mono">{user.phone_number}</span>
                              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                              </svg>
                            </div>
                          ) : (
                            <span className="text-mist-lilac/40">No phone number</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {user.lastUpdated && (
                          <div className="text-right">
                            <p className="text-xs text-mist-lilac/50 mb-1">Last Updated</p>
                            <p className="text-sm text-mist-lilac font-medium">
                              {new Date(user.lastUpdated).toLocaleString()}
                            </p>
                          </div>
                        )}
                        <button
                          onClick={() => sendWhatsAppMessage(
                            user.phone_number || '',
                            user.first_name || user.email.split('@')[0]
                          )}
                          disabled={!user.phone_number || user.phone_number === 'NOT_PROVIDED'}
                          className="btn-gothic py-2 px-4 text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          Send Reminder
                        </button>
                      </div>
                    </div>

                    {/* Cart Items */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-burnt-lilac/80">
                          Cart Items ({user.totalQuantity || 0})
                        </h4>
                      </div>
                      
                      {user.cartItems && user.cartItems.length > 0 ? (
                        <div className="space-y-2">
                          {user.cartItems.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-3 p-2 bg-black/20 rounded border border-white/5">
                              {item.image && (
                                <img 
                                  src={item.image} 
                                  alt={item.title}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-mist-lilac font-medium truncate">{item.title}</p>
                                {item.variantTitle && item.variantTitle !== 'Default Title' && (
                                  <p className="text-xs text-mist-lilac/60">{item.variantTitle}</p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-mist-lilac font-semibold">Qty: {item.quantity}</p>
                                {item.price && (
                                  <p className="text-xs text-mist-lilac/70">₹{item.price}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-mist-lilac/50 italic">No items in cart</p>
                      )}
                    </div>
                  </div>
                ))}
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
