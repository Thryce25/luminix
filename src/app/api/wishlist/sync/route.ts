import { NextRequest, NextResponse } from 'next/server';

const SHOPIFY_ADMIN_API_URL = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/graphql.json`;
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const { customerId } = await request.json();

    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID required' }, { status: 400 });
    }

    if (!SHOPIFY_ADMIN_ACCESS_TOKEN) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Query to get customer metafield
    const query = `
      query getCustomerWishlist($id: ID!) {
        customer(id: $id) {
          id
          metafield(namespace: "custom", key: "wishlist") {
            value
          }
        }
      }
    `;

    const response = await fetch(SHOPIFY_ADMIN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables: { id: customerId },
      }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error('Shopify API Error:', data.errors);
      return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
    }

    // Parse wishlist from metafield
    const wishlistValue = data.data?.customer?.metafield?.value;
    const productIds = wishlistValue ? JSON.parse(wishlistValue) : [];

    return NextResponse.json({ success: true, productIds });
  } catch (error) {
    console.error('Error syncing wishlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
