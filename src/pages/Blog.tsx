import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Loader2, Clock, Tag } from 'lucide-react';
import { motion } from 'motion/react';
import { getBlogPosts } from '@/lib/supabase';
import { BlogPost } from '@/types';
import { getImageUrl } from '@/lib/utils';

const CATEGORY_IMAGES: Record<string, string> = {
  fashion: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop',
  style: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=800&auto=format&fit=crop',
  default: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop',
};

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      setLoading(true);
      const data = await getBlogPosts();
      setPosts(data);
      setLoading(false);
    }
    loadPosts();
  }, []);

  return (
    <div className="pb-20">
      <Helmet>
        <title>Fashion Blog | Buver Nairobi</title>
        <meta name="description" content="Latest fashion trends, style tips, and news from Nairobi's favourite clothing store — Buver." />
      </Helmet>

      {/* Hero — edge to edge */}
      <section className="relative h-[65vh] w-full overflow-hidden">
        <img
          src={getImageUrl("https://images.unsplash.com/photo-1512436991641-6745cdb1723f", 1600, 75)}
          alt="Buver Fashion Blog"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-black/50" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4"
        >
          <span className="uppercase tracking-[0.4em] text-sm font-bold mb-4 text-primary">Buver Journal</span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">Style. Culture. Nairobi.</h1>
          <p className="text-gray-200 text-lg max-w-xl">
            Trend reports, style guides, and fashion stories curated for the modern Kenyan.
          </p>
        </motion.div>
      </section>

      {/* Posts Grid */}
      <div className="container mx-auto px-4 py-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-gray-500 italic">Loading articles...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl font-serif text-gray-400">No articles yet — check back soon!</p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {posts[0] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group mb-20"
              >
                <Link to={`/blog/${posts[0].slug}`} className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden">
                  <div className="aspect-[16/10] lg:aspect-auto lg:h-[480px] overflow-hidden">
                    <img
                      src={getImageUrl(posts[0].image, 1200)}
                      alt={posts[0].title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="bg-secondary text-white p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-primary mb-6">
                      <Tag className="w-3 h-3" />
                      <span>Featured</span>
                      <span className="text-gray-500">·</span>
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-400">{posts[0].date}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 leading-tight group-hover:text-primary transition-colors">
                      {posts[0].title}
                    </h2>
                    <p className="text-gray-400 leading-relaxed mb-8">{posts[0].excerpt}</p>
                    <span className="text-primary uppercase tracking-widest text-xs font-bold border-b border-primary pb-1 self-start">
                      Read Article →
                    </span>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Remaining Posts */}
            {posts.length > 1 && (
              <>
                <div className="flex items-center gap-4 mb-12">
                  <h2 className="text-2xl font-serif font-bold">More Articles</h2>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {posts.slice(1).map((post, idx) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="group"
                    >
                      <Link to={`/blog/${post.slug}`} className="block aspect-[16/10] overflow-hidden mb-6">
                        <img
                          src={getImageUrl(post.image || CATEGORY_IMAGES.default, 800)}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          decoding="async"
                        />
                      </Link>
                      <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-primary font-bold mb-4">
                        <span>Fashion</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className="text-gray-500 font-medium">
                          {new Date(post.date).toLocaleDateString('en-KE', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <Link to={`/blog/${post.slug}`}>
                        <h3 className="text-2xl font-serif font-bold mb-3 leading-tight group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 mb-5 leading-relaxed line-clamp-2">{post.excerpt}</p>
                      <Link to={`/blog/${post.slug}`} className="text-secondary font-bold uppercase tracking-widest text-xs hover:text-primary transition-colors">
                        Read More →
                      </Link>
                    </motion.article>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Bottom full-width banner */}
      <section className="w-full h-[40vh] overflow-hidden relative">
        <img
          src={getImageUrl("https://images.unsplash.com/photo-1483985988355-763728e1935b", 1600, 70)}
          alt="Explore the collection"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-center">
          <p className="uppercase tracking-[0.3em] text-sm mb-4 text-primary">Explore More</p>
          <h3 className="text-3xl font-serif font-bold mb-6">Discover the New Collection</h3>
          <Link to="/shop">
            <span className="border border-white px-10 py-4 uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all">
              Shop Now
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
