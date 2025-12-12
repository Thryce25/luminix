'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useWishlist } from '@/context/WishlistContext';
import Link from 'next/link';

type ActiveTab = 'profile' | 'orders' | 'addresses' | 'wishlist' | 'settings';

export default function AccountPageClient() {
  const { user, loading, signIn, signUp, signInWithGoogle, signInWithGitHub, signOut, updateProfile } = useAuth();
  const router = useRouter();
  const { items: wishlistItems } = useWishlist();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('profile');
  
  // Edit profile states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  
  // Change password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Address states
  const [addresses, setAddresses] = useState([
    { id: 1, type: 'Shipping', name: 'John Doe', street: '123 Gothic Street', city: 'Dark City', state: 'NY', zip: '10001', isDefault: true },
  ]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);

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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const { error } = await updateProfile({ firstName: editFirstName, lastName: editLastName });
      if (error) throw error;
      setSuccess('Profile updated successfully!');
      setIsEditingProfile(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      // In production, you'd verify current password first
      const supabase = (await import('@/lib/supabase/client')).createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    } finally {
      setIsSubmitting(false);
    }
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
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in-up opacity-0 stagger-1">
          <h1 className="font-serif text-5xl md:text-6xl mb-4 gradient-text">My Account</h1>
          <p className="text-mist-lilac/60 text-lg">Welcome back, {user.user_metadata?.first_name || 'Shadow Walker'}</p>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {[
              { id: 'profile' as ActiveTab, label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
              { id: 'orders' as ActiveTab, label: 'Orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
              { id: 'addresses' as ActiveTab, label: 'Addresses', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
              { id: 'wishlist' as ActiveTab, label: 'Wishlist', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
              { id: 'settings' as ActiveTab, label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
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
                {tab.id === 'wishlist' && wishlistItems.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-pink-500 text-white text-xs rounded-full">{wishlistItems.length}</span>
                )}
              </button>
            ))}
          </div>
        </div>

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

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="card-gothic p-8 md:p-12 animate-scale-in">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-serif text-burnt-lilac">Profile Information</h2>
              {!isEditingProfile && (
                <button
                  onClick={() => {
                    setIsEditingProfile(true);
                    setEditFirstName(user.user_metadata?.first_name || '');
                    setEditLastName(user.user_metadata?.last_name || '');
                  }}
                  className="btn-gothic-outline py-2 px-4 text-sm"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2 text-burnt-lilac font-medium">First Name</label>
                    <input
                      type="text"
                      value={editFirstName}
                      onChange={(e) => setEditFirstName(e.target.value)}
                      className="w-full px-4 py-3 bg-black/40 border border-burnt-lilac/30 rounded-lg focus:border-burnt-lilac focus:outline-none transition-all duration-300 text-mist-lilac"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-burnt-lilac font-medium">Last Name</label>
                    <input
                      type="text"
                      value={editLastName}
                      onChange={(e) => setEditLastName(e.target.value)}
                      className="w-full px-4 py-3 bg-black/40 border border-burnt-lilac/30 rounded-lg focus:border-burnt-lilac focus:outline-none transition-all duration-300 text-mist-lilac"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={isSubmitting} className="btn-gothic">
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" onClick={() => setIsEditingProfile(false)} className="btn-gothic-outline">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-burnt-lilac/20">
                  <svg className="w-6 h-6 text-burnt-lilac" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div>
                    <p className="text-sm text-mist-lilac/60">Email</p>
                    <p className="text-mist-lilac">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-burnt-lilac/20">
                  <svg className="w-6 h-6 text-burnt-lilac" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-mist-lilac/60">Name</p>
                    <p className="text-mist-lilac">
                      {user.user_metadata?.first_name || user.user_metadata?.last_name
                        ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
                        : 'Not set'}
                    </p>
                  </div>
                </div>

                <button onClick={handleSignOut} className="w-full btn-gothic-outline flex items-center justify-center gap-2 mt-8">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="card-gothic p-8 md:p-12 animate-scale-in">
            <h2 className="text-2xl font-serif text-burnt-lilac mb-8">Order History</h2>
            <div className="space-y-4">
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-mist-lilac/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="text-mist-lilac/60 mb-4">No orders yet</p>
                <Link href="/products" className="btn-gothic inline-block">
                  Start Shopping
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="card-gothic p-8 md:p-12 animate-scale-in">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-serif text-burnt-lilac">Saved Addresses</h2>
              <button onClick={() => setIsAddingAddress(true)} className="btn-gothic py-2 px-4 text-sm">
                + Add Address
              </button>
            </div>

            {isAddingAddress ? (
              <form className="space-y-4 mb-6 p-6 bg-white/5 rounded-lg border border-burnt-lilac/20">
                <div className="grid md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Full Name" className="w-full px-4 py-3 bg-black/40 border border-burnt-lilac/30 rounded-lg focus:border-burnt-lilac focus:outline-none text-mist-lilac" />
                  <input type="text" placeholder="Phone Number" className="w-full px-4 py-3 bg-black/40 border border-burnt-lilac/30 rounded-lg focus:border-burnt-lilac focus:outline-none text-mist-lilac" />
                </div>
                <input type="text" placeholder="Street Address" className="w-full px-4 py-3 bg-black/40 border border-burnt-lilac/30 rounded-lg focus:border-burnt-lilac focus:outline-none text-mist-lilac" />
                <div className="grid md:grid-cols-3 gap-4">
                  <input type="text" placeholder="City" className="w-full px-4 py-3 bg-black/40 border border-burnt-lilac/30 rounded-lg focus:border-burnt-lilac focus:outline-none text-mist-lilac" />
                  <input type="text" placeholder="State" className="w-full px-4 py-3 bg-black/40 border border-burnt-lilac/30 rounded-lg focus:border-burnt-lilac focus:outline-none text-mist-lilac" />
                  <input type="text" placeholder="ZIP Code" className="w-full px-4 py-3 bg-black/40 border border-burnt-lilac/30 rounded-lg focus:border-burnt-lilac focus:outline-none text-mist-lilac" />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="btn-gothic">Save Address</button>
                  <button type="button" onClick={() => setIsAddingAddress(false)} className="btn-gothic-outline">Cancel</button>
                </div>
              </form>
            ) : null}

            <div className="grid md:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <div key={address.id} className="p-6 bg-white/5 rounded-lg border border-burnt-lilac/20 relative">
                  {address.isDefault && (
                    <span className="absolute top-3 right-3 px-3 py-1 bg-burnt-lilac text-white text-xs rounded-full">Default</span>
                  )}
                  <h3 className="text-lg font-semibold text-burnt-lilac mb-2">{address.type}</h3>
                  <p className="text-mist-lilac">{address.name}</p>
                  <p className="text-mist-lilac/60 text-sm">{address.street}</p>
                  <p className="text-mist-lilac/60 text-sm">{address.city}, {address.state} {address.zip}</p>
                  <div className="mt-4 flex gap-2">
                    <button className="text-sm text-burnt-lilac hover:text-mist-lilac">Edit</button>
                    <button className="text-sm text-red-400 hover:text-red-300">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === 'wishlist' && (
          <div className="card-gothic p-8 md:p-12 animate-scale-in">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-serif text-burnt-lilac">My Wishlist</h2>
              <Link href="/wishlist/view" className="btn-gothic-outline py-2 px-4 text-sm">
                View All
              </Link>
            </div>

            {wishlistItems.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-mist-lilac/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <p className="text-mist-lilac/60 mb-4">Your wishlist is empty</p>
                <Link href="/products" className="btn-gothic inline-block">
                  Discover Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {wishlistItems.slice(0, 6).map((item) => (
                  <Link key={item.id} href={`/products/${item.productHandle}`} className="group">
                    <div className="aspect-square bg-white/5 rounded-lg border border-burnt-lilac/20 overflow-hidden hover:border-burnt-lilac/50 transition-all">
                      <img src={item.productImage || '/images/placeholder.jpg'} alt={item.productTitle || ''} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <p className="mt-2 text-sm text-mist-lilac line-clamp-1">{item.productTitle}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="card-gothic p-8 md:p-12 animate-scale-in">
            <h2 className="text-2xl font-serif text-burnt-lilac mb-8">Account Settings</h2>
            
            <div className="space-y-8">
              {/* Change Password */}
              <div className="border-b border-burnt-lilac/20 pb-8">
                <h3 className="text-xl font-serif text-burnt-lilac mb-4">Change Password</h3>
                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm mb-2 text-mist-lilac/60">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-black/40 border border-burnt-lilac/30 rounded-lg focus:border-burnt-lilac focus:outline-none text-mist-lilac"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-mist-lilac/60">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      minLength={6}
                      className="w-full px-4 py-3 bg-black/40 border border-burnt-lilac/30 rounded-lg focus:border-burnt-lilac focus:outline-none text-mist-lilac"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-mist-lilac/60">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      minLength={6}
                      className="w-full px-4 py-3 bg-black/40 border border-burnt-lilac/30 rounded-lg focus:border-burnt-lilac focus:outline-none text-mist-lilac"
                    />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="btn-gothic">
                    {isSubmitting ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>

              {/* Delete Account */}
              <div>
                <h3 className="text-xl font-serif text-red-400 mb-4">Danger Zone</h3>
                <p className="text-mist-lilac/60 mb-4">Once you delete your account, there is no going back.</p>
                <button className="px-6 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/20 transition-all">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
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
