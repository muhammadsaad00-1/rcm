'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

/**
 * BlogPosts component
 * Fetches and displays blog posts from /api/blog
 * 
 * Props:
 * - limit: Number of posts to display (default: 6)
 * - category: Filter by category (optional)
 * - featured: Show only featured posts (default: false)
 */
export default function BlogPosts({ limit = 6, category = null, featured = false }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const params = new URLSearchParams();
        params.set('limit', limit);
        if (category) params.set('category', category);

        const res = await fetch(`/api/blog?${params}`);
        const data = await res.json();
        
        let displayPosts = data.posts || [];
        if (featured) {
          displayPosts = displayPosts.filter(p => p.featured);
        }
        
        setPosts(displayPosts.slice(0, limit));
      } catch (err) {
        console.error('Failed to fetch blog posts:', err);
        setPosts([]); // Fallback to empty
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [limit, category, featured]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>;
  }

  return (
    <div className="blog-grid">
      {posts.length === 0 ? (
        <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--slate)' }}>
          No posts found.
        </p>
      ) : (
        posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="blog-card"
            style={{
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            {post.imageUrl && (
              <div
                className="blog-thumb"
                style={{
                  backgroundImage: `url(${post.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: '180px'
                }}
              ></div>
            )}
            <div className="blog-body">
              <div className="blog-cat">{post.category}</div>
              <h3>{post.title}</h3>
              <p>{post.description}</p>
              <div className="blog-meta">
                <span>{post.publishedAt}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
