import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id, 
          title, 
          status, 
          featured, 
          published_at, 
          categories (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) throw error;
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-primary-text mb-2">Posts</h1>
          <p className="font-sans text-secondary-dark/70">Manage your blog articles and teachings.</p>
        </div>
        <Link 
          to="/admin/posts/create" 
          className="flex items-center px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors font-sans"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Post
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-secondary-bg overflow-hidden">
        <div className="p-4 border-b border-secondary-bg flex justify-between items-center bg-primary-bg/20">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-dark/40 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search posts..." 
              className="w-full pl-10 pr-4 py-2 border border-secondary-bg rounded-md focus:outline-none focus:ring-2 focus:ring-accent font-sans text-sm"
            />
          </div>
          <button className="flex items-center px-3 py-2 border border-secondary-bg rounded-md text-secondary-dark hover:bg-primary-bg/50 transition-colors font-sans text-sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary-bg/30 text-secondary-dark font-sans text-sm border-b border-secondary-bg">
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-sans text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-secondary-dark/60">
                    Loading posts...
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-secondary-dark/60">
                    No posts found.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="border-b border-secondary-bg hover:bg-primary-bg/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-primary-text">{post.title}</div>
                      {post.featured && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-accent/10 text-accent text-xs rounded-full">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-secondary-dark/70">
                      {post.categories?.name || 'Uncategorized'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${
                        post.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-secondary-dark/70">
                      {post.published_at ? format(new Date(post.published_at), 'MMM d, yyyy') : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <Link 
                          to={`/admin/posts/edit/${post.id}`}
                          className="p-2 text-secondary-dark hover:text-accent transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(post.id)}
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
        
        {/* Pagination placeholder */}
        <div className="p-4 border-t border-secondary-bg flex justify-between items-center text-sm font-sans text-secondary-dark/70">
          <div>Showing {posts.length} results</div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-secondary-bg rounded-md disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 border border-secondary-bg rounded-md disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Posts;
