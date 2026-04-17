import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Package, Users, MessageSquare, FileText, Loader2, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    blogs: 0,
    users: 0,
    messages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          { count: pCount },
          { count: bCount },
          { count: uCount },
          { count: mCount }
        ] = await Promise.all([
          supabase.from('products').select('*', { count: 'exact', head: true }),
          supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('contacts').select('*', { count: 'exact', head: true }),
        ]);

        setStats({
          products: pCount || 0,
          blogs: bCount || 0,
          users: uCount || 0,
          messages: mCount || 0,
        });
      } catch (error) {
        console.error('Error fetching admin stats', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  const statCards = [
    { title: 'Total Products', value: stats.products, icon: Package, color: 'text-blue-500', bg: 'bg-blue-50', link: '/admin/products' },
    { title: 'Blog Posts', value: stats.blogs, icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50', link: '/admin/blogs' },
    { title: 'Registered Users', value: stats.users, icon: Users, color: 'text-orange-500', bg: 'bg-orange-50', link: '/admin/users' },
    { title: 'Contact Messages', value: stats.messages, icon: MessageSquare, color: 'text-green-500', bg: 'bg-green-50', link: '/admin/contacts' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your online store.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((stat, i) => (
          <Link key={stat.title} to={stat.link}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 shadow-sm border border-gray-100 rounded-sm flex items-center justify-between hover:border-primary/30 hover:shadow-md transition-all cursor-pointer h-full"
            >
              <div>
                <p className="text-sm uppercase tracking-widest text-gray-500 font-bold mb-2">{stat.title}</p>
                <h3 className="text-4xl font-serif font-bold">{stat.value}</h3>
              </div>
              <div className={`w-14 h-14 ${stat.bg} rounded-full flex items-center justify-center shrink-0`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="bg-white p-8 border border-gray-100 shadow-sm rounded-sm">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-serif font-bold">Welcome back, Admin.</h2>
        </div>
        <p className="text-gray-600 leading-relaxed max-w-3xl">
          Use the sidebar to navigate to different sections of your dashboard. You can add, edit, or delete 
          products within the Products tab, mark items as "Trending" to feature them on the homepage, write 
          new blog articles to engage your audience, approve pending user registrations, and manage customer 
          support inquiries from the Contact page.
        </p>
      </div>
    </div>
  );
}
