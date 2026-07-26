import React, { useState, useEffect } from 'react';
import { db } from '../lib/database';
import { ForceChangePasswordModal } from './ForceChangePasswordModal';
import {
  MarathonEvent,
  GalleryItem,
  Announcement,
  MarathonResult,
  CertificateRecord,
  EventRegistration,
  DashboardStats,
  ContactInfo,
  RegistrationFormConfig,
  GoogleSheetsConfig,
  AdminNotificationConfig,
  PaymentConfig,
} from '../types';
import { SUPABASE_SQL_SCHEMA, isSupabaseConfigured } from '../lib/supabase';
import {
  Trophy,
  Users,
  Calendar,
  Image as ImageIcon,
  ShieldCheck,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Bell,
  Database,
  Copy,
  Check,
  FileText,
  Search,
  Sparkles,
  Settings,
  PhoneCall,
  Save,
  Mail,
  ExternalLink,
  Eye,
  CheckSquare,
  X,
  Send,
  FileSpreadsheet,
  CreditCard,
  QrCode,
  Upload,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [activeAdminTab, setActiveAdminTab] = useState<
    | 'stats'
    | 'events'
    | 'reg_builder'
    | 'payment_settings'
    | 'contact_info'
    | 'gallery'
    | 'announcements'
    | 'results'
    | 'certificates'
    | 'registrations'
    | 'gsheets'
    | 'notifications'
    | 'supabase'
  >('stats');

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [events, setEvents] = useState<MarathonEvent[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [results, setResults] = useState<MarathonResult[]>([]);
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);

  // Registration Filter & Lightbox state
  const [registrationSearch, setRegistrationSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  // Editable Payment Settings State
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>({
    upiId: '9596024318@jio',
    secondaryUpiId: 'theshakir01@okaxis',
    accountHolderName: 'Apex Athletics / Shakir Yaqoob',
    qrCodeUrl: '',
    paymentInstructions: 'Scan the QR code using Google Pay, PhonePe, Paytm or BHIM UPI. Transfer the registration fee and enter the 12-digit UTR/Transaction ID with receipt proof screenshot.',
    registrationFee: '₹250',
  });
  const [paymentSaveMessage, setPaymentSaveMessage] = useState(false);

  // Editable Contact Info State
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: 'info@apexathleticskulgam.org',
    phone1: '+91 9596024318',
    phone2: '+91 6005032324',
    address: 'Near Sports Stadium, Main Chowk, Kulgam, Jammu & Kashmir, India - 192231',
    officeHours: 'Monday - Saturday: 09:00 AM - 05:00 PM IST',
  });
  const [contactSaveMessage, setContactSaveMessage] = useState(false);

  // Editable Registration Form Config State
  const [regConfig, setRegConfig] = useState<RegistrationFormConfig>({
    showTShirtSize: true,
    showRefreshments: true,
    showEmergencyContact: true,
    showGender: true,
    showAge: true,
    refreshmentOptions: ['Energy Drink & Fresh Fruits', 'Kashmir Herbal Kehwa & Dates', 'Standard Hydration Pack'],
    tShirtOptions: ['S (38)', 'M (40)', 'L (42)', 'XL (44)', 'XXL (46)'],
    customDeclarationNote: 'By registering, you confirm physical fitness for marathon participation and pledge commitment to a drug-free healthy Kashmir.',
  });
  const [regSaveMessage, setRegSaveMessage] = useState(false);
  const [newRefreshmentOpt, setNewRefreshmentOpt] = useState('');
  const [newTshirtOpt, setNewTshirtOpt] = useState('');

  // Google Sheets Integration State
  const [gsheetsConfig, setGsheetsConfig] = useState<GoogleSheetsConfig>({
    webhookUrl: '',
    enabled: false,
    sheetName: 'Marathon Registrations',
  });
  const [gsheetsSaveMessage, setGsheetsSaveMessage] = useState(false);

  // Admin Notification Config State
  const [notificationConfig, setNotificationConfig] = useState<AdminNotificationConfig>({
    notificationEmail: 'admin@apexathleticskulgam.org',
    webhookUrl: '',
    enabled: true,
  });
  const [notificationSaveMessage, setNotificationSaveMessage] = useState(false);

  const [copiedSql, setCopiedSql] = useState(false);

  // Form states for creating new records
  const [newEvent, setNewEvent] = useState({
    title: '',
    tagline: '',
    date: new Date().toISOString().split('T')[0],
    time: '06:00 AM IST',
    location: 'Sports Stadium Kulgam to Aharbal Road, J&K',
    distances: '21 KM, 10 KM, 5 KM',
    registrationStatus: 'open' as MarathonEvent['registrationStatus'],
    registrationFee: '₹350',
    description: '',
    routeDetails: '',
    image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=80',
    featured: false,
  });

  const [newGallery, setNewGallery] = useState({
    type: 'photo' as 'photo' | 'video',
    title: '',
    category: 'Marathons' as GalleryItem['category'],
    url: '',
    caption: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [newAnn, setNewAnn] = useState({
    title: '',
    content: '',
    category: 'Important' as Announcement['category'],
    pinned: false,
    date: new Date().toISOString().split('T')[0],
  });

  const [newResult, setNewResult] = useState({
    bibNumber: '',
    participantName: '',
    eventName: 'Apex Kulgam Half Marathon 2026',
    eventDate: new Date().toISOString().split('T')[0],
    distance: '21 KM',
    gender: 'Male' as MarathonResult['gender'],
    category: 'Open Male' as MarathonResult['category'],
    finishTime: '01:25:00',
    pace: '4:02 min/km',
    rank: 1,
    certificateNo: '',
  });

  const [newCert, setNewCert] = useState({
    certificateNumber: '',
    participantName: '',
    eventName: 'Apex Kulgam Half Marathon 2026',
    distance: '21 KM Half Marathon',
    eventDate: new Date().toISOString().split('T')[0],
    position: '1st Place',
    status: 'valid' as CertificateRecord['status'],
  });

  const refreshAllData = async () => {
    try {
      const [s, ev, gal, ann, res, cert, reg, contact, regCfg, gsheets, notif, pCfg] = await Promise.all([
        db.getDashboardStats(),
        db.getEvents(),
        db.getGallery(),
        db.getAnnouncements(),
        db.getResults(),
        db.getCertificates(),
        db.getRegistrations(),
        db.getContactInfo(),
        db.getRegistrationConfig(),
        db.getGoogleSheetsConfig(),
        db.getNotificationConfig(),
        db.getPaymentConfig(),
      ]);
      setStats(s);
      setEvents(ev);
      setGallery(gal);
      setAnnouncements(ann);
      setResults(res);
      setCertificates(cert);
      setRegistrations(reg);
      setContactInfo(contact);
      setRegConfig(regCfg);
      setGsheetsConfig(gsheets);
      setNotificationConfig(notif);
      setPaymentConfig(pCfg);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSavePaymentConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.savePaymentConfig(paymentConfig);
    setPaymentSaveMessage(true);
    setTimeout(() => setPaymentSaveMessage(false), 3500);
    refreshAllData();
  };

  const handleUpdatePaymentStatus = async (regId: string, status: 'Pending' | 'Approved' | 'Rejected') => {
    await db.updateRegistrationPaymentStatus(regId, status);
    refreshAllData();
  };

  const handleDeleteRegistration = async (regId: string) => {
    if (confirm('Are you sure you want to remove this participant registration record?')) {
      await db.deleteRegistration(regId);
      refreshAllData();
    }
  };

  const handleSaveContactInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.updateContactInfo(contactInfo);
    setContactSaveMessage(true);
    setTimeout(() => setContactSaveMessage(false), 3000);
    refreshAllData();
  };

  const handleSaveRegConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.updateRegistrationConfig(regConfig);
    setRegSaveMessage(true);
    setTimeout(() => setRegSaveMessage(false), 3000);
    refreshAllData();
  };

  const handleSaveGSheetsConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.updateGoogleSheetsConfig(gsheetsConfig);
    setGsheetsSaveMessage(true);
    setTimeout(() => setGsheetsSaveMessage(false), 3000);
    refreshAllData();
  };

  const handleSaveNotificationConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.updateNotificationConfig(notificationConfig);
    setNotificationSaveMessage(true);
    setTimeout(() => setNotificationSaveMessage(false), 3000);
    refreshAllData();
  };

  // State for Admin Security
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [adminEmail, setAdminEmail] = useState('theshakiryaqoob@gmail.com');

  useEffect(() => {
    refreshAllData();
    db.checkMustChangePassword().then((val) => setMustChangePassword(val));
    db.getAdminAccount().then((acct) => {
      if (acct?.email) setAdminEmail(acct.email);
    });
  }, []);

  // Handlers
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title) return;
    await db.addEvent({
      ...newEvent,
      distances: newEvent.distances.split(',').map((d) => d.trim()),
    });
    setNewEvent({
      title: '',
      tagline: '',
      date: new Date().toISOString().split('T')[0],
      time: '06:00 AM IST',
      location: 'Sports Stadium Kulgam to Aharbal Road, J&K',
      distances: '21 KM, 10 KM, 5 KM',
      registrationStatus: 'open',
      registrationFee: '₹350',
      description: '',
      routeDetails: '',
      image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=80',
      featured: false,
    });
    refreshAllData();
  };

  const handleDeleteEvent = async (id: string) => {
    if (confirm('Are you sure you want to delete this marathon event?')) {
      await db.deleteEvent(id);
      refreshAllData();
    }
  };

  const handleCreateGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGallery.title || !newGallery.url) return;
    await db.addGalleryItem(newGallery);
    setNewGallery({
      type: 'photo',
      title: '',
      category: 'Marathons',
      url: '',
      caption: '',
      date: new Date().toISOString().split('T')[0],
    });
    refreshAllData();
  };

  const handleDeleteGallery = async (id: string) => {
    await db.deleteGalleryItem(id);
    refreshAllData();
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnn.title || !newAnn.content) return;
    await db.addAnnouncement(newAnn);
    setNewAnn({
      title: '',
      content: '',
      category: 'Important',
      pinned: false,
      date: new Date().toISOString().split('T')[0],
    });
    refreshAllData();
  };

  const handleDeleteAnnouncement = async (id: string) => {
    await db.deleteAnnouncement(id);
    refreshAllData();
  };

  const handleCreateResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResult.participantName || !newResult.bibNumber) return;
    const certNo = newResult.certificateNo || `APEX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    await db.addResult({ ...newResult, certificateNo: certNo });

    // Auto-create certificate record as valid
    await db.addCertificate({
      certificateNumber: certNo,
      participantName: newResult.participantName,
      eventName: newResult.eventName,
      distance: newResult.distance,
      eventDate: newResult.eventDate,
      position: `${newResult.rank} Place (${newResult.category})`,
      status: 'valid',
    });

    setNewResult({
      bibNumber: '',
      participantName: '',
      eventName: 'Apex Kulgam Half Marathon 2026',
      eventDate: new Date().toISOString().split('T')[0],
      distance: '21 KM',
      gender: 'Male',
      category: 'Open Male',
      finishTime: '01:25:00',
      pace: '4:02 min/km',
      rank: 1,
      certificateNo: '',
    });
    refreshAllData();
  };

  const handleDeleteResult = async (id: string) => {
    await db.deleteResult(id);
    refreshAllData();
  };

  const handleCreateCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.certificateNumber || !newCert.participantName) return;
    await db.addCertificate(newCert);
    setNewCert({
      certificateNumber: '',
      participantName: '',
      eventName: 'Apex Kulgam Half Marathon 2026',
      distance: '21 KM Half Marathon',
      eventDate: new Date().toISOString().split('T')[0],
      position: 'Finisher',
      status: 'valid',
    });
    refreshAllData();
  };

  const handleDeleteCertificate = async (certNo: string) => {
    await db.deleteCertificate(certNo);
    refreshAllData();
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apex Athletics Admin Workspace</span>
          </div>
          <h2 className="text-3xl font-black text-white">Management Dashboard</h2>
          <p className="text-xs text-zinc-400">
            Control events, gallery media, announcements, marathon results, and certificate verification records.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2 bg-zinc-900 px-3.5 py-2 rounded-2xl border border-zinc-800 text-xs text-zinc-300 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Admin: <strong className="text-white font-bold">{adminEmail}</strong></span>
          </div>
          <button
            onClick={() => setMustChangePassword(true)}
            className="px-3.5 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Change Password</span>
          </button>
          <div className="flex items-center gap-2 bg-zinc-900 px-3 py-2 rounded-2xl border border-zinc-800 text-xs text-zinc-300">
            <Database className="w-4 h-4 text-orange-500" />
            <span>
              <strong className={isSupabaseConfigured() ? 'text-emerald-400' : 'text-amber-400'}>
                {isSupabaseConfigured() ? 'Supabase DB' : 'Persistent Storage'}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-zinc-800">
        {[
          { id: 'stats', label: 'Overview Stats', icon: Trophy },
          { id: 'events', label: 'Events Manager', icon: Calendar },
          { id: 'registrations', label: 'Registered Participants', icon: Users },
          { id: 'payment_settings', label: 'Payment Settings & QR', icon: CreditCard },
          { id: 'reg_builder', label: 'Registration Form Builder', icon: Settings },
          { id: 'contact_info', label: 'Contact & Email Settings', icon: PhoneCall },
          { id: 'gsheets', label: 'Google Sheets Integration', icon: FileSpreadsheet },
          { id: 'notifications', label: 'Admin Notifications', icon: Mail },
          { id: 'gallery', label: 'Gallery Manager', icon: ImageIcon },
          { id: 'announcements', label: 'Announcements', icon: Bell },
          { id: 'results', label: 'Marathon Results', icon: Trophy },
          { id: 'certificates', label: 'Certificate Verification DB', icon: ShieldCheck },
          { id: 'supabase', label: 'Supabase SQL Setup', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md shadow-orange-600/20'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* --- TAB 1: OVERVIEW STATS --- */}
      {activeAdminTab === 'stats' && stats && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Total Events', val: stats.totalEvents, icon: Calendar, color: 'text-orange-400' },
              { label: 'Active Events', val: stats.activeEvents, icon: Sparkles, color: 'text-emerald-400' },
              { label: 'Registered Runners', val: stats.totalParticipants, icon: Users, color: 'text-blue-400' },
              { label: 'Gallery Items', val: stats.totalGalleryItems, icon: ImageIcon, color: 'text-amber-400' },
              { label: 'Certificates DB', val: stats.totalCertificates, icon: ShieldCheck, color: 'text-emerald-400' },
              { label: 'Valid Records', val: stats.validCertificates, icon: CheckCircle2, color: 'text-emerald-400' },
            ].map((st, i) => {
              const Icon = st.icon;
              return (
                <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">{st.label}</span>
                    <Icon className={`w-4 h-4 ${st.color}`} />
                  </div>
                  <div className="text-3xl font-mono font-black text-white">{st.val}</div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-white text-base">Quick Action Shortcuts</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setActiveAdminTab('events')}
                  className="p-4 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-left text-xs space-y-1 transition-all"
                >
                  <Calendar className="w-5 h-5 text-orange-500" />
                  <span className="font-bold text-white block">Add New Event</span>
                  <span className="text-zinc-500">Publish marathon details</span>
                </button>
                <button
                  onClick={() => setActiveAdminTab('certificates')}
                  className="p-4 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-left text-xs space-y-1 transition-all"
                >
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-white block">Issue Certificate</span>
                  <span className="text-zinc-500">Add verification number</span>
                </button>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-3">
              <h3 className="font-bold text-white text-base">Registered Athletes Overview</h3>
              <p className="text-xs text-zinc-400">
                Current registrations recorded for upcoming Apex Athletics Kulgam events.
              </p>
              <div className="text-2xl font-black font-mono text-orange-400">
                {registrations.length} Active Signups
              </div>
              <button
                onClick={() => setActiveAdminTab('registrations')}
                className="text-xs font-bold text-orange-400 hover:underline"
              >
                View full registration list ›
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: MANAGE EVENTS --- */}
      {activeAdminTab === 'events' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Create Event Form */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-orange-500" /> Add New Marathon Event
            </h3>

            <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                required
                placeholder="Event Title (e.g. Apex Kulgam Half Marathon 2026)"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
              />
              <input
                type="text"
                placeholder="Tagline (e.g. Run Beyond Limits)"
                value={newEvent.tagline}
                onChange={(e) => setNewEvent({ ...newEvent, tagline: e.target.value })}
                className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
              />
              <input
                type="date"
                required
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
              />
              <input
                type="text"
                placeholder="Location (e.g. Kulgam Sports Stadium)"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
              />
              <input
                type="text"
                placeholder="Distances (comma separated: 21 KM, 10 KM, 5 KM)"
                value={newEvent.distances}
                onChange={(e) => setNewEvent({ ...newEvent, distances: e.target.value })}
                className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
              />
              <select
                value={newEvent.registrationStatus}
                onChange={(e) => setNewEvent({ ...newEvent, registrationStatus: e.target.value as any })}
                className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
              >
                <option value="open">Registration Open</option>
                <option value="upcoming">Upcoming</option>
                <option value="closed">Closed</option>
                <option value="completed">Completed</option>
              </select>
              <input
                type="text"
                placeholder="Registration Fee (e.g. ₹350)"
                value={newEvent.registrationFee}
                onChange={(e) => setNewEvent({ ...newEvent, registrationFee: e.target.value })}
                className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
              />
              <input
                type="url"
                placeholder="Header Banner Image URL"
                value={newEvent.image}
                onChange={(e) => setNewEvent({ ...newEvent, image: e.target.value })}
                className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
              />
              <textarea
                placeholder="Event Description..."
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                className="md:col-span-2 px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500 h-20"
              />
              <button
                type="submit"
                className="md:col-span-2 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-600/30"
              >
                Publish Event
              </button>
            </form>
          </div>

          {/* Events List */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-base">Published Events ({events.length})</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map((ev) => (
                <div key={ev.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3 flex justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-orange-400 uppercase">{ev.registrationStatus}</span>
                    <h5 className="font-bold text-white text-sm">{ev.title}</h5>
                    <p className="text-xs text-zinc-400">{ev.date} • {ev.location}</p>
                    <p className="text-[11px] text-zinc-500">{ev.distances.join(', ')}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteEvent(ev.id)}
                    className="p-2 text-zinc-500 hover:text-red-400 rounded-lg hover:bg-zinc-800 h-fit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB: REGISTRATION FORM BUILDER --- */}
      {activeAdminTab === 'reg_builder' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest mb-1">
                  <Settings className="w-3.5 h-3.5" />
                  <span>Interactive Form Builder</span>
                </div>
                <h3 className="text-xl font-black text-white">Marathon Registration Form Settings</h3>
                <p className="text-xs text-zinc-400">
                  Decide which fields and options appear in the public registration modal. Customize T-shirt choices, refreshment preferences, emergency contacts, and pledge notes.
                </p>
              </div>

              {regSaveMessage && (
                <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0">
                  <CheckCircle2 className="w-4 h-4" /> Form Saved!
                </div>
              )}
            </div>

            <form onSubmit={handleSaveRegConfig} className="space-y-6">
              {/* Field Toggles */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-orange-400">
                  Field Visibility Controls
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    {
                      id: 'showTShirtSize',
                      label: 'T-Shirt Size Selector',
                      desc: 'Collect apparel sizes (S, M, L, XL, XXL)',
                      val: regConfig.showTShirtSize,
                    },
                    {
                      id: 'showRefreshments',
                      label: 'Post-Run Refreshments',
                      desc: 'Collect refreshment preferences',
                      val: regConfig.showRefreshments,
                    },
                    {
                      id: 'showEmergencyContact',
                      label: 'Emergency Contact Phone',
                      desc: 'Collect safety contact for race day',
                      val: regConfig.showEmergencyContact,
                    },
                    {
                      id: 'showGender',
                      label: 'Gender Selection',
                      desc: 'Required for male/female rankings',
                      val: regConfig.showGender,
                    },
                    {
                      id: 'showAge',
                      label: 'Age Input',
                      desc: 'Required for masters/youth categories',
                      val: regConfig.showAge,
                    },
                  ].map((item) => (
                    <label
                      key={item.id}
                      className={`p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                        item.val
                          ? 'bg-zinc-950 border-orange-500/50 text-white'
                          : 'bg-zinc-950/50 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={item.val}
                        onChange={(e) =>
                          setRegConfig({ ...regConfig, [item.id]: e.target.checked })
                        }
                        className="mt-1 rounded bg-zinc-900 border-zinc-700 text-orange-500 focus:ring-0"
                      />
                      <div>
                        <strong className="text-xs font-bold block text-white">{item.label}</strong>
                        <span className="text-[11px] text-zinc-400 block">{item.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Options Lists */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* T-Shirt Options */}
                <div className="space-y-3 bg-zinc-950 p-5 border border-zinc-800 rounded-2xl">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    T-Shirt Size Options
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {regConfig.tShirtOptions?.map((opt, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-300 flex items-center gap-2"
                      >
                        {opt}
                        <button
                          type="button"
                          onClick={() =>
                            setRegConfig({
                              ...regConfig,
                              tShirtOptions: regConfig.tShirtOptions.filter((_, idx) => idx !== i),
                            })
                          }
                          className="text-zinc-500 hover:text-red-400"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="e.g. XXXL (48)"
                      value={newTshirtOpt}
                      onChange={(e) => setNewTshirtOpt(e.target.value)}
                      className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newTshirtOpt.trim()) {
                          setRegConfig({
                            ...regConfig,
                            tShirtOptions: [...regConfig.tShirtOptions, newTshirtOpt.trim()],
                          });
                          setNewTshirtOpt('');
                        }
                      }}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl"
                    >
                      Add Size
                    </button>
                  </div>
                </div>

                {/* Refreshment Options */}
                <div className="space-y-3 bg-zinc-950 p-5 border border-zinc-800 rounded-2xl">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Post-Run Refreshment Choices
                  </h4>
                  <div className="flex flex-col gap-2">
                    {regConfig.refreshmentOptions?.map((opt, i) => (
                      <div
                        key={i}
                        className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-300 flex items-center justify-between"
                      >
                        <span>{opt}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setRegConfig({
                              ...regConfig,
                              refreshmentOptions: regConfig.refreshmentOptions.filter(
                                (_, idx) => idx !== i
                              ),
                            })
                          }
                          className="text-zinc-500 hover:text-red-400 text-xs font-bold"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="e.g. Protein Shake & Energy Bar"
                      value={newRefreshmentOpt}
                      onChange={(e) => setNewRefreshmentOpt(e.target.value)}
                      className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newRefreshmentOpt.trim()) {
                          setRegConfig({
                            ...regConfig,
                            refreshmentOptions: [
                              ...regConfig.refreshmentOptions,
                              newRefreshmentOpt.trim(),
                            ],
                          });
                          setNewRefreshmentOpt('');
                        }
                      }}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl shrink-0"
                    >
                      Add Option
                    </button>
                  </div>
                </div>
              </div>

              {/* Declaration Note */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 block">
                  Declaration / Fitness Pledge Banner Note
                </label>
                <textarea
                  value={regConfig.customDeclarationNote}
                  onChange={(e) =>
                    setRegConfig({ ...regConfig, customDeclarationNote: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white h-20"
                />
              </div>

              <button
                type="submit"
                className="py-3 px-6 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-600/30 flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Registration Form Settings
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- TAB: PAYMENT SETTINGS & QR CODE --- */}
      {activeAdminTab === 'payment_settings' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-extrabold uppercase tracking-widest font-mono">
                  <CreditCard className="w-3 h-3" /> Admin Authorized Control
                </div>
                <h3 className="text-xl font-black text-white mt-1">Payment Settings & QR Code Manager</h3>
                <p className="text-xs text-zinc-400">
                  Configure official UPI IDs, Account Holder Name, payment instructions, and upload a custom QR Code image. Changes apply immediately to all registration payment screens.
                </p>
              </div>
              {paymentSaveMessage && (
                <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-2 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Payment Settings Saved!</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSavePaymentConfig} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Input Fields */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-300 block">
                      Primary UPI ID (Jio / GPay) *
                    </label>
                    <input
                      type="text"
                      required
                      value={paymentConfig.upiId}
                      onChange={(e) => setPaymentConfig({ ...paymentConfig, upiId: e.target.value })}
                      placeholder="e.g. 9596024318@jio"
                      className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-300 block">
                      Secondary UPI ID (Axis / PhonePe / Paytm)
                    </label>
                    <input
                      type="text"
                      value={paymentConfig.secondaryUpiId || ''}
                      onChange={(e) => setPaymentConfig({ ...paymentConfig, secondaryUpiId: e.target.value })}
                      placeholder="e.g. theshakir01@okaxis"
                      className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-300 block">
                      Account Holder Name / Entity *
                    </label>
                    <input
                      type="text"
                      required
                      value={paymentConfig.accountHolderName}
                      onChange={(e) => setPaymentConfig({ ...paymentConfig, accountHolderName: e.target.value })}
                      placeholder="e.g. Apex Athletics / Shakir Yaqoob"
                      className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-300 block">
                      Default Registration Fee
                    </label>
                    <input
                      type="text"
                      value={paymentConfig.registrationFee}
                      onChange={(e) => setPaymentConfig({ ...paymentConfig, registrationFee: e.target.value })}
                      placeholder="e.g. ₹250"
                      className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-300 block">
                      Payment Instructions for Participants
                    </label>
                    <textarea
                      rows={3}
                      value={paymentConfig.paymentInstructions}
                      onChange={(e) => setPaymentConfig({ ...paymentConfig, paymentInstructions: e.target.value })}
                      placeholder="Instructions displayed on the participant registration modal..."
                      className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Right Column: QR Code Upload & Live Preview */}
                <div className="space-y-4 bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-orange-400 font-mono flex items-center gap-1.5">
                    <QrCode className="w-4 h-4" /> QR Code Preview & Image Upload
                  </h4>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-zinc-300 block">
                      Upload Custom QR Code Image (PNG / JPG)
                    </label>

                    <div className="flex items-center gap-3">
                      <label className="flex-1 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl text-xs font-bold text-white transition-all cursor-pointer flex items-center justify-center gap-2">
                        <Upload className="w-4 h-4 text-orange-400" />
                        <span>Choose QR Image File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setPaymentConfig({ ...paymentConfig, qrCodeUrl: reader.result as string });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>

                      {paymentConfig.qrCodeUrl && (
                        <button
                          type="button"
                          onClick={() => setPaymentConfig({ ...paymentConfig, qrCodeUrl: '' })}
                          className="px-3.5 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0"
                        >
                          <Trash2 className="w-4 h-4" /> Reset SVG
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Live QR Code Preview */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center space-y-3">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono block font-bold">
                      Live Participant View Preview
                    </span>

                    <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl shadow-xl flex items-center justify-center border-2 border-orange-500/30">
                      {paymentConfig.qrCodeUrl ? (
                        <img
                          src={paymentConfig.qrCodeUrl}
                          alt="Custom QR Code"
                          className="w-full h-full object-contain rounded-lg"
                        />
                      ) : (
                        <div className="text-zinc-900 text-xs font-mono font-bold flex flex-col items-center gap-1">
                          <QrCode className="w-12 h-12 text-zinc-800" />
                          <span>Default Vector QR Code</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-bold text-white block">
                        {paymentConfig.accountHolderName || 'Apex Athletics Official'}
                      </span>
                      <span className="text-xs text-orange-400 font-mono font-bold block">
                        {paymentConfig.upiId}
                      </span>
                      {paymentConfig.secondaryUpiId && (
                        <span className="text-xs text-amber-400 font-mono block">
                          {paymentConfig.secondaryUpiId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-600/30 flex items-center gap-2 uppercase font-mono tracking-wider transition-all hover:opacity-95"
              >
                <Save className="w-4 h-4" /> Save Payment Settings
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- TAB: CONTACT & EMAIL SETTINGS --- */}
      {activeAdminTab === 'contact_info' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest mb-1">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Contact & Location Manager</span>
                </div>
                <h3 className="text-xl font-black text-white">Headquarters Contact & Email Settings</h3>
                <p className="text-xs text-zinc-400">
                  Update official phone support numbers, contact email, headquarters office address, and office working hours dynamically.
                </p>
              </div>

              {contactSaveMessage && (
                <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0">
                  <CheckCircle2 className="w-4 h-4" /> Contact Info Saved!
                </div>
              )}
            </div>

            <form onSubmit={handleSaveContactInfo} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300 block">Phone 1 (Primary Support) *</label>
                  <input
                    type="text"
                    required
                    value={contactInfo.phone1}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone1: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300 block">Phone 2 (Secondary Line)</label>
                  <input
                    type="text"
                    value={contactInfo.phone2}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone2: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 block">Official Support Email (Editable for Later) *</label>
                <input
                  type="email"
                  required
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 block">Headquarters Office Address</label>
                <input
                  type="text"
                  required
                  value={contactInfo.address}
                  onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 block">Office Working Hours</label>
                <input
                  type="text"
                  value={contactInfo.officeHours}
                  onChange={(e) => setContactInfo({ ...contactInfo, officeHours: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="py-3 px-6 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-600/30 flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Contact Details
              </button>
            </form>
          </div>
        </div>
      )}
      {activeAdminTab === 'gallery' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-orange-500" /> Upload Photo or Video to Gallery
            </h3>
            <form onSubmit={handleCreateGallery} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select
                value={newGallery.type}
                onChange={(e) => setNewGallery({ ...newGallery, type: e.target.value as any })}
                className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white"
              >
                <option value="photo">Photo Image URL</option>
                <option value="video">YouTube Embed Video URL</option>
              </select>
              <select
                value={newGallery.category}
                onChange={(e) => setNewGallery({ ...newGallery, category: e.target.value as any })}
                className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white"
              >
                <option value="Marathons">Marathons</option>
                <option value="Medal Ceremony">Medal Ceremony</option>
                <option value="Kulgam Scenic Route">Kulgam Scenic Route</option>
                <option value="Community & Fitness">Community & Fitness</option>
              </select>
              <input
                type="text"
                required
                placeholder="Title (e.g. 21K Finishers Group)"
                value={newGallery.title}
                onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })}
                className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white"
              />
              <input
                type="url"
                required
                placeholder="Image URL or Video Embed Link"
                value={newGallery.url}
                onChange={(e) => setNewGallery({ ...newGallery, url: e.target.value })}
                className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white"
              />
              <input
                type="text"
                placeholder="Caption description"
                value={newGallery.caption}
                onChange={(e) => setNewGallery({ ...newGallery, caption: e.target.value })}
                className="sm:col-span-2 px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white"
              />
              <button
                type="submit"
                className="sm:col-span-2 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-600/30"
              >
                Upload Gallery Item
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {gallery.map((g) => (
              <div key={g.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden relative group">
                <img src={g.thumbnail || g.url} alt={g.title} className="w-full h-32 object-cover" />
                <div className="p-3 space-y-1">
                  <span className="text-[10px] font-bold text-orange-400 block uppercase">{g.category}</span>
                  <h5 className="font-bold text-white text-xs truncate">{g.title}</h5>
                  <button
                    onClick={() => handleDeleteGallery(g.id)}
                    className="mt-2 text-red-400 hover:underline text-[10px] font-semibold"
                  >
                    Delete Item
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 4: ANNOUNCEMENTS --- */}
      {activeAdminTab === 'announcements' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-orange-500" /> Publish Announcement
            </h3>
            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <input
                type="text"
                required
                placeholder="Announcement Headline"
                value={newAnn.title}
                onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white"
              />
              <textarea
                required
                placeholder="Full content / update message..."
                value={newAnn.content}
                onChange={(e) => setNewAnn({ ...newAnn, content: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white h-24"
              />
              <div className="flex items-center gap-4 text-xs">
                <select
                  value={newAnn.category}
                  onChange={(e) => setNewAnn({ ...newAnn, category: e.target.value as any })}
                  className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white"
                >
                  <option value="Important">Important</option>
                  <option value="Registration">Registration</option>
                  <option value="Route">Route</option>
                  <option value="Event Day">Event Day</option>
                </select>
                <label className="flex items-center gap-2 text-zinc-300 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newAnn.pinned}
                    onChange={(e) => setNewAnn({ ...newAnn, pinned: e.target.checked })}
                    className="rounded border-zinc-800 bg-zinc-950 text-orange-500 focus:ring-0"
                  />
                  <span>Pin to Top</span>
                </label>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-600/30"
              >
                Publish Announcement
              </button>
            </form>
          </div>

          <div className="space-y-3">
            {announcements.map((a) => (
              <div key={a.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold text-orange-400 block uppercase">{a.category}</span>
                  <h5 className="font-bold text-white text-sm">{a.title}</h5>
                  <p className="text-xs text-zinc-400">{a.content}</p>
                </div>
                <button onClick={() => handleDeleteAnnouncement(a.id)} className="text-zinc-500 hover:text-red-400 p-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 5: MARATHON RESULTS --- */}
      {activeAdminTab === 'results' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-orange-500" /> Add Finisher Result & Issue Certificate
            </h3>
            <form onSubmit={handleCreateResult} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                required
                placeholder="Participant Full Name"
                value={newResult.participantName}
                onChange={(e) => setNewResult({ ...newResult, participantName: e.target.value })}
                className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white"
              />
              <input
                type="text"
                required
                placeholder="BIB Number (e.g. BIB-2101)"
                value={newResult.bibNumber}
                onChange={(e) => setNewResult({ ...newResult, bibNumber: e.target.value })}
                className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white font-mono"
              />
              <input
                type="text"
                placeholder="Certificate No (e.g. APEX-2026-1001 or Auto)"
                value={newResult.certificateNo}
                onChange={(e) => setNewResult({ ...newResult, certificateNo: e.target.value })}
                className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white font-mono"
              />
              <input
                type="text"
                placeholder="Finish Time (e.g. 01:14:22)"
                value={newResult.finishTime}
                onChange={(e) => setNewResult({ ...newResult, finishTime: e.target.value })}
                className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white font-mono"
              />
              <input
                type="number"
                min="1"
                placeholder="Rank Position (1, 2, 3...)"
                value={newResult.rank}
                onChange={(e) => setNewResult({ ...newResult, rank: Number(e.target.value) })}
                className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white"
              />
              <select
                value={newResult.distance}
                onChange={(e) => setNewResult({ ...newResult, distance: e.target.value })}
                className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white"
              >
                <option value="21 KM">21 KM Half Marathon</option>
                <option value="10 KM">10 KM Power Run</option>
                <option value="5 KM">5 KM Fun Run</option>
              </select>
              <button
                type="submit"
                className="sm:col-span-3 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-600/30"
              >
                Save Result & Register Certificate
              </button>
            </form>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-950 text-zinc-400 font-mono border-b border-zinc-800">
                <tr>
                  <th className="p-3">Rank</th>
                  <th className="p-3">BIB</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Certificate ID</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {results.map((r) => (
                  <tr key={r.id}>
                    <td className="p-3 font-bold">{r.rank}</td>
                    <td className="p-3 font-mono text-orange-400 font-bold">{r.bibNumber}</td>
                    <td className="p-3 text-white font-bold">{r.participantName}</td>
                    <td className="p-3 font-mono text-amber-400">{r.finishTime}</td>
                    <td className="p-3 font-mono">{r.certificateNo}</td>
                    <td className="p-3 text-right">
                      <button onClick={() => handleDeleteResult(r.id)} className="text-red-400 hover:underline">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 6: CERTIFICATE DATABASE --- */}
      {activeAdminTab === 'certificates' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-400" /> Add or Update Certificate Verification Record
            </h3>
            <form onSubmit={handleCreateCertificate} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                required
                placeholder="Certificate Number (e.g. APEX-2026-1001)"
                value={newCert.certificateNumber}
                onChange={(e) => setNewCert({ ...newCert, certificateNumber: e.target.value })}
                className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white font-mono uppercase"
              />
              <input
                type="text"
                required
                placeholder="Participant Name"
                value={newCert.participantName}
                onChange={(e) => setNewCert({ ...newCert, participantName: e.target.value })}
                className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white"
              />
              <input
                type="text"
                placeholder="Position (e.g. 1st Place - Male Open)"
                value={newCert.position}
                onChange={(e) => setNewCert({ ...newCert, position: e.target.value })}
                className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white"
              />
              <select
                value={newCert.status}
                onChange={(e) => setNewCert({ ...newCert, status: e.target.value as any })}
                className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white"
              >
                <option value="valid">Status: VALID ✅</option>
                <option value="invalid">Status: INVALID / REVOKED ❌</option>
              </select>
              <button
                type="submit"
                className="sm:col-span-2 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg"
              >
                Save Certificate Record
              </button>
            </form>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-950 text-zinc-400 font-mono border-b border-zinc-800">
                <tr>
                  <th className="p-3">Cert #</th>
                  <th className="p-3">Participant</th>
                  <th className="p-3">Event & Distance</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {certificates.map((c) => (
                  <tr key={c.certificateNumber}>
                    <td className="p-3 font-mono font-bold text-orange-400">{c.certificateNumber}</td>
                    <td className="p-3 font-bold text-white">{c.participantName}</td>
                    <td className="p-3 text-zinc-400">{c.eventName} ({c.distance})</td>
                    <td className="p-3">
                      {c.status === 'valid' ? (
                        <span className="text-emerald-400 font-bold">VALID ✅</span>
                      ) : (
                        <span className="text-red-400 font-bold">INVALID ❌</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button onClick={() => handleDeleteCertificate(c.certificateNumber)} className="text-red-400 hover:underline">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB: REGISTERED PARTICIPANTS --- */}
      {activeAdminTab === 'registrations' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-500" /> Registered Athletes ({registrations.length})
              </h3>
              <p className="text-xs text-zinc-400">
                Manage participant records, verify UTR payment receipts, approve/reject payment proofs, and assign bib numbers.
              </p>
            </div>

            {/* Filter and Search controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search ID, Name, Phone, UTR..."
                  value={registrationSearch}
                  onChange={(e) => setRegistrationSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value as any)}
                className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-orange-500"
              >
                <option value="All">All Payments</option>
                <option value="Pending">Pending Approval ⏳</option>
                <option value="Approved">Approved ✅</option>
                <option value="Rejected">Rejected ❌</option>
              </select>
            </div>
          </div>

          {/* Registrations Table */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-zinc-950 text-zinc-400 font-mono border-b border-zinc-800 uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">Reg ID</th>
                    <th className="p-3.5">Assigned BIB</th>
                    <th className="p-3.5">Participant Info</th>
                    <th className="p-3.5">Event & Category</th>
                    <th className="p-3.5">UTR / Txn ID</th>
                    <th className="p-3.5">Payment Screenshot</th>
                    <th className="p-3.5">Payment Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80">
                  {registrations
                    .filter((r) => {
                      const matchesFilter =
                        paymentFilter === 'All' || r.paymentStatus === paymentFilter;
                      const q = registrationSearch.toLowerCase().trim();
                      const matchesSearch =
                        !q ||
                        r.registrationId.toLowerCase().includes(q) ||
                        r.fullName.toLowerCase().includes(q) ||
                        r.phone.toLowerCase().includes(q) ||
                        (r.address && r.address.toLowerCase().includes(q)) ||
                        (r.email && r.email.toLowerCase().includes(q)) ||
                        r.utrNumber.toLowerCase().includes(q) ||
                        r.bibNumber.toLowerCase().includes(q);
                      return matchesFilter && matchesSearch;
                    })
                    .map((r) => (
                      <tr key={r.id} className="hover:bg-zinc-950/40 transition-colors">
                        <td className="p-3.5 font-mono font-black text-orange-400 text-sm">
                          #{r.registrationId || r.id}
                        </td>
                        <td className="p-3.5 font-mono text-white font-bold">{r.bibNumber}</td>
                        <td className="p-3.5 space-y-0.5">
                          <strong className="text-white font-bold block text-sm">{r.fullName}</strong>
                          <span className="text-zinc-400 block text-[11px] font-mono">
                            📞 {r.phone} {r.email ? `| ✉️ ${r.email}` : ''}
                          </span>
                          <span className="text-zinc-400 block text-[10px]">
                            📍 {r.address || 'Kulgam, J&K'}
                          </span>
                          <span className="text-zinc-500 block text-[10px]">
                            {r.gender}, {r.age} yrs | Size: {r.tShirtSize}
                          </span>
                        </td>
                        <td className="p-3.5 space-y-0.5">
                          <span className="text-white font-semibold block">{r.eventName}</span>
                          <span className="text-orange-400 font-bold block text-[11px]">{r.distance}</span>
                        </td>
                        <td className="p-3.5 font-mono font-bold text-zinc-300">
                          <span className="px-2 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-xs inline-block">
                            {r.utrNumber || 'N/A'}
                          </span>
                        </td>
                        <td className="p-3.5">
                          {r.paymentScreenshot ? (
                            <button
                              onClick={() => setSelectedScreenshot(r.paymentScreenshot || null)}
                              className="group flex items-center gap-2 p-1 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-orange-500 transition-all"
                            >
                              <img
                                src={r.paymentScreenshot}
                                alt="Screenshot"
                                className="w-10 h-10 object-cover rounded-lg border border-zinc-800"
                              />
                              <span className="text-[10px] font-bold text-orange-400 group-hover:underline flex items-center gap-1">
                                <Eye className="w-3 h-3" /> View Proof
                              </span>
                            </button>
                          ) : (
                            <span className="text-zinc-500 text-[11px] italic">No image uploaded</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase font-mono border inline-flex items-center gap-1 ${
                              r.paymentStatus === 'Approved'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : r.paymentStatus === 'Rejected'
                                ? 'bg-red-500/10 text-red-400 border-red-500/30'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            }`}
                          >
                            {r.paymentStatus === 'Approved'
                              ? 'Approved ✅'
                              : r.paymentStatus === 'Rejected'
                              ? 'Rejected ❌'
                              : 'Pending ⏳'}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-1">
                          <button
                            onClick={() => handleUpdatePaymentStatus(r.id, 'Approved')}
                            title="Approve Payment"
                            className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold transition-all"
                          >
                            <CheckSquare className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleUpdatePaymentStatus(r.id, 'Rejected')}
                            title="Reject Payment"
                            className="p-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-bold transition-all"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRegistration(r.id)}
                            title="Delete Record"
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB: GOOGLE SHEETS INTEGRATION --- */}
      {activeAdminTab === 'gsheets' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Google Sheets Webhook Sync</span>
                </div>
                <h3 className="text-xl font-black text-white">Automated Google Sheets Sync</h3>
                <p className="text-xs text-zinc-400">
                  Connect your Google Apps Script Webhook URL to automatically append every new marathon registration directly into your Google Spreadsheet.
                </p>
              </div>

              {gsheetsSaveMessage && (
                <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0">
                  <CheckCircle2 className="w-4 h-4" /> Config Saved!
                </div>
              )}
            </div>

            <form onSubmit={handleSaveGSheetsConfig} className="space-y-4">
              <label className="p-4 rounded-2xl border border-zinc-800 bg-zinc-950 flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={gsheetsConfig.enabled}
                  onChange={(e) => setGsheetsConfig({ ...gsheetsConfig, enabled: e.target.checked })}
                  className="mt-1 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-0"
                />
                <div>
                  <strong className="text-xs font-bold text-white block">Enable Google Sheets Auto-Sync</strong>
                  <span className="text-[11px] text-zinc-400 block">
                    When enabled, new participant registrations will be instantly posted to your Google Sheet webhook.
                  </span>
                </div>
              </label>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 block">Google Apps Script Webhook URL</label>
                <input
                  type="url"
                  placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                  value={gsheetsConfig.webhookUrl}
                  onChange={(e) => setGsheetsConfig({ ...gsheetsConfig, webhookUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 block">Spreadsheet Tab / Sheet Name</label>
                <input
                  type="text"
                  value={gsheetsConfig.sheetName}
                  onChange={(e) => setGsheetsConfig({ ...gsheetsConfig, sheetName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2 text-xs">
                <strong className="text-emerald-400 font-bold block flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Quick Google Apps Script Template
                </strong>
                <p className="text-zinc-400 text-[11px]">
                  Copy this Apps Script code into your Google Sheet (Extensions › Apps Script) to accept incoming registrations:
                </p>
                <pre className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-mono text-zinc-300 overflow-x-auto">
{`function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow([
    data.registrationId,
    data.fullName,
    data.phone,
    data.email,
    data.eventName,
    data.distance,
    data.utrNumber,
    data.paymentStatus,
    data.registrationDate
  ]);
  return ContentService.createTextOutput("SUCCESS");
}`}
                </pre>
              </div>

              <button
                type="submit"
                className="py-3 px-6 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Google Sheets Webhook
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- TAB: ADMIN NOTIFICATIONS --- */}
      {activeAdminTab === 'notifications' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest mb-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Admin Dispatch Notifications</span>
                </div>
                <h3 className="text-xl font-black text-white">Email & Webhook Alerts</h3>
                <p className="text-xs text-zinc-400">
                  Receive real-time notifications on new registrations containing Registration ID, Runner Name, Phone Number, and UTR reference.
                </p>
              </div>

              {notificationSaveMessage && (
                <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0">
                  <CheckCircle2 className="w-4 h-4" /> Notification Settings Saved!
                </div>
              )}
            </div>

            <form onSubmit={handleSaveNotificationConfig} className="space-y-4">
              <label className="p-4 rounded-2xl border border-zinc-800 bg-zinc-950 flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationConfig.enabled}
                  onChange={(e) => setNotificationConfig({ ...notificationConfig, enabled: e.target.checked })}
                  className="mt-1 rounded border-zinc-700 bg-zinc-900 text-orange-500 focus:ring-0"
                />
                <div>
                  <strong className="text-xs font-bold text-white block">Enable Real-Time Admin Alerts</strong>
                  <span className="text-[11px] text-zinc-400 block">
                    Trigger notification dispatch whenever a participant submits a new marathon registration.
                  </span>
                </div>
              </label>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 block">Admin Email Address for Alerts</label>
                <input
                  type="email"
                  required
                  placeholder="admin@apexathleticskulgam.org"
                  value={notificationConfig.notificationEmail}
                  onChange={(e) => setNotificationConfig({ ...notificationConfig, notificationEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 block">Optional Custom Webhook / Email Gateway URL</label>
                <input
                  type="url"
                  placeholder="https://api.yourdomain.com/webhook/admin-alert"
                  value={notificationConfig.webhookUrl}
                  onChange={(e) => setNotificationConfig({ ...notificationConfig, webhookUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                className="py-3 px-6 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Notification Settings
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- TAB: SUPABASE SQL SETUP --- */}
      {activeAdminTab === 'supabase' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-orange-500" /> Supabase Database SQL Schema
                </h3>
                <p className="text-xs text-zinc-400">
                  Copy and execute this SQL code in your Supabase SQL Editor to provision all backend tables automatically.
                </p>
              </div>

              <button
                onClick={handleCopySql}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md shrink-0"
              >
                {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL Schema'}</span>
              </button>
            </div>

            <pre className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-96 leading-relaxed">
              {SUPABASE_SQL_SCHEMA}
            </pre>
          </div>
        </div>
      )}

      {/* LIGHTBOX MODAL FOR PAYMENT SCREENSHOT */}
      {selectedScreenshot && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <button
              onClick={() => setSelectedScreenshot(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h4 className="text-base font-bold text-white">Uploaded Payment Proof Screenshot</h4>
            <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-black flex items-center justify-center max-h-[70vh]">
              <img
                src={selectedScreenshot}
                alt="Payment proof screenshot full preview"
                className="max-h-[68vh] w-auto object-contain"
              />
            </div>
            <button
              onClick={() => setSelectedScreenshot(null)}
              className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl"
            >
              Close Lightbox Preview
            </button>
          </div>
        </div>
      )}
      {/* FORCE CHANGE PASSWORD MODAL */}
      <ForceChangePasswordModal
        isOpen={mustChangePassword}
        onSuccess={() => setMustChangePassword(false)}
      />
    </div>
  );
};
