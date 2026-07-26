import React, { useState, useEffect } from 'react';
import { db } from '../lib/database';
import { CertificateRecord } from '../types';
import { ShieldCheck, Search, ShieldAlert, CheckCircle2, XCircle, Award, Calendar, Flame, AlertCircle } from 'lucide-react';

interface CertificateVerificationProps {
  initialSearchTerm?: string;
}

export const CertificateVerification: React.FC<CertificateVerificationProps> = ({
  initialSearchTerm = '',
}) => {
  const [certNumberInput, setCertNumberInput] = useState(initialSearchTerm);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CertificateRecord | null>(null);

  const sampleCertificates = [
    'APEX-2026-1001',
    'APEX-2026-1002',
    'APEX-2025-2001',
    'APEX-2025-2002',
  ];

  const handleVerify = async (certToSearch?: string) => {
    const target = certToSearch || certNumberInput;
    if (!target.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await db.verifyCertificate(target);
      setResult(res);
    } catch (e) {
      console.error(e);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialSearchTerm) {
      setCertNumberInput(initialSearchTerm);
      handleVerify(initialSearchTerm);
    }
  }, [initialSearchTerm]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Title Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4 text-orange-500" />
          <span>Official Verification Portal</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white">Certificate Verification</h2>
        <p className="text-sm text-zinc-400 max-w-xl mx-auto">
          Verify the authenticity of marathon finisher and merit certificates issued by Apex Athletics Kulgam, J&K.
        </p>
      </div>

      {/* Search Bar Container */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify();
          }}
          className="flex flex-col sm:flex-row items-center gap-3"
          id="cert-verification-form"
        >
          <div className="relative w-full">
            <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-3.5" />
            <input
              type="text"
              required
              placeholder="Enter Certificate Number (e.g. APEX-2026-1001)"
              value={certNumberInput}
              onChange={(e) => setCertNumberInput(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-zinc-950 border border-zinc-800 rounded-2xl text-base text-white uppercase placeholder-zinc-500 font-mono focus:outline-none focus:border-orange-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            id="cert-verify-submit-btn"
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:from-red-500 hover:to-orange-400 text-white font-black text-sm rounded-2xl shadow-lg shadow-orange-600/30 transition-all shrink-0 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Verifying...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Now</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Sample Buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-zinc-500 font-medium">Quick Test Sample Numbers:</span>
          {sampleCertificates.map((sample) => (
            <button
              key={sample}
              onClick={() => {
                setCertNumberInput(sample);
                handleVerify(sample);
              }}
              className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-orange-500/20 text-zinc-300 hover:text-orange-400 border border-zinc-700 transition-colors font-mono font-semibold"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Result Area */}
      {searched && (
        <div className="animate-in fade-in zoom-in-95 duration-300">
          {result ? (
            <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 border-2 border-orange-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden space-y-6">
              {/* Background watermark */}
              <div className="absolute right-[-20px] bottom-[-20px] opacity-5 pointer-events-none">
                <Flame className="w-80 h-80 text-orange-500" />
              </div>

              {/* Status Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-orange-500 p-[2px]">
                    <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                      <Flame className="w-6 h-6 text-orange-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white font-mono uppercase">
                      APEX ATHLETICS KULGAM
                    </h3>
                    <p className="text-xs text-zinc-400">Official Certificate Record</p>
                  </div>
                </div>

                {/* Status Badge */}
                {result.status === 'valid' ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 font-extrabold text-sm shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>VALID CERTIFICATE ✅</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-red-500/20 border border-red-500/50 text-red-400 font-extrabold text-sm shadow-lg shadow-red-500/20">
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span>INVALID / REVOKED ❌</span>
                  </div>
                )}
              </div>

              {/* Detail Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl">
                <div>
                  <span className="text-zinc-500 block text-xs font-semibold uppercase tracking-wider">
                    Participant Name
                  </span>
                  <p className="text-lg font-black text-white mt-0.5">{result.participantName}</p>
                </div>

                <div>
                  <span className="text-zinc-500 block text-xs font-semibold uppercase tracking-wider">
                    Certificate Number
                  </span>
                  <p className="text-lg font-mono font-black text-orange-400 mt-0.5">
                    {result.certificateNumber}
                  </p>
                </div>

                <div>
                  <span className="text-zinc-500 block text-xs font-semibold uppercase tracking-wider">
                    Event Name
                  </span>
                  <p className="text-sm font-bold text-zinc-200 mt-0.5">{result.eventName}</p>
                </div>

                <div>
                  <span className="text-zinc-500 block text-xs font-semibold uppercase tracking-wider">
                    Race Distance
                  </span>
                  <p className="text-sm font-bold text-zinc-200 mt-0.5">{result.distance}</p>
                </div>

                <div>
                  <span className="text-zinc-500 block text-xs font-semibold uppercase tracking-wider">
                    Event Date
                  </span>
                  <p className="text-sm font-bold text-zinc-200 mt-0.5">{result.eventDate}</p>
                </div>

                <div>
                  <span className="text-zinc-500 block text-xs font-semibold uppercase tracking-wider">
                    Position / Rank
                  </span>
                  <p className="text-sm font-extrabold text-amber-400 mt-0.5">
                    {result.position || 'Finisher'}
                  </p>
                </div>
              </div>

              {/* Security & Verification Notice */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 space-y-1">
                <div className="flex items-center gap-2 text-zinc-300 font-bold">
                  <ShieldAlert className="w-4 h-4 text-orange-500" />
                  <span>Security & Authenticity Notice</span>
                </div>
                <p>
                  This record is officially authenticated by the Apex Athletics Kulgam Database. As per organizational policies, digital certificate downloads are disabled on this portal to prevent unauthorized tampering or duplication.
                </p>
              </div>
            </div>
          ) : (
            /* Invalid Result Card */
            <div className="bg-zinc-900 border border-red-500/30 rounded-3xl p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Certificate Record Not Found</h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  No valid certificate found for <strong className="text-white font-mono">{certNumberInput}</strong>. Please verify the Certificate ID printed on your physical document or contact Apex Athletics admin.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
