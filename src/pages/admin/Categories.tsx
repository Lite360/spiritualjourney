import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    if (!editingId) {
      setSlug(generateSlug(newName));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const categoryData = { name, slug, description };
      
      if (editingId) {
        await supabase.from('categories').update(categoryData).eq('id', editingId);
      } else {
        await supabase.from('categories').insert([categoryData]);
      }
      
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error saving category');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category: any) => {
    setEditingId(category.id);
    setName(category.name);
    setSlug(category.slug);
    setDescription(category.description || '');
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await supabase.from('categories').delete().eq('id', id);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete. It may be used by existing posts.');
    }
  };

  const resetForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setName('');
    setSlug('');
    setDescription('');
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-primary-text mb-2">Categories</h1>
          <p className="font-sans text-secondary-dark/70">Organize content across the platform.</p>
        </div>
        {!isFormOpen && (
          <button 
            onClick={() => setIsFormOpen(true)}
            className="flex items-center px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors font-sans"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Category
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="bg-white rounded-lg shadow-sm border border-secondary-bg p-6 mb-8">
          <h2 className="text-xl font-serif text-primary-text mb-4">
            {editingId ? 'Edit Category' : 'New Category'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-secondary-dark mb-1 font-sans">Name</label>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                required
                className="w-full px-4 py-2 border border-secondary-bg rounded-md focus:outline-none focus:ring-2 focus:ring-accent font-sans text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-dark mb-1 font-sans">Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="w-full px-4 py-2 border border-secondary-bg rounded-md focus:outline-none focus:ring-2 focus:ring-accent font-sans text-sm bg-primary-bg/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-dark mb-1 font-sans">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-secondary-bg rounded-md focus:outline-none focus:ring-2 focus:ring-accent font-sans text-sm"
              />
            </div>
            <div className="flex space-x-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors font-sans"
              >
                {saving ? 'Saving...' : 'Save Category'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-secondary-bg text-secondary-dark bg-white rounded-md hover:bg-primary-bg/50 transition-colors font-sans"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-secondary-bg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary-bg/30 text-secondary-dark font-sans text-sm border-b border-secondary-bg">
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Slug</th>
                <th className="px-6 py-4 font-medium">Created</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-sans text-sm">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-secondary-dark/60">
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-secondary-dark/60">
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="border-b border-secondary-bg hover:bg-primary-bg/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-primary-text">{category.name}</div>
                      {category.description && (
                        <div className="text-xs text-secondary-dark/60 mt-1">{category.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-secondary-dark/70">
                      /{category.slug}
                    </td>
                    <td className="px-6 py-4 text-secondary-dark/70">
                      {category.created_at ? format(new Date(category.created_at), 'MMM d, yyyy') : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => handleEdit(category)}
                          className="p-2 text-secondary-dark hover:text-accent transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(category.id)}
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

export default Categories;
