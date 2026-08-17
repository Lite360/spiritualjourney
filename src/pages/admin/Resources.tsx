import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

const Resources: React.FC = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchResources(); }, []);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('id, title, status, featured, resource_type, price, published_at, cover_image')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setResources(data || []);
    } catch (err) {
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this resource?')) return;
    const { error } = await supabase.from('resources').delete().eq('id', id);
    if (!error) fetchResources();
  };

  const filtered = resources.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  const typeLabel: Record<string, string> = {
    ebook: 'eBook',
    pdf: 'PDF',
    book: 'Book',
    course: 'Course',
    guide: 'Guide',
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-primary-text mb-1">Resources</h1>
          <p className="font-sans text-primary-main/60 text-sm">Manage books, eBooks, guides, and other resources.</p>
        </div>
        <Link to="/admin/resources/create" className="flex items-center px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors font-sans">
          <Plus className="w-5 h-5 mr-2" />
          New Resource
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-secondary-surface overflow-hidden">
        <div className="p-4 border-b border-secondary-surface bg-primary-bg/20">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-main/40 w-4 h-4" />
            <input type="text" placeholder="Search resources..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-secondary-surface rounded-md focus:outline-none focus:ring-2 focus:ring-accent font-sans text-sm" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary-bg/30 text-primary-main font-sans text-sm border-b border-secondary-surface">
                <th className="px-6 py-4 font-medium">Resource</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Price</th>
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
                  <BookOpen className="mx-auto h-10 w-10 text-primary-main/20 mb-3" />
                  <p className="text-primary-main/50">No resources found.</p>
                </td></tr>
              ) : (
                filtered.map(item => (
                  <tr key={item.id} className="border-b border-secondary-surface hover:bg-primary-bg/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.cover_image ? (
                          <img src={item.cover_image} alt="" className="w-10 h-12 object-cover rounded" />
                        ) : (
                          <div className="w-10 h-12 bg-secondary-surface rounded flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-primary-main/30" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-primary-text">{item.title}</div>
                          {item.featured && <span className="inline-block mt-0.5 px-2 py-0.5 bg-accent/10 text-accent text-xs rounded-full">Featured</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-primary-main/60">
                      {item.resource_type ? (typeLabel[item.resource_type] || item.resource_type) : '—'}
                    </td>
                    <td className="px-6 py-4 text-primary-main/60">
                      {item.price ? `$${Number(item.price).toFixed(2)}` : 'Free'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${item.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-primary-main/60">{item.published_at ? format(new Date(item.published_at), 'MMM d, yyyy') : '—'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <Link to={`/admin/resources/edit/${item.id}`} className="p-2 text-primary-main/60 hover:text-accent transition-colors"><Edit2 className="w-4 h-4" /></Link>
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
          {filtered.length} resource{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
};

export default Resources;
