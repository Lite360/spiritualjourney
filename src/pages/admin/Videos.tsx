import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, Video as VideoIcon } from 'lucide-react';
import { format } from 'date-fns';

const Videos: React.FC = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('id, title, status, featured, published_at, thumbnail, categories(name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setVideos(data || []);
    } catch (err) {
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this video?')) return;
    const { error } = await supabase.from('videos').delete().eq('id', id);
    if (!error) fetchVideos();
  };

  const filtered = videos.filter(v =>
    v.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-primary-text mb-1">Videos</h1>
          <p className="font-sans text-primary-main/60 text-sm">Manage video content and teachings.</p>
        </div>
        <Link
          to="/admin/videos/create"
          className="flex items-center px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors font-sans"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Video
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-secondary-surface overflow-hidden">
        <div className="p-4 border-b border-secondary-surface bg-primary-bg/20 flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-main/40 w-4 h-4" />
            <input
              type="text"
              placeholder="Search videos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-secondary-surface rounded-md focus:outline-none focus:ring-2 focus:ring-accent font-sans text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary-bg/30 text-primary-main font-sans text-sm border-b border-secondary-surface">
                <th className="px-6 py-4 font-medium">Video</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Published</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-sans text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-primary-main/40">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent mx-auto" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <VideoIcon className="mx-auto h-10 w-10 text-primary-main/20 mb-3" />
                    <p className="text-primary-main/50">No videos found.</p>
                  </td>
                </tr>
              ) : (
                filtered.map(video => (
                  <tr key={video.id} className="border-b border-secondary-surface hover:bg-primary-bg/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {video.thumbnail ? (
                          <img src={video.thumbnail} alt="" className="w-14 h-10 object-cover rounded" />
                        ) : (
                          <div className="w-14 h-10 bg-secondary-surface rounded flex items-center justify-center">
                            <VideoIcon className="w-5 h-5 text-primary-main/30" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-primary-text">{video.title}</div>
                          {video.featured && (
                            <span className="inline-block mt-0.5 px-2 py-0.5 bg-accent/10 text-accent text-xs rounded-full">Featured</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-primary-main/60">{video.categories?.name || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                        video.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-primary-main/60">
                      {video.published_at ? format(new Date(video.published_at), 'MMM d, yyyy') : '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <Link to={`/admin/videos/edit/${video.id}`} className="p-2 text-primary-main/60 hover:text-accent transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(video.id)} className="p-2 text-primary-main/60 hover:text-red-500 transition-colors">
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
        <div className="p-4 border-t border-secondary-surface text-sm font-sans text-primary-main/50">
          {filtered.length} video{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
};

export default Videos;
