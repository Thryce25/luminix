import { NextRequest, NextResponse } from 'next/server';

const SHOPIFY_ADMIN_API_URL = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/graphql.json`;
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const { customerId, productId } = await request.json();

    if (!customerId || !productId) {
      return NextResponse.json({ error: 'Customer ID and Product ID required' }, { status: 400 });
    }

    if (!SHOPIFY_ADMIN_ACCESS_TOKEN) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // First, get current wishlist
    const getQuery = `
      query getCustomerWishlist($id: ID!) {
        customer(id: $id) {
          id
          metafield(namespace: "custom", key: "wishlist") {
            value
          }
        }
      }
    `;

    const getResponse = await fetch(SHOPIFY_ADMIN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: getQuery,
        variables: { id: customerId },
      }),
    });

    const getData = await getResponse.json();
    const currentWishlist = getData.data?.customer?.metafield?.value;
    let productIds: string[] = currentWishlist ? JSON.parse(currentWishlist) : [];

    // Add new product if not already in wishlist
    if (!productIds.includes(productId)) {
      productIds.push(productId);
    }

    // Update metafield with new wishlist
    const updateMutation = `
      mutation updateCustomerMetafield($input: CustomerInput!) {
        customerUpdate(input: $input) {
          customer {
            id
            metafield(namespace: "custom", key: "wishlist") {
              value
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const updateResponse = await fetch(SHOPIFY_ADMIN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: updateMutation,
        variables: {
          input: {
            id: customerId,
            metafields: [
              {
                namespace: 'custom',
                key: 'wishlist',
                value: JSON.stringify(productIds),
                type: 'json',
              },
            ],
          },
        },
      }),
    });

    const updateData = await updateResponse.json();

    if (updateData.data?.customerUpdate?.userErrors?.length > 0) {
      const error = updateData.data.customerUpdate.userErrors[0];
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, productIds });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
