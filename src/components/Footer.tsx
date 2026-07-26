import React, { useState, useEffect } from 'react';
import { db } from '../lib/database';
import { ContactInfo } from '../types';
import {
  Flame,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Send,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenAdminModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenAdminModal }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: 'info@apexathleticskulgam.org',
    phone1: '+91 9596024318',
    phone2: '+91 6005032324',
    address: 'Near Sports Stadium, Main Chowk, Kulgam, Jammu & Kashmir, India - 192231',
    officeHours: 'Monday - Saturday: 09:00 AM - 05:00 PM IST',
  });

  useEffect(() => {
    db.getContactInfo().then(setContactInfo).catch(console.error);
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setTimeout(() => {
        setNewsletterSubscribed(false);
        setNewsletterEmail('');
      }, 4000);
    }
  };

  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-900 pt-16 pb-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-zinc-900">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-orange-500 to-amber-400 p-[2px]">
                <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                  <Flame className="w-5 h-5 text-orange-500" />
                </div>
              </div>
              <span className="font-black text-xl text-white tracking-wider font-mono">
                APEX<span className="text-orange-500">.</span>ATHLETICS
              </span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Empowering athletes, promoting fitness, and building a drug-free healthy youth community across Kulgam and Kashmir through world-class marathon events.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5" />
              <span>Tagline: "Run Beyond Limits."</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider font-mono">
              Quick Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Home Overview', id: 'home' },
                { label: 'About Apex Athletics', id: 'about' },
                { label: 'Upcoming Marathons', id: 'events' },
                { label: 'Photo & Video Gallery', id: 'gallery' },
                { label: 'Marathon Leaderboards & Results', id: 'results' },
                { label: 'Verify Certificate', id: 'verify' },
                { label: 'Contact & Location', id: 'contact' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => {
                      setActiveTab(link.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-orange-400 transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-orange-500 text-xs">›</span> {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider font-mono">
              Kulgam Headquarters
            </h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-1" />
                <span>{contactInfo.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="font-mono">
                  <a href={`tel:${contactInfo.phone1}`} className="hover:text-orange-400">{contactInfo.phone1}</a>
                  {contactInfo.phone2 && (
                    <>
                      <span className="mx-1 text-zinc-600">/</span>
                      <a href={`tel:${contactInfo.phone2}`} className="hover:text-orange-400">{contactInfo.phone2}</a>
                    </>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <a href={`mailto:${contactInfo.email}`} className="hover:text-orange-400 transition-colors">
                  {contactInfo.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-emerald-400 font-medium">Registered Sports & Fitness Body J&K</span>
              </div>
            </div>
          </div>

          {/* Newsletter & Socials */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider font-mono">
              Stay Informed
            </h3>
            <p className="text-xs text-zinc-400">
              Subscribe to get instant marathon announcements, route map releases, and bib allotment notifications.
            </p>
            {newsletterSubscribed ? (
              <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Subscribed! Check your inbox for updates.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2" id="footer-newsletter-form">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white rounded-xl text-xs font-bold transition-all shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            <div className="pt-2">
              <span className="text-xs font-semibold text-zinc-400 block mb-2 uppercase tracking-wider">Follow Apex Athletics</span>
              <div className="flex items-center gap-3">
                {[
                  { icon: Instagram, href: '#', label: 'Instagram' },
                  { icon: Facebook, href: '#', label: 'Facebook' },
                  { icon: Twitter, href: '#', label: 'Twitter' },
                  { icon: Youtube, href: '#', label: 'YouTube' },
                ].map((social, i) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={i}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-gradient-to-tr hover:from-red-600 hover:to-orange-500 text-zinc-400 hover:text-white flex items-center justify-center transition-all border border-zinc-800"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & admin portal trigger */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} Apex Athletics Kulgam, J&K. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <span>Built for Kulgam Marathon Community</span>
            <button
              onClick={onOpenAdminModal}
              id="footer-admin-portal-link"
              className="text-zinc-400 hover:text-orange-400 underline transition-colors"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
