import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  Users, 
  MessageSquare,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Helmet } from 'react-helmet-async';

const ADMIN_LINKS = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Blog Posts', href: '/admin/blogs', icon: FileText },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Inbox', href: '/admin/contacts', icon: MessageSquare },
];

export default function AdminLayout() {
  const { signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <Helmet>
        <title>Admin Dashboard | Buver Nairobi</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Mobile Header */}
      <div className="md:hidden bg-secondary text-white p-4 flex items-center justify-between z-20">
        <span className="text-xl font-serif font-bold">Buver Admin</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
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

          <nav className="flex flex-col gap-2 flex-grow">
            {ADMIN_LINKS.map(link => (
              <NavLink
                key={link.name}
                to={link.href}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-3 rounded-sm transition-colors text-sm font-medium",
                  isActive 
                    ? "bg-primary text-white" 
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                )}
              >
                <link.icon className="w-5 h-5" />
                {link.name}
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
