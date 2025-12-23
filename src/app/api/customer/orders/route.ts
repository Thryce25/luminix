import { NextRequest, NextResponse } from 'next/server';

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

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

    // Check if required environment variables are set
    if (!SHOPIFY_ADMIN_ACCESS_TOKEN) {
      console.error('[API Orders] SHOPIFY_ADMIN_ACCESS_TOKEN is not set');
      // Return empty orders instead of error for better UX
      return NextResponse.json({ orders: [] });
    }

    if (!SHOPIFY_STORE_DOMAIN) {
      console.error('[API Orders] SHOPIFY_STORE_DOMAIN is not set');
      return NextResponse.json({ orders: [] });
    }

    console.log('[API Orders] Using domain:', SHOPIFY_STORE_DOMAIN);

    // GraphQL query to fetch customer orders
    const query = `
      query getCustomerOrders($query: String!) {
        customers(first: 1, query: $query) {
          edges {
            node {
              id
              email
              orders(first: 50, reverse: true, sortKey: PROCESSED_AT) {
                edges {
                  node {
                    id
                    name
                    processedAt
                    financialStatus
                    fulfillmentStatus
                    totalPriceSet {
                      shopMoney {
                        amount
                        currencyCode
                      }
                    }
                    lineItems(first: 50) {
                      edges {
                        node {
                          title
                          quantity
                          variant {
                            price
                            image {
                              url
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN,
        },
        body: JSON.stringify({
          query,
          variables: { query: `email:${email}` },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Shopify API error:', response.status, errorText);
      return NextResponse.json({ orders: [] });
    }

    const data = await response.json();

    console.log('[API Orders] Shopify response:', JSON.stringify(data, null, 2));

    if (data.errors) {
      console.error('[API Orders] Shopify GraphQL errors:', data.errors);
      return NextResponse.json({ orders: [] });
    }

    const customerEdges = data.data?.customers?.edges || [];
    console.log('[API Orders] Found', customerEdges.length, 'customers');
    
    if (customerEdges.length === 0) {
      console.log('[API Orders] No customer found for email:', email);
      return NextResponse.json({ orders: [] });
    }

    const customer = customerEdges[0].node;
    const orderEdges = customer.orders?.edges || [];
    console.log('[API Orders] Customer has', orderEdges.length, 'orders');

    // Transform orders to match the frontend interface
    const orders = orderEdges.map((edge: any) => {
      const order = edge.node;
      return {
        id: order.id,
        orderNumber: parseInt(order.name.replace('#', '')),
        processedAt: order.processedAt,
        financialStatus: order.financialStatus,
        fulfillmentStatus: order.fulfillmentStatus,
        totalPrice: {
          amount: order.totalPriceSet.shopMoney.amount,
          currencyCode: order.totalPriceSet.shopMoney.currencyCode,
        },
        lineItems: {
          edges: order.lineItems.edges.map((item: any) => ({
            node: {
              title: item.node.title,
              quantity: item.node.quantity,
              variant: {
                price: {
                  amount: item.node.variant?.price || '0',
                  currencyCode: order.totalPriceSet.shopMoney.currencyCode,
                },
                image: item.node.variant?.image || null,
              },
            },
          })),
        },
      };
    });

    console.log('[API Orders] Returning', orders.length, 'formatted orders');
    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('[API Orders] Error:', error);
    // Return empty array instead of error for better UX
    return NextResponse.json({ orders: [] });
  }
}
