import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

async function getProductHandle(productId: string): Promise<string | null> {
  try {
    const query = `
      query getProduct($id: ID!) {
        product(id: $id) {
          handle
        }
      }
    `;

    const response = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/api/2024-10/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
        },
        body: JSON.stringify({
          query,
          variables: { id: `gid://shopify/Product/${productId}` },
        }),
      }
    );

    const data = await response.json();
    return data.data?.product?.handle || null;
  } catch (error) {
    console.error('[getProductHandle] Error:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    console.log('[API Orders] Request received for email:', email);

    if (!email) {
      console.log('[API Orders] No email provided');
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Fetch orders from Supabase
    const supabase = await createClient();
    
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_email', email)
      .order('processed_at', { ascending: false });

    if (error) {
      console.error('[API Orders] Supabase error:', error);
      return NextResponse.json({ orders: [] });
    }

    console.log('[API Orders] Found', orders?.length || 0, 'orders for', email);

    // Get unique product IDs
    const productIds = new Set<string>();
    orders?.forEach(order => {
      order.line_items?.forEach((item: any) => {
        if (item.product_id) {
          productIds.add(item.product_id);
        }
      });
    });

    // Fetch product handles
    const productHandles = new Map<string, string>();
    for (const productId of productIds) {
      const handle = await getProductHandle(productId);
      if (handle) {
        productHandles.set(productId, handle);
      }
    }

    // Transform to match frontend interface
    const formattedOrders = (orders || []).map((order) => ({
      id: order.shopify_order_id,
      orderNumber: parseInt(order.order_number),
      processedAt: order.processed_at,
      financialStatus: order.financial_status,
      fulfillmentStatus: order.fulfillment_status || 'UNFULFILLED',
      totalPrice: {
        amount: order.total_price.toString(),
        currencyCode: order.currency,
      },
      lineItems: {
        edges: order.line_items.map((item: any) => ({
          node: {
            title: item.title,
            quantity: item.quantity,
            productId: item.product_id,
            productHandle: item.product_id ? productHandles.get(item.product_id) || null : null,
            variant: {
              price: {
                amount: item.price,
                currencyCode: order.currency,
              },
              image: item.image_url ? { url: item.image_url } : null,
            },
          },
        })),
      },
    }));

    console.log('[API Orders] Returning', formattedOrders.length, 'formatted orders');
    return NextResponse.json({ orders: formattedOrders });
  } catch (error: any) {
    console.error('[API Orders] Error:', error);
    return NextResponse.json({ orders: [] });
  }
}
