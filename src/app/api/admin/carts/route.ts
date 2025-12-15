import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Get all users with their profile information
    const { data: users, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, phone_number, email, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ users: users || [] });
  } catch (error: any) {
    console.error('Error fetching users for cart reminders:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
