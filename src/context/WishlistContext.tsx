import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, WishlistLead } from '@/types';
import { supabase } from '@/lib/supabase';

interface WishlistContextType {
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
  submitLead: (name: string, phone: string) => Promise<void>;
  hasCapturedLead: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('buver_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [hasCapturedLead, setHasCapturedLead] = useState(() => {
    return localStorage.getItem('buver_lead_captured') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('buver_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const isInWishlist = (productId: string) => wishlist.some(p => p.id === productId);

  const toggleWishlist = async (product: Product) => {
    const isAdding = !isInWishlist(product.id);
    if (isAdding) {
      setWishlist(prev => [...prev, product]);
      // If we already have lead info, log it silently
      if (hasCapturedLead) {
        const leadInfo = JSON.parse(localStorage.getItem('buver_lead_info') || '{}');
        if (leadInfo.name && leadInfo.phone) {
          await supabase.from('wishlist_leads').insert([{
            product_id: product.id,
            customer_name: leadInfo.name,
            customer_phone: leadInfo.phone
          }]);
        }
      }
    } else {
      setWishlist(prev => prev.filter(p => p.id !== product.id));
    }
  };

  const submitLead = async (name: string, phone: string) => {
    localStorage.setItem('buver_lead_captured', 'true');
    localStorage.setItem('buver_lead_info', JSON.stringify({ name, phone }));
    setHasCapturedLead(true);

    // Link current wishlist items to this lead
    if (wishlist.length > 0) {
      const leads = wishlist.map(p => ({
        product_id: p.id,
        customer_name: name,
        customer_phone: phone
      }));
      await supabase.from('wishlist_leads').insert(leads);
    }
  };

  return (
    <WishlistContext.Provider value={{ 
      wishlist, 
      toggleWishlist, 
      isInWishlist, 
      wishlistCount: wishlist.length,
      submitLead,
      hasCapturedLead
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
