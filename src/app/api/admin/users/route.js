import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const supabase = await createClient();

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userData?.role !== 'admin') {
      return NextResponse.json({ error: 'Only admins can create users' }, { status: 403 });
    }

    // Get form data
    const body = await request.json();
    const { fullName, email, phone, role, password } = body;

    // Validate required fields
    if (!fullName || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if service role key is available
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (serviceRoleKey) {
      // Use admin client to create user without email confirmation
      const supabaseAdmin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        serviceRoleKey
      );

      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
        }
      });

      if (authError) {
        return NextResponse.json({ error: authError.message }, { status: 400 });
      }

      // Update user profile with role
      const { error: profileError } = await supabaseAdmin
        .from('users')
        .update({
          full_name: fullName,
          phone: phone || null,
          role: role,
          is_active: true
        })
        .eq('id', authData.user.id);

      if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 400 });
      }

      return NextResponse.json({ 
        success: true, 
        message: 'User created successfully',
        userId: authData.user.id 
      });

    } else {
      // Fallback: use regular signUp (user will need to confirm email)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (authError) {
        return NextResponse.json({ error: authError.message }, { status: 400 });
      }

      if (!authData.user) {
        return NextResponse.json({ 
          error: 'User created but needs email confirmation. Add SUPABASE_SERVICE_ROLE_KEY to .env.local for auto-confirm.' 
        }, { status: 400 });
      }

      // Update user profile
      const { error: profileError } = await supabase
        .from('users')
        .update({
          full_name: fullName,
          phone: phone || null,
          role: role,
          is_active: true
        })
        .eq('id', authData.user.id);

      if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 400 });
      }

      return NextResponse.json({ 
        success: true, 
        message: 'User created successfully (email confirmation may be required)',
        userId: authData.user.id 
      });
    }

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
