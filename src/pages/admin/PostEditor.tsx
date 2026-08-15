import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { RichTextEditor } from '../../components/admin/RichTextEditor';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const PostEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [status, setStatus] = useState('draft');
  const [featured, setFeatured] = useState(false);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('id, name');
    if (data) setCategories(data);
  };

  const fetchPost = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();
      
    if (data && !error) {
      setTitle(data.title || '');
      setSlug(data.slug || '');
      setExcerpt(data.excerpt || '');
      setContent(data.content || '');
      setCategoryId(data.category_id || '');
      setFeaturedImage(data.featured_image || '');
      setStatus(data.status || 'draft');
      setFeatured(data.featured || false);
      setSeoTitle(data.seo_title || '');
      setSeoDescription(data.seo_description || '');
    }
    setLoading(false);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!id) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleSave = async (publishStatus: string = status) => {
    setSaving(true);
    
    const postData = {
      title,
      slug,
      excerpt,
      content,
      category_id: categoryId || null,
      featured_image: featuredImage,
      status: publishStatus,
      featured,
      seo_title: seoTitle,
      seo_description: seoDescription,
      author_id: user?.id,
      published_at: publishStatus === 'published' && status !== 'published' ? new Date().toISOString() : undefined,
    };

    try {
      if (id) {
        await supabase.from('posts').update(postData).eq('id', id);
      } else {
        await supabase.from('posts').insert([postData]);
      }
      navigate('/admin/posts');
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error saving post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/admin/posts')}
            className="mr-4 p-2 text-secondary-dark hover:bg-primary-bg/50 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-serif text-primary-text">{id ? 'Edit Post' : 'New Post'}</h1>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="px-4 py-2 border border-secondary-bg text-secondary-dark bg-white rounded-md hover:bg-primary-bg/50 transition-colors font-sans"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={saving}
            className="flex items-center px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors font-sans"
          >
            <Save className="w-4 h-4 mr-2" />
            Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg p-6 border border-secondary-bg">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Post Title"
              className="w-full text-3xl font-serif text-primary-text placeholder-secondary-dark/40 border-none focus:outline-none focus:ring-0 mb-4 bg-transparent"
            />
            <RichTextEditor content={content} onChange={setContent} />
          </div>

          <div className="bg-white rounded-lg p-6 border border-secondary-bg">
            <h3 className="text-lg font-serif text-primary-text mb-4">Excerpt</h3>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-secondary-bg rounded-md focus:outline-none focus:ring-2 focus:ring-accent font-sans text-primary-text bg-primary-bg/30"
              placeholder="Brief summary of the post..."
            />
          </div>

          <div className="bg-white rounded-lg p-6 border border-secondary-bg">
            <h3 className="text-lg font-serif text-primary-text mb-4">SEO</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-dark mb-1 font-sans">SEO Title</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-secondary-bg rounded-md focus:outline-none focus:ring-2 focus:ring-accent font-sans text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-dark mb-1 font-sans">Meta Description</label>
                <textarea
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-secondary-bg rounded-md focus:outline-none focus:ring-2 focus:ring-accent font-sans text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 border border-secondary-bg">
            <h3 className="text-lg font-serif text-primary-text mb-4">Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-dark mb-1 font-sans">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-2 border border-secondary-bg rounded-md focus:outline-none focus:ring-2 focus:ring-accent font-sans text-sm bg-primary-bg/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-dark mb-1 font-sans">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-2 border border-secondary-bg rounded-md focus:outline-none focus:ring-2 focus:ring-accent font-sans text-sm bg-primary-bg/30"
                >
                  <option value="">Select category...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 text-accent focus:ring-accent border-secondary-bg rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-secondary-dark font-sans">
                  Feature this post
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-secondary-bg">
            <h3 className="text-lg font-serif text-primary-text mb-4">Featured Image</h3>
            
            {featuredImage ? (
              <div className="relative group">
                <img src={featuredImage} alt="Featured" className="w-full h-40 object-cover rounded-md" />
                <button
                  onClick={() => setFeaturedImage('')}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-secondary-bg rounded-md p-8 text-center bg-primary-bg/20">
                <ImageIcon className="mx-auto h-8 w-8 text-secondary-dark/40 mb-2" />
                <p className="text-sm font-sans text-secondary-dark/60">
                  Click to upload or drag image here
                </p>
                <button className="mt-4 px-4 py-2 border border-secondary-bg text-secondary-dark rounded font-sans text-sm hover:bg-white transition-colors">
                  Select Image
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostEditor;
