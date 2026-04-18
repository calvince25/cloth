import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, MessageCircle, Clock, Instagram, Facebook, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { submitContact } from '@/lib/supabase';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', info: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const { error } = await submitContact({
        name: formData.name,
        contact_info: formData.info,
        subject: formData.subject,
        message: formData.message,
      });

      if (error) {
        console.error('Submission Error:', error);
        setStatus('error');
      } else {
        setStatus('success');
        setFormData({ name: '', info: '', subject: '', message: '' });
      }
    } catch (err) {
      console.error('Submission Exception:', err);
      setStatus('error');
    }
  };

  return (
    <div className="pb-20">
      <Helmet>
        <title>Contact Us | Buver Nairobi</title>
        <meta name="description" content="Get in touch with Buver Nairobi. Fastest response via WhatsApp. We are here to help with your orders and inquiries." />
      </Helmet>

      {/* Hero — edge to edge */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=60&w=1600&auto=format&fit=crop"
          alt="Contact Buver"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-black/55" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4"
        >
          <span className="uppercase tracking-[0.4em] text-sm font-bold mb-4 text-primary">We're Here For You</span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4">Get In Touch</h1>
          <p className="text-gray-300 text-lg max-w-lg">
            Have a question about an order or want to know more about our collection? We'd love to hear from you.
          </p>
        </motion.div>
      </section>

      {/* Contact Cards */}
      <div className="container mx-auto px-4 -mt-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: MessageCircle, title: 'WhatsApp', sub: 'Fastest response', value: 'Chat Now', href: 'https://wa.me/254740791756', color: '#25D366' },
            { icon: Phone, title: 'Call Us', sub: 'Mon–Sat, 9am–6pm', value: '+254740791756', href: 'tel:+254740791756', color: '' },
            { icon: Mail, title: 'Email Us', sub: 'General inquiries', value: 'hello@buver.co.ke', href: 'mailto:hello@buver.co.ke', color: '' },
            { icon: Instagram, title: 'Instagram', sub: 'Follow for new drops', value: '@buver.ke', href: '#', color: '' },
          ].map((card) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 shadow-lg border border-gray-100 flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-5">
                <card.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-1">{card.title}</h3>
              <p className="text-gray-500 mb-4 text-sm">{card.sub}</p>
              <a href={card.href} target="_blank" rel="noopener noreferrer"
                className="text-secondary font-bold hover:text-primary transition-colors text-sm">
                {card.value}
              </a>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Form + Info */}
      <div className="container mx-auto px-4 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Contact Form */}
          <div>
            <span className="uppercase tracking-[0.3em] text-xs font-bold text-primary mb-4 block">Send a Message</span>
            <h2 className="text-4xl font-serif font-bold mb-8">How Can We Help?</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {status === 'success' && (
                <div className="bg-green-50 text-green-700 p-4 rounded-sm border border-green-100">
                  <p className="font-bold mb-1">Message Sent!</p>
                  <p className="text-sm">We've received your inquiry and will get back to you shortly.</p>
                </div>
              )}
              {status === 'error' && (
                <div className="bg-red-50 text-red-700 p-4 rounded-sm border border-red-100 text-sm">
                  There was an error sending your message. Please try again or use WhatsApp.
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold">Full Name</label>
                  <Input 
                    required 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Jane Wanjiru" 
                    className="rounded-none h-12 border-gray-200" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold">Phone / Email</label>
                  <Input 
                    required 
                    value={formData.info}
                    onChange={e => setFormData({...formData, info: e.target.value})}
                    placeholder="+254 7XX or email" 
                    className="rounded-none h-12 border-gray-200" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widests font-bold">Subject</label>
                <Input 
                  required 
                  value={formData.subject}
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                  placeholder="Order inquiry, returns, styling advice..." 
                  className="rounded-none h-12 border-gray-200" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold">Your Message</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full min-h-[160px] p-4 border border-gray-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="Tell us how we can help..."
                />
              </div>
              <Button 
                disabled={status === 'loading'}
                className="w-full bg-secondary hover:bg-secondary/90 text-white rounded-none h-14 uppercase tracking-widest flex justify-center items-center gap-2"
              >
                {status === 'loading' && <Loader2 className="w-5 h-5 animate-spin"/>}
                Send Message
              </Button>
              <p className="text-center text-sm text-gray-400">Or for fastest response, chat with us directly on WhatsApp</p>
              <a href="https://wa.me/254740791756" target="_blank" rel="noopener noreferrer" className="block w-full">
                <Button type="button" variant="outline" className="w-full h-14 rounded-none border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white uppercase tracking-widest">
                  <MessageCircle className="w-5 h-5 mr-2" /> Open WhatsApp Chat
                </Button>
              </a>
            </form>
          </div>

          {/* Info Panel */}
          <div>
            <span className="uppercase tracking-[0.3em] text-xs font-bold text-primary mb-4 block">Find Us</span>
            <h2 className="text-4xl font-serif font-bold mb-8">Visit or Reach Out</h2>
            
            <div className="space-y-6 mb-10">
              <div className="flex gap-4 items-start">
                <MapPin className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <p className="font-bold mb-1">Nairobi Headquarters</p>
                  <p className="text-gray-600">CBD, Kenyatta Avenue, Nairobi, Kenya</p>
                  <p className="text-gray-500 text-sm mt-1">Nationwide delivery available</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <Clock className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <p className="font-bold mb-1">Business Hours</p>
                  <p className="text-gray-600">Monday – Saturday: 9:00 AM – 6:00 PM</p>
                  <p className="text-gray-500 text-sm mt-1">Sunday: WhatsApp orders only</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <Facebook className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <p className="font-bold mb-1">Social Media</p>
                  <p className="text-gray-600">Follow us @buver.ke for new drops, styling tips and exclusive offers.</p>
                </div>
              </div>
            </div>

            {/* Location Image — edge to edge within its column */}
            <div className="w-full h-72 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=60&w=800&auto=format&fit=crop"
                alt="Nairobi CBD"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="bg-secondary text-white p-6 mt-0">
              <p className="text-sm uppercase tracking-widest font-bold mb-1">Same-Day Delivery</p>
              <p className="text-gray-400 text-sm">Order by 12:00 PM for same-day delivery in Nairobi CBD, Westlands, Kilimani, Karen, and more.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
