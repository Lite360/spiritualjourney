import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Save } from 'lucide-react';

const VideoEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus] = useState('draft');
  const [featured, setFeatured] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
    if (id) fetchVideo();
  }, [id]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('id, name').order('name');
    if (data) setCategories(data);
  };

  const fetchVideo = async () => {
    setLoading(true);
    const { data } = await supabase.from('videos').select('*').eq('id', id).single();
    if (data) {
      setTitle(data.title || '');
      setSlug(data.slug || '');
      setDescription(data.description || '');
      setVideoUrl(data.video_url || '');
      setThumbnail(data.thumbnail || '');
      setCategoryId(data.category_id || '');
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

  const getYoutubeEmbed = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const handleSave = async (publishStatus = status) => {
    if (!title.trim() || !slug.trim()) {
      setError('Title and slug are required.');
      return;
    }
    setError(null);
    setSaving(true);

    const payload = {
      title,
      slug,
      description,
      video_url: videoUrl,
      thumbnail,
      category_id: categoryId || null,
      status: publishStatus,
      featured,
      published_at: publishStatus === 'published' && status !== 'published' ? new Date().toISOString() : undefined,
    };

    try {
      if (id) {
        await supabase.from('videos').update(payload).eq('id', id);
      } else {
        await supabase.from('videos').insert([payload]);
      }
      navigate('/admin/videos');
    } catch (err: any) {
      setError(err.message || 'Error saving video');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full px-4 py-2 border border-secondary-surface rounded-md focus:outline-none focus:ring-2 focus:ring-accent font-sans text-sm text-primary-text bg-primary-bg/30';
  const labelClass = 'block text-sm font-medium text-primary-main mb-1 font-sans';

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" /></div>;

  const embedUrl = getYoutubeEmbed(videoUrl);

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin/videos')} className="p-2 text-primary-main/60 hover:bg-primary-bg/50 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-serif text-primary-text">{id ? 'Edit Video' : 'New Video'}</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={() => handleSave('draft')} disabled={saving} className="px-4 py-2 border border-secondary-surface text-primary-main bg-white rounded-md hover:bg-primary-bg/50 transition-colors font-sans text-sm">
            Save Draft
          </button>
          <button onClick={() => handleSave('published')} disabled={saving} className="flex items-center px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors font-sans text-sm">
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-md text-sm font-sans">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg p-6 border border-secondary-surface space-y-4">
            <div>
              <label className={labelClass}>Video Title</label>
              <input type="text" value={title} onChange={handleTitleChange} className={inputClass} placeholder="Enter video title..." />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className={inputClass + ' resize-none'} placeholder="Brief description of this video..." />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-secondary-surface space-y-4">
            <h3 className="text-lg font-serif text-primary-text">Video Source</h3>
            <div>
              <label className={labelClass}>Video URL (YouTube or direct link)</label>
              <input type="url" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className={inputClass} placeholder="https://youtube.com/watch?v=..." />
            </div>
            {embedUrl && (
              <div className="aspect-video rounded-lg overflow-hidden bg-black">
                <iframe src={embedUrl} className="w-full h-full" allowFullScreen title="Video preview" />
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg p-6 border border-secondary-surface space-y-4">
            <h3 className="text-lg font-serif text-primary-text">Thumbnail</h3>
            <div>
              <label className={labelClass}>Thumbnail URL</label>
              <input type="url" value={thumbnail} onChange={e => setThumbnail(e.target.value)} className={inputClass} placeholder="https://..." />
            </div>
            {thumbnail && (
              <img src={thumbnail} alt="Thumbnail preview" className="w-full h-40 object-cover rounded-lg" />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 border border-secondary-surface space-y-4">
            <h3 className="text-lg font-serif text-primary-text">Settings</h3>
            <div>
              <label className={labelClass}>URL Slug</label>
              <input type="text" value={slug} onChange={e => setSlug(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className={inputClass}>
                <option value="">Select category...</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
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
              <label htmlFor="featured" className="ml-2 text-sm text-primary-main font-sans">Feature this video</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoEditor;
