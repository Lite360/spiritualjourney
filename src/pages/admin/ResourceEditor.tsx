import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Save } from 'lucide-react';

const ResourceEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [resourceType, setResourceType] = useState('ebook');
  const [resourceUrl, setResourceUrl] = useState('');
  const [purchaseUrl, setPurchaseUrl] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState('draft');
  const [featured, setFeatured] = useState(false);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchResource();
  }, [id]);

  const fetchResource = async () => {
    setLoading(true);
    const { data } = await supabase.from('resources').select('*').eq('id', id).single();
    if (data) {
      setTitle(data.title || '');
      setSlug(data.slug || '');
      setDescription(data.description || '');
      setResourceType(data.resource_type || 'ebook');
      setResourceUrl(data.resource_url || '');
      setPurchaseUrl(data.purchase_url || '');
      setCoverImage(data.cover_image || '');
      setPrice(data.price?.toString() || '');
      setStatus(data.status || 'draft');
      setFeatured(data.featured || false);
    }
    setLoading(false);
  };

  const generateSlug = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (!id) setSlug(generateSlug(e.target.value));
  };

  const handleSave = async (publishStatus = status) => {
    if (!title.trim() || !slug.trim()) { setError('Title and slug are required.'); return; }
    setError(null);
    setSaving(true);

    const payload = {
      title, slug, description,
      resource_type: resourceType,
      resource_url: resourceUrl || null,
      purchase_url: purchaseUrl || null,
      cover_image: coverImage || null,
      price: price ? parseFloat(price) : null,
      status: publishStatus,
      featured,
      published_at: publishStatus === 'published' && status !== 'published' ? new Date().toISOString() : undefined,
    };

    try {
      if (id) {
        await supabase.from('resources').update(payload).eq('id', id);
      } else {
        await supabase.from('resources').insert([payload]);
      }
      navigate('/admin/resources');
    } catch (err: any) {
      setError(err.message || 'Error saving resource');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full px-4 py-2 border border-secondary-surface rounded-md focus:outline-none focus:ring-2 focus:ring-accent font-sans text-sm text-primary-text bg-primary-bg/30';
  const labelClass = 'block text-sm font-medium text-primary-main mb-1 font-sans';

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" /></div>;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin/resources')} className="p-2 text-primary-main/60 hover:bg-primary-bg/50 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-serif text-primary-text">{id ? 'Edit Resource' : 'New Resource'}</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={() => handleSave('draft')} disabled={saving} className="px-4 py-2 border border-secondary-surface text-primary-main bg-white rounded-md hover:bg-primary-bg/50 transition-colors font-sans text-sm">Save Draft</button>
          <button onClick={() => handleSave('published')} disabled={saving} className="flex items-center px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors font-sans text-sm">
            <Save className="w-4 h-4 mr-2" />{saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-md text-sm font-sans">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg p-6 border border-secondary-surface space-y-4">
            <div>
              <label className={labelClass}>Resource Title</label>
              <input type="text" value={title} onChange={handleTitleChange} className={inputClass} placeholder="Resource title..." />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={5} className={inputClass + ' resize-none'} placeholder="Describe this resource..." />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-secondary-surface space-y-4">
            <h3 className="text-lg font-serif text-primary-text">Resource Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Type</label>
                <select value={resourceType} onChange={e => setResourceType(e.target.value)} className={inputClass}>
                  <option value="ebook">eBook</option>
                  <option value="pdf">PDF</option>
                  <option value="book">Book</option>
                  <option value="course">Course</option>
                  <option value="guide">Guide</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Price (leave blank for free)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-main/50 font-sans text-sm">$</span>
                  <input type="number" value={price} onChange={e => setPrice(e.target.value)} className={inputClass + ' pl-7'} placeholder="0.00" min="0" step="0.01" />
                </div>
              </div>
            </div>
            <div>
              <label className={labelClass}>Download / Access URL</label>
              <input type="url" value={resourceUrl} onChange={e => setResourceUrl(e.target.value)} className={inputClass} placeholder="https://..." />
              <p className="text-xs text-primary-main/50 mt-1 font-sans">Direct download link or access URL for free resources.</p>
            </div>
            <div>
              <label className={labelClass}>Purchase URL (for paid resources)</label>
              <input type="url" value={purchaseUrl} onChange={e => setPurchaseUrl(e.target.value)} className={inputClass} placeholder="https://gumroad.com/..." />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 border border-secondary-surface space-y-4">
            <h3 className="text-lg font-serif text-primary-text">Settings</h3>
            <div>
              <label className={labelClass}>URL Slug</label>
              <input type="text" value={slug} onChange={e => setSlug(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className={inputClass}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="flex items-center pt-1">
              <input type="checkbox" id="featured" checked={featured} onChange={e => setFeatured(e.target.checked)} className="h-4 w-4 text-accent focus:ring-accent border-secondary-surface rounded" />
              <label htmlFor="featured" className="ml-2 text-sm text-primary-main font-sans">Feature this resource</label>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-secondary-surface space-y-4">
            <h3 className="text-lg font-serif text-primary-text">Cover Image</h3>
            <div>
              <label className={labelClass}>Image URL</label>
              <input type="url" value={coverImage} onChange={e => setCoverImage(e.target.value)} className={inputClass} placeholder="https://..." />
            </div>
            {coverImage && (
              <img src={coverImage} alt="Cover preview" className="w-full h-48 object-cover rounded-lg" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceEditor;
