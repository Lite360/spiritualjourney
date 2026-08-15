import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FileText, 
  Calendar, 
  MessageSquare,
  Users,
  Headphones,
  Video,
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { name: 'Total Posts', value: '0', icon: FileText, bg: 'bg-blue-50', color: 'text-blue-600' },
    { name: 'Published Posts', value: '0', icon: FileText, bg: 'bg-green-50', color: 'text-green-600' },
    { name: 'Upcoming Programs', value: '0', icon: Calendar, bg: 'bg-accent/10', color: 'text-accent' },
    { name: 'Resources', value: '0', icon: BookOpen, bg: 'bg-purple-50', color: 'text-purple-600' },
    { name: 'Audio Items', value: '0', icon: Headphones, bg: 'bg-orange-50', color: 'text-orange-600' },
    { name: 'Video Items', value: '0', icon: Video, bg: 'bg-red-50', color: 'text-red-600' },
    { name: 'Subscribers', value: '0', icon: Users, bg: 'bg-teal-50', color: 'text-teal-600' },
    { name: 'Unread Messages', value: '0', icon: MessageSquare, bg: 'bg-yellow-50', color: 'text-yellow-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-primary-text mb-2">Dashboard</h1>
        <p className="font-sans text-secondary-dark/70">
          Welcome back, {user?.email}. Here's what's happening today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg p-6 shadow-sm border border-secondary-bg flex items-center">
            <div className={`p-4 rounded-full mr-4 ${stat.bg} ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-secondary-dark/70 font-sans">{stat.name}</p>
              <p className="text-2xl font-serif text-primary-text">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-secondary-bg p-6">
          <h2 className="text-xl font-serif text-primary-text mb-4">Recent Posts</h2>
          <div className="text-center py-8 text-secondary-dark/60 font-sans">
            No posts found. <Link to="/admin/posts" className="text-accent hover:underline">Create one</Link>.
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-secondary-bg p-6">
          <h2 className="text-xl font-serif text-primary-text mb-4">Upcoming Programs</h2>
          <div className="text-center py-8 text-secondary-dark/60 font-sans">
            No upcoming programs.
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-secondary-bg p-6">
        <h2 className="text-xl font-serif text-primary-text mb-4">Recent Messages</h2>
        <div className="text-center py-8 text-secondary-dark/60 font-sans">
          No new messages.
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
