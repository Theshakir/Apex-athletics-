/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CountdownTimer } from './components/CountdownTimer';
import { HomeAnnouncements } from './components/HomeAnnouncements';
import { SponsorsSection } from './components/SponsorsSection';
import { EventCard } from './components/EventCard';
import { EventRegistrationModal } from './components/EventRegistrationModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AccessDeniedView } from './components/AccessDeniedView';
import { AboutView } from './components/AboutView';
import { EventsView } from './components/EventsView';
import { GalleryView } from './components/GalleryView';
import { ResultsTable } from './components/ResultsTable';
import { CertificateVerification } from './components/CertificateVerification';
import { ContactView } from './components/ContactView';
import { db } from './lib/database';
import { MarathonEvent, EventRegistration } from './types';
import {
  Flame,
  ChevronRight,
  Trophy,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowUpRight,
  HeartPulse,
  Award,
  Zap,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [darkMode, setDarkMode] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  // Registration Modal state
  const [registeringEvent, setRegisteringEvent] = useState<MarathonEvent | null>(null);
  const [featuredEvent, setFeaturedEvent] = useState<MarathonEvent | null>(null);

  // Certificate search state passed from Results table
  const [certSearchTerm, setCertSearchTerm] = useState('');

  useEffect(() => {
    // Fetch featured event for home page
    db.getEvents().then((events) => {
      const featured = events.find((e) => e.featured) || events[0] || null;
      setFeaturedEvent(featured);
    });
  }, []);

  const handleVerifyCertFromResults = (certNo: string) => {
    setCertSearchTerm(certNo);
    setActiveTab('verify');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegisterClick = (eventToRegister?: MarathonEvent) => {
    if (eventToRegister) {
      setRegisteringEvent(eventToRegister);
    } else if (featuredEvent) {
      setRegisteringEvent(featuredEvent);
    }
  };

  return (
    <div className={`${darkMode ? 'dark bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-900'} min-h-screen font-sans flex flex-col selection:bg-orange-500 selection:text-white transition-colors duration-200`}>
      {/* Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdmin={isAdmin}
        onOpenAdminModal={() => setAdminModalOpen(true)}
        onLogoutAdmin={() => setIsAdmin(false)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onRegisterClick={() => handleRegisterClick()}
      />

      {/* Main Page Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
        {/* --- PAGE 1: HOME --- */}
        {activeTab === 'home' && (
          <div className="space-y-12 animate-in fade-in duration-300">
            {/* Hero Section */}
            <section className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-8 sm:p-14 lg:p-20 shadow-2xl">
              {/* Background Glow Accents */}
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-red-600/20 to-orange-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-orange-600/15 to-amber-500/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-3xl space-y-6">
                {/* Location & Organization Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-black uppercase tracking-widest shadow-inner">
                  <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
                  <span>Kulgam, Jammu & Kashmir • India</span>
                </div>

                {/* Title */}
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase leading-none font-mono">
                  APEX <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-amber-400">ATHLETICS</span>
                </h1>

                {/* Tagline */}
                <p className="text-xl sm:text-3xl font-extrabold text-orange-400 tracking-wide font-sans">
                  "Run Beyond Limits."
                </p>

                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal max-w-2xl">
                  South Kashmir's premier marathon organization uniting runners, promoting endurance, and advocating for a healthy, drug-free youth across the breathtaking valley of Kulgam.
                </p>

                {/* Call-to-action Buttons */}
                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => handleRegisterClick()}
                    id="hero-cta-register-btn"
                    className="px-7 py-4 rounded-2xl font-black text-sm bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:from-red-500 hover:to-orange-400 text-white shadow-xl shadow-orange-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <span>Register Now</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('gallery');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    id="hero-cta-gallery-btn"
                    className="px-7 py-4 rounded-2xl font-bold text-sm bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 hover:border-zinc-700 transition-all flex items-center gap-2"
                  >
                    <span>View Gallery</span>
                    <ArrowUpRight className="w-4 h-4 text-orange-400" />
                  </button>
                </div>

                {/* Quick Trust Badges */}
                <div className="pt-6 border-t border-zinc-800/80 flex flex-wrap items-center gap-6 text-xs text-zinc-400 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Chip Timing & E-Certificates
                  </span>
                  <span className="flex items-center gap-1.5">
                    <HeartPulse className="w-4 h-4 text-red-400" /> Say No To Drugs Campaign
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-400" /> Heavy Finisher Medals
                  </span>
                </div>
              </div>
            </section>

            {/* Live Countdown Timer Section */}
            <CountdownTimer
              targetDateStr={featuredEvent ? featuredEvent.date : '2026-09-20'}
              targetTitle={featuredEvent ? featuredEvent.title : 'Apex Kulgam Half Marathon 2026'}
              location={featuredEvent ? featuredEvent.location : 'Kulgam Sports Stadium, J&K'}
              onRegisterClick={() => handleRegisterClick(featuredEvent || undefined)}
            />

            {/* Upcoming Marathon Showcase */}
            {featuredEvent && (
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest mb-1">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Next Featured Race</span>
                    </div>
                    <h2 className="text-3xl font-black text-white">Upcoming Marathon Details</h2>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('events');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-xs font-bold text-orange-400 hover:underline flex items-center gap-1"
                  >
                    <span>View All Races</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="max-w-xl">
                  <EventCard
                    event={featuredEvent}
                    onRegister={(evt) => handleRegisterClick(evt)}
                  />
                </div>
              </section>
            )}

            {/* Announcements Feed */}
            <HomeAnnouncements />

            {/* Sponsors Section */}
            <SponsorsSection />
          </div>
        )}

        {/* --- PAGE 2: ABOUT --- */}
        {activeTab === 'about' && <AboutView />}

        {/* --- PAGE 3: EVENTS --- */}
        {activeTab === 'events' && <EventsView onRegister={(evt) => handleRegisterClick(evt)} />}

        {/* --- PAGE 4: GALLERY --- */}
        {activeTab === 'gallery' && <GalleryView />}

        {/* --- PAGE 5: RESULTS --- */}
        {activeTab === 'results' && <ResultsTable onVerifyCert={handleVerifyCertFromResults} />}

        {/* --- PAGE 6: CERTIFICATE VERIFICATION --- */}
        {activeTab === 'verify' && <CertificateVerification initialSearchTerm={certSearchTerm} />}

        {/* --- PAGE 7: CONTACT --- */}
        {activeTab === 'contact' && <ContactView />}

        {/* --- PAGE 8: ADMIN DASHBOARD (PROTECTED) --- */}
        {activeTab === 'admin' && (
          isAdmin ? (
            <AdminDashboard />
          ) : (
            <AccessDeniedView
              onOpenLogin={() => setAdminModalOpen(true)}
              onGoHome={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )
        )}
      </main>

      {/* Global Footer */}
      <Footer setActiveTab={setActiveTab} onOpenAdminModal={() => setAdminModalOpen(true)} />

      {/* Registration Modal */}
      {registeringEvent && (
        <EventRegistrationModal
          event={registeringEvent}
          onClose={() => setRegisteringEvent(null)}
          onSuccess={() => {
            // refresh data if needed
          }}
        />
      )}

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        onLoginSuccess={() => {
          setIsAdmin(true);
          setActiveTab('admin');
        }}
      />
    </div>
  );
}
