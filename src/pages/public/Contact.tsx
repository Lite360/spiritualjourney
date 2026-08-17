import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Send, MapPin, Mail, Phone } from 'lucide-react';
import { useSEO } from '../../hooks/useSEO';

const Contact: React.FC = () => {
  const [siteSettings, setSiteSettings] = useState<any>(null);

  useSEO({
    title: 'Contact',
    description: 'Get in touch with the Spiritual Journey team. Have a question, prayer request, or want to invite Ife Dayo to speak?',
    url: '/contact',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from('site_settings').select('*').limit(1).single();
    if (data) setSiteSettings(data);
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      const { error } = await supabase.from('contact_messages').insert([
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          status: 'unread'
        }
      ]);
      
      if (error) throw error;
      
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
    }
  };

  return (
    <div className="bg-primary-bg min-h-screen pb-24">
      {/* Header */}
      <section className="bg-secondary-dark text-primary-bg py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-serif mb-6">Contact Us</h1>
          <p className="text-lg font-sans text-primary-bg/80 max-w-2xl mx-auto">
            Have a question, prayer request, or want to invite Ife to speak? We'd love to hear from you.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl font-serif text-primary-text mb-8">Get in Touch</h2>
            <p className="text-secondary-dark/70 font-sans mb-10 leading-relaxed">
              We try to respond to all inquiries within 48 hours. Please fill out the form or reach out directly using the information below.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="p-3 bg-secondary-bg text-accent rounded-full mr-4">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-primary-text mb-1">Email</h3>
                  <p className="text-secondary-dark/70 font-sans">{siteSettings?.contact_email || 'hello@spiritualjourney.com'}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="p-3 bg-secondary-bg text-accent rounded-full mr-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-primary-text mb-1">Location</h3>
                  <p className="text-secondary-dark/70 font-sans">Lagos, Nigeria</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="p-3 bg-secondary-bg text-accent rounded-full mr-4">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-primary-text mb-1">Phone</h3>
                  <p className="text-secondary-dark/70 font-sans">+234 (0) 123 456 7890</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-secondary-bg p-8 md:p-10">
            <h3 className="text-2xl font-serif text-primary-text mb-6">Send a Message</h3>
            
            {status === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg font-sans">
                Thank you for your message! We will get back to you shortly.
              </div>
            )}
            
            {status === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg font-sans">
                There was an error sending your message. Please try again later.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-secondary-dark mb-2 font-sans">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-secondary-bg rounded-md focus:outline-none focus:ring-2 focus:ring-accent font-sans bg-primary-bg/30"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-secondary-dark mb-2 font-sans">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-secondary-bg rounded-md focus:outline-none focus:ring-2 focus:ring-accent font-sans bg-primary-bg/30"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-secondary-dark mb-2 font-sans">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-secondary-bg rounded-md focus:outline-none focus:ring-2 focus:ring-accent font-sans bg-primary-bg/30"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-secondary-dark mb-2 font-sans">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-secondary-bg rounded-md focus:outline-none focus:ring-2 focus:ring-accent font-sans bg-primary-bg/30 resize-none"
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full flex justify-center items-center px-6 py-4 bg-accent text-white font-medium rounded-md hover:bg-accent/90 transition-colors disabled:opacity-70 font-sans"
              >
                {status === 'submitting' ? 'Sending...' : (
                  <>
                    Send Message <Send className="ml-2 w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
