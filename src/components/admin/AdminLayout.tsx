import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  Image as ImageIcon, 
  Headphones, 
  Video, 
  BookOpen, 
  Tags, 
  MessageSquare, 
  Users, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Posts', path: '/admin/posts', icon: FileText },
    { name: 'Programs', path: '/admin/programs', icon: Calendar },
    { name: 'Media', path: '/admin/media', icon: ImageIcon },
    { name: 'Audio', path: '/admin/audio', icon: Headphones },
    { name: 'Videos', path: '/admin/videos', icon: Video },
    { name: 'Resources', path: '/admin/resources', icon: BookOpen },
    { name: 'Categories', path: '/admin/categories', icon: Tags },
    { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
    { name: 'Subscribers', path: '/admin/subscribers', icon: Users },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-secondary-dark text-primary-bg w-64 flex-shrink-0">
      <div className="p-6">
        <h2 className="text-2xl font-serif">Spiritual Journey</h2>
        <p className="text-sm opacity-70 mt-1 font-sans">Admin Panel</p>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/admin'}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }: { isActive: boolean }) =>
                `flex items-center px-3 py-2 text-sm font-medium rounded-md font-sans transition-colors ${
                  isActive
                    ? 'bg-primary-bg/10 text-white'
                    : 'text-primary-bg/70 hover:bg-primary-bg/5 hover:text-white'
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-primary-bg/10">
        <div className="flex items-center mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-bold mr-3">
            {user?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="truncate text-sm text-primary-bg/80 font-sans">
            {user?.email}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-red-300 hover:bg-red-900/30 transition-colors font-sans"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-primary-bg">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <SidebarContent />
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50" 
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-secondary-dark z-50">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Mobile Top Header */}
        <div className="md:hidden flex items-center justify-between bg-secondary-dark px-4 py-3 border-b border-primary-bg/10">
          <h2 className="text-xl font-serif text-primary-bg">Spiritual Journey</h2>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-primary-bg hover:text-white focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
