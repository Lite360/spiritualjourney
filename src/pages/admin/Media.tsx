import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Upload, Copy, Trash2, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';

const Media: React.FC = () => {
  const { user } = useAuth();
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMediaItems(data || []);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }
      
      const { data: publicUrlData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      // Save to media table for tracking
      const { error: dbError } = await supabase.from('media').insert([
        {
          filename: file.name,
          url: publicUrl,
          size: file.size,
          mime_type: file.type,
          uploaded_by: user?.id,
        },
      ]);

      if (dbError) throw dbError;

      // Refresh media list
      fetchMedia();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (item: any) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    
    try {
      // Extract filename from URL (since we stored it in the bucket root)
      const urlParts = item.url.split('/');
      const fileName = urlParts[urlParts.length - 1];

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('media')
        .remove([fileName]);

      if (storageError) throw storageError;

      // Delete from db tracking table
      const { error: dbError } = await supabase
        .from('media')
        .delete()
        .eq('id', item.id);

      if (dbError) throw dbError;

      fetchMedia();
    } catch (error: any) {
      alert(error.message || 'Error deleting media');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('URL copied to clipboard!');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-primary-text mb-2">Media Library</h1>
          <p className="font-sans text-secondary-dark/70">Upload and manage images.</p>
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleUpload}
            disabled={uploading}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors font-sans disabled:opacity-50"
          >
            <Upload className="w-5 h-5 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-secondary-bg overflow-hidden p-6">
        {loading ? (
          <div className="text-center py-12 text-secondary-dark/60 font-sans">
            Loading media...
          </div>
        ) : mediaItems.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-secondary-bg rounded-lg bg-primary-bg/20">
            <ImageIcon className="mx-auto h-12 w-12 text-secondary-dark/40 mb-4" />
            <h3 className="text-lg font-medium text-primary-text font-sans mb-1">No media found</h3>
            <p className="text-secondary-dark/60 font-sans mb-4">Upload some images to get started.</p>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 font-sans"
            >
              Upload Image
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {mediaItems.map((item) => (
              <div key={item.id} className="border border-secondary-bg rounded-lg overflow-hidden group bg-primary-bg/10 relative">
                <div className="aspect-square bg-secondary-bg/20 flex items-center justify-center overflow-hidden">
                  <img 
                    src={item.url} 
                    alt={item.filename} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-primary-text font-sans truncate mb-1" title={item.filename}>
                    {item.filename}
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-secondary-dark/60 font-sans">
                      {formatFileSize(item.size)}
                    </p>
                    <p className="text-xs text-secondary-dark/40 font-sans">
                      {item.created_at ? format(new Date(item.created_at), 'MMM d, yy') : ''}
                    </p>
                  </div>
                </div>
                
                {/* Hover Actions Overlay */}
                <div className="absolute inset-0 bg-primary-text/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 rounded-lg">
                  <button 
                    onClick={() => copyToClipboard(item.url)}
                    className="p-2 bg-white text-secondary-dark rounded hover:text-accent transition-colors shadow-sm"
                    title="Copy URL"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(item)}
                    className="p-2 bg-white text-secondary-dark rounded hover:text-red-500 transition-colors shadow-sm"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Media;
