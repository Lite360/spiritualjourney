import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Globe, User, Share2, Mail, CheckCircle } from 'lucide-react';

interface SiteSettings {
  id?: string;
  site_name: string;
  site_description: string;
  founder_name: string;
  founder_bio: string;
  founder_image: string;
  contact_email: string;
  newsletter_email: string;
  instagram_url: string;
  youtube_url: string;
  facebook_url: string;
  tiktok_url: string;
  x_url: string;
  footer_copyright: string;
}

const defaultSettings: SiteSettings = {
  site_name: 'Spiritual Journey',
  site_description: '',
  founder_name: 'Ife Dayo',
  founder_bio: '',
  founder_image: '',
  contact_email: '',
  newsletter_email: '',
  instagram_url: '',
  youtube_url: '',
  facebook_url: '',
  tiktok_url: '',
  x_url: '',
  footer_copyright: `© ${new Date().getFullYear()} Spiritual Journey. All rights reserved.`,
};

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'founder' | 'social' | 'email'>('general');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .single();

      if (data && !error) {
        setSettings({ ...defaultSettings, ...data });
      }
    } catch {
      // No settings row yet — we'll create it on save
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    try {
      if (settings.id) {
        const { error } = await supabase
          .from('site_settings')
          .update({ ...settings, updated_at: new Date().toISOString() })
          .eq('id', settings.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('site_settings')
          .insert([settings])
          .select()
          .single();
        if (error) throw error;
        if (data) setSettings(data);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert('Error saving settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const update = (field: keyof SiteSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const inputClass =
    'w-full px-4 py-2 border border-secondary-surface rounded-md focus:outline-none focus:ring-2 focus:ring-accent font-sans text-sm text-primary-text bg-primary-bg/30';
  const labelClass = 'block text-sm font-medium text-primary-main mb-1 font-sans';
  const textareaClass = inputClass + ' resize-none';

  const tabs = [
    { id: 'general' as const, label: 'General', icon: Globe },
    { id: 'founder' as const, label: 'About / Founder', icon: User },
    { id: 'social' as const, label: 'Social Media', icon: Share2 },
    { id: 'email' as const, label: 'Email', icon: Mail },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-primary-text mb-1">Site Settings</h1>
          <p className="font-sans text-primary-main/60 text-sm">Configure your platform's identity and content.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center px-5 py-2.5 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors font-sans font-medium disabled:opacity-60"
        >
          {saved ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-secondary-surface/40 rounded-lg p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium font-sans transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-primary-main shadow-sm'
                : 'text-primary-main/60 hover:text-primary-main'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-secondary-surface p-6 space-y-6">
        {/* GENERAL TAB */}
        {activeTab === 'general' && (
          <>
            <div>
              <label className={labelClass}>Site Name</label>
              <input
                type="text"
                value={settings.site_name}
                onChange={e => update('site_name', e.target.value)}
                className={inputClass}
                placeholder="Spiritual Journey"
              />
            </div>
            <div>
              <label className={labelClass}>Site Description</label>
              <textarea
                value={settings.site_description}
                onChange={e => update('site_description', e.target.value)}
                rows={3}
                className={textareaClass}
                placeholder="A space for biblical reflections, teachings, and honest conversations..."
              />
              <p className="text-xs text-primary-main/50 mt-1 font-sans">Used as the default meta description for SEO.</p>
            </div>
            <div>
              <label className={labelClass}>Footer Copyright Text</label>
              <input
                type="text"
                value={settings.footer_copyright}
                onChange={e => update('footer_copyright', e.target.value)}
                className={inputClass}
              />
            </div>
          </>
        )}

        {/* FOUNDER TAB */}
        {activeTab === 'founder' && (
          <>
            <div>
              <label className={labelClass}>Founder Name</label>
              <input
                type="text"
                value={settings.founder_name}
                onChange={e => update('founder_name', e.target.value)}
                className={inputClass}
                placeholder="Ife Dayo"
              />
            </div>
            <div>
              <label className={labelClass}>Founder Bio</label>
              <textarea
                value={settings.founder_bio}
                onChange={e => update('founder_bio', e.target.value)}
                rows={6}
                className={textareaClass}
                placeholder="Write a short biography that will appear on the About page..."
              />
            </div>
            <div>
              <label className={labelClass}>Founder Photos (Multiple allowed for animation)</label>
              
              <div className="flex flex-col space-y-4 mt-2">
                <div className="flex flex-wrap gap-4">
                  {settings.founder_image ? (
                    settings.founder_image.split(',').filter(Boolean).map((imgUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imgUrl}
                          alt={`Founder ${index + 1}`}
                          className="h-24 w-24 object-cover rounded-md border-2 border-secondary-surface"
                        />
                        <button
                          onClick={() => {
                            const newImages = settings.founder_image.split(',').filter(Boolean);
                            newImages.splice(index, 1);
                            update('founder_image', newImages.join(','));
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="h-24 w-24 rounded-md bg-secondary-surface flex items-center justify-center border-2 border-dashed border-primary-main/30 shadow-sm">
                      <User className="h-10 w-10 text-primary-main/30" />
                    </div>
                  )}
                </div>
                
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={async (e) => {
                      if (!e.target.files || e.target.files.length === 0) return;
                      
                      try {
                        const newUrls: string[] = [];
                        for (let i = 0; i < e.target.files.length; i++) {
                          const file = e.target.files[i];
                          const fileExt = file.name.split('.').pop();
                          const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
                          const filePath = `settings/${fileName}`;

                          const { error: uploadError } = await supabase.storage
                            .from('media')
                            .upload(filePath, file);

                          if (uploadError) throw uploadError;

                          const { data } = supabase.storage
                            .from('media')
                            .getPublicUrl(filePath);
                            
                          newUrls.push(data.publicUrl);
                        }
                        
                        const existingImages = settings.founder_image ? settings.founder_image.split(',').filter(Boolean) : [];
                        update('founder_image', [...existingImages, ...newUrls].join(','));
                      } catch (err: any) {
                        alert('Error uploading images: ' + err.message);
                      }
                    }}
                    className="block w-full text-sm font-sans text-primary-text
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-accent file:text-white
                      hover:file:bg-accent/90 cursor-pointer"
                  />
                  <p className="text-xs font-sans text-primary-main/50 mt-2">
                    Upload multiple square images. They will fade between each other on the About page.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* SOCIAL TAB */}
        {activeTab === 'social' && (
          <>
            {[
              { field: 'instagram_url' as const, label: 'Instagram URL', placeholder: 'https://instagram.com/...' },
              { field: 'youtube_url' as const, label: 'YouTube URL', placeholder: 'https://youtube.com/@...' },
              { field: 'facebook_url' as const, label: 'Facebook URL', placeholder: 'https://facebook.com/...' },
              { field: 'tiktok_url' as const, label: 'TikTok URL', placeholder: 'https://tiktok.com/@...' },
              { field: 'x_url' as const, label: 'X (Twitter) URL', placeholder: 'https://x.com/...' },
            ].map(({ field, label, placeholder }) => (
              <div key={field}>
                <label className={labelClass}>{label}</label>
                <input
                  type="url"
                  value={settings[field]}
                  onChange={e => update(field, e.target.value)}
                  className={inputClass}
                  placeholder={placeholder}
                />
              </div>
            ))}
          </>
        )}

        {/* EMAIL TAB */}
        {activeTab === 'email' && (
          <>
            <div>
              <label className={labelClass}>Contact Email</label>
              <input
                type="email"
                value={settings.contact_email}
                onChange={e => update('contact_email', e.target.value)}
                className={inputClass}
                placeholder="hello@spiritualjourney.com"
              />
              <p className="text-xs text-primary-main/50 mt-1 font-sans">Shown on the Contact page.</p>
            </div>
            <div>
              <label className={labelClass}>Newsletter Reply-To Email</label>
              <input
                type="email"
                value={settings.newsletter_email}
                onChange={e => update('newsletter_email', e.target.value)}
                className={inputClass}
                placeholder="newsletter@spiritualjourney.com"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Settings;
