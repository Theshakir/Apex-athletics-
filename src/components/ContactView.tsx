import React, { useState, useEffect } from 'react';
import { db } from '../lib/database';
import { ContactInfo } from '../types';
import { Mail, Phone, MapPin, Send, CheckCircle2, Instagram, Facebook, Twitter, Youtube, Clock } from 'lucide-react';

export const ContactView: React.FC = () => {
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

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'General Inquiry',
          message: '',
        });
      }, 5000);
    }
  };

  return (
    <div className="space-y-12 py-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest">
          <Mail className="w-4 h-4 text-orange-500" />
          <span>Get in Touch with Us</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white">Contact Apex Athletics</h2>
        <p className="text-sm text-zinc-400 max-w-xl mx-auto">
          Have questions regarding upcoming marathons, sponsorship opportunities, or bib distribution in Kulgam? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <h3 className="text-2xl font-black text-white">Send Us a Message</h3>

          {submitted ? (
            <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <h4 className="text-lg font-bold text-white">Thank You for Contacting Apex Athletics!</h4>
              <p className="text-xs text-zinc-300">
                Your message has been received by our Kulgam office team. We will get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 block">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Faizan Ahmad"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300 block">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="runner@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300 block">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 94190XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 block">Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Marathon Registration">Marathon Registration</option>
                  <option value="Certificate Correction">Certificate Correction</option>
                  <option value="Sponsorship & Media">Sponsorship & Media</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 block">Message *</label>
                <textarea
                  required
                  placeholder="How can we assist you?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 h-28"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 hover:opacity-95 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>

        {/* Contact Info & Map */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-xl font-bold text-white">Headquarters Info</h3>

            <div className="space-y-3 text-xs text-zinc-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">Main Office Address</strong>
                  <span>{contactInfo.address}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-500 shrink-0" />
                <div>
                  <strong className="text-white block font-semibold">Phone Support</strong>
                  <span className="font-mono text-zinc-200">
                    <a href={`tel:${contactInfo.phone1}`} className="hover:text-orange-400 transition-colors">{contactInfo.phone1}</a>
                    {contactInfo.phone2 && (
                      <>
                        <span className="mx-1.5 text-zinc-600">/</span>
                        <a href={`tel:${contactInfo.phone2}`} className="hover:text-orange-400 transition-colors">{contactInfo.phone2}</a>
                      </>
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-500 shrink-0" />
                <div>
                  <strong className="text-white block font-semibold">Official Email</strong>
                  <a href={`mailto:${contactInfo.email}`} className="text-orange-400 hover:underline font-medium">
                    {contactInfo.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange-500 shrink-0" />
                <div>
                  <strong className="text-white block font-semibold">Office Working Hours</strong>
                  <span>{contactInfo.officeHours}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-800">
              <span className="text-xs font-semibold text-zinc-400 block mb-2 uppercase">Connect on Social Media</span>
              <div className="flex items-center gap-3">
                {[
                  { icon: Instagram, href: '#' },
                  { icon: Facebook, href: '#' },
                  { icon: Twitter, href: '#' },
                  { icon: Youtube, href: '#' },
                ].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={i}
                      href={s.href}
                      className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-orange-400 hover:border-orange-500 transition-all"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Embedded Google Map for Kulgam, J&K */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden h-64 shadow-xl relative">
            <iframe
              title="Kulgam Jammu & Kashmir Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d53038.56208573216!2d74.98188175!3d33.64811465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e1f5ffadad3881%3A0xb35a3fa0bfa9343f!2sKulgam%2C%20Jammu%20and%20Kashmir%20192231!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              className="w-full h-full border-0 grayscale contrast-125 opacity-90 hover:opacity-100 transition-opacity"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
