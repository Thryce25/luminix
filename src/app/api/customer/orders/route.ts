import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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
