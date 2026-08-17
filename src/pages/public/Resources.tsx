import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { FileText, Search, Download, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { useSEO } from '../../hooks/useSEO';

const Resources: React.FC = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');

  useSEO({
    title: 'Resources',
    description: 'Download devotionals, reading plans, books, eBooks, and study guides to help you grow spiritually.',
    url: '/resources',
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('resources')
      .select('id, title, description, resource_type, resource_url, purchase_url, price, cover_image, published_at, featured')
      .eq('status', 'published')
      .order('featured', { ascending: false })
      .order('published_at', { ascending: false });
    
    if (data) setResources(data);
    setLoading(false);
  };

  const filteredResources = resources.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
    const matchesType = selectedType ? item.resource_type === selectedType : true;
    return matchesSearch && matchesType;
  });

  const resourceTypes = [
    { id: 'ebook', label: 'eBooks' },
    { id: 'pdf', label: 'PDFs' },
    { id: 'book', label: 'Books' },
    { id: 'course', label: 'Courses' },
    { id: 'guide', label: 'Guides' },
  ];

  const getTypeLabel = (type: string) => {
    return resourceTypes.find(t => t.id === type)?.label || type;
  };

  return (
    <div className="bg-primary-bg min-h-screen pb-20">
      {/* Header */}
      <div className="bg-secondary-dark text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-full mb-6 text-accent">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif mb-6">Resources</h1>
          <p className="text-lg font-sans text-white/70 max-w-2xl mx-auto">
            Downloadable devotionals, reading plans, books, and study guides.
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
              placeholder="Search resources..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-secondary-bg rounded-full focus:outline-none focus:ring-2 focus:ring-accent font-sans"
            />
          </div>
          <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <div className="flex gap-2">
              <button 
                onClick={() => setSelectedType('')}
                className={`px-4 py-2 rounded-full font-sans text-sm whitespace-nowrap transition-colors ${
                  selectedType === '' ? 'bg-secondary-dark text-white' : 'bg-white text-secondary-dark border border-secondary-bg hover:bg-secondary-bg'
                }`}
              >
                All
              </button>
              {resourceTypes.map(type => (
                <button 
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-4 py-2 rounded-full font-sans text-sm whitespace-nowrap transition-colors ${
                    selectedType === type.id ? 'bg-secondary-dark text-white' : 'bg-white text-secondary-dark border border-secondary-bg hover:bg-secondary-bg'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Resource Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-secondary-bg">
            <FileText className="mx-auto h-16 w-16 text-secondary-dark/20 mb-4" />
            <h3 className="text-xl font-serif text-primary-text mb-2">No resources found</h3>
            <p className="text-secondary-dark/60 font-sans">Try adjusting your search or type filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredResources.map(item => (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-secondary-bg hover:shadow-md transition-all flex flex-col group">
                <div className="aspect-[3/4] bg-secondary-bg relative overflow-hidden">
                  {item.cover_image ? (
                    <img 
                      src={item.cover_image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-secondary-dark/20">
                      <FileText className="w-16 h-16" />
                    </div>
                  )}
                  {item.featured && (
                    <div className="absolute top-4 right-4 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10 shadow-md">
                      Featured
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-secondary-dark text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10 shadow-sm">
                    {getTypeLabel(item.resource_type)}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-serif text-primary-text mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  
                  {item.description && (
                    <p className="text-secondary-dark/70 font-sans text-sm line-clamp-3 mb-4 flex-grow">
                      {item.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-secondary-bg">
                    <span className="font-serif font-medium text-lg text-primary-text">
                      {item.price ? `$${Number(item.price).toFixed(2)}` : 'Free'}
                    </span>
                    
                    {item.purchase_url ? (
                      <a 
                        href={item.purchase_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center p-2 bg-secondary-dark text-white rounded-full hover:bg-secondary-dark/90 transition-colors"
                        title="Purchase"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    ) : item.resource_url ? (
                      <a 
                        href={item.resource_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center p-2 bg-accent text-white rounded-full hover:bg-accent/90 transition-colors"
                        title="Download"
                      >
                        <Download className="w-5 h-5" />
                      </a>
                    ) : null}
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

export default Resources;
