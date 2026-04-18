import React from 'react';
import { X, Trash2, ShoppingBag, MessageCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { getImageUrl } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, cartTotal, generateWhatsAppMessage, cartCount } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-[101] h-screen w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-serif font-bold text-secondary">Your Trolley</h2>
                <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">{cartCount}</span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-10 h-10 text-gray-200" />
                  </div>
                  <h3 className="text-lg font-serif font-bold mb-2">Trolley is Empty</h3>
                  <p className="text-gray-400 text-sm mb-8">Looks like you haven't added anything yet.</p>
                  <Button onClick={onClose} className="bg-primary text-white uppercase tracking-widest px-8">
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4 group">
                      <Link to={`/product/${item.id}`} onClick={onClose} className="w-24 h-32 shrink-0 bg-gray-100 overflow-hidden">
                        <img src={getImageUrl(item.images[0], 200)} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </Link>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-1">
                          <Link to={`/product/${item.id}`} onClick={onClose}>
                            <h4 className="font-bold text-secondary hover:text-primary transition-colors">{item.name}</h4>
                          </Link>
                          <button 
                            onClick={() => removeFromCart(item.id, item.selectedSize)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mb-2 uppercase tracking-widest">Size: {item.selectedSize}</p>
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-medium">Qty: {item.quantity}</p>
                          <p className="font-bold text-secondary">KES {new Intl.NumberFormat('en-KE').format(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t bg-gray-50/50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-500 uppercase tracking-widest text-sm font-bold">Subtotal</span>
                  <span className="text-2xl font-serif font-bold text-secondary">
                    KES {new Intl.NumberFormat('en-KE').format(cartTotal)}
                  </span>
                </div>
                <a 
                  href={`https://wa.me/254740791756?text=${generateWhatsAppMessage()}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button className="w-full h-14 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-none uppercase tracking-widest text-sm font-bold flex items-center justify-center gap-2">
                    <MessageCircle className="w-5 h-5" /> Checkout on WhatsApp
                  </Button>
                </a>
                <p className="text-[10px] text-center text-gray-400 mt-4 uppercase tracking-[0.2em]">
                  Fast same-day delivery available in Nairobi
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
