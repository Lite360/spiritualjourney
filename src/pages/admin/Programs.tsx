import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { format } from 'date-fns';

const Programs: React.FC = () => {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select(`
          id, 
          title, 
          status, 
          event_date,
          start_time,
          venue,
          categories (name)
        `)
        .order('event_date', { ascending: true });

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this program?')) return;
    
    try {
      const { error } = await supabase.from('programs').delete().eq('id', id);
      if (error) throw error;
      fetchPrograms();
    } catch (error) {
      console.error('Error deleting program:', error);
      alert('Error deleting program');
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-primary-text mb-2">Programs & Events</h1>
          <p className="font-sans text-secondary-dark/70">Manage upcoming and past events.</p>
        </div>
        <Link 
          to="/admin/programs/create" 
          className="flex items-center px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors font-sans"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Program
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-secondary-bg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary-bg/30 text-secondary-dark font-sans text-sm border-b border-secondary-bg">
                <th className="px-6 py-4 font-medium">Event Name</th>
                <th className="px-6 py-4 font-medium">Date & Time</th>
                <th className="px-6 py-4 font-medium">Venue</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-sans text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-secondary-dark/60">
                    Loading programs...
                  </td>
                </tr>
              ) : programs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-secondary-dark/60">
                    No programs found.
                  </td>
                </tr>
              ) : (
                programs.map((program) => (
                  <tr key={program.id} className="border-b border-secondary-bg hover:bg-primary-bg/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-primary-text">{program.title}</div>
                      <div className="text-xs text-secondary-dark/60 mt-1">{program.categories?.name}</div>
                    </td>
                    <td className="px-6 py-4 text-secondary-dark/70">
                      <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-2 opacity-50" />
                        {program.event_date ? format(new Date(program.event_date), 'MMM d, yyyy') : 'TBD'}
                      </div>
                      {program.start_time && (
                        <div className="text-xs mt-1 ml-6">{program.start_time.substring(0,5)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-secondary-dark/70">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 opacity-50" />
                        {program.venue || 'TBA'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${
                        program.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : program.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : program.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <Link 
                          to={`/admin/programs/edit/${program.id}`}
                          className="p-2 text-secondary-dark hover:text-accent transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(program.id)}
                          className="p-2 text-secondary-dark hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Programs;
