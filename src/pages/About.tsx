import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Heart, Users, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const team = [
  {
    name: 'Amara Njeri',
    role: 'Founder & Creative Director',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'David Kimani',
    role: 'Head of Styling',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Lisa Wanjiru',
    role: 'Customer Experience',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop',
  },
];

const values = [
  {
    icon: Heart,
    title: 'Passion for Fashion',
    desc: 'Every piece in our collection is handpicked with love and an eye for quality that stands the test of time.',
  },
  {
    icon: Users,
    title: 'Community First',
    desc: 'We celebrate the vibrant culture and style of Nairobi. Our community is our greatest inspiration.',
  },
  {
    icon: Truck,
    title: 'Reliable Delivery',
    desc: 'Same-day delivery across Nairobi. Order by noon, wear it by evening — that is our promise to you.',
  },
  {
    icon: ShieldCheck,
    title: 'Quality Assured',
    desc: 'Every item undergoes rigorous quality checks before it reaches your door. No compromises.',
  },
];

export default function About() {
  return (
    <div className="pb-20">
      <Helmet>
        <title>About Us | Buver Nairobi</title>
        <meta name="description" content="Learn about Buver — Nairobi's favourite online fashion store. Our story, our team, and our mission." />
      </Helmet>

      {/* Hero — edge to edge */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=60&w=1600&auto=format&fit=crop"
          alt="About Buver"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-black/50" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4"
        >
          <span className="uppercase tracking-[0.4em] text-sm font-bold mb-4 text-primary">Our Story</span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight max-w-4xl">
            Dressing Nairobi, One Look at a Time
          </h1>
          <p className="text-lg text-gray-200 max-w-xl">
            Born in the heart of Nairobi. Built for the modern Kenyan. Buver is more than fashion — it's a lifestyle.
          </p>
        </motion.div>
      </section>

      {/* Story Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="uppercase tracking-[0.3em] text-xs font-bold text-primary mb-4 block">Who We Are</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 leading-tight">
                A Brand With Purpose, Style, and Soul
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                Buver was founded in 2020 with one simple goal: to make premium fashion accessible to every Kenyan. 
                We noticed a gap in the market — Nairobians wanted quality, trendy clothing delivered to their door 
                without the hassle of traffic, malls, or long queues.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Today, we serve thousands of customers across Nairobi and beyond, delivering everything from casual 
                everyday wear to statement pieces for special occasions. Our ordering process is simple — find your 
                piece, choose your size, and confirm your order directly via WhatsApp. Fashion has never been easier.
              </p>
              <Link to="/shop">
                <Button className="bg-secondary hover:bg-secondary/90 text-white rounded-none px-10 py-6 uppercase tracking-widest flex items-center gap-3">
                  Shop the Collection <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=60&w=800&auto=format&fit=crop"
                alt="Buver Store"
                className="w-full h-[550px] object-cover"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute -bottom-8 -right-8 bg-primary p-8 hidden md:block text-white">
                <p className="text-4xl font-serif font-bold">5+</p>
                <p className="text-sm uppercase tracking-widest">Years Serving Nairobi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full-width image break */}
      <section className="w-full h-[50vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=60&w=1600&auto=format&fit=crop"
          alt="Fashion lifestyle"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
        />
      </section>

      {/* Values */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="uppercase tracking-[0.3em] text-xs font-bold text-primary mb-4 block">What We Stand For</span>
            <h2 className="text-4xl font-serif font-bold">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((val, i) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 border border-gray-100 shadow-sm text-center"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <val.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-serif font-bold mb-4">{val.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="uppercase tracking-[0.3em] text-xs font-bold text-primary mb-4 block">The People Behind Buver</span>
            <h2 className="text-4xl font-serif font-bold">Meet Our Team</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group text-center"
              >
                <div className="aspect-[3/4] overflow-hidden mb-6">
                  <img
                    src={`${member.image}&q=60&w=400`}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <h3 className="text-xl font-serif font-bold">{member.name}</h3>
                <p className="text-primary text-sm uppercase tracking-widest mt-1">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — full width */}
      <section className="relative h-[50vh] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=60&w=1600&auto=format&fit=crop"
          alt="Shop now"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-center px-4">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Ready to Elevate Your Style?</h2>
          <Link to="/shop">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-none px-12 py-7 text-lg uppercase tracking-widest">
              Browse the Collection
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
