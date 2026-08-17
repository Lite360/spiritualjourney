import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

import { PublicLayout } from './components/public/PublicLayout';
import { AdminLayout } from './components/admin/AdminLayout';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Posts from './pages/admin/Posts';
import PostEditor from './pages/admin/PostEditor';
import Categories from './pages/admin/Categories';
import Media from './pages/admin/Media';
import Programs from './pages/admin/Programs';
import ProgramEditor from './pages/admin/ProgramEditor';
import Settings from './pages/admin/Settings';
import Videos from './pages/admin/Videos';
import VideoEditor from './pages/admin/VideoEditor';
import AudioList from './pages/admin/AudioList';
import AudioEditor from './pages/admin/AudioEditor';
import AdminResources from './pages/admin/Resources';
import ResourceEditor from './pages/admin/ResourceEditor';
import Messages from './pages/admin/Messages';
import Subscribers from './pages/admin/Subscribers';

// Public Pages
import Home from './pages/public/Home';
import Blog from './pages/public/Blog';
import BlogPost from './pages/public/BlogPost';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Teachings from './pages/public/Teachings';
import Audio from './pages/public/Audio';
import PublicResources from './pages/public/Resources';
import PublicPrograms from './pages/public/PublicPrograms';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import TermsOfService from './pages/public/TermsOfService';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/programs" element={<PublicPrograms />} />
            <Route path="/teachings" element={<Teachings />} />
            <Route path="/audio" element={<Audio />} />
            <Route path="/resources" element={<PublicResources />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          
          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/posts" element={<Posts />} />
              <Route path="/admin/posts/create" element={<PostEditor />} />
              <Route path="/admin/posts/edit/:id" element={<PostEditor />} />
              <Route path="/admin/categories" element={<Categories />} />
              <Route path="/admin/media" element={<Media />} />
              <Route path="/admin/programs" element={<Programs />} />
              <Route path="/admin/programs/create" element={<ProgramEditor />} />
              <Route path="/admin/programs/edit/:id" element={<ProgramEditor />} />
              <Route path="/admin/settings" element={<Settings />} />
              <Route path="/admin/videos" element={<Videos />} />
              <Route path="/admin/videos/create" element={<VideoEditor />} />
              <Route path="/admin/videos/edit/:id" element={<VideoEditor />} />
              <Route path="/admin/audio" element={<AudioList />} />
              <Route path="/admin/audio/create" element={<AudioEditor />} />
              <Route path="/admin/audio/edit/:id" element={<AudioEditor />} />
              <Route path="/admin/resources" element={<AdminResources />} />
              <Route path="/admin/resources/create" element={<ResourceEditor />} />
              <Route path="/admin/resources/edit/:id" element={<ResourceEditor />} />
              <Route path="/admin/messages" element={<Messages />} />
              <Route path="/admin/subscribers" element={<Subscribers />} />
            </Route>
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
