import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowRight, BookOpen, Search } from 'lucide-react';

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [featuredPost, setFeaturedPost] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const fetchData = async () => {
    setLoading(true);
    
    try {
      // Fetch categories
      const { data: catData } = await supabase.from('categories').select('id, name, slug');
      if (catData) setCategories(catData);

      // Build posts query
      let query = supabase
        .from('posts')
        .select('id, title, slug, excerpt, featured_image, published_at, categories(name)')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (selectedCategory) {
        // Find category ID by slug
        const categoryId = catData?.find((c: { id: string; slug: string }) => c.slug === selectedCategory)?.id;
        if (categoryId) {
          query = query.eq('category_id', categoryId);
        }
      }

      const { data: postsData, error } = await query;
      
      if (error) throw error;
      
      if (postsData) {
        // If no category filter is applied, use the first featured post as the featured display
        if (!selectedCategory) {
          const featuredData = await supabase
            .from('posts')
            .select('id, title, slug, excerpt, featured_image, published_at, categories(name)')
            .eq('status', 'published')
            .eq('featured', true)
            .order('published_at', { ascending: false })
            .limit(1)
            .single();

          if (featuredData.data) {
            setFeaturedPost(featuredData.data);
            // Filter out the featured post from the list to avoid duplication
            setPosts(postsData.filter(p => p.id !== featuredData.data?.id));
          } else {
            // If no explicit featured post, use the first one
            setFeaturedPost(postsData[0]);
            setPosts(postsData.slice(1));
          }
        } else {
          setFeaturedPost(null);
          setPosts(postsData);
        }
      }
    } catch (error) {
      console.error('Error fetching blog data:', error);
    } finally {
      setLoading(false);
    }
  };

    const filteredPosts = posts.filter((post: { title: string; excerpt?: string }) => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-primary-bg min-h-screen pb-24">
      {/* Header */}
      <section className="bg-secondary-dark text-primary-bg py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-serif mb-6">The Journey Blog</h1>
          <p className="text-lg font-sans text-primary-bg/80 max-w-2xl mx-auto mb-10">
            Biblical reflections, teachings, and honest conversations about faith, purpose, and spiritual growth.
          </p>
          
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-bg/50 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search articles..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full bg-white/10 border border-primary-bg/20 text-white placeholder-primary-bg/50 focus:outline-none focus:bg-white/20 focus:border-accent transition-colors font-sans"
            />
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="border-b border-secondary-bg bg-white sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-4 space-x-6 hide-scrollbar">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`whitespace-nowrap font-sans text-sm font-medium transition-colors ${
                selectedCategory === null ? 'text-accent' : 'text-secondary-dark/70 hover:text-secondary-dark'
              }`}
            >
              All Articles
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`whitespace-nowrap font-sans text-sm font-medium transition-colors ${
                  selectedCategory === cat.slug ? 'text-accent' : 'text-secondary-dark/70 hover:text-secondary-dark'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-20 text-secondary-dark/50">Loading articles...</div>
        ) : (
          <>
            {/* Featured Post (Only show if not searching and not filtering by category) */}
            {!searchQuery && !selectedCategory && featuredPost && (
              <div className="mb-16">
                <Link to={`/blog/${featuredPost.slug}`} className="group flex flex-col md:flex-row gap-8 items-center bg-white rounded-2xl overflow-hidden border border-secondary-bg hover:shadow-md transition-shadow">
                  <div className="w-full md:w-1/2 aspect-[4/3] md:aspect-auto md:h-full bg-secondary-bg relative overflow-hidden">
                    {featuredPost.featured_image ? (
                      <img 
                        src={featuredPost.featured_image} 
                        alt={featuredPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full min-h-[300px] flex items-center justify-center text-secondary-dark/20 group-hover:scale-105 transition-transform duration-500">
                        <BookOpen className="w-16 h-16" />
                      </div>
                    )}
                  </div>
                  <div className="w-full md:w-1/2 p-8 md:p-12">
                    <div className="flex items-center text-sm font-sans text-accent uppercase tracking-wider mb-4">
                      <span>{featuredPost.categories?.name || 'Reflection'}</span>
                      <span className="mx-2 text-secondary-dark/30">•</span>
                      <span className="text-secondary-dark/60">
                        {featuredPost.published_at ? format(new Date(featuredPost.published_at), 'MMM d, yyyy') : ''}
                      </span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-serif text-primary-text mb-4 group-hover:text-accent transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-lg text-secondary-dark/70 font-sans mb-8 line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                    <span className="inline-flex items-center text-accent font-medium font-sans">
                      Read Article <ArrowRight className="ml-2 w-5 h-5" />
                    </span>
                  </div>
                </Link>
              </div>
            )}

            {/* Posts Grid */}
            {filteredPosts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg border border-secondary-bg">
                <p className="text-secondary-dark/70 font-sans text-lg">No articles found matching your criteria.</p>
                {(searchQuery || selectedCategory) && (
                  <button 
                    onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
                    className="mt-4 text-accent hover:underline font-medium"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredPosts.map((post) => (
                  <article key={post.id} className="group">
                    <Link to={`/blog/${post.slug}`}>
                      <div className="aspect-[4/3] rounded-lg overflow-hidden bg-secondary-bg mb-6 border border-secondary-bg/50">
                        {post.featured_image ? (
                          <img 
                            src={post.featured_image} 
                            alt={post.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-secondary-dark/20 group-hover:scale-105 transition-transform duration-500">
                            <BookOpen className="w-12 h-12" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center text-xs font-sans text-accent uppercase tracking-wider mb-3">
                        <span>{post.categories?.name || 'Reflection'}</span>
                        <span className="mx-2 text-secondary-dark/30">•</span>
                        <span className="text-secondary-dark/60">
                          {post.published_at ? format(new Date(post.published_at), 'MMM d, yyyy') : ''}
                        </span>
                      </div>
                      <h3 className="text-xl font-serif text-primary-text mb-3 group-hover:text-accent transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-secondary-dark/70 font-sans line-clamp-3">
                        {post.excerpt}
                      </p>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;
