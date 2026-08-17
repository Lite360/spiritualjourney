import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Headphones, Search } from 'lucide-react';
import { format } from 'date-fns';
import { useSEO } from '../../hooks/useSEO';

const Audio: React.FC = () => {
  const [audioItems, setAudioItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<any[]>([]);

  useSEO({
    title: 'Audio & Podcasts',
    description: 'Listen to sermons, devotionals, and spiritual conversations from Ife Dayo on Spiritual Journey.',
    url: '/audio',
  });

  useEffect(() => {
    fetchAudio();
    fetchCategories();
  }, []);

  const fetchAudio = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('audio')
      .select('id, title, description, audio_url, cover_image, duration, published_at, featured, categories(id, name)')
      .eq('status', 'published')
      .order('featured', { ascending: false })
      .order('published_at', { ascending: false });
    
    if (data) setAudioItems(data);
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('id, name');
    if (data) setCategories(data);
  };

  const filteredAudio = audioItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory ? item.categories?.id === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m} min ${s} sec`;
  };



  return (
    <div className="bg-primary-bg min-h-screen pb-20">
      {/* Header */}
      <div className="bg-secondary-dark text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-full mb-6 text-accent">
            <Headphones className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif mb-6">Audio & Podcasts</h1>
          <p className="text-lg font-sans text-white/70 max-w-2xl mx-auto">
            Listen to sermons, devotionals, and conversations on the go.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-dark/40 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search audio..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-secondary-bg rounded-full focus:outline-none focus:ring-2 focus:ring-accent font-sans"
            />
          </div>
          <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <div className="flex gap-2">
              <button 
                onClick={() => setSelectedCategory('')}
                className={`px-4 py-2 rounded-full font-sans text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === '' ? 'bg-secondary-dark text-white' : 'bg-white text-secondary-dark border border-secondary-bg hover:bg-secondary-bg'
                }`}
              >
                All
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full font-sans text-sm whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id ? 'bg-secondary-dark text-white' : 'bg-white text-secondary-dark border border-secondary-bg hover:bg-secondary-bg'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Audio List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
          </div>
        ) : filteredAudio.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-secondary-bg">
            <Headphones className="mx-auto h-16 w-16 text-secondary-dark/20 mb-4" />
            <h3 className="text-xl font-serif text-primary-text mb-2">No audio found</h3>
            <p className="text-secondary-dark/60 font-sans">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filteredAudio.map(item => (
              <div key={item.id} className="bg-white rounded-2xl p-6 border border-secondary-bg hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-start md:items-center">
                {item.cover_image ? (
                  <img 
                    src={item.cover_image} 
                    alt={item.title} 
                    className="w-full md:w-48 h-48 md:h-auto md:aspect-square object-cover rounded-xl shrink-0"
                  />
                ) : (
                  <div className="w-full md:w-48 h-48 md:h-auto md:aspect-square bg-secondary-bg rounded-xl shrink-0 flex items-center justify-center text-secondary-dark/20">
                    <Headphones className="w-16 h-16" />
                  </div>
                )}
                
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-sans text-accent uppercase tracking-wider font-semibold">
                      {item.categories?.name || 'Podcast'}
                    </span>
                    {item.featured && (
                      <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-serif text-primary-text mb-3">
                    {item.title}
                  </h3>
                  
                  {item.description && (
                    <p className="text-secondary-dark/70 font-sans text-sm line-clamp-2 mb-4">
                      {item.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm font-sans text-secondary-dark/60 mb-6">
                    {item.published_at && (
                      <span>{format(new Date(item.published_at), 'MMMM d, yyyy')}</span>
                    )}
                    {item.published_at && item.duration && <span>•</span>}
                    {item.duration && (
                      <span>{formatDuration(item.duration)}</span>
                    )}
                  </div>
                  
                  <div className="w-full">
                    {item.audio_url && (
                      <audio 
                        src={item.audio_url} 
                        controls 
                        className="w-full h-12"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Audio;
