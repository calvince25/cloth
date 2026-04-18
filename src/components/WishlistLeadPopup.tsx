import React, { useState } from 'react';
import { X, Heart, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useWishlist } from '@/context/WishlistContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface WishlistLeadPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WishlistLeadPopup({ isOpen, onClose }: WishlistLeadPopupProps) {
  const { submitLead } = useWishlist();
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await submitLead(formData.name, formData.phone);
    setLoading(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-md relative z-10 p-10 shadow-2xl overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full" />
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8 relative">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-primary fill-primary" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-secondary">Save Your Favorites</h2>
              <p className="text-gray-500 mt-2 text-sm leading-relaxed text-balance">
                Provide your details to save your wishlist. We'll follow up with styling tips and availability!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold">Full Name</label>
                <Input 
                  required 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Jane Wanjiru" 
                  className="rounded-none h-12 border-gray-200" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold">WhatsApp Number</label>
                <Input 
                  required 
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+254 7XX XXX XXX" 
                  className="rounded-none h-12 border-gray-200" 
                />
              </div>
              
              <Button 
                type="submit"
                disabled={loading}
                className="w-full bg-secondary hover:bg-secondary/90 text-white rounded-none h-14 uppercase tracking-widest font-bold flex justify-center items-center gap-2"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                Save My Wishlist
              </Button>
              
              <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest">
                Safe & Secure • Direct WhatsApp Support
              </p>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
