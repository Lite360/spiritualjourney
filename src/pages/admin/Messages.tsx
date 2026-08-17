import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Mail, Trash2, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setMessages(data);
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('contact_messages')
      .update({ status: 'read' })
      .eq('id', id);
    
    if (!error) {
      setMessages(messages.map(m => m.id === id ? { ...m, status: 'read' } : m));
    }
  };

  const deleteMessage = async (id: string) => {
    if (!window.confirm('Delete this message?')) return;
    
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);
      
    if (!error) {
      setMessages(messages.filter(m => m.id !== id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-primary-text mb-1">Messages</h1>
          <p className="font-sans text-primary-main/60 text-sm">View messages sent from the Contact page.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-secondary-surface overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20">
            <Mail className="mx-auto h-12 w-12 text-primary-main/20 mb-3" />
            <p className="text-primary-main/50 font-sans">No messages found.</p>
          </div>
        ) : (
          <div className="divide-y divide-secondary-surface">
            {messages.map(msg => (
              <div key={msg.id} className={`p-6 transition-colors ${msg.status === 'unread' ? 'bg-accent/5' : 'bg-white'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-serif text-lg text-primary-text flex items-center gap-2">
                      {msg.name} 
                      {msg.status === 'unread' && <span className="w-2 h-2 rounded-full bg-accent"></span>}
                    </h3>
                    <a href={`mailto:${msg.email}`} className="text-accent text-sm font-sans hover:underline">
                      {msg.email}
                    </a>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-primary-main/50 font-sans mb-2 flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3" />
                      {format(new Date(msg.created_at), 'MMM d, yyyy h:mm a')}
                    </div>
                    <div className="flex gap-2 justify-end">
                      {msg.status === 'unread' && (
                        <button 
                          onClick={() => markAsRead(msg.id)}
                          className="p-2 text-primary-main/50 hover:text-green-600 transition-colors tooltip relative group"
                          title="Mark as Read"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteMessage(msg.id)}
                        className="p-2 text-primary-main/50 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {msg.subject && (
                  <div className="font-sans font-medium text-primary-text mb-2 text-sm">
                    Subject: {msg.subject}
                  </div>
                )}
                
                <div className="bg-primary-bg/30 p-4 rounded-md border border-secondary-surface text-primary-main/80 font-sans text-sm whitespace-pre-wrap">
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
