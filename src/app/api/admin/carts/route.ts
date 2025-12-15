import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Get carts with items
    const { data: carts, error: cartsError } = await supabase
      .from('carts')
      .select('*')
      .gt('total_quantity', 0)
      .order('updated_at', { ascending: false });

    if (cartsError) {
      console.warn('Error fetching carts:', cartsError);
      return NextResponse.json({ 
        users: [],
        message: 'Cart tracking table not set up yet. Please execute the SQL file in Supabase.'
      });
    }

    if (!carts || carts.length === 0) {
      return NextResponse.json({ users: [] });
    }

    // Get user IDs from carts
    const userIds = carts.map(cart => cart.user_id);

    // Fetch profiles for these users
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, phone_number, email')
      .in('id', userIds);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return NextResponse.json({ 
        users: [],
        error: profilesError.message 
      }, { status: 500 });
    }

    // Create a map of profiles for quick lookup
    const profileMap = new Map(
      (profiles || []).map(profile => [profile.id, profile])
    );

    // Combine cart data with profile data
    const users = carts
      .map((cart: any) => {
        const profile = profileMap.get(cart.user_id);
        if (!profile) return null;

        return {
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone_number: profile.phone_number,
          email: profile.email,
          cartItems: cart.items || [],
          totalQuantity: cart.total_quantity,
          lastUpdated: cart.updated_at,
        };
      })
      .filter(Boolean); // Filter out null entries

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error('Error fetching cart users:', error);
    return NextResponse.json({ 
      users: [],
      error: error.message 
    }, { status: 500 });
  }
}
