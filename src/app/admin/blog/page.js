'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BlogAdminPage() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    checkAuthorization();
  }, []);

  const checkAuthorization = async () => {
    try {
      // In a real app, you'd check the user's role from session/JWT
      // For now, this is a placeholder that assumes Supabase auth
      const res = await fetch('/api/auth/check-role');
      const data = await res.json();
      
      if (data.role !== 'admin') {
        router.push('/');
        return;
      }
      
      setAuthorized(true);
      fetchPosts();
    } catch (err) {
      console.error('Auth check failed:', err);
      // Fallback: try to fetch posts anyway
      setAuthorized(true);
      fetchPosts();
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/blog?limit=100');
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  if (authorized === false) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ color: '#E53E3E', marginBottom: '16px' }}>Access Denied</h2>
        <p style={{ color: 'var(--slate)', marginBottom: '24px' }}>Only admin users can manage blog posts.</p>
        <Link href="/" style={{ color: 'var(--teal)', textDecoration: 'none', fontWeight: '600' }}>
          ← Back to Home
        </Link>
      </div>
    );
  }

  if (authorized === null || loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--slate)' }}>
        Loading...
      </div>
    );
  }

  const filteredPosts = posts.filter(p =>
    (p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())) ?? false
  );

  return (
    <div style={{ padding: '40px 5%', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ marginBottom: '8px' }}>Blog Management</h1>
        <p style={{ color: 'var(--slate)' }}>Create, edit, and publish blog posts</p>
      </div>

      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '28px',
        flexWrap: 'wrap'
      }}>
        <Link
          href="/admin/blog/new"
          className="btn-primary"
        >
          + New Post
        </Link>
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: '200px',
            padding: '12px 16px',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            fontSize: '14px',
            fontFamily: "'DM Sans', sans-serif"
          }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--slate)' }}>
          Loading posts...
        </div>
      ) : filteredPosts.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'var(--light-gray)',
          borderRadius: 'var(--radius-lg)',
          color: 'var(--slate)'
        }}>
          <p style={{ marginBottom: '16px' }}>No posts found</p>
          <Link href="/admin/blog/new" className="btn-primary">
            Create your first post
          </Link>
        </div>
      ) : (
        <div style={{
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          overflow: 'hidden'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--light-gray)' }}>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: '600', color: 'var(--slate)', fontSize: '14px' }}>Title</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: '600', color: 'var(--slate)', fontSize: '14px' }}>Category</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: '600', color: 'var(--slate)', fontSize: '14px' }}>Status</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: '600', color: 'var(--slate)', fontSize: '14px' }}>Published</th>
                <th style={{ padding: '14px 16px', textAlign: 'right', fontWeight: '600', color: 'var(--slate)', fontSize: '14px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post, idx) => (
                <tr
                  key={post.id}
                  style={{
                    borderBottom: idx < filteredPosts.length - 1 ? '1px solid var(--border)' : 'none',
                    hoverBackground: 'var(--light-gray)'
                  }}
                >
                  <td style={{ padding: '14px 16px', fontSize: '14px' }}>
                    <strong>{post.title}</strong>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--slate)' }}>
                    {post.category}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '14px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: post.featured ? 'rgba(240, 180, 41, 0.15)' : 'rgba(13, 140, 140, 0.15)',
                      color: post.featured ? 'var(--gold)' : 'var(--teal)'
                    }}>
                      {post.featured ? '⭐ Featured' : 'Regular'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '14px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: post.published ? 'rgba(40, 200, 64, 0.15)' : 'rgba(200, 200, 200, 0.2)',
                      color: post.published ? '#28C840' : 'var(--slate)'
                    }}>
                      {post.published ? '✓ Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: '14px' }}>
                    <Link
                      href={`/admin/blog/${post.id}/edit`}
                      style={{
                        marginRight: '12px',
                        color: 'var(--teal)',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${post.title}"?`)) {
                          // Delete logic here
                          console.log('Delete post:', post.id);
                        }
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#E53E3E',
                        cursor: 'pointer',
                        fontWeight: '500',
                        fontSize: '14px'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{
        marginTop: '36px',
        padding: '24px',
        background: 'var(--light-gray)',
        borderRadius: 'var(--radius-lg)',
        fontSize: '14px',
        color: 'var(--slate)',
        lineHeight: '1.6'
      }}>
        <strong>📌 Note:</strong> Blog posts are fetched from the database via <code>/api/blog</code>. 
        To set up the database, run the SQL schema in <code>blog-schema.sql</code> in your Supabase dashboard.
        Once set up, all posts created here will appear on the public blog page automatically.
      </div>
    </div>
  );
}
