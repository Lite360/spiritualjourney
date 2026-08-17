import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowRight, BookOpen, Calendar } from 'lucide-react';
import { useSEO } from '../../hooks/useSEO';
import { getDailyVerse } from '../../data/dailyVerses';

const Home: React.FC = () => {
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [upcomingPrograms, setUpcomingPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const dailyVerse = getDailyVerse();

  useSEO({
    title: undefined, // Home uses the bare site name
    description: siteSettings?.site_description || 'Spiritual Journey is a space for biblical reflections, honest conversations, teachings and resources designed to help you grow in your walk with God.',
    url: '/',
  });

  useEffect(() => {
    fetchHomepageData();
  }, []);

  const fetchHomepageData = async () => {
    setLoading(true);

    // Fetch settings
    const { data: settingsData } = await supabase.from('site_settings').select('*').limit(1).single();
    if (settingsData) setSiteSettings(settingsData);
    
    // Fetch latest posts
    const { data: latestData } = await supabase
      .from('posts')
      .select('id, title, slug, excerpt, featured_image, published_at, categories(name)')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(3);
      
    if (latestData) setLatestPosts(latestData);

    // Fetch upcoming programs
    const { data: programsData } = await supabase
      .from('programs')
      .select('id, title, slug, description, event_date, featured_image, categories(name)')
      .eq('status', 'published')
      .gte('event_date', new Date().toISOString().split('T')[0])
      .order('event_date', { ascending: true })
      .limit(3);
      
    if (programsData) setUpcomingPrograms(programsData);

    setLoading(false);
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-secondary-dark overflow-hidden min-h-[92vh] flex items-center">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-bg.png')" }}
        />

        {/* Layered overlay: dark gradient + warm tint */}
        <div className="absolute inset-0 bg-gradient-to-b from-secondary-dark/70 via-secondary-dark/60 to-secondary-dark/80" />
        <div className="absolute inset-0 bg-accent/10 mix-blend-overlay" />

        <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          {/* Eyebrow label */}
          <div className="inline-flex items-center gap-3 mb-10">
            <span className="h-px w-8 bg-accent" />
            <span className="text-xs font-sans font-semibold tracking-[0.2em] text-accent uppercase">
              {siteSettings?.site_name || 'Spiritual Journey'}
            </span>
            <span className="h-px w-8 bg-accent" />
          </div>

          {/* Main headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif text-white leading-[1.1] tracking-tight mb-8">
            <span className="block">Finding God.</span>
            <span className="block text-white/90">Discovering Purpose.</span>
            <span className="block italic text-accent">Becoming More.</span>
          </h1>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3 my-8">
            <span className="h-px w-16 bg-white/20" />
            <span className="text-accent text-lg">✦</span>
            <span className="h-px w-16 bg-white/20" />
          </div>

          {/* Sub-copy */}
          <p className="text-lg md:text-xl text-white/75 font-sans leading-relaxed max-w-2xl mx-auto mb-12">
            {siteSettings?.site_description || 'Spiritual Journey is a space for biblical reflections, honest conversations, teachings and resources designed to help you grow in your walk with God.'}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/teachings"
              className="inline-flex items-center gap-2 px-9 py-4 bg-accent text-white text-base font-sans font-medium rounded-full hover:bg-accent/90 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Explore Teachings
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-9 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white text-base font-sans font-medium rounded-full hover:bg-white/20 transition-all duration-200"
            >
              Meet {siteSettings?.founder_name || 'Ife Dayo'}
            </Link>
          </div>

          {/* Scroll hint */}
          <div className="mt-20 flex flex-col items-center gap-2 text-white/30">
            <span className="text-xs font-sans tracking-widest uppercase">Scroll</span>
            <div className="w-px h-10 bg-white/20 animate-pulse" />
          </div>
        </div>
      </section>


      {/* Today's Word */}
      <section className="py-20 bg-secondary-dark text-primary-bg px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-sm font-sans tracking-widest text-accent uppercase mb-8">Today's Word</h2>
          <blockquote className="text-3xl md:text-4xl font-serif leading-relaxed mb-6">
            "{dailyVerse.text}"
          </blockquote>
          <p className="text-lg font-sans text-primary-bg/70 mb-10">— {dailyVerse.reference}</p>
          <Link 
            to="/blog" 
            className="inline-flex items-center text-accent hover:text-white transition-colors font-sans font-medium"
          >
            Read Reflection <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Featured Content */}
      <section className="py-24 bg-primary-bg px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12 border-b border-secondary-bg pb-6">
            <h2 className="text-3xl font-serif text-primary-text">Latest from the Journey</h2>
            <Link to="/blog" className="text-accent hover:text-secondary-dark transition-colors font-medium flex items-center">
              View all <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-20 text-secondary-dark/50">Loading content...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {latestPosts.map((post) => (
                <article key={post.id} className="group">
                  <Link to={`/blog/${post.slug}`}>
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-secondary-bg mb-6">
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
                      {post.excerpt || 'Read this reflection on Spiritual Journey...'}
                    </p>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Programs */}
      <section className="py-24 bg-white px-4 sm:px-6 lg:px-8 border-y border-secondary-bg">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12 border-b border-secondary-bg pb-6">
            <h2 className="text-3xl font-serif text-primary-text">Upcoming Programs</h2>
            <Link to="/programs" className="text-accent hover:text-secondary-dark transition-colors font-medium flex items-center">
              View all <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          {loading ? (
             <div className="text-center py-20 text-secondary-dark/50">Loading programs...</div>
          ) : upcomingPrograms.length === 0 ? (
            <div className="text-center py-20 bg-primary-bg rounded-lg">
              <Calendar className="mx-auto h-12 w-12 text-secondary-dark/30 mb-4" />
              <p className="text-secondary-dark/70 font-sans">No upcoming programs scheduled at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {upcomingPrograms.map((program) => (
                <div key={program.id} className="border border-secondary-bg rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="text-sm text-accent font-sans mb-2">
                    {program.event_date ? format(new Date(program.event_date), 'MMMM d, yyyy') : 'Date TBA'}
                  </div>
                  <h3 className="text-xl font-serif text-primary-text mb-3">{program.title}</h3>
                  <p className="text-secondary-dark/70 font-sans text-sm mb-6 line-clamp-2">
                    {program.description}
                  </p>
                  <Link 
                    to={`/programs/${program.slug}`}
                    className="inline-block px-5 py-2 border border-secondary-dark text-secondary-dark hover:bg-secondary-dark hover:text-white rounded-full text-sm font-medium transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-secondary-bg px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-primary-text mb-4">Walk With Us</h2>
          <p className="text-lg text-secondary-dark/80 font-sans mb-10">
            Receive new reflections, teachings and resources directly in your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              required
              className="flex-grow px-5 py-3 rounded-full border border-secondary-dark/20 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-sans bg-white"
            />
            <button 
              type="submit"
              className="px-8 py-3 bg-secondary-dark text-white font-medium rounded-full hover:bg-secondary-dark/90 transition-colors whitespace-nowrap"
            >
              Join the Journey
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
