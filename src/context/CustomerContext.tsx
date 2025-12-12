'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';

interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  isOAuthUser?: boolean;
}

interface CustomerContextType {
  customer: Customer | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  getAccountUrl: () => string;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

const CUSTOMER_TOKEN_KEY = 'shopify_customer_token';
const CUSTOMER_DATA_KEY = 'shopify_customer_data';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '';
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';

// GraphQL mutations for customer authentication
const CUSTOMER_CREATE_MUTATION = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
        displayName
        createdAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_QUERY = `
  query customer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      email
      firstName
      lastName
      displayName
    }
  }
`;

async function shopifyCustomerFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await response.json();
  
  if (json.errors) {
    console.error('Shopify Customer API Error:', json.errors);
    throw new Error(json.errors[0]?.message || 'API Error');
  }
  
  return json.data;
}

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { data: session, status } = useSession();

  const logout = useCallback(() => {
    // Sign out of OAuth if applicable
    if (customer?.isOAuthUser) {
      signOut({ callbackUrl: '/account' });
    }
    // Clear Shopify session
    localStorage.removeItem(CUSTOMER_TOKEN_KEY);
    localStorage.removeItem(CUSTOMER_DATA_KEY);
    setAccessToken(null);
    setCustomer(null);
  }, [customer]);

  // Load OAuth user or Shopify customer
  useEffect(() => {
    const loadCustomer = async () => {
      try {
        // Check for OAuth session first
        if (status === 'authenticated' && session?.user) {
          const oauthUser: Customer = {
            id: session.user.id || '',
            email: session.user.email || '',
            firstName: session.user.name?.split(' ')[0] || '',
            lastName: session.user.name?.split(' ').slice(1).join(' ') || '',
            displayName: session.user.name || '',
            isOAuthUser: true,
          };
          console.log('OAuth user authenticated:', oauthUser);
          
          // Check if this OAuth user has been synced to Shopify before
          const syncedKey = `shopify_synced_${session.user.email}`;
          const alreadySynced = localStorage.getItem(syncedKey);
          
          // If not synced yet, create them in Shopify (without login capability)
          if (!alreadySynced && oauthUser.email) {
            try {
              console.log('Creating Shopify customer for OAuth user...');
              const createData = await shopifyCustomerFetch<{
                customerCreate: {
                  customer: { id: string } | null;
                  customerUserErrors: Array<{ message: string; code: string }>;
                };
              }>(CUSTOMER_CREATE_MUTATION, {
                input: {
                  email: oauthUser.email,
                  firstName: oauthUser.firstName,
                  lastName: oauthUser.lastName,
                  acceptsMarketing: false,
                  // No password - this customer can only sign in via OAuth
                },
              });

              if (createData.customerCreate.customer) {
                console.log('Successfully created Shopify customer:', createData.customerCreate.customer.id);
                localStorage.setItem(syncedKey, 'true');
              } else if (createData.customerCreate.customerUserErrors.length > 0) {
                const error = createData.customerCreate.customerUserErrors[0];
                // If email is taken, that's fine - customer already exists
                if (error.code === 'TAKEN') {
                  console.log('Shopify customer already exists');
                  localStorage.setItem(syncedKey, 'true');
                } else {
                  console.error('Failed to create Shopify customer:', error.message);
                }
              }
            } catch (error) {
              console.error('Error syncing OAuth user to Shopify:', error);
              // Continue anyway - OAuth user can still use the site
            }
          }
          
          setCustomer(oauthUser);
          setLoading(false);
          return;
        }

        // If explicitly not authenticated, clear loading
        if (status === 'unauthenticated') {
          setLoading(false);
        }

        // Fall back to Shopify authentication
        const token = localStorage.getItem(CUSTOMER_TOKEN_KEY);
        const storedCustomer = localStorage.getItem(CUSTOMER_DATA_KEY);
        
        if (token && storedCustomer) {
          setAccessToken(token);
          setCustomer(JSON.parse(storedCustomer));
          
          // Verify token is still valid by fetching customer data
          try {
            const data = await shopifyCustomerFetch<{ customer: Customer | null }>(CUSTOMER_QUERY, {
              customerAccessToken: token,
            });
            
            if (data.customer) {
              setCustomer(data.customer);
              localStorage.setItem(CUSTOMER_DATA_KEY, JSON.stringify(data.customer));
            } else {
              // Token expired or invalid
              logout();
            }
          } catch {
            // Token invalid, clear it
            logout();
          }
        }
      } catch (error) {
        console.error('Failed to load customer:', error);
      } finally {
        setLoading(false);
      }
    };

    if (status !== 'loading') {
      loadCustomer();
    }
  }, [logout, session, status]);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Create access token
      const tokenData = await shopifyCustomerFetch<{
        customerAccessTokenCreate: {
          customerAccessToken: { accessToken: string; expiresAt: string } | null;
          customerUserErrors: Array<{ message: string }>;
        };
      }>(CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION, {
        input: { email, password },
      });

      const { customerAccessToken, customerUserErrors } = tokenData.customerAccessTokenCreate;

      if (customerUserErrors.length > 0) {
        return { success: false, error: customerUserErrors[0].message };
      }

      if (!customerAccessToken) {
        return { success: false, error: 'Failed to create access token' };
      }

      // Save token
      const token = customerAccessToken.accessToken;
      localStorage.setItem(CUSTOMER_TOKEN_KEY, token);
      setAccessToken(token);

      // Fetch customer data
      const customerData = await shopifyCustomerFetch<{ customer: Customer }>(CUSTOMER_QUERY, {
        customerAccessToken: token,
      });

      if (customerData.customer) {
        setCustomer(customerData.customer);
        localStorage.setItem(CUSTOMER_DATA_KEY, JSON.stringify(customerData.customer));
        return { success: true };
      }

      return { success: false, error: 'Failed to fetch customer data' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Invalid email or password' };
    }
  }, []);

  const register = useCallback(async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Create customer with acceptsMarketing flag
      const createData = await shopifyCustomerFetch<{
        customerCreate: {
          customer: Customer | null;
          customerUserErrors: Array<{ message: string; code: string }>;
        };
      }>(CUSTOMER_CREATE_MUTATION, {
        input: { 
          email, 
          password, 
          firstName, 
          lastName,
          acceptsMarketing: false  // Set to true if you want them opted into marketing
        },
      });

      const { customer: newCustomer, customerUserErrors } = createData.customerCreate;

      if (customerUserErrors.length > 0) {
        const error = customerUserErrors[0];
        console.error('Customer creation error:', error);
        if (error.code === 'TAKEN') {
          return { success: false, error: 'An account with this email already exists' };
        }
        return { success: false, error: error.message };
      }

      if (newCustomer) {
        console.log('Customer created successfully:', newCustomer);
        // Auto-login after registration
        return await login(email, password);
      }

      return { success: false, error: 'Failed to create customer account' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Failed to create account. Please try again.' };
    }
  }, [login]);

  // Get Shopify hosted account URL for orders/addresses
  const getAccountUrl = useCallback(() => {
    return `https://${domain}/account`;
  }, []);

  // User is authenticated if they have a customer object (either OAuth or Shopify)
  const isAuthenticated = !!customer && (!!accessToken || !!customer.isOAuthUser);

  return (
    <CustomerContext.Provider
      value={{
        customer,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        getAccountUrl,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
}
