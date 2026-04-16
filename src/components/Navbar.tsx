import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Heart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { name: 'Women', href: '/women' },
  { name: 'Men', href: '/men' },
  { name: 'Kids', href: '/kids' },
  { name: 'New Arrivals', href: '/new' },
  { name: 'Sale', href: '/sale' },
];

const SECONDARY_LINKS = [
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 w-full transition-all duration-300',
          isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-2' : 'bg-white py-3'
        )}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Mobile Hamburger */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileOpen(prev => !prev)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Link to="/" className="text-3xl font-serif font-bold tracking-tighter">
            Buver
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  'text-sm font-medium uppercase tracking-widest hover:text-primary transition-colors',
                  location.pathname === link.href ? 'text-primary' : 'text-secondary/70'
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions + secondary links */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Secondary desktop links */}
            <div className="hidden lg:flex items-center gap-4 mr-2 border-l border-gray-200 pl-6">
              {SECONDARY_LINKS.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    'text-xs font-medium uppercase tracking-widest hover:text-primary transition-colors',
                    location.pathname === link.href ? 'text-primary' : 'text-gray-400'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Heart className="w-5 h-5" />
            </Button>
            <Link to="/shop">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  0
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <nav className="absolute top-0 left-0 w-[300px] h-full bg-white shadow-xl pt-20 px-8 flex flex-col gap-2 overflow-y-auto">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400 font-bold mb-2">Shop</p>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  'text-xl font-serif font-medium py-3 border-b border-gray-100 hover:text-primary transition-colors',
                  location.pathname === link.href ? 'text-primary' : ''
                )}
              >
                {link.name}
              </Link>
            ))}
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400 font-bold mb-2 mt-6">Company</p>
            {SECONDARY_LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  'text-xl font-serif font-medium py-3 border-b border-gray-100 hover:text-primary transition-colors',
                  location.pathname === link.href ? 'text-primary' : ''
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
