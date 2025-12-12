import { NextRequest, NextResponse } from 'next/server';

const SHOPIFY_ADMIN_API_URL = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/graphql.json`;
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!SHOPIFY_ADMIN_ACCESS_TOKEN) {
      console.error('SHOPIFY_ADMIN_ACCESS_TOKEN not configured');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Check if customer already exists first
    const checkQuery = `
      query checkCustomer($email: String!) {
        customers(first: 1, query: $email) {
          edges {
            node {
              id
              email
            }
          }
        }
      }
    `;

    const checkResponse = await fetch(SHOPIFY_ADMIN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: checkQuery,
        variables: { email: `email:${email}` },
      }),
    });

    const checkData = await checkResponse.json();

    if (checkData.data?.customers?.edges?.length > 0) {
      return NextResponse.json({
        success: true,
        alreadyExists: true,
        customerId: checkData.data.customers.edges[0].node.id,
      });
    }

    // Create customer using Admin API (no password required)
    const createMutation = `
      mutation customerCreate($input: CustomerInput!) {
        customerCreate(input: $input) {
          customer {
            id
            email
            firstName
            lastName
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const createResponse = await fetch(SHOPIFY_ADMIN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: createMutation,
        variables: {
          input: {
            email,
            firstName: firstName || '',
            lastName: lastName || '',
            note: 'OAuth user - authenticates via Google',
            tags: ['oauth', 'google-auth'],
          },
        },
      }),
    });

    const createData = await createResponse.json();

    if (createData.data?.customerCreate?.customer) {
      return NextResponse.json({
        success: true,
        customerId: createData.data.customerCreate.customer.id,
      });
    } else if (createData.data?.customerCreate?.userErrors?.length > 0) {
      const error = createData.data.customerCreate.userErrors[0];
      return NextResponse.json({
        error: error.message,
        field: error.field,
      }, { status: 400 });
    } else {
      return NextResponse.json({
        error: 'Failed to create customer',
        details: createData,
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in sync-oauth-customer API:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
