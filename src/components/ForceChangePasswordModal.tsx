import React, { useState } from 'react';
import { db } from '../lib/database';
import { KeyRound, ShieldAlert, CheckCircle2, AlertCircle, Lock } from 'lucide-react';

interface ForceChangePasswordModalProps {
  isOpen: boolean;
  onSuccess: () => void;
}

export const ForceChangePasswordModal: React.FC<ForceChangePasswordModalProps> = ({
  isOpen,
  onSuccess,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword === currentPassword) {
      setError('New password must be different from the temporary password.');
      return;
    }

    setLoading(true);
    try {
      const res = await db.changeAdminPassword(currentPassword, newPassword);
      if (res.success) {
        setSuccessMsg('Password changed successfully! Redirecting...');
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setError(res.message || 'Failed to change password. Please verify current password.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while updating your password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="bg-zinc-900 border-2 border-orange-500/50 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto shadow-lg">
            <KeyRound className="w-7 h-7" />
          </div>
          <span className="px-3 py-1 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase tracking-widest font-mono inline-block">
            Action Required • Security Policy
          </span>
          <h3 className="text-2xl font-black text-white">Change Temporary Password</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            You logged in using a temporary setup password. For security compliance, you must set a new confidential password before managing the admin panel.
          </p>
        </div>

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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-300 block">Current Temporary Password *</label>
            <input
              type="password"
              required
              placeholder="Enter temporary password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-300 block">Create New Custom Password *</label>
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
            <label className="text-xs font-bold text-zinc-300 block">Confirm New Custom Password *</label>
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
            className="w-full py-3.5 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:opacity-95 text-white font-black text-xs rounded-xl shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2 uppercase tracking-wider font-mono"
          >
            <Lock className="w-4 h-4" />
            <span>{loading ? 'Updating Password...' : 'Save Password & Continue'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
