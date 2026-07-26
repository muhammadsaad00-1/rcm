import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function updateSession(request) {
  // If Supabase env vars aren't configured, pass the request through without auth
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    const protectedRoutes = ['/dashboard', '/admin', '/billing', '/patients', '/claims', '/payments']
    const isProtected = protectedRoutes.some(r => request.nextUrl.pathname.startsWith(r))
    if (isProtected) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      return NextResponse.redirect(url)
    }
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    const protectedRoutes = ['/dashboard', '/admin', '/billing', '/patients', '/claims', '/payments']
    const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))

    if (isProtectedRoute && !user) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      url.searchParams.set('redirectTo', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    return supabaseResponse

  } catch (err) {
    // Supabase unreachable — allow public pages, block protected routes
    console.error('Middleware Supabase error:', err.message)
    const protectedRoutes = ['/dashboard', '/admin', '/billing', '/patients', '/claims', '/payments']
    const isProtected = protectedRoutes.some(r => request.nextUrl.pathname.startsWith(r))
    if (isProtected) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      return NextResponse.redirect(url)
    }
    return NextResponse.next({ request })
  }
}
