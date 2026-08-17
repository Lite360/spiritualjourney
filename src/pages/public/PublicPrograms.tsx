import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { useSEO } from '../../hooks/useSEO';

const PublicPrograms: React.FC = () => {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: 'Programs & Events',
    description: 'Join upcoming spiritual programs, retreats, and events hosted by Spiritual Journey.',
    url: '/programs',
  });

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('programs')
        .select(`
          *,
          categories(name)
        `)
        .eq('status', 'published')
        .gte('event_date', new Date().toISOString().split('T')[0])
        .order('event_date', { ascending: true });

      if (error) throw error;
      if (data) setPrograms(data);
      
      document.title = 'Upcoming Programs | Spiritual Journey';
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-primary-bg min-h-screen pb-24">
      {/* Header */}
      <section className="bg-secondary-dark text-primary-bg py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-serif mb-6">Upcoming Programs</h1>
          <p className="text-lg font-sans text-primary-bg/80 max-w-2xl mx-auto">
            Join us for powerful teachings, worship, and community gatherings designed to help you encounter God.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="text-center py-20 text-secondary-dark/50">Loading programs...</div>
        ) : programs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-secondary-bg">
            <Calendar className="mx-auto h-16 w-16 text-secondary-dark/20 mb-6" />
            <h2 className="text-2xl font-serif text-primary-text mb-2">No Upcoming Events</h2>
            <p className="text-secondary-dark/70 font-sans max-w-md mx-auto">
              We don't have any programs scheduled right now. Check back soon or subscribe to our newsletter for updates!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program) => (
              <div key={program.id} className="bg-white rounded-2xl overflow-hidden border border-secondary-bg hover:shadow-md transition-shadow flex flex-col">
                {program.featured_image ? (
                  <div className="aspect-[16/9] w-full relative">
                    <img 
                      src={program.featured_image} 
                      alt={program.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-accent text-white px-3 py-1 text-xs font-sans font-medium rounded-full uppercase tracking-wider">
                      {program.categories?.name || 'Event'}
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[16/9] w-full bg-secondary-bg flex items-center justify-center relative">
                    <Calendar className="w-12 h-12 text-secondary-dark/20" />
                    <div className="absolute top-4 left-4 bg-accent text-white px-3 py-1 text-xs font-sans font-medium rounded-full uppercase tracking-wider">
                      {program.categories?.name || 'Event'}
                    </div>
                  </div>
                )}
                
                <div className="p-8 flex-grow flex flex-col">
                  <h3 className="text-2xl font-serif text-primary-text mb-4">
                    {program.title}
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm font-sans text-secondary-dark/80">
                      <Calendar className="w-4 h-4 mr-3 text-accent" />
                      {program.event_date ? format(new Date(program.event_date), 'EEEE, MMMM d, yyyy') : 'Date TBA'}
                    </div>
                    {(program.start_time || program.end_time) && (
                      <div className="flex items-center text-sm font-sans text-secondary-dark/80">
                        <Clock className="w-4 h-4 mr-3 text-accent" />
                        {program.start_time?.substring(0,5)} {program.end_time ? `- ${program.end_time.substring(0,5)}` : ''}
                      </div>
                    )}
                    <div className="flex items-start text-sm font-sans text-secondary-dark/80">
                      <MapPin className="w-4 h-4 mr-3 text-accent mt-0.5 shrink-0" />
                      <span>{program.venue || 'Venue TBA'}{program.address ? `, ${program.address}` : ''}</span>
                    </div>
                  </div>
                  
                  <p className="text-secondary-dark/70 font-sans text-sm mb-8 line-clamp-3 flex-grow">
                    {program.description}
                  </p>
                  
                  {program.registration_url ? (
                    <a 
                      href={program.registration_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center px-6 py-3 bg-secondary-dark text-white rounded-full font-medium hover:bg-secondary-dark/90 transition-colors mt-auto"
                    >
                      Register Now
                    </a>
                  ) : (
                    <button className="w-full text-center px-6 py-3 border border-secondary-dark/20 text-secondary-dark/50 rounded-full font-medium cursor-not-allowed mt-auto">
                      Registration Unavailable
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicPrograms;
