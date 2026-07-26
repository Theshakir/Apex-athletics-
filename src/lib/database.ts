import {
  MarathonEvent,
  GalleryItem,
  Announcement,
  MarathonResult,
  CertificateRecord,
  EventRegistration,
  Sponsor,
  DashboardStats,
  ContactInfo,
  RegistrationFormConfig,
  AdminAccount,
  GoogleSheetsConfig,
  AdminNotificationConfig,
  PaymentConfig,
} from '../types';
import { supabase, isSupabaseConfigured } from './supabase';

// Local storage keys
const STORAGE_KEYS = {
  EVENTS: 'apex_kulgam_events_v2',
  GALLERY: 'apex_kulgam_gallery_v2',
  ANNOUNCEMENTS: 'apex_kulgam_announcements_v2',
  RESULTS: 'apex_kulgam_results_v2',
  CERTIFICATES: 'apex_kulgam_certificates_v2',
  REGISTRATIONS: 'apex_kulgam_registrations_v2',
  SPONSORS: 'apex_kulgam_sponsors_v2',
  CONTACT_INFO: 'apex_kulgam_contact_info_v1',
  REG_CONFIG: 'apex_kulgam_reg_config_v1',
  LAST_REG_ID: 'apex_kulgam_last_reg_id_v2',
  ADMIN_ACCOUNT: 'apex_kulgam_admin_account_v2',
  GOOGLE_SHEETS_CONFIG: 'apex_kulgam_gsheets_config_v1',
  NOTIFICATION_CONFIG: 'apex_kulgam_notification_config_v1',
  PAYMENT_CONFIG: 'apex_kulgam_payment_config_v1',
};

const INITIAL_PAYMENT_CONFIG: PaymentConfig = {
  upiId: '9596024318@jio',
  secondaryUpiId: 'theshakir01@okaxis',
  accountHolderName: 'Apex Athletics / Shakir Yaqoob',
  qrCodeUrl: '',
  paymentInstructions: 'Scan the QR code using Google Pay, PhonePe, Paytm or BHIM UPI. Transfer the registration fee and enter the 12-digit UTR/Transaction ID with receipt proof screenshot.',
  registrationFee: '₹250',
};

const INITIAL_CONTACT_INFO: ContactInfo = {
  email: 'info@apexathleticskulgam.org',
  phone1: '+91 9596024318',
  phone2: '+91 6005032324',
  address: 'Near Sports Stadium, Main Chowk, Kulgam, Jammu & Kashmir, India - 192231',
  officeHours: 'Monday - Saturday: 09:00 AM - 05:00 PM IST',
};

const INITIAL_REG_CONFIG: RegistrationFormConfig = {
  showTShirtSize: true,
  showRefreshments: true,
  showEmergencyContact: true,
  showGender: true,
  showAge: true,
  refreshmentOptions: ['Energy Drink & Fresh Fruits', 'Kashmir Herbal Kehwa & Dates', 'Standard Hydration Pack'],
  tShirtOptions: ['S (38)', 'M (40)', 'L (42)', 'XL (44)', 'XXL (46)'],
  customDeclarationNote: 'By registering, you confirm physical fitness for marathon participation and pledge commitment to a drug-free healthy Kashmir.',
};

// Seed Data for Apex Athletics Kulgam
const INITIAL_EVENTS: MarathonEvent[] = [
  {
    id: 'evt_1',
    title: 'Apex Kulgam Half Marathon 2026',
    tagline: 'Run Beyond Limits through the Valley of Aharbal',
    date: '2026-09-20',
    time: '06:00 AM IST',
    location: 'Sports Stadium Kulgam to Aharbal Valley Road, J&K',
    distances: ['21 KM Half Marathon', '10 KM Power Run', '5 KM Fun Run'],
    registrationStatus: 'open',
    registrationFee: '₹350 (Includes Dry-fit T-Shirt, Medal, E-Certificate, Refreshment)',
    description:
      'The flagship marathon of South Kashmir organized by Apex Athletics Kulgam. Experience breathtaking scenic mountain views, pine forests, and cool mountain breezes as hundreds of runners unite for health and a drug-free Kashmir.',
    routeDetails:
      'Flagoff at Kulgam Sports Stadium, heading via Main Chowk towards Nihama and Aharbal route. Hydration stations every 2.5 KM with medical teams and timing mats.',
    image:
      'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=80',
    featured: true,
  },
  {
    id: 'evt_2',
    title: 'Kulgam Green Trail Run 2026',
    tagline: 'Conquer the Pine Ridge & Veshav River Bank Trails',
    date: '2026-11-15',
    time: '06:30 AM IST',
    location: 'Veshav River Promenade & Chimmer, Kulgam',
    distances: ['15 KM Mountain Trail', '7 KM Youth Cross Country'],
    registrationStatus: 'upcoming',
    registrationFee: '₹250',
    description:
      'An exhilarating off-road trail marathon designed for endurance enthusiasts and mountain runners along the Veshav riverbank in Kulgam.',
    routeDetails:
      'Challenging gravel, pine forest tracks, and natural elevation shifts. Chip timing provided for competitive categories.',
    image:
      'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1200&q=80',
    featured: false,
  },
  {
    id: 'evt_3',
    title: 'Apex Kashmir Winter Snow Run 2025',
    tagline: 'Winter Endurance Challenge in Pure Snow',
    date: '2025-12-28',
    time: '08:00 AM IST',
    location: 'Aharbal Plateau, Kulgam, J&K',
    distances: ['10 KM Snow Run', '5 KM Snow Sprint'],
    registrationStatus: 'completed',
    registrationFee: '₹300',
    description:
      'A historic snow marathon held in sub-zero temperature amidst snow-capped peaks in Aharbal, attracting over 450 athletes across J&K.',
    routeDetails:
      'Paved snow route cleared by local authorities with thermal blankets and hot kehwa stations at every checkpoint.',
    image:
      'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=1200&q=80',
    featured: false,
  },
  {
    id: 'evt_4',
    title: 'Kulgam Drug-Free Kashmir Youth Run 2025',
    tagline: 'Say No to Drugs, Yes to Sports & Health',
    date: '2025-08-15',
    time: '07:00 AM IST',
    location: 'Town Hall Grounds to Govt Degree College Kulgam',
    distances: ['5 KM Awareness Run', '3 KM Student Sprint'],
    registrationStatus: 'completed',
    registrationFee: 'Free Entry',
    description:
      'Community marathon drive raising awareness among youth against substance abuse and advocating sports, athletics, and healthy living.',
    routeDetails:
      'Town circuit passing through Kulgam Bazaar with enthusiastic cheers from local citizens and district sports dignitaries.',
    image:
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
    featured: false,
  },
];

