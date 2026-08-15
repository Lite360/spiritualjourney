import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-bg px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-secondary-bg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-primary-text mb-2">Spiritual Journey</h1>
          <p className="text-secondary-dark/70 font-sans">Admin Dashboard Login</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md text-sm font-sans border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-primary-text mb-2 font-sans">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-secondary-bg rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent font-sans text-primary-text bg-primary-bg/30"
              placeholder="admin@spiritualjourney.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-text mb-2 font-sans">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-secondary-bg rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent font-sans text-primary-text bg-primary-bg/30"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white py-3 px-4 rounded-md hover:bg-accent/90 transition-colors duration-200 font-medium font-sans flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
