import React from 'react';
import { ShieldAlert, Lock, ArrowLeft, KeyRound } from 'lucide-react';

interface AccessDeniedViewProps {
  onOpenLogin: () => void;
  onGoHome: () => void;
}

export const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({
  onOpenLogin,
  onGoHome,
}) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-8 text-center space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-3xl bg-red-500/10 border border-red-500/30 text-red-500 flex items-center justify-center mx-auto shadow-xl">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-red-500/10 text-red-400 border border-red-500/30 uppercase tracking-widest font-mono">
            403 - Access Restricted
          </span>
          <h2 className="text-3xl font-black text-white">Access Denied</h2>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-md mx-auto">
            The Apex Athletics Admin Control Panel is strictly protected. Only authorized administrators with verified credentials can access participant records, marathon results, and system configurations.
          </p>
        </div>

        <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-left space-y-2 text-xs">
          <div className="flex items-center gap-2 text-orange-400 font-bold">
            <Lock className="w-4 h-4" />
            <span>Administrator Privileges Required</span>
          </div>
          <p className="text-zinc-400 text-[11px]">
            If you are the official organizer or site owner, please authenticate using your registered email and password to open the administration dashboard.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onOpenLogin}
            className="flex-1 py-3 px-5 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition-all"
          >
            <KeyRound className="w-4 h-4" />
            <span>Authenticate Admin</span>
          </button>

          <button
            onClick={onGoHome}
            className="flex-1 py-3 px-5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all border border-zinc-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Main Site</span>
          </button>
        </div>
      </div>
    </div>
  );
};
