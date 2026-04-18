import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn, getImageUrl } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  key?: string | number;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(product.price);

  const formattedSalePrice = product.salePrice 
    ? new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 0,
      }).format(product.salePrice)
    : null;

  return (
    <motion.div
      className="group relative flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-sm">
        <Link to={`/product/${product.id}`}>
          <img
            src={getImageUrl(product.images[0], 600)}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <Badge className="bg-white text-secondary hover:bg-white border-none rounded-none px-3 py-1 text-[10px] uppercase tracking-widest font-bold">
              New
            </Badge>
          )}
          {product.isSale && (
            <Badge className="bg-primary text-white hover:bg-primary border-none rounded-none px-3 py-1 text-[10px] uppercase tracking-widest font-bold">
              Sale
            </Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Button size="icon" variant="secondary" className="rounded-full shadow-lg">
            <Heart className="w-4 h-4" />
          </Button>
          <Link to={`/product/${product.id}`}>
            <Button size="icon" variant="secondary" className="rounded-full shadow-lg">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
          <Button size="icon" variant="default" className="rounded-full shadow-lg">
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">
          {product.subCategory}
        </p>
        <Link to={`/product/${product.id}`} className="hover:text-primary transition-colors">
          <h3 className="text-lg font-serif font-medium mb-1">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-2">
          {product.isSale ? (
            <>
              <span className="text-primary font-bold">{formattedSalePrice}</span>
              <span className="text-gray-400 line-through text-sm">{formattedPrice}</span>
            </>
          ) : (
            <span className="text-secondary font-bold">{formattedPrice}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
