import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const Subscribers: React.FC = () => {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });
    
    if (data) setSubscribers(data);
    setLoading(false);
  };

  const deleteSubscriber = async (id: string) => {
    if (!window.confirm('Remove this subscriber?')) return;
    
    const { error } = await supabase
      .from('newsletter_subscribers')
      .delete()
      .eq('id', id);
      
    if (!error) {
      setSubscribers(subscribers.filter(s => s.id !== id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-primary-text mb-1">Subscribers</h1>
          <p className="font-sans text-primary-main/60 text-sm">Manage newsletter subscribers.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-secondary-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary-bg/30 text-primary-main font-sans text-sm border-b border-secondary-surface">
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Subscribed Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-sans text-sm">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent mx-auto" /></td></tr>
              ) : subscribers.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center">
                  <Users className="mx-auto h-10 w-10 text-primary-main/20 mb-3" />
                  <p className="text-primary-main/50">No subscribers yet.</p>
                </td></tr>
              ) : (
                subscribers.map(sub => (
                  <tr key={sub.id} className="border-b border-secondary-surface hover:bg-primary-bg/10 transition-colors">
                    <td className="px-6 py-4 font-medium text-primary-text">{sub.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${sub.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-primary-main/60">
                      {sub.subscribed_at ? format(new Date(sub.subscribed_at), 'MMM d, yyyy') : '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => deleteSubscriber(sub.id)} className="p-2 text-primary-main/60 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-secondary-surface text-sm font-sans text-primary-main/50">
          {subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
};

export default Subscribers;
