import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

async function getAdminUser(supabase) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { error: 'Unauthorized', status: 401 };

  const { data: userData } = await supabase
    .from('users').select('id, role, is_active').eq('id', user.id).single();

  if (!userData || userData.role !== 'admin') {
    return { error: 'Admin access required', status: 403 };
  }
  if (!userData.is_active) return { error: 'Account inactive', status: 403 };

  return { user, userData };
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { error, status } = await getAdminUser(supabase);
    if (error) return NextResponse.json({ error }, { status });

    const { data, error: fetchError } = await supabase
      .from('users').select('*').eq('id', id).single();

    if (fetchError || !data) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { user, error, status } = await getAdminUser(supabase);
    if (error) return NextResponse.json({ error }, { status });

    // Prevent admin from deactivating their own account
    if (id === user.id) {
      const body = await request.json();
      if (body.is_active === false) {
        return NextResponse.json({ error: 'You cannot deactivate your own account' }, { status: 400 });
      }
    }

    const body = await request.json();
    const allowed = ['full_name', 'phone', 'role', 'is_active'];
    const updates = {};
    for (const key of allowed) {
      if (key in body) updates[key] = body[key];
    }

    const validRoles = ['admin', 'billing', 'finance', 'support'];
    if (updates.role && !validRoles.includes(updates.role)) {
      return NextResponse.json({ error: `Role must be one of: ${validRoles.join(', ')}` }, { status: 400 });
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const { data, error: updateError } = await supabase
      .from('users').update(updates).eq('id', id).select().single();

    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 400 });

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { user, error, status } = await getAdminUser(supabase);
    if (error) return NextResponse.json({ error }, { status });

    if (id === user.id) {
      return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 });
    }

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
      return NextResponse.json({ error: 'Service role key not configured' }, { status: 500 });
    }

    const supabaseAdmin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey);

    // Delete from public.users first (cascade will handle related data if FK set up)
    await supabase.from('users').delete().eq('id', id);

    // Delete from auth.users
    const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (authDeleteError) return NextResponse.json({ error: authDeleteError.message }, { status: 400 });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
