export type EventStatus = 'open' | 'closed' | 'upcoming' | 'completed';

export interface MarathonEvent {
  id: string;
  title: string;
  tagline: string;
  date: string; // YYYY-MM-DD format
  time: string;
  location: string;
  distances: string[]; // e.g. ["21 KM", "10 KM", "5 KM"]
  registrationStatus: EventStatus;
  registrationFee: string;
  description: string;
  routeDetails: string;
  image: string;
  featured?: boolean;
}

export interface GalleryItem {
  id: string;
  type: 'photo' | 'video';
  title: string;
  category: 'Marathons' | 'Medal Ceremony' | 'Kulgam Scenic Route' | 'Community & Fitness';
  url: string;
  thumbnail?: string;
  caption: string;
  date: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'Important' | 'Registration' | 'Route' | 'Event Day';
  pinned?: boolean;
}

export interface MarathonResult {
  id: string;
  bibNumber: string;
  participantName: string;
  eventName: string;
  eventDate: string;
  distance: string;
  gender: 'Male' | 'Female' | 'Other';
  category: 'Open Male' | 'Open Female' | 'Masters (40+)' | 'Youth (<18)';
  finishTime: string;
  pace: string;
  rank: number;
  certificateNo: string;
}

export interface CertificateRecord {
  certificateNumber: string;
  participantName: string;
  eventName: string;
  distance: string;
  eventDate: string;
  position?: string;
  status: 'valid' | 'invalid';
  issueDate?: string;
}

export interface EventRegistration {
  id: string; // e.g. "20001"
  registrationId: string; // Sequential ID e.g. "20001", "20002"
  eventId: string;
  eventName: string;
  fullName: string;
  phone: string;
  email?: string; // Optional
  gender: string;
  age: number;
  address?: string; // Participant residential address
  distance: string;
  tShirtSize?: string;
  refreshmentPreference?: string;
  emergencyContact?: string;
  paymentScreenshot?: string; // Data URL or Image URL
  utrNumber: string; // UTR / Transaction ID
  paymentStatus: 'Pending' | 'Approved' | 'Rejected';
  registrationDate: string; // ISO / formatted date-time string
  bibNumber: string; // e.g. "BIB-20001"
}

export interface AdminAccount {
  email: string;
  passwordHash: string;
  createdAt: string;
  mustChangePassword?: boolean;
}

export interface GoogleSheetsConfig {
  webhookUrl: string;
  enabled: boolean;
  sheetName?: string;
}

export interface AdminNotificationConfig {
  notificationEmail: string;
  webhookUrl: string; // Optional Webhook / EmailJS / Formspree URL
  enabled: boolean;
}

export interface PaymentConfig {
  upiId: string;
  secondaryUpiId?: string;
  accountHolderName: string;
  qrCodeUrl?: string; // Data URL or Image URL
  paymentInstructions: string;
  registrationFee: string;
}

export interface ContactInfo {
  email: string;
  phone1: string;
  phone2: string;
  address: string;
  officeHours: string;
}

export interface RegistrationFormConfig {
  showTShirtSize: boolean;
  showRefreshments: boolean;
  showEmergencyContact: boolean;
  showGender: boolean;
  showAge: boolean;
  refreshmentOptions: string[];
  tShirtOptions: string[];
  customDeclarationNote: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  category: 'Title Sponsor' | 'Co-Sponsor' | 'Hydration Partner' | 'Medical Partner' | 'Media Partner';
}

export interface DashboardStats {
  totalEvents: number;
  activeEvents: number;
  totalParticipants: number;
  totalGalleryItems: number;
  totalCertificates: number;
  validCertificates: number;
}
