import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SizeGuideProps {
  isOpen: boolean;
  onClose: () => void;
  category: 'women' | 'men' | 'kids';
}

const SIZE_DATA = {
  women: [
    { size: 'XS', uk: '4-6', us: '0-2', eu: '32-34', bust: '80-84cm' },
    { size: 'S', uk: '8-10', us: '4-6', eu: '36-38', bust: '86-90cm' },
    { size: 'M', uk: '12-14', us: '8-10', eu: '40-42', bust: '94-98cm' },
    { size: 'L', uk: '16-18', us: '12-14', eu: '44-46', bust: '102-108cm' },
    { size: 'XL', uk: '20-22', us: '16-18', eu: '48-50', bust: '114-120cm' },
  ],
  men: [
    { size: 'S', chest: '91-96cm', collar: '37-38cm', waist: '76-81cm' },
    { size: 'M', chest: '99-104cm', collar: '39-40cm', waist: '84-89cm' },
    { size: 'L', chest: '106-111cm', collar: '41-42cm', waist: '91-97cm' },
    { size: 'XL', chest: '114-119cm', collar: '43-44cm', waist: '100-104cm' },
  ],
  kids: [
    { age: '2-3Y', height: '92-98cm', chest: '54cm' },
    { age: '4-5Y', height: '104-110cm', chest: '58cm' },
    { age: '6-7Y', height: '116-122cm', chest: '62cm' },
    { age: '8-9Y', height: '128-134cm', chest: '67cm' },
    { age: '10-11Y', height: '140-146cm', chest: '72cm' },
  ]
};

export default function SizeGuide({ isOpen, onClose, category }: SizeGuideProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
            className="bg-white w-full max-w-2xl relative z-10 p-8 md:p-12 shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-10">
              <span className="uppercase tracking-[0.3em] text-xs font-bold text-primary mb-2 block">Fit Guide</span>
              <h2 className="text-3xl font-serif font-bold capitalize">{category}'s Size Chart</h2>
              <p className="text-gray-500 mt-2">Standard global fashion measurements to help you find the perfect fit.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-secondary">
                    {category === 'women' && (
                      <>
                        <th className="py-4 font-bold uppercase tracking-widest">Size</th>
                        <th className="py-4 font-bold uppercase tracking-widest">UK</th>
                        <th className="py-4 font-bold uppercase tracking-widest">US</th>
                        <th className="py-4 font-bold uppercase tracking-widest">EU</th>
                        <th className="py-4 font-bold uppercase tracking-widest">Bust</th>
                      </>
                    )}
                    {category === 'men' && (
                      <>
                        <th className="py-4 font-bold uppercase tracking-widest">Size</th>
                        <th className="py-4 font-bold uppercase tracking-widest">Chest</th>
                        <th className="py-4 font-bold uppercase tracking-widest">Collar</th>
                        <th className="py-4 font-bold uppercase tracking-widest">Waist</th>
                      </>
                    )}
                    {category === 'kids' && (
                      <>
                        <th className="py-4 font-bold uppercase tracking-widest">Age</th>
                        <th className="py-4 font-bold uppercase tracking-widest">Height</th>
                        <th className="py-4 font-bold uppercase tracking-widest">Chest</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {category === 'women' && SIZE_DATA.women.map((row) => (
                    <tr key={row.size} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 font-bold">{row.size}</td>
                      <td className="py-4">{row.uk}</td>
                      <td className="py-4">{row.us}</td>
                      <td className="py-4">{row.eu}</td>
                      <td className="py-4">{row.bust}</td>
                    </tr>
                  ))}
                  {category === 'men' && SIZE_DATA.men.map((row) => (
                    <tr key={row.size} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 font-bold">{row.size}</td>
                      <td className="py-4">{row.chest}</td>
                      <td className="py-4">{row.collar}</td>
                      <td className="py-4">{row.waist}</td>
                    </tr>
                  ))}
                  {category === 'kids' && SIZE_DATA.kids.map((row) => (
                    <tr key={row.age} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 font-bold">{row.age}</td>
                      <td className="py-4">{row.height}</td>
                      <td className="py-4">{row.chest}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-10 p-6 bg-gray-50 border border-gray-100">
              <h4 className="font-bold mb-2">Not sure?</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                If you are between sizes, we generally recommend going a size up for a more comfortable fit. 
                For specific styling advice, chat with us on WhatsApp.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