const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal_1',
    type: 'photo',
    title: 'Apex Kulgam Half Marathon Flag-off',
    category: 'Marathons',
    url: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=80',
    caption: 'Over 600 runners at the starting line at Kulgam Sports Stadium.',
    date: '2025-09-21',
  },
  {
    id: 'gal_2',
    type: 'photo',
    title: 'Medal Ceremony & Winners Podium',
    category: 'Medal Ceremony',
    url: 'https://images.unsplash.com/photo-1567113463300-102a7eb3cb26?auto=format&fit=crop&w=1200&q=80',
    caption: 'Top finishers receiving official trophies and medals from district guest dignitaries.',
    date: '2025-09-21',
  },
  {
    id: 'gal_3',
    type: 'photo',
    title: 'Scenic Aharbal Valley Running Route',
    category: 'Kulgam Scenic Route',
    url: 'https://images.unsplash.com/photo-1502904550040-7534597429ae?auto=format&fit=crop&w=1200&q=80',
    caption: 'Runners passing through the lush pine forest route towards Aharbal.',
    date: '2025-09-21',
  },
  {
    id: 'gal_4',
    type: 'photo',
    title: 'Youth & Veteran Runners United',
    category: 'Community & Fitness',
    url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1200&q=80',
    caption: 'Athletes of all age groups advocating drug-free healthy Kashmir.',
    date: '2025-08-15',
  },
  {
    id: 'gal_5',
    type: 'photo',
    title: 'Hydration & Kehwa Refreshment Station',
    category: 'Marathons',
    url: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=1200&q=80',
    caption: 'Volunteers handing water, energy drinks and traditional Kashmir Kehwa to participants.',
    date: '2025-12-28',
  },
  {
    id: 'gal_6',
    type: 'video',
    title: 'Apex Athletics Kulgam Marathon Highlights',
    category: 'Marathons',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder embed video
    thumbnail: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1200&q=80',
    caption: 'Official cinematic video summary of Apex Athletics Annual Marathon.',
    date: '2025-10-01',
  },
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann_1',
    title: 'Official Registrations Open for Apex Kulgam Half Marathon 2026!',
    content:
      'Registrations are now open for the 21K Half Marathon, 10K Power Run, and 5K Fun Run. Bib numbers and personalized T-Shirts will be issued on a first-come, first-served basis.',
    date: '2026-07-15',
    category: 'Registration',
    pinned: true,
  },
  {
    id: 'ann_2',
    title: '"Say No to Drugs, Yes to Sports" Free Youth Endurance Camp',
    content:
      'Apex Athletics Kulgam will host a 3-day training and endurance clinic at Kulgam Sports Stadium starting August 5. All school and college students are invited free of charge.',
    date: '2026-07-20',
    category: 'Important',
    pinned: true,
  },
  {
    id: 'ann_3',
    title: 'Aharbal Route Map & Hydration Points Released',
    content:
      'The route map for the upcoming 21K race has been finalized. Hydration, fruit, and medical stations will be setup at 2.5 KM intervals.',
    date: '2026-07-10',
    category: 'Route',
    pinned: false,
  },
  {
    id: 'ann_4',
    title: 'BIB & T-Shirt Expo Venue Confirmed',
    content:
      'Registered runners can collect their bibs and race kits at Apex Athletics Office, Main Chowk Kulgam on Sept 18 & 19, 2026 from 10:00 AM to 6:00 PM.',
    date: '2026-07-02',
    category: 'Event Day',
    pinned: false,
  },
];

