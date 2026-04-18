import { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { getProducts } from '@/lib/supabase';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { cn, getImageUrl } from '@/lib/utils';

interface ShopProps {
  category?: 'women' | 'men' | 'kids';
  filter?: 'new' | 'sale';
}

const CATEGORY_CONFIG = {
  women: {
    title: "Women's Collection",
    subtitle: 'Explore our curated selection of premium womenswear  tailored for every style.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b',
  },
  men: {
    title: "Men's Collection",
    subtitle: 'Sharp, sophisticated menswear designed for the modern Nairobi gentleman.',
    image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891',
  },
  kids: {
    title: "Kids' Collection",
    subtitle: 'Fun, durable, and stylish clothing to keep your little ones looking their best.',
    image: 'https://images.unsplash.com/photo-1514090458221-65bb69af63e6',
  },
  sale: {
    title: 'Sale',
    subtitle: 'Incredible deals on premium fashion. Limited time — limited stock.',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da',
  },
  new: {
    title: 'New Arrivals',
    subtitle: 'Fresh pieces just landed. Be the first to own the latest trends in Nairobi.',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f',
  },
  all: {
    title: 'All Collection',
    subtitle: 'Browse our full range of premium fashion for women, men, and kids.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
  },
};

export default function Shop({ category, filter }: ShopProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (category) result = result.filter(p => p.category === category);
    if (filter === 'new') result = result.filter(p => p.isNew);
    else if (filter === 'sale') result = result.filter(p => p.isSale);
    if (activeSubCategory) result = result.filter(p => p.subCategory === activeSubCategory);
    return result;
  }, [category, filter, activeSubCategory, products]);

  const subCategories = useMemo(() => {
    const cats = products
      .filter(p => !category || p.category === category)
      .map(p => p.subCategory);
    return Array.from(new Set(cats));
  }, [category, products]);

  const configKey = category || (filter === 'sale' ? 'sale' : filter === 'new' ? 'new' : 'all');
  const config = CATEGORY_CONFIG[configKey as keyof typeof CATEGORY_CONFIG] || CATEGORY_CONFIG.all;

  const pageTitle = config.title;

  return (
    <div className="pb-20">
      <Helmet>
        <title>{pageTitle} | Buver Nairobi</title>
        <meta name="description" content={`${config.subtitle} Shop at Buver Nairobi.`} />
      </Helmet>

      {/* Hero — edge to edge */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <img
          src={getImageUrl(config.image, 1800, 75)}
          alt={pageTitle}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/45" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4"
        >
          <span className="uppercase tracking-[0.4em] text-sm font-bold mb-4 text-primary">
            {filter === 'sale' ? '🔥 Limited Time Deals' : filter === 'new' ? '✨ Just Landed' : 'Buver Collection'}
          </span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4 leading-tight">{pageTitle}</h1>
          <p className="text-gray-200 text-lg max-w-xl">{config.subtitle}</p>
        </motion.div>
      </section>

      <div className="container mx-auto px-4 mt-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="sticky top-24">
              <h3 className="text-sm uppercase tracking-widest font-bold mb-6">Categories</h3>
              <div className="flex flex-wrap lg:flex-col gap-2">
                <Button
                  variant="ghost"
                  className={cn(
                    'justify-start rounded-none px-4 py-2 h-auto text-sm',
                    !activeSubCategory ? 'bg-gray-100 font-bold' : 'text-gray-500'
                  )}
                  onClick={() => setActiveSubCategory(null)}
                >
                  All {category || 'Items'}
                </Button>
                {subCategories.map(cat => (
                  <Button
                    key={cat}
                    variant="ghost"
                    className={cn(
                      'justify-start rounded-none px-4 py-2 h-auto text-sm',
                      activeSubCategory === cat ? 'bg-gray-100 font-bold' : 'text-gray-500'
                    )}
                    onClick={() => setActiveSubCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>


            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-8">
              <p className="text-sm text-gray-500">
                {loading ? 'Loading…' : `Showing ${filteredProducts.length} products`}
              </p>
              <select className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer">
                <option>Sort by: Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Most Popular</option>
              </select>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-gray-500 italic">Curating the collection…</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500 italic">No products found in this category.</p>
                <Button
                  variant="link"
                  className="mt-4 text-primary"
                  onClick={() => setActiveSubCategory(null)}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
