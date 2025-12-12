import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { userId, email, firstName, lastName, phoneNumber } = await request.json();

    // Check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is expected for new users
      console.error('Error checking profile:', checkError);
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }

    // If profile doesn't exist, create it (OAuth signup)
    if (!existingProfile) {
      const { error: insertError } = await supabase.from('profiles').insert({
        id: userId,
        email,
        first_name: firstName || '',
        last_name: lastName || '',
        phone_number: phoneNumber || 'NOT_PROVIDED', // Try to use OAuth phone or placeholder
        display_name: firstName || email.split('@')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (insertError) {
        console.error('Error creating OAuth profile:', insertError);
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }

      return NextResponse.json({ 
        success: true, 
        isNewUser: true,
        needsPhone: !phoneNumber,
        message: 'Profile created for OAuth user'
      });
    }

    // Check if existing user needs phone number
    const needsPhone = !existingProfile.phone_number || existingProfile.phone_number === 'NOT_PROVIDED';

    // Existing user
    return NextResponse.json({ 
      success: true, 
      isNewUser: false,
      needsPhone,
      message: 'Existing user authenticated'
    });

  } catch (error: any) {
    console.error('OAuth callback error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
