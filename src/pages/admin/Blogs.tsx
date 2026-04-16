import React, { useState, useEffect } from 'react';
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from '@/lib/supabase';
import { BlogPost } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2, Plus, X, Loader2 } from 'lucide-react';

export default function Blogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    date: '',
    content: '',
    excerpt: '',
    image: '',
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function fetchBlogs() {
    setLoading(true);
    const data = await getBlogPosts();
    setBlogs(data);
    setLoading(false);
  }

  const openForm = (blog?: BlogPost) => {
    if (blog) {
      setEditingId(blog.id);
      setFormData({
        title: blog.title,
        slug: blog.slug,
        date: blog.date,
        content: blog.content,
        excerpt: blog.excerpt,
        image: blog.image || '',
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        slug: '',
        date: new Date().toISOString().split('T')[0], // yyyy-mm-dd
        content: '',
        excerpt: '',
        image: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Auto-generate slug if left blank
    const finalSlug = formData.slug.trim() 
      ? formData.slug.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^\w-]+/g, '')
      : formData.title.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^\w-]+/g, '');

    const payload = {
      title: formData.title,
      slug: finalSlug,
      date: formData.date,
      content: formData.content,
      excerpt: formData.excerpt,
      image: formData.image,
    };

    if (editingId) {
      await updateBlogPost(editingId, payload);
    } else {
      await createBlogPost(payload as unknown as Omit<BlogPost, 'id'>);
    }

    setIsModalOpen(false);
    await fetchBlogs();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setLoading(true);
      await deleteBlogPost(id);
      await fetchBlogs();
    }
  };

  if (loading && blogs.length === 0) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary w-8 h-8"/></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-500 mt-1">Write, edit, and publish engaging articles.</p>
        </div>
        <Button onClick={() => openForm()} className="bg-primary hover:bg-primary/90 text-white rounded-none">
          <Plus className="w-4 h-4 mr-2" /> Write Post
        </Button>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-widest text-gray-500">
              <th className="p-4 font-bold">Article Details</th>
              <th className="p-4 font-bold">Date Published</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className={loading ? 'opacity-50' : ''} style={{display: loading ? 'table-row' : 'none'}}>
              <td colSpan={3} className="p-4 text-center text-sm text-gray-400">Updating...</td>
            </tr>
            {blogs.map(blog => (
              <tr key={blog.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-start gap-4">
                    {blog.image ? (
                      <img src={blog.image} alt={blog.title} className="w-16 h-12 object-cover bg-gray-100 hidden sm:block" />
                    ) : (
                      <div className="w-16 h-12 bg-gray-100 hidden sm:block" />
                    )}
                    <div>
                      <p className="font-bold text-sm text-gray-900">{blog.title}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{blog.excerpt}</p>
                      <p className="text-[10px] text-primary uppercase tracking-widest mt-1">/{blog.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-600">
                  {new Date(blog.date).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openForm(blog)}>
                      <Pencil className="w-4 h-4 text-gray-600" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(blog.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8 rounded-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-bold">{editingId ? 'Edit Post' : 'Write Post'}</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="w-6 h-6 text-gray-500"/></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-widest font-bold mb-2">Title</label>
                  <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="rounded-none h-12 text-lg font-bold"/>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold mb-2">URL Slug (Optional)</label>
                  <Input placeholder="my-custom-url" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="rounded-none"/>
                  <p className="text-xs text-gray-400 mt-1">Leave blank to auto-generate from title.</p>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold mb-2">Publish Date</label>
                  <Input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="rounded-none"/>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-widest font-bold mb-2">Header Image / Thumbnail (URL)</label>
                  <Input value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="rounded-none"/>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-widest font-bold mb-2">Short Excerpt</label>
                  <Input required value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="rounded-none"/>
                  <p className="text-xs text-gray-400 mt-1">Appears on the blog listing page under the title.</p>
                </div>
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold mb-2">Main Content</label>
                <textarea 
                  required className="w-full min-h-[300px] border border-gray-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed font-mono"
                  value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})}
                  placeholder="Support simple text formatting. Use paragraphs."
                />
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-none px-6">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-white rounded-none h-12 px-10 uppercase tracking-widest">
                  {editingId ? 'Save Edits' : 'Publish Post'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
