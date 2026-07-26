import React, { useState, useEffect } from 'react';
import { MarathonEvent, EventRegistration, RegistrationFormConfig } from '../types';
import { db } from '../lib/database';
import { PaymentMethod } from './PaymentMethod';
import {
  CheckCircle2,
  X,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';

interface EventRegistrationModalProps {
  event: MarathonEvent | null;
  onClose: () => void;
  onSuccess: (reg: EventRegistration) => void;
}

export const EventRegistrationModal: React.FC<EventRegistrationModalProps> = ({
  event,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
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

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    gender: 'Male',
    age: 22,
    address: '',
    distance: event?.distances[0] || '21 KM Half Marathon',
    tShirtSize: 'M (40)',
    refreshmentPreference: 'Energy Drink & Fresh Fruits',
    emergencyContact: '',
    utrNumber: '',
  });

  const [paymentScreenshot, setPaymentScreenshot] = useState<string>('');
  const [screenshotName, setScreenshotName] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [registeredResult, setRegisteredResult] = useState<EventRegistration | null>(null);

  useEffect(() => {
    db.getRegistrationConfig()
      .then((cfg) => {
        setRegConfig(cfg);
        if (cfg.tShirtOptions?.length > 0) {
          setFormData((prev) => ({ ...prev, tShirtSize: cfg.tShirtOptions[0] }));
        }
        if (cfg.refreshmentOptions?.length > 0) {
          setFormData((prev) => ({ ...prev, refreshmentPreference: cfg.refreshmentOptions[0] }));
        }
      })
      .catch(console.error);
  }, []);

  if (!event) return null;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText('9596024318@ybl');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshotName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGoToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setErrorMessage('Full Name, Phone Number, and Residential Address are required.');
      return;
    }
    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!paymentScreenshot) {
      setErrorMessage('Please upload your payment screenshot.');
      return;
    }

    if (!formData.utrNumber.trim()) {
      setErrorMessage('Please enter your UTR / Transaction ID.');
      return;
    }

    setLoading(true);
    try {
      const result = await db.registerForEvent({
        eventId: event.id,
        eventName: event.title,
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        gender: formData.gender,
        age: Number(formData.age),
        address: formData.address.trim(),
        distance: formData.distance,
        tShirtSize: formData.tShirtSize,
        refreshmentPreference: formData.refreshmentPreference,
        emergencyContact: formData.emergencyContact || formData.phone,
        paymentScreenshot,
        utrNumber: formData.utrNumber.trim(),
      });

      setRegisteredResult(result);
      onSuccess(result);
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to submit registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 my-8 animate-in fade-in zoom-in-95 duration-200 shadow-2xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {registeredResult ? (
          /* Step 3: Confirmation Pass Screen */
          <div className="text-center space-y-6 py-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest font-mono">
                Registration Submitted Successfully
              </span>
              <h3 className="text-2xl font-black text-white">Welcome to Apex Athletics</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Your entry for <strong className="text-white">{registeredResult.eventName}</strong> has been logged under Registration ID <strong className="text-orange-400 font-mono">#{registeredResult.registrationId}</strong>.
              </p>
            </div>

            {/* Official Digital BIB Pass */}
            <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 border-2 border-orange-500/50 rounded-2xl p-6 text-left relative overflow-hidden shadow-2xl space-y-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div>
                  <span className="text-[10px] font-black uppercase text-orange-400 tracking-widest font-mono">
                    REGISTRATION ID #{registeredResult.registrationId}
                  </span>
                  <h4 className="text-sm font-bold text-white">{registeredResult.eventName}</h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 block uppercase">Assigned BIB</span>
                  <span className="font-mono text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
                    {registeredResult.bibNumber}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase">Participant Name</span>
                  <span className="font-bold text-white text-sm">{registeredResult.fullName}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase">Distance Category</span>
                  <span className="font-bold text-orange-400 text-sm">{registeredResult.distance}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase">UTR / Ref Number</span>
                  <span className="font-mono font-bold text-zinc-300 text-xs">{registeredResult.utrNumber}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase">Payment Verification</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold">
                    Pending Admin Approval
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
                <span>📍 Apex Sports Complex, Kulgam</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Digital Pass Active
                </span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400">
              Please save your Registration ID (<strong className="text-white">#{registeredResult.registrationId}</strong>). Present this at the Main Chowk Apex Office on Bib Distribution Day to receive your physical race kit.
            </p>

            <button
              onClick={onClose}
              className="w-full py-3.5 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-orange-600/30"
            >
              Done & Close
            </button>
          </div>
        ) : (
          /* Step 1 or Step 2 Form */
          <>
            <div className="space-y-2 border-b border-zinc-800 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-widest text-orange-500 font-mono">
                  Official Marathon Registration
                </span>
                <span className="text-xs font-mono text-zinc-400">Step {step} of 2</span>
              </div>
              <h3 className="text-2xl font-black text-white">{event.title}</h3>
              <p className="text-xs text-zinc-400">
                Date: <strong className="text-zinc-200">{event.date}</strong> | Registration Fee: <strong className="text-orange-400 font-bold">{event.registrationFee}</strong>
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {step === 1 ? (
              /* STEP 1: PARTICIPANT DETAILS */
              <form onSubmit={handleGoToPayment} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300 block">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Faizan Ahmad Mir"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-300 block">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 95960XXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-300 block">
                      Email Address <span className="text-zinc-500 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="runner@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300 block">Residential Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Main Market Kulgam, J&K - 192231"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {regConfig.showGender && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-300 block">Gender</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  )}

                  {regConfig.showAge && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-300 block">Age</label>
                      <input
                        type="number"
                        min="10"
                        max="85"
                        required
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                        className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {regConfig.showTShirtSize && regConfig.tShirtOptions?.length > 0 && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-300 block">T-Shirt Size</label>
                      <select
                        value={formData.tShirtSize}
                        onChange={(e) => setFormData({ ...formData, tShirtSize: e.target.value })}
                        className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
                      >
                        {regConfig.tShirtOptions.map((opt, i) => (
                          <option key={i} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {regConfig.showRefreshments && regConfig.refreshmentOptions?.length > 0 && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-300 block">Post-Run Refreshment Choice</label>
                      <select
                        value={formData.refreshmentPreference}
                        onChange={(e) =>
                          setFormData({ ...formData, refreshmentPreference: e.target.value })
                        }
                        className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                      >
                        {regConfig.refreshmentOptions.map((opt, i) => (
                          <option key={i} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300 block">Race Distance Category *</label>
                  <select
                    value={formData.distance}
                    onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white font-semibold focus:outline-none focus:border-orange-500"
                  >
                    {event.distances.map((dist, idx) => (
                      <option key={idx} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>

                {regConfig.showEmergencyContact && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-300 block">Emergency Contact Phone</label>
                    <input
                      type="tel"
                      placeholder="Emergency contact number"
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                )}

                {regConfig.customDeclarationNote && (
                  <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{regConfig.customDeclarationNote}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:opacity-95 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  <span>Proceed to Payment QR Code</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* STEP 2: PAYMENT QR CODE & PROOF SUBMISSION VIA PAYMENTMETHOD COMPONENT */
              <div className="space-y-4 animate-in fade-in duration-200">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-zinc-400 hover:text-white flex items-center gap-1 mb-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Participant Details
                </button>

                <PaymentMethod
                  fullName={formData.fullName}
                  phone={formData.phone}
                  email={formData.email}
                  paymentScreenshot={paymentScreenshot}
                  utrNumber={formData.utrNumber}
                  screenshotName={screenshotName}
                  registrationFee={event.registrationFee}
                  onFullNameChange={(val) => setFormData({ ...formData, fullName: val })}
                  onPhoneChange={(val) => setFormData({ ...formData, phone: val })}
                  onEmailChange={(val) => setFormData({ ...formData, email: val })}
                  onScreenshotChange={(fileDataUrl, fileName) => {
                    setPaymentScreenshot(fileDataUrl);
                    setScreenshotName(fileName);
                  }}
                  onUtrNumberChange={(val) => setFormData({ ...formData, utrNumber: val })}
                  onSubmit={handleFinalSubmit}
                  loading={loading}
                  showSubmitButton={true}
                  submitButtonText="Submit Payment Proof & Complete Registration"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
