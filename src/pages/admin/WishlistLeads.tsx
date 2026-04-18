import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Loader2, Heart, CheckCircle2, Search, MessageCircle, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function WishlistLeads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredLeads(leads);
    } else {
      const s = search.toLowerCase();
      setFilteredLeads(
        leads.filter(l => 
          l.customer_name?.toLowerCase().includes(s) || 
          l.customer_phone?.toLowerCase().includes(s) || 
          l.products?.name?.toLowerCase().includes(s)
        )
      );
    }
  }, [search, leads]);

  async function fetchLeads() {
    setLoading(true);
    const { data, error } = await supabase
      .from('wishlist_leads')
      .select(`
        *,
        products (
          name,
          images,
          price
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) console.error('Error fetching leads:', error);
    if (data) {
      setLeads(data);
      setFilteredLeads(data);
    }
    setLoading(false);
  }

  const markAsRead = async (id: string, currentlyRead: boolean) => {
    const { error } = await supabase
      .from('wishlist_leads')
      .update({ read: !currentlyRead })
      .eq('id', id);
    if (error) alert('Error updating status: ' + error.message);
    await fetchLeads();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      const { error } = await supabase.from('wishlist_leads').delete().eq('id', id);
      if (error) alert('Error deleting lead: ' + error.message);
      await fetchLeads();
    }
  };

  if (loading && leads.length === 0) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary w-8 h-8"/></div>;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Wishlist Interest</h1>
          <p className="text-gray-500 mt-1">Track customers who saved products for later.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input 
            placeholder="Search leads..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-none bg-white border-gray-200 focus:border-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredLeads.length === 0 && !loading && (
          <div className="bg-white p-12 text-center border border-gray-100 rounded-sm col-span-full">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-1">No Leads Found</h3>
            <p className="text-gray-500 text-sm">Customers haven't saved any items yet.</p>
          </div>
        )}

        {filteredLeads.map(lead => (
          <div 
            key={lead.id} 
            className={`bg-white border p-6 transition-all ${
              lead.read ? 'border-gray-100 opacity-80' : 'border-primary/20 shadow-sm border-l-4 border-l-primary'
            }`}
          >
            <div className="flex flex-col lg:flex-row justify-between gap-6">
              <div className="flex gap-6 flex-grow">
                {/* Product Thumbnail */}
                <div className="w-20 h-24 bg-gray-50 shrink-0 overflow-hidden border">
                  {lead.products?.images?.[0] && (
                    <img src={lead.products.images[0]} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                
                <div className="flex-grow">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{lead.customer_name}</h3>
                    {!lead.read && <Badge className="bg-primary text-white text-[10px] uppercase tracking-widest">New Interest</Badge>}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MessageCircle className="w-4 h-4 text-green-500" />
                      <span className="font-mono">{lead.customer_phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Heart className="w-4 h-4 text-primary" />
                      <span>Interested in: <span className="font-bold text-secondary">{lead.products?.name}</span></span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-400 mt-4">
                    Captured on {new Date(lead.created_at).toLocaleString('en-US', {
                      month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex flex-row lg:flex-col justify-end gap-2 shrink-0">
                <a 
                  href={`https://wa.me/${lead.customer_phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${lead.customer_name}! I saw you were interested in our ${lead.products?.name} at Buver Nairobi. Is there anything I can help you with?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" className="bg-[#25D366] hover:bg-[#128C7E] text-white rounded-none w-full lg:w-32">
                    <MessageCircle className="w-4 h-4 mr-2" /> Follow Up
                  </Button>
                </a>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => markAsRead(lead.id, lead.read)}
                  className="rounded-none w-full lg:w-32"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" /> {lead.read ? 'Unread' : 'Read'}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(lead.id)} className="w-full lg:w-10">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
