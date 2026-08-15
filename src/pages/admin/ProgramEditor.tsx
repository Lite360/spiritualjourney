import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';

const ProgramEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [venue, setVenue] = useState('');
  const [address, setAddress] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [registrationUrl, setRegistrationUrl] = useState('');
  const [status, setStatus] = useState('draft');
  
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchProgram();
    }
  }, [id]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('id, name');
    if (data) setCategories(data);
  };

  const fetchProgram = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('id', id)
      .single();
      
    if (data && !error) {
      setTitle(data.title || '');
      setSlug(data.slug || '');
      setDescription(data.description || '');
      setCategoryId(data.category_id || '');
      setFeaturedImage(data.featured_image || '');
      setEventDate(data.event_date || '');
      setStartTime(data.start_time ? data.start_time.substring(0,5) : '');
      setEndTime(data.end_time ? data.end_time.substring(0,5) : '');
      setVenue(data.venue || '');
      setAddress(data.address || '');
      setSpeaker(data.speaker || '');
      setRegistrationUrl(data.registration_url || '');
      setStatus(data.status || 'draft');
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const programData = {
      title,
      slug,
      description,
      category_id: categoryId || null,
      featured_image: featuredImage,
      event_date: eventDate || null,
      start_time: startTime ? `${startTime}:00` : null,
      end_time: endTime ? `${endTime}:00` : null,
      venue,
      address,
      speaker,
      registration_url: registrationUrl,
      status,
    };

    try {
      if (id) {
        await supabase.from('programs').update(programData).eq('id', id);
      } else {
        await supabase.from('programs').insert([programData]);
      }
      navigate('/admin/programs');
    } catch (error) {
      console.error('Error saving program:', error);
      alert('Error saving program');
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
            onClick={() => navigate('/admin/programs')}
            className="mr-4 p-2 text-secondary-dark hover:bg-primary-bg/50 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-serif text-primary-text">{id ? 'Edit Program' : 'New Program'}</h1>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg p-6 border border-secondary-bg space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-dark mb-1 font-sans">Event Name</label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                required
                className="w-full px-4 py-2 border border-secondary-bg rounded-md focus:outline-none focus:ring-2 focus:ring-accent font-sans text-primary-text bg-primary-bg/30"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-dark mb-1 font-sans">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full px-4 py-2 border border-secondary-bg rounded-md focus:outline-none focus:ring-2 focus:ring-accent font-sans text-primary-text bg-primary-bg/30"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-secondary-bg">
            <h3 className="text-lg font-serif text-primary-text mb-4">Date & Time</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-dark mb-1 font-sans">Date</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-4 py-2 border border-secondary-bg rounded-md focus:outline-none focus:ring-2 focus:ring-accent font-sans text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-dark mb-1 font-sans">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-2 border border-secondary-bg rounded-md focus:outline-none focus:ring-2 focus:ring-accent font-sans text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-dark mb-1 font-sans">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-2 border border-secondary-bg rounded-md focus:outline-none focus:ring-2 focus:ring-accent font-sans text-sm"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-secondary-bg">
            <h3 className="text-lg font-serif text-primary-text mb-4">Location Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-dark mb-1 font-sans">Venue Name</label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. The Main Auditorium"
                  className="w-full px-4 py-2 border border-secondary-bg rounded-md focus:outline-none focus:ring-2 focus:ring-accent font-sans text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-dark mb-1 font-sans">Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-secondary-bg rounded-md focus:outline-none focus:ring-2 focus:ring-accent font-sans text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 border border-secondary-bg space-y-4">
            <h3 className="text-lg font-serif text-primary-text mb-2">Publishing</h3>
            
            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors font-sans"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Program'}
            </button>
            
            <div>
              <label className="block text-sm font-medium text-secondary-dark mb-1 font-sans mt-4">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 border border-secondary-bg rounded-md focus:outline-none focus:ring-2 focus:ring-accent font-sans text-sm bg-primary-bg/30"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

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
              
              <div>
                <label className="block text-sm font-medium text-secondary-dark mb-1 font-sans">Speaker</label>
                <input
                  type="text"
                  value={speaker}
                  onChange={(e) => setSpeaker(e.target.value)}
                  className="w-full px-4 py-2 border border-secondary-bg rounded-md focus:outline-none focus:ring-2 focus:ring-accent font-sans text-sm bg-primary-bg/30"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-dark mb-1 font-sans">Registration URL</label>
                <input
                  type="url"
                  value={registrationUrl}
                  onChange={(e) => setRegistrationUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-secondary-bg rounded-md focus:outline-none focus:ring-2 focus:ring-accent font-sans text-sm bg-primary-bg/30"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-secondary-bg">
            <h3 className="text-lg font-serif text-primary-text mb-4">Featured Image</h3>
            
            {featuredImage ? (
              <div className="relative group">
                <img src={featuredImage} alt="Featured" className="w-full h-40 object-cover rounded-md" />
                <button
                  type="button"
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
                  Provide an image URL for now
                </p>
                <input 
                  type="url"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="https://..."
                  className="mt-4 w-full px-3 py-2 border border-secondary-bg rounded-md font-sans text-sm"
                />
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProgramEditor;
