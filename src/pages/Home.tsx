import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { ArrowRight, Truck, CreditCard, ShieldCheck, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { getProducts, getTestimonials } from '@/lib/supabase';
import { Product, Testimonial } from '@/types';
import { getImageUrl } from '@/lib/utils';

export default function Home() {
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      setLoading(true);
      const [productsData, testimonialsData] = await Promise.all([
        getProducts(),
        getTestimonials()
      ]);
      setTrendingProducts(productsData.filter(p => p.trending).slice(0, 4));
      setTestimonials(testimonialsData);
      setLoading(false);
    }
    loadHomeData();
  }, []);

  return (
    <>
      <Helmet>
        <title>Buy Clothes Online in Nairobi | Buver Kenya</title>
        <meta name="description" content="Shop affordable women, men & kids clothing online in Nairobi. Fast delivery across Kenya. Click to order via WhatsApp." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={getImageUrl("https://images.unsplash.com/photo-1490481651871-ab68de25d43d", 1600, 75)}
            alt="Hero Background"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >

            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">
              Nairobi’s Favourite Online Clothing Store
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-100 max-w-lg">
              Affordable fashion + fast delivery + WhatsApp ordering. Discover the latest trends curated for the modern Kenyan.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-none px-10 py-7 text-lg uppercase tracking-widest">
                  Shop Now
                </Button>
              </Link>
              <Link to="/women">
                <Button size="lg" variant="outline" className="text-white border-2 border-white bg-transparent hover:bg-white hover:text-secondary rounded-none px-10 py-7 text-lg uppercase tracking-widest font-bold">
                  Women
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-secondary text-white py-8 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center gap-4">
              <Truck className="w-6 h-6 text-primary" />
              <div>
                <p className="text-xs uppercase tracking-widest font-bold">Fast Delivery</p>
                <p className="text-[10px] text-gray-400">Same-day in Nairobi</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <CreditCard className="w-6 h-6 text-primary" />
              <div>
                <p className="text-xs uppercase tracking-widest font-bold">WhatsApp Ready</p>
                <p className="text-[10px] text-gray-400">Direct Order Confirmation</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <div>
                <p className="text-xs uppercase tracking-widest font-bold">Quality Assured</p>
                <p className="text-[10px] text-gray-400">Premium Fabrics</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <RefreshCw className="w-6 h-6 text-primary" />
              <div>
                <p className="text-xs uppercase tracking-widest font-bold">Easy Returns</p>
                <p className="text-[10px] text-gray-400">7-day policy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4">Shop by Category</h2>
            <div className="w-20 h-1 bg-primary mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Women', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b', href: '/women' },
              { name: 'Men', image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891', href: '/men' },
              { name: 'Kids', image: '/images/kids-collection.png', href: '/kids' },
            ].map((cat, idx) => (
              <Link key={cat.name} to={cat.href} className="group relative h-[500px] overflow-hidden">
                <img
                  src={getImageUrl(cat.image, 800)}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                  <h3 className="text-4xl font-serif font-bold mb-6">{cat.name}</h3>
                  <Button variant="outline" className="text-white border-2 border-white bg-transparent hover:bg-white hover:text-secondary rounded-none px-8 py-5 text-sm uppercase tracking-widest font-bold">
                    Explore
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-serif font-bold mb-2">Trending Now</h2>
              <p className="text-gray-500">Our most loved pieces this week in Nairobi.</p>
            </div>
            <Link to="/shop" className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-gray-500 italic">Curating trends...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {trendingProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-secondary text-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 leading-tight">
                Why Nairobi Chooses Buver
              </h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-primary flex items-center justify-center shrink-0">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Order via WhatsApp</h4>
                    <p className="text-gray-400">Instant order confirmation and support via WhatsApp. No complex checkout required.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-primary flex items-center justify-center shrink-0">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Same-day Nairobi Delivery</h4>
                    <p className="text-gray-400">Order by 12 PM and receive your package the same day in Westlands, Kilimani, CBD, and more.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-primary flex items-center justify-center shrink-0">
                    <RefreshCw className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Easy Returns</h4>
                    <p className="text-gray-400">Not the right fit? We offer a hassle-free 7-day return policy for all Nairobi orders.</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <div className="relative">
              <img
                src={getImageUrl("https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a", 800)}
                alt="Shopping Experience"
                className="w-full h-[600px] object-cover rounded-sm"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute -bottom-8 -left-8 bg-primary p-8 hidden md:block">
                <p className="text-4xl font-serif font-bold">10k+</p>
                <p className="text-sm uppercase tracking-widest">Happy Customers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4">What Our Clients Say</h2>
            <p className="text-gray-500">Real reviews from our community in Kenya.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loading ? (
              <div className="col-span-full flex justify-center py-10">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : (
              testimonials.map(t => (
                <div key={t.id} className="bg-white p-8 shadow-sm border border-gray-100">
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <span key={i} className="text-primary text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-lg italic mb-6">"{t.content}"</p>
                  <div>
                    <p className="font-bold">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.location}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gray-100 p-12 md:p-20 text-center max-w-5xl mx-auto">
            <h2 className="text-4xl font-serif font-bold mb-4">Get 10% Off Your First Order</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Join our community and be the first to know about new arrivals and exclusive offers in Nairobi.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-6 py-4 bg-white border-none focus:ring-2 focus:ring-primary outline-none"
                required
              />
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white rounded-none px-10 py-4 uppercase tracking-widest">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
