import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShoppingCart, Heart, MessageCircle, Truck, RefreshCw, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { getProductById, getProducts } from '@/lib/supabase';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ProductCard from '@/components/ProductCard';
import { cn } from '@/lib/utils';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    async function loadProductData() {
      if (!id) return;
      setLoading(true);
      const fetchedProduct = await getProductById(id);
      setProduct(fetchedProduct);

      if (fetchedProduct) {
        const allProducts = await getProducts();
        const related = allProducts
          .filter(p => p.category === fetchedProduct.category && p.id !== fetchedProduct.id)
          .slice(0, 4);
        setRelatedProducts(related);
      }
      setLoading(false);
    }
    loadProductData();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-40 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-gray-500 italic">Finding your piece...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif font-bold mb-4">Product Not Found</h2>
        <Link to="/shop">
          <Button className="bg-primary text-white">Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(product.price);

  const whatsappUrl = `https://wa.me/254700000000?text=${encodeURIComponent(`Hello Buver! I would like to order:
🛍️ *Product:* ${product.name}
📏 *Size:* ${selectedSize || 'Not specified'}
💰 *Price:* ${formattedPrice}
🔗 *Link:* ${window.location.href}
🖼️ *Image:* ${product.images[0]}

Please confirm availability.`)}`;

  return (
    <div className="pb-20 pt-24">
      <Helmet>
        <title>{product.name} | Buver Nairobi</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 mb-8">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to={`/${product.category}`} className="hover:text-primary">{product.category}</Link>
          <span>/</span>
          <span className="text-secondary font-bold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Gallery */}
          <div className="flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto max-h-[600px] shrink-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  className={cn(
                    "w-20 h-24 border-2 transition-all shrink-0",
                    activeImage === idx ? "border-primary" : "border-transparent"
                  )}
                  onClick={() => setActiveImage(idx)}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
            <div className="flex-grow aspect-[3/4] overflow-hidden bg-gray-100">
              <motion.img
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-6">
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-2">{product.subCategory}</p>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{product.name}</h1>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-secondary">{formattedPrice}</span>
                {product.isSale && (
                  <Badge className="bg-primary text-white rounded-none uppercase tracking-widest px-3">Sale</Badge>
                )}
              </div>
            </div>

            <Separator className="my-8" />

            {/* Urgency Indicator */}
            <div className="bg-orange-50 border border-orange-100 p-4 rounded-sm flex items-center gap-3 mb-8">
              <AlertCircle className="w-5 h-5 text-primary" />
              <p className="text-sm font-medium text-primary">Limited Stock: Only 3 left in Nairobi warehouse!</p>
            </div>

            {/* Size Selector */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm uppercase tracking-widest font-bold">Select Size</h3>
                <button className="text-xs underline text-gray-500">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    className={cn(
                      "w-12 h-12 flex items-center justify-center border transition-all text-sm font-medium",
                      selectedSize === size 
                        ? "border-secondary bg-secondary text-white" 
                        : "border-gray-200 hover:border-secondary"
                    )}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 mb-8">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-none h-14 text-lg uppercase tracking-widest"
                  disabled={!selectedSize}
                >
                  <MessageCircle className="w-5 h-5 mr-2" /> Confirm Order via WhatsApp
                </Button>
              </a>
              <div className="flex gap-4">
                <Button variant="outline" className="flex-grow h-14 rounded-none border-gray-200 uppercase tracking-widest">
                  <Heart className="w-5 h-5 mr-2" /> Wishlist
                </Button>
                <Button variant="outline" className="h-14 w-14 rounded-none border-gray-200">
                  <ShoppingCart className="w-6 h-6" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8 border-y border-gray-100">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-gray-400" />
                <span className="text-xs uppercase tracking-widest font-medium">Fast Delivery</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-gray-400" />
                <span className="text-xs uppercase tracking-widest font-medium">WhatsApp Support</span>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-gray-400" />
                <span className="text-xs uppercase tracking-widest font-medium">Easy Returns</span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-12">
              <h3 className="text-sm uppercase tracking-widest font-bold mb-4">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description} Our {product.name} is designed with the Nairobi lifestyle in mind. 
                Crafted from premium materials, it offers both comfort and style for any occasion.
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-32">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold mb-4">You May Also Like</h2>
              <div className="w-16 h-1 bg-primary mx-auto" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
