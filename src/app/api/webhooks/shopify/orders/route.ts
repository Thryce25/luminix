import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';

const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET;

// Verify Shopify webhook signature
function verifyShopifyWebhook(body: string, hmacHeader: string): boolean {
  if (!SHOPIFY_WEBHOOK_SECRET) {
    console.error('[Webhook] SHOPIFY_WEBHOOK_SECRET not configured');
    return false;
  }

  const hash = crypto
    .createHmac('sha256', SHOPIFY_WEBHOOK_SECRET)
    .update(body, 'utf8')
    .digest('base64');

  return hash === hmacHeader;
}

export async function POST(request: NextRequest) {
  try {
    // Get the raw body for signature verification
    const body = await request.text();
    const hmacHeader = request.headers.get('x-shopify-hmac-sha256');

    console.log('[Webhook] Received order webhook');

    // Verify webhook signature
    if (!hmacHeader || !verifyShopifyWebhook(body, hmacHeader)) {
      console.error('[Webhook] Invalid signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const orderData = JSON.parse(body);
    console.log('[Webhook] Order received:', orderData.id, 'for', orderData.email);

    // Extract order information
    const order = {
      shopify_order_id: orderData.id.toString(),
      order_number: orderData.order_number?.toString() || orderData.name?.replace('#', ''),
      customer_email: orderData.email || orderData.contact_email,
      customer_name: orderData.customer
        ? `${orderData.customer.first_name || ''} ${orderData.customer.last_name || ''}`.trim()
        : orderData.billing_address?.name || 'Guest',
      customer_phone: orderData.customer?.phone || orderData.billing_address?.phone || null,
      total_price: parseFloat(orderData.total_price || '0'),
      currency: orderData.currency || 'INR',
      financial_status: orderData.financial_status,
      fulfillment_status: orderData.fulfillment_status,
      line_items: orderData.line_items.map((item: any) => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        variant_id: item.variant_id,
        variant_title: item.variant_title,
        product_id: item.product_id,
        image_url: item.image?.src || null,
      })),
      shipping_address: orderData.shipping_address || null,
      billing_address: orderData.billing_address || null,
      order_status_url: orderData.order_status_url,
      processed_at: orderData.processed_at || orderData.created_at,
    };

    if (!order.customer_email) {
      console.warn('[Webhook] Order has no email, skipping:', order.shopify_order_id);
      return NextResponse.json({ success: true, message: 'No email, skipped' });
    }

    // Use service role client to bypass RLS
    const supabase = await createClient();

    // Upsert order (insert or update if exists)
    const { error } = await supabase
      .from('orders')
      .upsert(order, {
        onConflict: 'shopify_order_id',
        ignoreDuplicates: false,
      });

    if (error) {
      console.error('[Webhook] Error saving order:', error);
      return NextResponse.json(
        { error: 'Failed to save order' },
        { status: 500 }
      );
    }

    console.log('[Webhook] Order saved successfully:', order.order_number);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Webhook] Error processing webhook:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
