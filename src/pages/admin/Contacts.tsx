import { useState, useEffect } from 'react';
import { getContacts, updateContactStatus, deleteContact } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Loader2, Mail, CheckCircle2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Contacts() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredContacts(contacts);
    } else {
      const s = search.toLowerCase();
      setFilteredContacts(
        contacts.filter(c => 
          c.name?.toLowerCase().includes(s) || 
          c.contact_info?.toLowerCase().includes(s) || 
          c.subject?.toLowerCase().includes(s) ||
          c.message?.toLowerCase().includes(s)
        )
      );
    }
  }, [search, contacts]);

  async function fetchContacts() {
    setLoading(true);
    const { data } = await getContacts();
    if (data) {
      setContacts(data);
      setFilteredContacts(data);
    }
    setLoading(false);
  }

  const markAsRead = async (id: string, currentlyRead: boolean) => {
    await updateContactStatus(id, !currentlyRead);
    await fetchContacts();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      setLoading(true);
      await deleteContact(id);
      await fetchContacts();
    }
  };

  if (loading && contacts.length === 0) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary w-8 h-8"/></div>;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Inbox</h1>
          <p className="text-gray-500 mt-1">Customer inquiries from the contact form.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input 
            placeholder="Search messages..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-none bg-white border-gray-200 focus:border-primary"
          />
        </div>
      </div>

      <div className="space-y-4">
        {loading && <div className="text-center p-4 text-sm text-gray-400">Updating...</div>}
        
        {filteredContacts.length === 0 && !loading && (
          <div className="bg-white p-12 text-center border border-gray-100 rounded-sm">
            <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-1">Inbox Empty</h3>
            <p className="text-gray-500 text-sm">You have no new messages matching your search.</p>
          </div>
        )}

        {filteredContacts.map(msg => (
          <div 
            key={msg.id} 
            className={`bg-white border p-6 transition-all ${
              msg.read ? 'border-gray-100 opacity-75' : 'border-primary/20 shadow-sm border-l-4 border-l-primary'
            }`}
          >
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  msg.read ? 'bg-gray-100' : 'bg-primary/10'
                }`}>
                  <Mail className={`w-5 h-5 ${msg.read ? 'text-gray-400' : 'text-primary'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-gray-900">{msg.name}</h3>
                    {!msg.read && <Badge className="bg-primary text-white text-[10px] uppercase tracking-widest px-2 py-0 border-none">New</Badge>}
                  </div>
                  <p className="text-xs text-gray-500 font-mono mt-1">{msg.contact_info}</p>
                </div>
              </div>
              <div className="text-right flex flex-row md:flex-col justify-between items-end gap-2 shrink-0">
                <span className="text-xs text-gray-400">
                  {new Date(msg.created_at).toLocaleString('en-US', {
                    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                  })}
                </span>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => markAsRead(msg.id, msg.read)}
                    className="text-xs h-8 text-gray-500 hover:text-primary"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    {msg.read ? 'Mark Unread' : 'Mark Read'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(msg.id)} className="h-8">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="mt-2 ml-0 md:ml-14">
              <h4 className="font-serif font-bold text-gray-900 mb-2">{msg.subject}</h4>
              <div className="bg-gray-50 p-4 rounded-sm border border-gray-100 text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                {msg.message}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
