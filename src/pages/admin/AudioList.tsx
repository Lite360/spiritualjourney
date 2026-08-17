import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, Headphones } from 'lucide-react';
import { format } from 'date-fns';

const AudioList: React.FC = () => {
  const [audioItems, setAudioItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchAudio(); }, []);

  const fetchAudio = async () => {
    try {
      const { data, error } = await supabase
        .from('audio')
        .select('id, title, status, featured, published_at, cover_image, duration, categories(name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setAudioItems(data || []);
    } catch (err) {
      console.error('Error fetching audio:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this audio?')) return;
    const { error } = await supabase.from('audio').delete().eq('id', id);
    if (!error) fetchAudio();
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '—';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const filtered = audioItems.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-primary-text mb-1">Audio</h1>
          <p className="font-sans text-primary-main/60 text-sm">Manage sermons, podcasts, and audio teachings.</p>
        </div>
        <Link to="/admin/audio/create" className="flex items-center px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors font-sans">
          <Plus className="w-5 h-5 mr-2" />
          New Audio
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-secondary-surface overflow-hidden">
        <div className="p-4 border-b border-secondary-surface bg-primary-bg/20">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-main/40 w-4 h-4" />
            <input type="text" placeholder="Search audio..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-secondary-surface rounded-md focus:outline-none focus:ring-2 focus:ring-accent font-sans text-sm" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary-bg/30 text-primary-main font-sans text-sm border-b border-secondary-surface">
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Duration</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Published</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-sans text-sm">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent mx-auto" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center">
                  <Headphones className="mx-auto h-10 w-10 text-primary-main/20 mb-3" />
                  <p className="text-primary-main/50">No audio found.</p>
                </td></tr>
              ) : (
                filtered.map(item => (
                  <tr key={item.id} className="border-b border-secondary-surface hover:bg-primary-bg/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.cover_image ? (
                          <img src={item.cover_image} alt="" className="w-10 h-10 object-cover rounded" />
                        ) : (
                          <div className="w-10 h-10 bg-secondary-surface rounded flex items-center justify-center">
                            <Headphones className="w-5 h-5 text-primary-main/30" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-primary-text">{item.title}</div>
                          {item.featured && <span className="inline-block mt-0.5 px-2 py-0.5 bg-accent/10 text-accent text-xs rounded-full">Featured</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-primary-main/60">{item.categories?.name || '—'}</td>
                    <td className="px-6 py-4 text-primary-main/60">{formatDuration(item.duration)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${item.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-primary-main/60">{item.published_at ? format(new Date(item.published_at), 'MMM d, yyyy') : '—'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <Link to={`/admin/audio/edit/${item.id}`} className="p-2 text-primary-main/60 hover:text-accent transition-colors"><Edit2 className="w-4 h-4" /></Link>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-primary-main/60 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-secondary-surface text-sm font-sans text-primary-main/50">
          {filtered.length} item{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
};

export default AudioList;
