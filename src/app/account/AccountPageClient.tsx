'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useWishlist } from '@/context/WishlistContext';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

type ActiveTab = 'profile' | 'orders' | 'wishlist';

interface Address {
  id: number;
  type: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  isDefault?: boolean;
}

interface Order {
  id: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  lineItems: {
    edges: Array<{
      node: {
        title: string;
        quantity: number;
        productId?: string;
        productHandle?: string | null;
        variant: {
          price: {
            amount: string;
            currencyCode: string;
          };
          image: {
            url: string;
          } | null;
        };
      };
    }>;
  };
}

export default function AccountPageClient() {
  const { user, loading, signIn, signUp, signInWithGoogle, signInWithGitHub, signOut, updateProfile } = useAuth();
  const router = useRouter();
  const { items: wishlistItems } = useWishlist();

  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('profile');
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [modalPhoneNumber, setModalPhoneNumber] = useState('');
  const [userPhoneNumber, setUserPhoneNumber] = useState<string>('');

  // Debug: Log state changes
  useEffect(() => {
    console.log('[Modal State] showPhoneModal:', showPhoneModal);
  }, [showPhoneModal]);

  // Check URL params for action (signin/signup) and OAuth signup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const action = params.get('action');
      const oauthMode = params.get('oauth_mode');
      
      // Set isLogin based on action parameter
      if (action === 'signin') {
        setIsLogin(true);
      } else if (action === 'signup') {
        setIsLogin(false);
      }
      
      console.log('[OAuth Check] oauth_mode:', oauthMode, 'user:', user?.id);
      
      // If coming from OAuth signup, check phone immediately
      if (oauthMode === 'signup' && user) {
        console.log('[OAuth Check] Triggering phone check for OAuth signup');
        checkUserPhone();
      }
    }
  }, [user]);
  
  // Edit profile states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');

  // Function to check user phone
  const checkUserPhone = async () => {
    console.log('[Phone Check] Starting check, user:', user?.id);
    
    if (user) {
      try {
        const supabase = createClient();
        
        // Check for pending phone number from signup
        const pendingPhone = typeof window !== 'undefined' ? sessionStorage.getItem('pendingPhoneNumber') : null;
        console.log('[Phone Check] Pending phone from session:', pendingPhone);
        
        if (pendingPhone) {
          // Save pending phone number
          await supabase
            .from('profiles')
            .update({ phone_number: pendingPhone })
            .eq('id', user.id);
          sessionStorage.removeItem('pendingPhoneNumber');
          console.log('[Phone Check] Saved pending phone, no modal needed');
          return; // Phone already saved
        }
        
        // Check if profile needs phone number
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('phone_number')
          .eq('id', user.id)
          .single();

        console.log('[Phone Check] Profile data:', profile, 'Error:', error);

        if (!error && profile) {
          // Store phone number in state if it exists
          if (profile.phone_number && profile.phone_number !== 'NOT_PROVIDED') {
            setUserPhoneNumber(profile.phone_number);
          }
          
          // Show modal if phone is missing or set to NOT_PROVIDED
          if (!profile.phone_number || profile.phone_number === 'NOT_PROVIDED') {
            console.log('[Phone Check] NO PHONE FOUND - SHOWING MODAL');
            setShowPhoneModal(true);
          } else {
            console.log('[Phone Check] Phone exists:', profile.phone_number);
          }
        }
      } catch (err) {
        console.error('[Phone Check] Error:', err);
      }
    } else {
      console.log('[Phone Check] No user logged in');
    }
  };

  // Check if user needs to provide phone number - mandatory for all users
  useEffect(() => {
    console.log('[Main Effect] User changed:', user?.id);
    if (user) {
      checkUserPhone();
    }
  }, [user]);
  
  // Change password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Address states
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

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
        
        // Check for redirect after auth
        const redirectTo = typeof window !== 'undefined' ? localStorage.getItem('redirectAfterAuth') : null;
        if (redirectTo) {
          localStorage.removeItem('redirectAfterAuth');
          setTimeout(() => router.push(redirectTo), 1000);
        } else {
          setTimeout(() => router.push('/account'), 1000);
        }
      } else {
        // Sign up without phone number - will collect via popup
        const { error } = await signUp(email, password, firstName, lastName, 'NOT_PROVIDED');
        if (error) throw error;
        
        // Clear form
        setEmail('');
        setPassword('');
        setFirstName('');
        setLastName('');
        
        // Check for redirect after auth (for signup too)
        const redirectTo = typeof window !== 'undefined' ? localStorage.getItem('redirectAfterAuth') : null;
        if (redirectTo) {
          localStorage.removeItem('redirectAfterAuth');
        }
        
        // Show phone modal immediately after signup
        setIsSubmitting(false);
        setShowPhoneModal(true);
        return; // Exit early to prevent closing modal
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

  // Fetch customer orders
  const fetchOrders = async () => {
    if (!user?.email) {
      console.log('[Orders] No user email available');
      return;
    }

    console.log('[Orders] Fetching orders for email:', user.email);
    setOrdersLoading(true);
    try {
      const url = `/api/customer/orders?email=${encodeURIComponent(user.email)}`;
      console.log('[Orders] API URL:', url);
      
      const response = await fetch(url);
      console.log('[Orders] Response status:', response.status);
      
      const data = await response.json();
      console.log('[Orders] Response data:', data);
      
      setOrders(data.orders || []);
      console.log('[Orders] Orders set:', data.orders?.length || 0, 'orders');
    } catch (err: any) {
      console.error('[Orders] Error fetching orders:', err);
      // Silently fail and show empty state
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch orders when orders tab is selected
  useEffect(() => {
    console.log('[Orders Effect] activeTab:', activeTab, 'user:', !!user, 'orders.length:', orders.length);
    if (activeTab === 'orders' && user && orders.length === 0) {
      console.log('[Orders Effect] Triggering fetchOrders');
      fetchOrders();
    }
  }, [activeTab, user]);

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
      const mode = isLogin ? 'signin' : 'signup';
      const { error } = await signInWithGoogle(mode);
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
      const mode = isLogin ? 'signin' : 'signup';
      const { error } = await signInWithGitHub(mode);
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with GitHub');
      setIsSubmitting(false);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!/^[0-9]{10}$/.test(modalPhoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setIsSubmitting(true);
    try {
      // If user is authenticated, update their profile
      if (user) {
        const supabase = createClient();
        const { error } = await supabase
          .from('profiles')
          .update({ phone_number: modalPhoneNumber })
          .eq('id', user.id);

        if (error) throw error;

        setShowPhoneModal(false);
        setUserPhoneNumber(modalPhoneNumber);
        setModalPhoneNumber('');
        setSuccess('Phone number saved! Please check your email to verify your account.');
        
        // Check for redirect after auth
        const redirectTo = typeof window !== 'undefined' ? localStorage.getItem('redirectAfterAuth') : null;
        if (redirectTo) {
          localStorage.removeItem('redirectAfterAuth');
          setTimeout(() => router.push(redirectTo), 1000);
        }
      } else {
        // Store phone temporarily if user isn't authenticated yet (just signed up)
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('pendingPhoneNumber', modalPhoneNumber);
        }
        setShowPhoneModal(false);
        setModalPhoneNumber('');
        setSuccess('Account created! Please check your email to verify your account. Your phone number will be saved after verification.');
        
        // Check for redirect after auth
        const redirectTo = typeof window !== 'undefined' ? localStorage.getItem('redirectAfterAuth') : null;
        if (redirectTo) {
          localStorage.removeItem('redirectAfterAuth');
          setTimeout(() => router.push(redirectTo), 1500);
        }
      }
    } catch (err: any) {
      setError('Failed to save phone number: ' + err.message);
    } finally {
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
      <>
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12 animate-fade-in-up opacity-0 stagger-1">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-2 sm:mb-4 gradient-text">My Account</h1>
          <p className="text-mist-lilac/60 text-sm sm:text-base md:text-lg">Welcome back, {user.user_metadata?.first_name || 'Shadow Walker'}</p>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-6 sm:mb-8">
          {/* Mobile: Grid Layout */}
          <div className="grid grid-cols-3 gap-2 sm:hidden">
            {[
              { id: 'profile' as ActiveTab, label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
              { id: 'orders' as ActiveTab, label: 'Orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
              { id: 'wishlist' as ActiveTab, label: 'Wishlist', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-3 rounded-lg font-medium text-sm transition-all duration-300 flex flex-col items-center justify-center gap-1.5 relative ${
                  activeTab === tab.id
                    ? 'bg-burnt-lilac text-white shadow-lg shadow-burnt-lilac/30'
                    : 'bg-white/5 text-mist-lilac hover:bg-white/10 border border-white/10'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                <span className="text-xs">{tab.label}</span>
                {tab.id === 'wishlist' && wishlistItems.length > 0 && (
                  <span className="absolute top-1 right-1 px-1.5 py-0.5 bg-pink-500 text-white text-[10px] rounded-full">{wishlistItems.length}</span>
                )}
              </button>
            ))}
          </div>

          {/* Desktop: Horizontal Layout */}
          <div className="hidden sm:flex gap-2">
            {[
              { id: 'profile' as ActiveTab, label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
              { id: 'orders' as ActiveTab, label: 'Orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
              { id: 'wishlist' as ActiveTab, label: 'Wishlist', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-medium text-base transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-burnt-lilac text-white shadow-lg shadow-burnt-lilac/30'
                    : 'bg-white/5 text-mist-lilac hover:bg-white/10 border border-white/10'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                <span>{tab.label}</span>
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
          <div className="card-gothic p-4 sm:p-6 md:p-8 lg:p-12 animate-scale-in">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-serif text-burnt-lilac">Profile Information</h2>
              {!isEditingProfile && (
                <button
                  onClick={() => {
                    setIsEditingProfile(true);
                    setEditFirstName(user.user_metadata?.first_name || '');
                    setEditLastName(user.user_metadata?.last_name || '');
                  }}
                  className="btn-gothic-outline py-1.5 sm:py-2 px-3 sm:px-4 text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Edit Profile</span>
                  <span className="sm:hidden">Edit</span>
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
                <div className="flex flex-col sm:flex-row gap-3">
                  <button type="submit" disabled={isSubmitting} className="btn-gothic w-full sm:w-auto">
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" onClick={() => setIsEditingProfile(false)} className="btn-gothic-outline w-full sm:w-auto">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 rounded-lg border border-burnt-lilac/20">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-burnt-lilac shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-mist-lilac/60">Email</p>
                    <p className="text-sm sm:text-base text-mist-lilac truncate">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 rounded-lg border border-burnt-lilac/20">
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

                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-burnt-lilac/20">
                  <svg className="w-6 h-6 text-burnt-lilac" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm text-mist-lilac/60">WhatsApp Number</p>
                    <p className="text-mist-lilac">{userPhoneNumber || 'Not set'}</p>
                  </div>
                  {userPhoneNumber && (
                    <div className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-md border border-green-500/30">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      <span>Verified</span>
                    </div>
                  )}
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
          <div className="card-gothic p-4 sm:p-6 md:p-8 lg:p-12 animate-scale-in">
            <h2 className="text-xl sm:text-2xl font-serif text-burnt-lilac mb-6 sm:mb-8">Order History</h2>
            
            {ordersLoading ? (
              <div className="flex items-center justify-center py-12">
                <svg className="animate-spin h-10 w-10 text-burnt-lilac" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="group bg-gradient-to-br from-white/5 to-white/[0.02] border border-burnt-lilac/20 rounded-xl p-5 hover:border-burnt-lilac/50 hover:shadow-lg hover:shadow-burnt-lilac/10 transition-all duration-300">
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-5">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-bold text-burnt-lilac">Order #{order.orderNumber}</h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            order.fulfillmentStatus === 'fulfilled' 
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                              : order.fulfillmentStatus === 'partial'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
                          }`}>
                            {order.fulfillmentStatus === 'fulfilled' ? '✓ Delivered' : 
                             order.fulfillmentStatus === 'partial' ? '⟳ In Transit' : '⏱ Processing'}
                          </span>
                        </div>
                        <p className="text-sm text-mist-lilac/50">
                          {new Date(order.processedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      
                      {/* Total Price with Hover Details */}
                      <div className="relative group/price">
                        <div className="text-right cursor-help">
                          <p className="text-xs text-mist-lilac/50 mb-1">Total Amount</p>
                          <p className="text-2xl font-bold bg-gradient-to-r from-burnt-lilac to-pink-400 bg-clip-text text-transparent">
                            {order.totalPrice.currencyCode} {parseFloat(order.totalPrice.amount).toFixed(2)}
                          </p>
                        </div>
                        
                        {/* Hover Dropdown - Order Details */}
                        <div className="absolute right-0 top-full mt-2 w-72 bg-deep-purple/95 backdrop-blur-sm border border-burnt-lilac/30 rounded-lg p-4 opacity-0 invisible group-hover/price:opacity-100 group-hover/price:visible transition-all duration-300 shadow-xl z-10">
                          <h4 className="text-sm font-bold text-burnt-lilac mb-3 border-b border-burnt-lilac/20 pb-2">Order Summary</h4>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between text-mist-lilac/80">
                              <span>Payment Status:</span>
                              <span className="font-semibold text-green-400">{order.financialStatus || 'Paid'}</span>
                            </div>
                            <div className="flex justify-between text-mist-lilac/80">
                              <span>Items:</span>
                              <span className="font-semibold text-mist-lilac">{order.lineItems.edges.reduce((sum, item) => sum + item.node.quantity, 0)}</span>
                            </div>
                            <div className="flex justify-between text-mist-lilac/80">
                              <span>Order Date:</span>
                              <span className="font-semibold text-mist-lilac">
                                {new Date(order.processedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Product Items with Images */}
                    <div className="space-y-3">
                      {order.lineItems.edges.map((item, idx) => {
                        const ItemWrapper = item.node.productHandle ? Link : 'div';
                        const wrapperProps = item.node.productHandle 
                          ? { href: `/products/${item.node.productHandle}` }
                          : {};
                        
                        return (
                          <ItemWrapper 
                            key={idx} 
                            {...wrapperProps}
                            className={`flex gap-4 items-center bg-white/[0.03] rounded-lg p-3 hover:bg-white/[0.06] transition-all ${
                              item.node.productHandle ? 'cursor-pointer hover:border-burnt-lilac/30 border border-transparent' : ''
                            }`}
                          >
                            {/* Product Image */}
                            <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-burnt-lilac/10 to-transparent border border-burnt-lilac/20">
                              {item.node.variant?.image ? (
                                <img 
                                  src={item.node.variant.image.url} 
                                  alt={item.node.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <svg className="w-8 h-8 text-mist-lilac/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            
                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <p className="text-mist-lilac font-semibold truncate mb-1">{item.node.title}</p>
                              <div className="flex items-center gap-4 text-sm text-mist-lilac/60">
                                <span className="flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                  </svg>
                                  Qty: {item.node.quantity}
                                </span>
                                {item.node.productHandle && (
                                  <span className="text-xs text-burnt-lilac/80 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    View Product
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {/* Item Price */}
                            <div className="text-right flex-shrink-0">
                              <p className="text-burnt-lilac font-bold">
                                {order.totalPrice.currencyCode} {parseFloat(item.node.variant.price.amount).toFixed(2)}
                              </p>
                              {item.node.quantity > 1 && (
                                <p className="text-xs text-mist-lilac/40">
                                  @{(parseFloat(item.node.variant.price.amount) / item.node.quantity).toFixed(2)} each
                                </p>
                              )}
                            </div>
                          </ItemWrapper>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-mist-lilac/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="text-mist-lilac/60 mb-4">No orders yet</p>
                <Link href="/products" className="btn-gothic inline-block">
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === 'wishlist' && (
          <div className="card-gothic p-4 sm:p-6 md:p-8 lg:p-12 animate-scale-in">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-serif text-burnt-lilac">My Wishlist</h2>
              <Link href="/wishlist/view" className="btn-gothic-outline py-1.5 sm:py-2 px-3 sm:px-4 text-xs sm:text-sm">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {wishlistItems.slice(0, 8).map((item) => (
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


      </div>

      {/* Phone Number Collection Modal - Rendered here for authenticated users */}
      {showPhoneModal && (() => {
        console.log('[Modal Render] Modal is being rendered in authenticated section');
        return (
        <div data-phone-modal="true" className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden" style={{ zIndex: 99999, background: 'linear-gradient(to bottom right, #1a0a2e, #000000, #1a0a2e)' }}>
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-burnt-lilac/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 md:w-[32rem] md:h-[32rem] bg-mist-lilac/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          {/* Main Content */}
          <div className="relative w-full max-w-lg lg:max-w-xl">
            {/* Card */}
            <div className="bg-black/90 backdrop-blur-xl border-2 border-burnt-lilac/40 rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl shadow-burnt-lilac/20">
              {/* Header */}
              <div className="text-center mb-8">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-burnt-lilac/30 to-mist-lilac/20 border border-burnt-lilac/50 mb-6 animate-scale-in">
                  <svg className="w-10 h-10 text-burnt-lilac" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>

                {/* Title */}
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl gradient-text mb-3 tracking-wide">
                  One More Step
                </h2>
                <p className="text-mist-lilac/80 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
                  Provide your phone number to unlock your Luminix experience
                </p>
              </div>

              {/* Info Box */}
              <div className="mb-6 p-4 bg-burnt-lilac/10 border border-burnt-lilac/30 rounded-xl">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-burnt-lilac shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-mist-lilac/90 leading-relaxed">
                      <strong className="text-burnt-lilac">Required:</strong> We need your WhatsApp number for order confirmations, shipping updates, and exclusive offers. Your privacy is protected.
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm animate-shake flex items-center gap-3">
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handlePhoneSubmit} className="space-y-6">
                <div>
                  <label className="block text-base font-medium mb-3 text-burnt-lilac">
                    WhatsApp Number <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={modalPhoneNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setModalPhoneNumber(value);
                        setError('');
                      }}
                      required
                      pattern="[0-9]{10}"
                      maxLength={10}
                      title="Please enter exactly 10 digits"
                      className="w-full px-5 py-4 bg-black/60 border-2 border-burnt-lilac/40 rounded-xl focus:border-burnt-lilac focus:outline-none transition-all duration-300 text-mist-lilac text-lg placeholder-mist-lilac/40"
                      placeholder="10-digit mobile number"
                      autoFocus
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-mist-lilac/40">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-mist-lilac/60 mt-2 flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Instant updates via WhatsApp
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-gothic py-3 sm:py-4 text-base sm:text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-burnt-lilac/20"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </span>
                  ) : (
                    'Complete Setup →'
                  )}
                </button>
              </form>

              {/* Footer Note */}
              <p className="text-center text-xs text-mist-lilac/50 mt-6">
                🔒 This information is secured and used only for order communication
              </p>
            </div>
          </div>
        </div>
        );
      })()}
      </>
    );
  }

  return (
    <>
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
                      required
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
                      required
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
    </>
  );
}

