import { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  Users, 
  MessageSquare,
  Heart,
  LogOut,
  Menu,
  X,
  Bell
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/lib/supabase';

export default function AdminLayout() {
  const { signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadContacts, setUnreadContacts] = useState(0);
  const [unreadLeads, setUnreadLeads] = useState(0);

  useEffect(() => {
    async function fetchCounts() {
      const [{ count: contactCount }, { count: leadCount }] = await Promise.all([
        supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('read', false),
        supabase.from('wishlist_leads').select('*', { count: 'exact', head: true }).eq('read', false)
      ]);
      setUnreadContacts(contactCount || 0);
      setUnreadLeads(leadCount || 0);
    }
    fetchCounts();

    // Polling for updates
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  const adminLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Blog Posts', href: '/admin/blogs', icon: FileText },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Inbox', href: '/admin/contacts', icon: MessageSquare, badge: unreadContacts },
    { name: 'Wishlist Leads', href: '/admin/wishlist-leads', icon: Heart, badge: unreadLeads },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <Helmet>
        <title>Admin Dashboard | Buver Nairobi</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Mobile Header */}
      <div className="md:hidden bg-secondary text-white p-4 flex items-center justify-between z-20">
        <span className="text-xl font-serif font-bold">Buver Admin</span>
        <div className="flex items-center gap-4">
          {(unreadContacts + unreadLeads > 0) && (
            <div className="relative">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-primary w-2 h-2 rounded-full" />
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed md:sticky top-0 left-0 z-20 h-screen w-64 bg-secondary text-white transition-transform duration-300 ease-in-out md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="hidden md:block mb-10">
            <h1 className="text-2xl font-serif font-bold">Buver Admin</h1>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Management Panel</p>
          </div>

          <nav className="flex flex-col gap-2 flex-grow overflow-y-auto">
            {adminLinks.map(link => (
              <NavLink
                key={link.name}
                to={link.href}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => cn(
                  "flex items-center justify-between px-4 py-3 rounded-sm transition-colors text-sm font-medium",
                  isActive 
                    ? "bg-primary text-white" 
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </div>
                {link.badge > 0 && (
                  <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="pt-6 border-t border-white/10 mt-auto">
            <button
              onClick={() => signOut()}
              className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-300 hover:bg-white/10 hover:text-white rounded-sm transition-colors text-sm font-medium"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-4 md:p-8 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
