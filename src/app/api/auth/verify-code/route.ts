import { NextRequest, NextResponse } from 'next/server';

// Import the verification codes map from send-code route
const verificationCodes = new Map<string, { code: string; expiresAt: number; firstName?: string; lastName?: string }>();

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
const adminAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!;
const endpoint = `https://${domain}/api/2024-01/graphql.json`;
const adminEndpoint = `https://${domain}/admin/api/2024-01/graphql.json`;

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code are required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();
    const storedData = verificationCodes.get(normalizedEmail);

    // Check if code exists and hasn't expired
    if (!storedData) {
      return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 });
    }

    if (storedData.expiresAt < Date.now()) {
      verificationCodes.delete(normalizedEmail);
      return NextResponse.json({ error: 'Code has expired' }, { status: 400 });
    }

    if (storedData.code !== code) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
    }

    // Code is valid! Now check if customer exists in Shopify
    const checkQuery = `
      query checkCustomer($email: String!) {
        customers(first: 1, query: $email) {
          edges {
            node {
              id
              email
              firstName
              lastName
              displayName
            }
          }
        }
      }
    `;

    const checkResponse = await fetch(adminEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminAccessToken,
      },
      body: JSON.stringify({
        query: checkQuery,
        variables: { email: `email:${normalizedEmail}` },
      }),
    });

    const checkData = await checkResponse.json();
    let customerId: string;
    let customerData: any;

    if (checkData.data?.customers?.edges?.length > 0) {
      // Customer exists
      customerData = checkData.data.customers.edges[0].node;
      customerId = customerData.id;
    } else {
      // Create new customer using Admin API (passwordless)
      const createMutation = `
        mutation customerCreate($input: CustomerInput!) {
          customerCreate(input: $input) {
            customer {
              id
              email
              firstName
              lastName
              displayName
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const createResponse = await fetch(adminEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': adminAccessToken,
        },
        body: JSON.stringify({
          query: createMutation,
          variables: {
            input: {
              email: normalizedEmail,
              firstName: storedData.firstName || '',
              lastName: storedData.lastName || '',
              note: 'Passwordless authentication via magic link',
              tags: ['magic-link', 'passwordless'],
            },
          },
        }),
      });

      const createResult = await createResponse.json();

      if (createResult.data?.customerCreate?.userErrors?.length > 0) {
        const error = createResult.data.customerCreate.userErrors[0];
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      customerData = createResult.data?.customerCreate?.customer;
      customerId = customerData.id;
    }

    // Delete the used code
    verificationCodes.delete(normalizedEmail);

    // Create a customer access token for Storefront API access
    const tokenMutation = `
      mutation customerAccessTokenCreateWithMultipass($multipassToken: String!) {
        customerAccessTokenCreateWithMultipass(multipassToken: $multipassToken) {
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

    // For magic link auth, we'll return customer data without Storefront API token
    // The frontend will store this as a "magic link authenticated" customer
    return NextResponse.json({
      success: true,
      customer: {
        id: customerId,
        email: customerData.email,
        firstName: customerData.firstName || '',
        lastName: customerData.lastName || '',
        displayName: customerData.displayName || customerData.firstName || customerData.email,
        isMagicLinkUser: true,
      },
    });
  } catch (error) {
    console.error('Verify code error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
