import React, { useState, useEffect } from 'react';
import { db } from '../lib/database';
import { Lock, ShieldCheck, X, AlertCircle, KeyRound, CheckCircle2, ArrowLeft, Mail, RefreshCw } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

type ModalMode = 'login' | 'forgot_email' | 'verify_otp';

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<ModalMode>('login');
  
  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Forgot password state
  const [recoveryEmail, setRecoveryEmail] = useState('THESHAKIR01@gmail.com');
  const [otpInput, setOtpInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [simulatedOTP, setSimulatedOTP] = useState<string | null>(null);

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode('login');
      setError('');
      setSuccessMsg('');
      setEmail('');
      setPassword('');
      setRecoveryEmail('THESHAKIR01@gmail.com');
      setOtpInput('');
      setNewPassword('');
      setConfirmPassword('');
      setSimulatedOTP(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Email and Password are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await db.verifyAdminLogin(email, password);
      if (res.success) {
        onLoginSuccess();
        onClose();
      } else {
        setError('Invalid admin credentials. Access Denied.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!recoveryEmail.trim()) {
      setError('Recovery email is required.');
      return;
    }

    setLoading(true);
    try {
      const res = await db.requestPasswordResetOTP(recoveryEmail.trim());
      if (res.success) {
        setSimulatedOTP(res.simulatedOTP || null);
        setSuccessMsg(res.message);
        setMode('verify_otp');
      } else {
        setError(res.message);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to dispatch password reset OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordWithOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!otpInput.trim() || otpInput.trim().length !== 6) {
      setError('Please enter the valid 6-digit OTP code.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await db.verifyOTPAndResetPassword(recoveryEmail, otpInput, newPassword);
      if (res.success) {
        setSuccessMsg('Password reset successfully! Logging you in...');
        setTimeout(() => {
          setEmail(recoveryEmail);
          setPassword(newPassword);
          db.verifyAdminLogin(recoveryEmail, newPassword).then(() => {
            onLoginSuccess();
            onClose();
          });
        }, 1200);
      } else {
        setError(res.message);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {mode === 'login' && (
          <>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-500 flex items-center justify-center mx-auto shadow-lg">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-white">Admin Authentication</h3>
              <p className="text-xs text-zinc-400">
                Enter your authorized admin email and password to access the control panel.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 block">Admin Email *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. THESHAKIR01@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-300 block">Password *</label>
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setSuccessMsg('');
                      setMode('forgot_email');
                    }}
                    className="text-xs font-bold text-orange-400 hover:text-orange-300 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2 uppercase tracking-wider font-mono"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{loading ? 'Authenticating...' : 'Authenticate & Open Dashboard'}</span>
              </button>
            </form>
          </>
        )}

        {mode === 'forgot_email' && (
          <>
            <button
              onClick={() => setMode('login')}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-500 flex items-center justify-center mx-auto shadow-lg">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-white">Reset Admin Password</h3>
              <p className="text-xs text-zinc-400">
                A 6-digit OTP verification code will be sent to the authorized admin recovery email.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 block">Recovery Email Address *</label>
                <input
                  type="email"
                  required
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="e.g. THESHAKIR01@gmail.com"
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2 uppercase tracking-wider font-mono"
              >
                <Mail className="w-4 h-4" />
                <span>{loading ? 'Sending OTP...' : 'Send 6-Digit OTP Code'}</span>
              </button>
            </form>
          </>
        )}

        {mode === 'verify_otp' && (
          <>
            <button
              onClick={() => setMode('forgot_email')}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Recovery Email
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-white">Enter Verification OTP</h3>
              <p className="text-xs text-zinc-400">
                Check <strong className="text-white">{recoveryEmail}</strong> for your 6-digit code.
              </p>
            </div>

            {simulatedOTP && (
              <div className="p-3.5 bg-orange-500/10 border border-orange-500/30 rounded-2xl text-orange-400 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Dispatched OTP Code:
                  </span>
                  <code className="text-base font-black text-white tracking-widest bg-zinc-950 px-2 py-0.5 rounded border border-orange-500/40">
                    {simulatedOTP}
                  </code>
                </div>
                <p className="text-[10px] text-zinc-400">
                  (Dispatched to {recoveryEmail}. Entered code will be verified securely.)
                </p>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleResetPasswordWithOTP} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 block">6-Digit OTP Code *</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="e.g. 849201"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-base font-mono font-bold tracking-widest text-center text-orange-400 placeholder-zinc-600 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 block">New Admin Password *</label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 block">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2 uppercase tracking-wider font-mono"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Verifying & Updating...' : 'Verify OTP & Set New Password'}</span>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
