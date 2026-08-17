import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { PlayCircle, Search, Video } from 'lucide-react';
import { format } from 'date-fns';

const Teachings: React.FC = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchVideos();
    fetchCategories();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('videos')
      .select('id, title, description, video_url, thumbnail, published_at, featured, categories(id, name)')
      .eq('status', 'published')
      .order('featured', { ascending: false })
      .order('published_at', { ascending: false });
    
    if (data) setVideos(data);
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('id, name');
    if (data) setCategories(data);
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(search.toLowerCase()) || 
                          (video.description && video.description.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory ? video.categories?.id === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const getYoutubeEmbed = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  return (
    <div className="bg-primary-bg min-h-screen pb-20">
      {/* Header */}
      <div className="bg-secondary-dark text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-full mb-6 text-accent">
            <PlayCircle className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif mb-6">Teachings</h1>
          <p className="text-lg font-sans text-white/70 max-w-2xl mx-auto">
            Watch sermons, devotionals, and video teachings to grow in your faith.
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
              placeholder="Search teachings..." 
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

        {/* Video Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-secondary-bg">
            <Video className="mx-auto h-16 w-16 text-secondary-dark/20 mb-4" />
            <h3 className="text-xl font-serif text-primary-text mb-2">No videos found</h3>
            <p className="text-secondary-dark/60 font-sans">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVideos.map(video => {
              const isYoutube = video.video_url?.includes('youtube.com') || video.video_url?.includes('youtu.be');
              
              return (
                <div key={video.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-secondary-bg hover:shadow-md transition-shadow group">
                  <div className="aspect-video bg-secondary-dark relative">
                    {isYoutube ? (
                      <iframe 
                        src={getYoutubeEmbed(video.video_url)} 
                        className="w-full h-full"
                        allowFullScreen
                        title={video.title}
                      />
                    ) : (
                      <video 
                        src={video.video_url} 
                        poster={video.thumbnail}
                        controls 
                        className="w-full h-full object-cover"
                      />
                    )}
                    {video.featured && (
                      <div className="absolute top-4 right-4 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10">
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-xs font-sans text-accent uppercase tracking-wider mb-3">
                      <span>{video.categories?.name || 'Teaching'}</span>
                      {video.published_at && (
                        <>
                          <span className="mx-2 text-secondary-dark/30">•</span>
                          <span className="text-secondary-dark/60">
                            {format(new Date(video.published_at), 'MMM d, yyyy')}
                          </span>
                        </>
                      )}
                    </div>
                    <h3 className="text-xl font-serif text-primary-text mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    {video.description && (
                      <p className="text-secondary-dark/70 font-sans text-sm line-clamp-2">
                        {video.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Teachings;
