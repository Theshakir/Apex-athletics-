import React, { useState, useEffect } from 'react';
import { db } from '../lib/database';
import { PaymentConfig } from '../types';
import {
  QrCode,
  Copy,
  Check,
  Upload,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  ShieldCheck,
  CreditCard,
  User,
  Phone,
  Mail,
  Hash,
} from 'lucide-react';

export interface PaymentMethodProps {
  fullName: string;
  phone: string;
  email: string;
  paymentScreenshot: string;
  utrNumber: string;
  screenshotName?: string;
  registrationFee?: string;
  customPaymentConfig?: PaymentConfig;
  onFullNameChange: (val: string) => void;
  onPhoneChange: (val: string) => void;
  onEmailChange: (val: string) => void;
  onScreenshotChange: (fileDataUrl: string, fileName: string) => void;
  onUtrNumberChange: (val: string) => void;
  onSubmit?: (e: React.FormEvent) => void;
  loading?: boolean;
  showSubmitButton?: boolean;
  submitButtonText?: string;
}

export const PaymentMethod: React.FC<PaymentMethodProps> = ({
  fullName,
  phone,
  email,
  paymentScreenshot,
  utrNumber,
  screenshotName,
  registrationFee,
  customPaymentConfig,
  onFullNameChange,
  onPhoneChange,
  onEmailChange,
  onScreenshotChange,
  onUtrNumberChange,
  onSubmit,
  loading = false,
  showSubmitButton = false,
  submitButtonText = 'Submit Payment & Complete Registration',
}) => {
  const [copiedUpi, setCopiedUpi] = useState<string | null>(null);
  const [config, setConfig] = useState<PaymentConfig>({
    upiId: '9596024318@jio',
    secondaryUpiId: 'theshakir01@okaxis',
    accountHolderName: 'Apex Athletics / Shakir Yaqoob',
    qrCodeUrl: '',
    paymentInstructions: 'Scan the QR code using Google Pay, PhonePe, Paytm or BHIM UPI. Transfer the fee and submit your transaction UTR ID and screenshot proof.',
    registrationFee: '₹250',
  });

  useEffect(() => {
    if (customPaymentConfig) {
      setConfig(customPaymentConfig);
    } else {
      db.getPaymentConfig().then((cfg) => setConfig(cfg));
    }
  }, [customPaymentConfig]);

  const activeFee = registrationFee || config.registrationFee || '₹250';
  const primaryUpi = config.upiId || '9596024318@jio';
  const secondaryUpi = config.secondaryUpiId || 'theshakir01@okaxis';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUpi(text);
    setTimeout(() => setCopiedUpi(null), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB. Please choose a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onScreenshotChange(reader.result as string, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-red-500/10 border border-orange-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white">Apex Official UPI Payment</h4>
            <p className="text-xs text-zinc-400">Scan QR Code or pay directly to UPI ID below</p>
          </div>
        </div>
        <div className="px-3.5 py-1.5 bg-zinc-950 border border-orange-500/40 rounded-xl font-mono text-center">
          <span className="text-[10px] text-zinc-400 block uppercase">Registration Fee</span>
          <span className="text-base font-black text-orange-400">{activeFee}</span>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="bg-gradient-to-b from-zinc-950 to-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-6 space-y-5 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* QR Code Visual Box */}
          <div className="p-3.5 bg-white rounded-2xl shadow-2xl shrink-0 flex flex-col items-center group relative border-2 border-orange-500/20">
            <div className="w-44 h-44 relative bg-black rounded-xl overflow-hidden flex items-center justify-center p-2">
              {config.qrCodeUrl ? (
                <img
                  src={config.qrCodeUrl}
                  alt="Official Apex UPI QR Code"
                  className="w-full h-full object-contain rounded-lg bg-white"
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 200 200"
                  className="w-full h-full text-white fill-current"
                >
                  {/* Outer corners */}
                  <path d="M10,10 H70 V70 H10 Z M20,20 V60 H60 V20 Z M30,30 H50 V50 H30 Z" fill="#FFFFFF" />
                  <path d="M130,10 H190 V70 H130 Z M140,20 V60 H180 V20 Z M150,30 H170 V50 H150 Z" fill="#FFFFFF" />
                  <path d="M10,130 H70 V190 H10 Z M20,140 V180 H60 V140 Z M30,150 H50 V170 H30 Z" fill="#FFFFFF" />
                  
                  {/* Data modules pattern */}
                  <rect x="85" y="15" width="12" height="12" fill="#FFFFFF" />
                  <rect x="102" y="15" width="12" height="24" fill="#FFFFFF" />
                  <rect x="85" y="42" width="24" height="12" fill="#FFFFFF" />
                  <rect x="85" y="60" width="12" height="12" fill="#FFFFFF" />
                  <rect x="102" y="60" width="18" height="12" fill="#FFFFFF" />
                  
                  <rect x="15" y="85" width="25" height="12" fill="#FFFFFF" />
                  <rect x="45" y="85" width="12" height="12" fill="#FFFFFF" />
                  <rect x="62" y="85" width="20" height="12" fill="#FFFFFF" />
                  <rect x="87" y="85" width="12" height="28" fill="#FFFFFF" />
                  <rect x="105" y="85" width="25" height="12" fill="#FFFFFF" />
                  <rect x="135" y="85" width="12" height="12" fill="#FFFFFF" />
                  <rect x="152" y="85" width="33" height="12" fill="#FFFFFF" />

                  <rect x="15" y="102" width="12" height="18" fill="#FFFFFF" />
                  <rect x="35" y="102" width="18" height="18" fill="#FFFFFF" />
                  <rect x="60" y="102" width="20" height="12" fill="#FFFFFF" />
                  <rect x="105" y="102" width="15" height="25" fill="#FFFFFF" />
                  <rect x="125" y="102" width="22" height="12" fill="#FFFFFF" />
                  <rect x="152" y="102" width="12" height="25" fill="#FFFFFF" />
                  <rect x="170" y="102" width="15" height="12" fill="#FFFFFF" />

                  <rect x="85" y="125" width="18" height="12" fill="#FFFFFF" />
                  <rect x="108" y="125" width="12" height="20" fill="#FFFFFF" />
                  <rect x="125" y="125" width="25" height="12" fill="#FFFFFF" />
                  <rect x="155" y="125" width="30" height="12" fill="#FFFFFF" />

                  <rect x="85" y="142" width="12" height="20" fill="#FFFFFF" />
                  <rect x="102" y="150" width="20" height="12" fill="#FFFFFF" />
                  <rect x="125" y="142" width="12" height="30" fill="#FFFFFF" />
                  <rect x="142" y="142" width="20" height="12" fill="#FFFFFF" />
                  <rect x="168" y="142" width="18" height="20" fill="#FFFFFF" />

                  <rect x="85" y="168" width="25" height="18" fill="#FFFFFF" />
                  <rect x="115" y="178" width="20" height="10" fill="#FFFFFF" />
                  <rect x="140" y="168" width="15" height="20" fill="#FFFFFF" />
                  <rect x="160" y="168" width="25" height="20" fill="#FFFFFF" />

                  {/* Google Pay / GPay center badge */}
                  <circle cx="100" cy="100" r="22" fill="#FFFFFF" stroke="#18181b" strokeWidth="3" />
                  <path d="M92 95 L108 95 L108 105 L92 105 Z" fill="#4285F4" />
                  <path d="M92 95 L100 100 L108 95 Z" fill="#EA4335" />
                  <path d="M92 105 L100 100 L108 105 Z" fill="#34A853" />
                  <path d="M100 92 L100 108" stroke="#FBBC05" strokeWidth="2" />
                </svg>
              )}
            </div>
            <div className="mt-2 text-center">
              <span className="text-[10px] font-black text-zinc-900 tracking-wider uppercase block">
                {config.accountHolderName || 'Apex Athletics Official'}
              </span>
              <span className="text-[9px] text-zinc-500 font-mono">Scan to Pay {activeFee}</span>
            </div>
          </div>

          {/* Instructions & Copyable UPI Handles */}
          <div className="space-y-4 text-center md:text-left flex-1">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-extrabold uppercase tracking-widest font-mono">
                <QrCode className="w-3 h-3" /> Quick Payment Options
              </div>
              <h4 className="text-base font-extrabold text-white mt-1">
                Official UPI ({config.accountHolderName || 'Apex Athletics'})
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                {config.paymentInstructions ||
                  'Scan the QR code or directly transfer using either of these authorized UPI IDs:'}
              </p>
            </div>

            {/* UPI ID #1 */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex items-center justify-between gap-2">
              <div className="text-left font-mono">
                <span className="text-[9px] text-zinc-500 uppercase block font-bold">Primary UPI ID (Jio / GPay)</span>
                <span className="text-sm font-bold text-orange-400">{primaryUpi}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(primaryUpi)}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
              >
                {copiedUpi === primaryUpi ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* UPI ID #2 */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex items-center justify-between gap-2">
              <div className="text-left font-mono">
                <span className="text-[9px] text-zinc-500 uppercase block font-bold">Secondary UPI ID (Axis / PhonePe)</span>
                <span className="text-sm font-bold text-amber-400">{secondaryUpi}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(secondaryUpi)}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
              >
                {copiedUpi === secondaryUpi ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-[11px] text-zinc-400 flex items-center gap-2 justify-center md:justify-start">
              <Smartphone className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Supports all Indian payment apps: GPay, PhonePe, Paytm, BHIM, Amazon Pay.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Fields Section */}
      <div className="space-y-4 bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-6">
        <h4 className="text-xs font-black uppercase tracking-widest text-orange-400 font-mono flex items-center gap-1.5">
          <User className="w-4 h-4" /> Participant & Payment Verification Details
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-300 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-zinc-400" /> Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Faizan Ahmad Mir"
              value={fullName}
              onChange={(e) => onFullNameChange(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-300 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-zinc-400" /> Phone Number *
            </label>
            <input
              type="tel"
              required
              placeholder="+91 95960XXXXX"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-zinc-300 flex items-center gap-1">
            <Mail className="w-3.5 h-3.5 text-zinc-400" /> Email Address <span className="text-zinc-500 font-normal">(Optional)</span>
          </label>
          <input
            type="email"
            placeholder="runner@gmail.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* Upload Payment Screenshot */}
        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-bold text-zinc-300 block">
            Payment Screenshot Upload *
          </label>
          <div className="relative border-2 border-dashed border-zinc-800 hover:border-orange-500/50 bg-zinc-950 rounded-2xl p-4 text-center transition-all cursor-pointer">
            <input
              type="file"
              accept="image/*"
              required={!paymentScreenshot}
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
            />
            {paymentScreenshot ? (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={paymentScreenshot}
                    alt="Payment screenshot"
                    className="w-14 h-14 object-cover rounded-xl border border-orange-500/40"
                  />
                  <div className="text-left">
                    <span className="text-xs font-bold text-white block truncate max-w-[200px]">
                      {screenshotName || 'payment_receipt.png'}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Screenshot Uploaded Successfully
                    </span>
                  </div>
                </div>
                <span className="text-xs text-orange-400 font-bold underline z-20">
                  Change Image
                </span>
              </div>
            ) : (
              <div className="space-y-1.5 py-2">
                <Upload className="w-8 h-8 text-orange-400 mx-auto" />
                <span className="text-xs font-bold text-white block">
                  Click or Drag Payment Screenshot Here
                </span>
                <span className="text-[10px] text-zinc-500 block">
                  Supports PNG, JPG, JPEG or WEBP (Max 5MB)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* UTR / Transaction ID */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-zinc-300 flex items-center gap-1">
            <Hash className="w-3.5 h-3.5 text-zinc-400" /> UTR / Transaction ID *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. 320984019283 (12-digit UPI reference number)"
            value={utrNumber}
            onChange={(e) => onUtrNumberChange(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
          />
          <span className="text-[10px] text-zinc-500 block">
            Enter the 12-digit UPI Reference / UTR Number shown on your successful payment receipt.
          </span>
        </div>

        {showSubmitButton && onSubmit && (
          <button
            type="button"
            onClick={(e) => onSubmit(e)}
            disabled={loading}
            className="w-full mt-4 py-3.5 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:opacity-95 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition-all uppercase tracking-wider font-mono"
          >
            {loading ? (
              <span>Submitting Registration...</span>
            ) : (
              <>
                <span>{submitButtonText}</span>
                <CheckCircle2 className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
