import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { userId, email, firstName, lastName, phoneNumber } = await request.json();

    // Validate required fields
    if (!phoneNumber || phoneNumber.trim() === '') {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Validate phone number format (10 digits)
    if (!/^[0-9]{10}$/.test(phoneNumber)) {
      return NextResponse.json(
        { error: 'Phone number must be exactly 10 digits' },
        { status: 400 }
      );
    }

    // Create user profile in profiles table
    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      email,
      first_name: firstName || '',
      last_name: lastName || '',
      phone_number: phoneNumber,
      display_name: firstName || email.split('@')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Error creating profile:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Create profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
