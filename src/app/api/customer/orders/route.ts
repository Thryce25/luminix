import { NextRequest, NextResponse } from 'next/server';

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // GraphQL query to fetch customer orders
    const query = `
      query getCustomerOrders($email: String!) {
        customers(first: 1, query: $email) {
          edges {
            node {
              id
              email
              orders(first: 50, reverse: true) {
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
          variables: { email: `email:${email}` },
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from Shopify');
    }

    const data = await response.json();

    if (data.errors) {
      console.error('Shopify GraphQL errors:', data.errors);
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }

    const customerEdges = data.data?.customers?.edges || [];
    
    if (customerEdges.length === 0) {
      return NextResponse.json({ orders: [] });
    }

    const customer = customerEdges[0].node;
    const orderEdges = customer.orders?.edges || [];

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

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
