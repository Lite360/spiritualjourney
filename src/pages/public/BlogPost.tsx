import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { ArrowLeft, Share2 } from 'lucide-react';
import DOMPurify from 'dompurify';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          categories(name),
          profiles(full_name, avatar_url)
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error || !data) {
        navigate('/blog');
        return;
      }

      setPost(data);
      
      // Update document title for basic SEO
      if (data.seo_title || data.title) {
        document.title = `${data.seo_title || data.title} | Spiritual Journey`;
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-bg">
        <div className="text-secondary-dark/60 font-sans">Loading article...</div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="bg-primary-bg min-h-screen pb-24">
      {/* Featured Image Header */}
      {post.featured_image ? (
        <div className="w-full h-[50vh] md:h-[60vh] relative bg-secondary-dark">
          <img 
            src={post.featured_image} 
            alt={post.title}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-bg via-transparent to-transparent"></div>
        </div>
      ) : (
        <div className="w-full h-32 bg-primary-bg"></div> // Spacer if no image
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="bg-white rounded-2xl shadow-sm border border-secondary-bg p-8 md:p-12 mb-12">
          
          {/* Article Header Info */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center text-sm font-sans text-accent uppercase tracking-wider">
              <span>{post.categories?.name || 'Reflection'}</span>
              <span className="mx-2 text-secondary-dark/30">•</span>
              <span className="text-secondary-dark/60">
                {post.published_at ? format(new Date(post.published_at), 'MMMM d, yyyy') : ''}
              </span>
            </div>
            
            <button 
              onClick={handleShare}
              className="p-2 text-secondary-dark/50 hover:text-accent transition-colors rounded-full hover:bg-primary-bg/50"
              title="Share Article"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif text-primary-text mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Author Info */}
          <div className="flex items-center border-y border-secondary-bg py-6 mb-10">
            <div className="w-12 h-12 rounded-full bg-secondary-bg mr-4 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center">
              {post.profiles?.avatar_url ? (
                <img src={post.profiles.avatar_url} alt={post.profiles?.full_name || 'Author'} className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-serif text-secondary-dark">
                  {(post.profiles?.full_name || 'Spiritual Journey').charAt(0)}
                </span>
              )}
            </div>
            <div>
              <p className="font-sans font-medium text-primary-text">
                {post.profiles?.full_name || 'Spiritual Journey'}
              </p>
              {post.reading_time && (
                <p className="text-sm font-sans text-secondary-dark/60">{post.reading_time} min read</p>
              )}
            </div>
          </div>

          {/* Article Content */}
          <div 
            className="prose prose-lg prose-stone max-w-none font-sans text-primary-text prose-headings:font-serif prose-headings:font-normal prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-blockquote:border-l-accent prose-blockquote:bg-primary-bg/30 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:not-italic prose-blockquote:rounded-r-lg"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content || '') }}
          />

        </div>

        {/* Back Link */}
        <div className="flex justify-center">
          <Link 
            to="/blog"
            className="inline-flex items-center text-secondary-dark hover:text-accent transition-colors font-medium font-sans"
          >
            <ArrowLeft className="mr-2 w-4 h-4" /> Back to all articles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
