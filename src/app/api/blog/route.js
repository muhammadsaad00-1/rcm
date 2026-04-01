/**
 * GET /api/blog
 * Returns all published blog posts
 * 
 * Query params:
 * - limit: Number of posts (default: 20)
 * - offset: Pagination offset (default: 0)
 * - category: Filter by category (optional)
 */

import { createClient } from '@/lib/supabase/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = parseInt(searchParams.get('offset')) || 0;
    const category = searchParams.get('category');

    const supabase = await createClient();

    // Build query
    let query = supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .eq('published', true)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq('category', category);
    }

    const { data, count, error } = await query;

    if (error) {
      console.error('Blog fetch error:', error);
      // Return hardcoded posts if DB is not configured yet
      return Response.json(defaultBlogPosts(), { status: 200 });
    }

    return Response.json(
      {
        posts: data || [],
        total: count || 0,
        limit,
        offset
      },
      { status: 200 }
    );

  } catch (err) {
    console.error('Blog API error:', err);
    // Fallback to hardcoded posts
    return Response.json(defaultBlogPosts(), { status: 200 });
  }
}

// Fallback hardcoded posts for when DB is not configured
function defaultBlogPosts() {
  return {
    posts: [
      {
        id: 1,
        title: '2025 CPT Code Changes: Complete Guide for Medical Billers',
        slug: 'cpt-code-changes-2025',
        category: 'Coding Updates',
        description: 'Comprehensive breakdown of 400+ CPT code additions, deletions, and revisions effective January 2025.',
        imageUrl: '/images/blog/cpt-codes.jpg',
        content: '...',
        author: 'ClearClaim Coding Team',
        publishedAt: '2025-01-08',
        readTime: '8 min read',
        featured: true
      },
      {
        id: 2,
        title: 'Top 10 Claim Denial Reasons in 2024 — And How to Prevent Every One',
        slug: 'top-denial-reasons-2024',
        category: 'Denial Management',
        description: 'Data from 2.8 billion claims processed: here are the exact denial patterns costing practices the most.',
        imageUrl: '/images/blog/denials.jpg',
        content: '...',
        author: 'Denial Management Team',
        publishedAt: '2024-12-15',
        readTime: '11 min read',
        featured: true
      },
      {
        id: 3,
        title: 'KPI Benchmarks Every Practice Should Track in 2025',
        slug: 'kpi-benchmarks-2025',
        category: 'Revenue Cycle',
        description: 'The 12 key performance indicators that separate high-performing practices from those leaving money on the table.',
        imageUrl: '/images/blog/kpis.jpg',
        content: '...',
        author: 'Analytics Team',
        publishedAt: '2024-11-28',
        readTime: '7 min read',
        featured: false
      }
    ],
    total: 3
  };
}
