import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Try to get users with cart data (if carts table exists)
    const { data: carts, error } = await supabase
      .from('carts')
      .select(`
        id,
        items,
        total_quantity,
        updated_at,
        profiles!user_id (
          id,
          first_name,
          last_name,
          phone_number,
          email
        )
      `)
      .gt('total_quantity', 0)
      .order('updated_at', { ascending: false });

    if (error) {
      // If carts table doesn't exist yet, return empty array with helpful message
      console.warn('Carts table not found. Please execute supabase-cart-tracking.sql first.');
      return NextResponse.json({ 
        users: [],
        message: 'Cart tracking table not set up yet. Please execute the SQL file in Supabase.'
      });
    }

    // Transform data to match expected format
    const users = (carts || []).map((cart: any) => ({
      id: cart.profiles?.id,
      first_name: cart.profiles?.first_name,
      last_name: cart.profiles?.last_name,
      phone_number: cart.profiles?.phone_number,
      email: cart.profiles?.email,
      cartItems: cart.items || [],
      totalQuantity: cart.total_quantity,
      lastUpdated: cart.updated_at,
    })).filter((user: any) => user.id); // Filter out any null profiles

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error('Error fetching cart users:', error);
    return NextResponse.json({ 
      users: [],
      error: error.message 
    }, { status: 500 });
  }
}