const INITIAL_RESULTS: MarathonResult[] = [
  {
    id: 'res_1',
    bibNumber: 'BIB-2101',
    participantName: 'Faizan Ahmad Mir',
    eventName: 'Apex Kulgam Half Marathon 2026',
    eventDate: '2026-09-20',
    distance: '21 KM',
    gender: 'Male',
    category: 'Open Male',
    finishTime: '01:14:22',
    pace: '3:32 min/km',
    rank: 1,
    certificateNo: 'APEX-2026-1001',
  },
  {
    id: 'res_2',
    bibNumber: 'BIB-2102',
    participantName: 'Umer Farooq Wani',
    eventName: 'Apex Kulgam Half Marathon 2026',
    eventDate: '2026-09-20',
    distance: '21 KM',
    gender: 'Male',
    category: 'Open Male',
    finishTime: '01:16:45',
    pace: '3:39 min/km',
    rank: 2,
    certificateNo: 'APEX-2026-1003',
  },
  {
    id: 'res_3',
    bibNumber: 'BIB-2103',
    participantName: 'Insha Jan',
    eventName: 'Apex Kulgam Half Marathon 2026',
    eventDate: '2026-09-20',
    distance: '21 KM',
    gender: 'Female',
    category: 'Open Female',
    finishTime: '01:28:10',
    pace: '4:11 min/km',
    rank: 1,
    certificateNo: 'APEX-2026-1002',
  },
  {
    id: 'res_4',
    bibNumber: 'BIB-1045',
    participantName: 'Tariq Ahmad Rather',
    eventName: 'Apex Kashmir Winter Snow Run 2025',
    eventDate: '2025-12-28',
    distance: '10 KM',
    gender: 'Male',
    category: 'Open Male',
    finishTime: '00:36:18',
    pace: '3:37 min/km',
    rank: 2,
    certificateNo: 'APEX-2025-2001',
  },
  {
    id: 'res_5',
    bibNumber: 'BIB-5012',
    participantName: 'Mehak Zehra',
    eventName: 'Kulgam Drug-Free Kashmir Youth Run 2025',
    eventDate: '2025-08-15',
    distance: '5 KM',
    gender: 'Female',
    category: 'Youth (<18)',
    finishTime: '00:22:05',
    pace: '4:25 min/km',
    rank: 5,
    certificateNo: 'APEX-2025-2002',
  },
  {
    id: 'res_6',
    bibNumber: 'BIB-2109',
    participantName: 'Aamir Hussain Lone',
    eventName: 'Apex Kulgam Half Marathon 2026',
    eventDate: '2026-09-20',
    distance: '21 KM',
    gender: 'Male',
    category: 'Masters (40+)',
    finishTime: '01:22:14',
    pace: '3:54 min/km',
    rank: 3,
    certificateNo: 'APEX-2026-1004',
  },
];

const INITIAL_CERTIFICATES: CertificateRecord[] = [
  {
    certificateNumber: 'APEX-2026-1001',
    participantName: 'Faizan Ahmad Mir',
    eventName: 'Apex Kulgam Half Marathon 2026',
    distance: '21 KM Half Marathon',
    eventDate: '2026-09-20',
    position: '1st Place - Male Open (Time: 01:14:22)',
    status: 'valid',
    issueDate: '2026-09-20',
  },
  {
    certificateNumber: 'APEX-2026-1002',
    participantName: 'Insha Jan',
    eventName: 'Apex Kulgam Half Marathon 2026',
    distance: '21 KM Half Marathon',
    eventDate: '2026-09-20',
    position: '1st Place - Female Open (Time: 01:28:10)',
    status: 'valid',
    issueDate: '2026-09-20',
  },
  {
    certificateNumber: 'APEX-2025-2001',
    participantName: 'Tariq Ahmad Rather',
    eventName: 'Apex Kashmir Winter Snow Run 2025',
    distance: '10 KM Snow Run',
    eventDate: '2025-12-28',
    position: '2nd Place Overall (Time: 00:36:18)',
    status: 'valid',
    issueDate: '2025-12-28',
  },
  {
    certificateNumber: 'APEX-2025-2002',
    participantName: 'Mehak Zehra',
    eventName: 'Kulgam Drug-Free Kashmir Youth Run 2025',
    distance: '5 KM Youth Run',
    eventDate: '2025-08-15',
    position: 'Top 5 Finisher (Time: 00:22:05)',
    status: 'valid',
    issueDate: '2025-08-15',
  },
  {
    certificateNumber: 'APEX-2025-3099',
    participantName: 'Sample Revoked Participant',
    eventName: 'Kulgam Trial Run 2025',
    distance: '5 KM',
    eventDate: '2025-05-10',
    position: 'Disqualified',
    status: 'invalid',
    issueDate: '2025-05-10',
  },
];

const INITIAL_SPONSORS: Sponsor[] = [
  {
    id: 'sp_1',
    name: 'District Sports Authority Kulgam',
    logo: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=300&q=80',
    category: 'Title Sponsor',
  },
  {
    id: 'sp_2',
    name: 'Aharbal Eco Tourism Society',
    logo: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=300&q=80',
    category: 'Co-Sponsor',
  },
  {
    id: 'sp_3',
    name: 'Kashmir Pure Mountain Water',
    logo: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=300&q=80',
    category: 'Hydration Partner',
  },
  {
    id: 'sp_4',
    name: 'Valley Care Hospital Kulgam',
    logo: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=300&q=80',
    category: 'Medical Partner',
  },
];

// Helper: load from localStorage with initial default
function loadStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (e) {
    console.error(`Error reading ${key} from storage`, e);
    return defaultValue;
  }
}

function saveStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage`, e);
  }
}

// Data Engine Object
export const db = {
  // --- EVENTS ---
  async getEvents(): Promise<MarathonEvent[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          title: d.title,
          tagline: d.tagline || '',
          date: d.date,
          time: d.time || '',
          location: d.location || '',
          distances: d.distances || [],
          registrationStatus: d.registration_status || 'upcoming',
          registrationFee: d.registration_fee || '',
          description: d.description || '',
          routeDetails: d.route_details || '',
          image: d.image || '',
          featured: d.featured || false,
        }));
      }
    }
    return loadStorage<MarathonEvent[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  },

  async addEvent(event: Omit<MarathonEvent, 'id'>): Promise<MarathonEvent> {
    const newEvent: MarathonEvent = {
      ...event,
      id: `evt_${Date.now()}`,
    };
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('events').insert({
        id: newEvent.id,
        title: newEvent.title,
        tagline: newEvent.tagline,
        date: newEvent.date,
        time: newEvent.time,
        location: newEvent.location,
        distances: newEvent.distances,
        registration_status: newEvent.registrationStatus,
        registration_fee: newEvent.registrationFee,
        description: newEvent.description,
        route_details: newEvent.routeDetails,
        image: newEvent.image,
        featured: newEvent.featured,
      });
    }
    const current = loadStorage<MarathonEvent[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    const updated = [newEvent, ...current];
    saveStorage(STORAGE_KEYS.EVENTS, updated);
    return newEvent;
  },

  async updateEvent(id: string, updates: Partial<MarathonEvent>): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      await supabase
        .from('events')
        .update({
          title: updates.title,
          tagline: updates.tagline,
          date: updates.date,
          time: updates.time,
          location: updates.location,
          distances: updates.distances,
          registration_status: updates.registrationStatus,
          registration_fee: updates.registrationFee,
          description: updates.description,
          route_details: updates.routeDetails,
          image: updates.image,
          featured: updates.featured,
        })
        .eq('id', id);
    }
    const current = loadStorage<MarathonEvent[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    const updated = current.map((e) => (e.id === id ? { ...e, ...updates } : e));
    saveStorage(STORAGE_KEYS.EVENTS, updated);
  },

  async deleteEvent(id: string): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('events').delete().eq('id', id);
    }
    const current = loadStorage<MarathonEvent[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    const updated = current.filter((e) => e.id !== id);
    saveStorage(STORAGE_KEYS.EVENTS, updated);
  },

  // --- GALLERY ---
  async getGallery(): Promise<GalleryItem[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('gallery').select('*').order('date', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((g) => ({
          id: g.id,
          type: g.type as 'photo' | 'video',
          title: g.title,
          category: g.category,
          url: g.url,
          thumbnail: g.thumbnail || '',
          caption: g.caption || '',
          date: g.date,
        }));
      }
    }
    return loadStorage<GalleryItem[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
  },

  async addGalleryItem(item: Omit<GalleryItem, 'id'>): Promise<GalleryItem> {
    const newItem: GalleryItem = {
      ...item,
      id: `gal_${Date.now()}`,
    };
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('gallery').insert({
        id: newItem.id,
        type: newItem.type,
        title: newItem.title,
        category: newItem.category,
        url: newItem.url,
        thumbnail: newItem.thumbnail,
        caption: newItem.caption,
        date: newItem.date,
      });
    }
    const current = loadStorage<GalleryItem[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
    const updated = [newItem, ...current];
    saveStorage(STORAGE_KEYS.GALLERY, updated);
    return newItem;
  },

  async deleteGalleryItem(id: string): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('gallery').delete().eq('id', id);
    }
    const current = loadStorage<GalleryItem[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
    const updated = current.filter((g) => g.id !== id);
    saveStorage(STORAGE_KEYS.GALLERY, updated);
  },

  // --- ANNOUNCEMENTS ---
  async getAnnouncements(): Promise<Announcement[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('announcements').select('*').order('date', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((a) => ({
          id: a.id,
          title: a.title,
          content: a.content,
          date: a.date,
          category: a.category,
          pinned: a.pinned || false,
        }));
      }
    }
    return loadStorage<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  },

  async addAnnouncement(ann: Omit<Announcement, 'id'>): Promise<Announcement> {
    const newAnn: Announcement = {
      ...ann,
      id: `ann_${Date.now()}`,
    };
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('announcements').insert({
        id: newAnn.id,
        title: newAnn.title,
        content: newAnn.content,
        date: newAnn.date,
        category: newAnn.category,
        pinned: newAnn.pinned,
      });
    }
    const current = loadStorage<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    const updated = [newAnn, ...current];
    saveStorage(STORAGE_KEYS.ANNOUNCEMENTS, updated);
    return newAnn;
  },

  async deleteAnnouncement(id: string): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('announcements').delete().eq('id', id);
    }
    const current = loadStorage<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    const updated = current.filter((a) => a.id !== id);
    saveStorage(STORAGE_KEYS.ANNOUNCEMENTS, updated);
  },

  // --- RESULTS ---
  async getResults(): Promise<MarathonResult[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('results').select('*').order('rank', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((r) => ({
          id: r.id,
          bibNumber: r.bib_number,
          participantName: r.participant_name,
          eventName: r.event_name,
          eventDate: r.event_date,
          distance: r.distance,
          gender: r.gender,
          category: r.category,
          finishTime: r.finish_time,
          pace: r.pace || '',
          rank: r.rank,
          certificateNo: r.certificate_no || '',
        }));
      }
    }
    return loadStorage<MarathonResult[]>(STORAGE_KEYS.RESULTS, INITIAL_RESULTS);
  },

  async addResult(res: Omit<MarathonResult, 'id'>): Promise<MarathonResult> {
    const newRes: MarathonResult = {
      ...res,
      id: `res_${Date.now()}`,
    };
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('results').insert({
        id: newRes.id,
        bib_number: newRes.bibNumber,
        participant_name: newRes.participantName,
        event_name: newRes.eventName,
        event_date: newRes.eventDate,
        distance: newRes.distance,
        gender: newRes.gender,
        category: newRes.category,
        finish_time: newRes.finishTime,
        pace: newRes.pace,
        rank: newRes.rank,
        certificate_no: newRes.certificateNo,
      });
    }
    const current = loadStorage<MarathonResult[]>(STORAGE_KEYS.RESULTS, INITIAL_RESULTS);
    const updated = [newRes, ...current];
    saveStorage(STORAGE_KEYS.RESULTS, updated);
    return newRes;
  },

  async updateResult(id: string, updates: Partial<MarathonResult>): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      await supabase
        .from('results')
        .update({
          bib_number: updates.bibNumber,
          participant_name: updates.participantName,
          event_name: updates.eventName,
          event_date: updates.eventDate,
          distance: updates.distance,
          gender: updates.gender,
          category: updates.category,
          finish_time: updates.finishTime,
          pace: updates.pace,
          rank: updates.rank,
          certificate_no: updates.certificateNo,
        })
        .eq('id', id);
    }
    const current = loadStorage<MarathonResult[]>(STORAGE_KEYS.RESULTS, INITIAL_RESULTS);
    const updated = current.map((r) => (r.id === id ? { ...r, ...updates } : r));
    saveStorage(STORAGE_KEYS.RESULTS, updated);
  },

  async deleteResult(id: string): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('results').delete().eq('id', id);
    }
    const current = loadStorage<MarathonResult[]>(STORAGE_KEYS.RESULTS, INITIAL_RESULTS);
    const updated = current.filter((r) => r.id !== id);
    saveStorage(STORAGE_KEYS.RESULTS, updated);
  },

  // --- CERTIFICATE VERIFICATION ---
  async verifyCertificate(certNo: string): Promise<CertificateRecord | null> {
    const cleanCertNo = certNo.trim().toUpperCase();
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .ilike('certificate_number', cleanCertNo)
        .maybeSingle();

      if (!error && data) {
        return {
          certificateNumber: data.certificate_number,
          participantName: data.participant_name,
          eventName: data.event_name,
          distance: data.distance,
          eventDate: data.event_date,
          position: data.position || 'Finisher',
          status: data.status as 'valid' | 'invalid',
          issueDate: data.issue_date,
        };
      }
    }

    const current = loadStorage<CertificateRecord[]>(STORAGE_KEYS.CERTIFICATES, INITIAL_CERTIFICATES);
    const match = current.find((c) => c.certificateNumber.toUpperCase() === cleanCertNo);
    return match || null;
  },

  async getCertificates(): Promise<CertificateRecord[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('certificates').select('*');
      if (!error && data && data.length > 0) {
        return data.map((c) => ({
          certificateNumber: c.certificate_number,
          participantName: c.participant_name,
          eventName: c.event_name,
          distance: c.distance,
          eventDate: c.event_date,
          position: c.position || 'Finisher',
          status: c.status as 'valid' | 'invalid',
          issueDate: c.issue_date,
        }));
      }
    }
    return loadStorage<CertificateRecord[]>(STORAGE_KEYS.CERTIFICATES, INITIAL_CERTIFICATES);
  },

  async addCertificate(cert: CertificateRecord): Promise<CertificateRecord> {
    const cleanCert: CertificateRecord = {
      ...cert,
      certificateNumber: cert.certificateNumber.trim().toUpperCase(),
    };
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('certificates').insert({
        certificate_number: cleanCert.certificateNumber,
        participant_name: cleanCert.participantName,
        event_name: cleanCert.eventName,
        distance: cleanCert.distance,
        event_date: cleanCert.eventDate,
        position: cleanCert.position,
        status: cleanCert.status,
        issue_date: cleanCert.issueDate || cleanCert.eventDate,
      });
    }
    const current = loadStorage<CertificateRecord[]>(STORAGE_KEYS.CERTIFICATES, INITIAL_CERTIFICATES);
    const existingIndex = current.findIndex((c) => c.certificateNumber === cleanCert.certificateNumber);
    let updated: CertificateRecord[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = cleanCert;
    } else {
      updated = [cleanCert, ...current];
    }
    saveStorage(STORAGE_KEYS.CERTIFICATES, updated);
    return cleanCert;
  },

  async deleteCertificate(certNo: string): Promise<void> {
    const cleanCertNo = certNo.trim().toUpperCase();
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('certificates').delete().eq('certificate_number', cleanCertNo);
    }
    const current = loadStorage<CertificateRecord[]>(STORAGE_KEYS.CERTIFICATES, INITIAL_CERTIFICATES);
    const updated = current.filter((c) => c.certificateNumber.toUpperCase() !== cleanCertNo);
    saveStorage(STORAGE_KEYS.CERTIFICATES, updated);
  },

  // --- ADMIN SECURITY & AUTHENTICATION ---
  async hashPassword(password: string): Promise<string> {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(password + '_apex_kulgam_salt_2026');
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
    // Fallback simple hash for older environments
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      hash = (hash << 5) - hash + password.charCodeAt(i);
      hash |= 0;
    }
    return 'h_' + Math.abs(hash).toString(16);
  },

  async getAdminAccount(): Promise<AdminAccount> {
    let account = loadStorage<AdminAccount | null>(STORAGE_KEYS.ADMIN_ACCOUNT, null);
    if (!account) {
      const passwordHash = await this.hashPassword('Apex@2026#Admin');
      account = {
        email: 'theshakiryaqoob@gmail.com',
        passwordHash,
        createdAt: new Date().toISOString(),
        mustChangePassword: true,
      };
      saveStorage(STORAGE_KEYS.ADMIN_ACCOUNT, account);
    }
    return account;
  },

  async verifyAdminLogin(
    email: string,
    password: string
  ): Promise<{ success: boolean; mustChangePassword: boolean }> {
    const account = await this.getAdminAccount();
    const computedHash = await this.hashPassword(password);
    const isValid =
      account.email.trim().toLowerCase() === email.trim().toLowerCase() &&
      account.passwordHash === computedHash;

    if (isValid) {
      sessionStorage.setItem('apex_admin_logged_in', 'true');
      sessionStorage.setItem('apex_admin_email', account.email);
      return { success: true, mustChangePassword: !!account.mustChangePassword };
    }
    return { success: false, mustChangePassword: false };
  },

  async changeAdminPassword(
    oldPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message?: string }> {
    const account = await this.getAdminAccount();
    const oldHash = await this.hashPassword(oldPassword);
    if (account.passwordHash !== oldHash) {
      return { success: false, message: 'Current password is incorrect.' };
    }
    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters long.' };
    }
    const newHash = await this.hashPassword(newPassword);
    const updatedAccount: AdminAccount = {
      ...account,
      passwordHash: newHash,
      mustChangePassword: false,
    };
    saveStorage(STORAGE_KEYS.ADMIN_ACCOUNT, updatedAccount);
    return { success: true };
  },

  async checkMustChangePassword(): Promise<boolean> {
    const account = await this.getAdminAccount();
    return !!account?.mustChangePassword;
  },

  // --- FORGOT PASSWORD & OTP RECOVERY ---
  async requestPasswordResetOTP(emailInput: string): Promise<{ success: boolean; message: string; simulatedOTP?: string }> {
    const cleanEmail = emailInput.trim().toLowerCase();
    const authorizedEmails = ['theshakir01@gmail.com', 'theshakiryaqoob@gmail.com'];
    const account = await this.getAdminAccount();
    const isAuthorized = authorizedEmails.includes(cleanEmail) || account.email.toLowerCase() === cleanEmail;

    if (!isAuthorized) {
      return { success: false, message: 'This email is not authorized as an admin recovery email.' };
    }

    // Generate 6-digit random OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    const otpData = { otp, email: cleanEmail, expiresAt };
    saveStorage('apex_admin_pwd_otp', otpData);

    // Auto-dispatch notification if webhook configured
    this.sendAdminOtpNotification(cleanEmail, otp).catch(() => {});

    return {
      success: true,
      message: `A 6-digit OTP verification code has been dispatched to ${cleanEmail}.`,
      simulatedOTP: otp,
    };
  },

  async verifyOTPAndResetPassword(
    emailInput: string,
    otpInput: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    const stored = loadStorage<{ otp: string; email: string; expiresAt: number } | null>('apex_admin_pwd_otp', null);
    if (!stored) {
      return { success: false, message: 'No active OTP request found. Please request a new OTP.' };
    }

    if (Date.now() > stored.expiresAt) {
      return { success: false, message: 'OTP code has expired. Please request a new OTP.' };
    }

    if (stored.otp !== otpInput.trim()) {
      return { success: false, message: 'Incorrect 6-digit OTP entered. Please check and try again.' };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters long.' };
    }

    const newHash = await this.hashPassword(newPassword);
    const account = await this.getAdminAccount();
    const updatedAccount: AdminAccount = {
      ...account,
      email: stored.email || account.email,
      passwordHash: newHash,
      mustChangePassword: false,
    };
    saveStorage(STORAGE_KEYS.ADMIN_ACCOUNT, updatedAccount);
    saveStorage('apex_admin_pwd_otp', null);

    return { success: true, message: 'Password reset successfully! You can now log in.' };
  },

  async sendAdminOtpNotification(email: string, otp: string) {
    const config = await this.getNotificationConfig();
    if (config.enabled && config.webhookUrl) {
      try {
        await fetch(config.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'ADMIN_OTP_REQUEST',
            recoveryEmail: email,
            otpCode: otp,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (e) {
        console.error('OTP Dispatch err:', e);
      }
    }
  },

  isAdminAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('apex_admin_logged_in') === 'true';
  },

  logoutAdmin(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('apex_admin_logged_in');
      sessionStorage.removeItem('apex_admin_email');
    }
  },

  // --- REGISTRATIONS & SEQUENTIAL ID (Starts from 20001) ---
  async getNextRegistrationId(): Promise<string> {
    const current = loadStorage<number>(STORAGE_KEYS.LAST_REG_ID, 20000);
    const nextVal = current + 1;
    saveStorage(STORAGE_KEYS.LAST_REG_ID, nextVal);
    return nextVal.toString();
  },

  async getRegistrations(): Promise<EventRegistration[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('registrations').select('*').order('registration_date', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((r) => ({
          id: r.id || r.registration_id,
          registrationId: r.registration_id || r.id,
          eventId: r.event_id,
          eventName: r.event_name,
          fullName: r.full_name,
          email: r.email || '',
          phone: r.phone,
          gender: r.gender,
          age: r.age,
          address: r.address || 'Kulgam, J&K',
          distance: r.distance,
          tShirtSize: r.t_shirt_size,
          refreshmentPreference: r.refreshment_preference,
          emergencyContact: r.emergency_contact,
          paymentScreenshot: r.payment_screenshot,
          utrNumber: r.utr_number || 'N/A',
          paymentStatus: r.payment_status || 'Pending',
          registrationDate: r.registration_date,
          bibNumber: r.bib_number || `BIB-${r.registration_id}`,
        }));
      }
    }
    return loadStorage<EventRegistration[]>(STORAGE_KEYS.REGISTRATIONS, [
      {
        id: '20001',
        registrationId: '20001',
        eventId: 'evt_1',
        eventName: 'Apex Kulgam Half Marathon 2026',
        fullName: 'Faizan Ahmad Mir',
        email: 'faizan.kulgam@gmail.com',
        phone: '+91 9596024318',
        gender: 'Male',
        age: 24,
        distance: '21 KM Half Marathon',
        tShirtSize: 'M (40)',
        refreshmentPreference: 'Energy Drink & Fresh Fruits',
        emergencyContact: '+91 9906012345',
        paymentScreenshot: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
        utrNumber: '320984019283',
        paymentStatus: 'Approved',
        registrationDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
        bibNumber: 'BIB-20001',
      },
      {
        id: '20002',
        registrationId: '20002',
        eventId: 'evt_1',
        eventName: 'Apex Kulgam Half Marathon 2026',
        fullName: 'Insha Jan',
        email: 'insha.jan@gmail.com',
        phone: '+91 6005032324',
        gender: 'Female',
        age: 22,
        distance: '21 KM Half Marathon',
        tShirtSize: 'S (38)',
        refreshmentPreference: 'Kashmir Herbal Kehwa & Dates',
        emergencyContact: '+91 9419011111',
        paymentScreenshot: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
        utrNumber: '320984019284',
        paymentStatus: 'Pending',
        registrationDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
        bibNumber: 'BIB-20002',
      },
    ]);
  },

  async registerForEvent(
    data: Omit<
      EventRegistration,
      'id' | 'registrationId' | 'registrationDate' | 'bibNumber' | 'paymentStatus'
    >
  ): Promise<EventRegistration> {
    const regId = await this.getNextRegistrationId(); // Sequential starting 20001
    const bibNumber = `BIB-${regId}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(
      2,
      '0'
    )}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newReg: EventRegistration = {
      ...data,
      id: regId,
      registrationId: regId,
      paymentStatus: 'Pending',
      registrationDate: formattedDate,
      bibNumber,
    };

    if (isSupabaseConfigured() && supabase) {
      await supabase.from('registrations').insert({
        id: newReg.id,
        registration_id: newReg.registrationId,
        event_id: newReg.eventId,
        event_name: newReg.eventName,
        full_name: newReg.fullName,
        email: newReg.email || '',
        phone: newReg.phone,
        gender: newReg.gender,
        age: newReg.age,
        distance: newReg.distance,
        t_shirt_size: newReg.tShirtSize || '',
        refreshment_preference: newReg.refreshmentPreference || '',
        emergency_contact: newReg.emergencyContact || '',
        payment_screenshot: newReg.paymentScreenshot || '',
        utr_number: newReg.utrNumber,
        payment_status: newReg.paymentStatus,
        registration_date: newReg.registrationDate,
        bib_number: newReg.bibNumber,
      });
    }

    const current = loadStorage<EventRegistration[]>(STORAGE_KEYS.REGISTRATIONS, []);
    const updated = [newReg, ...current];
    saveStorage(STORAGE_KEYS.REGISTRATIONS, updated);

    // Auto-dispatch to Google Sheets if configured
    this.sendToGoogleSheets(newReg).catch((err) => console.log('GSheets sync silent err:', err));

    // Auto-dispatch Admin Notification
    this.sendAdminNotification(newReg).catch((err) => console.log('Notification silent err:', err));

    return newReg;
  },

  async updateRegistrationPaymentStatus(
    regId: string,
    status: 'Pending' | 'Approved' | 'Rejected'
  ): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('registrations').update({ payment_status: status }).eq('id', regId);
    }
    const current = loadStorage<EventRegistration[]>(STORAGE_KEYS.REGISTRATIONS, []);
    const updated = current.map((r) =>
      r.id === regId || r.registrationId === regId ? { ...r, paymentStatus: status } : r
    );
    saveStorage(STORAGE_KEYS.REGISTRATIONS, updated);
  },

  async deleteRegistration(regId: string): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('registrations').delete().eq('id', regId);
    }
    const current = loadStorage<EventRegistration[]>(STORAGE_KEYS.REGISTRATIONS, []);
    const updated = current.filter((r) => r.id !== regId && r.registrationId !== regId);
    saveStorage(STORAGE_KEYS.REGISTRATIONS, updated);
  },

  // --- GOOGLE SHEETS INTEGRATION ---
  async getGoogleSheetsConfig(): Promise<GoogleSheetsConfig> {
    return loadStorage<GoogleSheetsConfig>(STORAGE_KEYS.GOOGLE_SHEETS_CONFIG, {
      webhookUrl: '',
      enabled: false,
      sheetName: 'Marathon Registrations',
    });
  },

  async updateGoogleSheetsConfig(config: GoogleSheetsConfig): Promise<GoogleSheetsConfig> {
    saveStorage(STORAGE_KEYS.GOOGLE_SHEETS_CONFIG, config);
    return config;
  },

  async sendToGoogleSheets(reg: EventRegistration): Promise<boolean> {
    const config = await this.getGoogleSheetsConfig();
    if (!config.enabled || !config.webhookUrl) return false;

    try {
      await fetch(config.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationId: reg.registrationId,
          fullName: reg.fullName,
          phone: reg.phone,
          email: reg.email || 'N/A',
          age: reg.age,
          gender: reg.gender,
          address: reg.address || 'N/A',
          eventName: reg.eventName,
          distance: reg.distance,
          tShirtSize: reg.tShirtSize || 'N/A',
          refreshmentPreference: reg.refreshmentPreference || 'N/A',
          emergencyContact: reg.emergencyContact || 'N/A',
          utrNumber: reg.utrNumber,
          paymentStatus: reg.paymentStatus,
          registrationDate: reg.registrationDate,
          bibNumber: reg.bibNumber,
        }),
      });
      return true;
    } catch (err) {
      console.warn('Failed to send to Google Sheets Webhook:', err);
      return false;
    }
  },

  // --- ADMIN NOTIFICATION SETTINGS ---
  async getNotificationConfig(): Promise<AdminNotificationConfig> {
    return loadStorage<AdminNotificationConfig>(STORAGE_KEYS.NOTIFICATION_CONFIG, {
      notificationEmail: 'admin@apexathleticskulgam.org',
      webhookUrl: '',
      enabled: true,
    });
  },

  async updateNotificationConfig(
    config: AdminNotificationConfig
  ): Promise<AdminNotificationConfig> {
    saveStorage(STORAGE_KEYS.NOTIFICATION_CONFIG, config);
    return config;
  },

  async sendAdminNotification(reg: EventRegistration): Promise<boolean> {
    const config = await this.getNotificationConfig();
    if (!config.enabled) return false;

    const payload = {
      event: 'NEW_MARATHON_REGISTRATION',
      registrationId: reg.registrationId,
      fullName: reg.fullName,
      phone: reg.phone,
      utrNumber: reg.utrNumber,
      paymentScreenshot: reg.paymentScreenshot ? 'ATTACHED_PROOF_DATA_URL' : 'N/A',
      eventName: reg.eventName,
      distance: reg.distance,
      registrationDate: reg.registrationDate,
      adminEmailTarget: config.notificationEmail,
    };

    if (config.webhookUrl) {
      try {
        await fetch(config.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        return true;
      } catch (err) {
        console.warn('Admin notification webhook error:', err);
      }
    }
    return true;
  },

  // --- SPONSORS ---
  async getSponsors(): Promise<Sponsor[]> {
    return loadStorage<Sponsor[]>(STORAGE_KEYS.SPONSORS, INITIAL_SPONSORS);
  },

  // --- DASHBOARD STATS ---
  async getDashboardStats(): Promise<DashboardStats> {
    const events = await this.getEvents();
    const certificates = await this.getCertificates();
    const gallery = await this.getGallery();
    const registrations = await this.getRegistrations();

    const activeEvents = events.filter((e) => e.registrationStatus === 'open' || e.registrationStatus === 'upcoming').length;
    const validCerts = certificates.filter((c) => c.status === 'valid').length;

    return {
      totalEvents: events.length,
      activeEvents,
      totalParticipants: registrations.length + 120, // Baseline runners + new signups
      totalGalleryItems: gallery.length,
      totalCertificates: certificates.length,
      validCertificates: validCerts,
    };
  },

  // --- CONTACT INFO & SITE CONFIG ---
  async getContactInfo(): Promise<ContactInfo> {
    return loadStorage<ContactInfo>(STORAGE_KEYS.CONTACT_INFO, INITIAL_CONTACT_INFO);
  },

  async updateContactInfo(info: ContactInfo): Promise<ContactInfo> {
    saveStorage(STORAGE_KEYS.CONTACT_INFO, info);
    return info;
  },

  // --- REGISTRATION FORM CONFIG ---
  async getRegistrationConfig(): Promise<RegistrationFormConfig> {
    return loadStorage<RegistrationFormConfig>(STORAGE_KEYS.REG_CONFIG, INITIAL_REG_CONFIG);
  },

  async updateRegistrationConfig(config: RegistrationFormConfig): Promise<RegistrationFormConfig> {
    saveStorage(STORAGE_KEYS.REG_CONFIG, config);
    return config;
  },

  // --- PAYMENT SETTINGS (ADMIN EDITABLE) ---
  async getPaymentConfig(): Promise<PaymentConfig> {
    return loadStorage<PaymentConfig>(STORAGE_KEYS.PAYMENT_CONFIG, INITIAL_PAYMENT_CONFIG);
  },

  async savePaymentConfig(config: PaymentConfig): Promise<PaymentConfig> {
    saveStorage(STORAGE_KEYS.PAYMENT_CONFIG, config);
    return config;
  },
};
