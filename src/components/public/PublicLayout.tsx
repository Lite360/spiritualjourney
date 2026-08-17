import React, { useState, useEffect } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import logo from '../../assets/logo.png';

export const PublicLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState<any>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from('site_settings').select('*').limit(1).single();
    if (data) setSiteSettings(data);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: 'Programs', path: '/programs' },
    { name: 'Teachings', path: '/teachings' },
    { name: 'Audio', path: '/audio' },
    { name: 'Resources', path: '/resources' },
    { name: 'About', path: '/about' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-primary-bg font-sans text-primary-text">
      {/* Navigation */}
      <header className="border-b border-secondary-bg sticky top-0 z-50 bg-primary-bg/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <img src={logo} alt="Spiritual Journey" className="h-12 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }: { isActive: boolean }) =>
                    `text-sm font-medium transition-colors ${
                      isActive ? 'text-accent' : 'text-secondary-dark hover:text-accent'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex">
              <Link 
                to="/programs" 
                className="px-6 py-2.5 bg-accent text-white text-sm font-medium rounded-full hover:bg-accent/90 transition-colors shadow-sm"
              >
                Start Your Journey
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-secondary-dark hover:text-accent focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-primary-bg border-b border-secondary-bg absolute w-full">
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }: { isActive: boolean }) =>
                    `block px-3 py-3 rounded-md text-base font-medium ${
                      isActive ? 'bg-secondary-bg text-accent' : 'text-secondary-dark hover:bg-secondary-bg hover:text-accent'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <div className="pt-4 px-3">
                <Link
                  to="/programs"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center px-6 py-3 bg-accent text-white text-base font-medium rounded-full hover:bg-accent/90 transition-colors"
                >
                  Start Your Journey
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-secondary-dark text-primary-bg pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <Link to="/" className="inline-block mb-4">
                <img src={logo} alt="Spiritual Journey" className="h-10 w-auto" />
              </Link>
              <p className="text-primary-bg/70 max-w-sm">
                {siteSettings?.site_description || 'A space for biblical reflections, honest conversations, teachings and resources designed to help you grow in your walk with God.'}
              </p>
            </div>
            <div>
              <h4 className="font-serif text-lg mb-4 text-accent">Explore</h4>
              <ul className="space-y-2 text-primary-bg/80">
                <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/programs" className="hover:text-white transition-colors">Programs</Link></li>
                <li><Link to="/audio" className="hover:text-white transition-colors">Audio</Link></li>
                <li><Link to="/resources" className="hover:text-white transition-colors">Resources</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif text-lg mb-4 text-accent">Connect</h4>
              <ul className="space-y-2 text-primary-bg/80">
                <li><Link to="/about" className="hover:text-white transition-colors">About {siteSettings?.founder_name || 'Ife Dayo'}</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                {siteSettings?.instagram_url && <li><a href={siteSettings.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a></li>}
                {siteSettings?.youtube_url && <li><a href={siteSettings.youtube_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">YouTube</a></li>}
                {siteSettings?.facebook_url && <li><a href={siteSettings.facebook_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Facebook</a></li>}
                {siteSettings?.tiktok_url && <li><a href={siteSettings.tiktok_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">TikTok</a></li>}
                {siteSettings?.x_url && <li><a href={siteSettings.x_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">X (Twitter)</a></li>}
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-bg/20 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-primary-bg/50">
            <p>{siteSettings?.footer_copyright || `© ${new Date().getFullYear()} ${siteSettings?.site_name || 'Spiritual Journey'}. All rights reserved.`}</p>
            <div className="mt-4 md:mt-0 space-x-4">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
