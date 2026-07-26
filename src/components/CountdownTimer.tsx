import React, { useState, useEffect } from 'react';
import { Timer, Calendar, MapPin, Zap } from 'lucide-react';

interface CountdownTimerProps {
  targetDateStr: string; // YYYY-MM-DD
  targetTitle: string;
  location: string;
  onRegisterClick: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDateStr,
  targetTitle,
  location,
  onRegisterClick,
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPassed: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(`${targetDateStr}T06:00:00+05:30`).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPassed: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  return (
    <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden my-8">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Event Meta */}
        <div className="space-y-3 text-center lg:text-left max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5 animate-bounce" />
            <span>Official Race Countdown</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {targetTitle}
          </h3>
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-medium text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-orange-500" />
              {targetDateStr} (06:00 AM IST)
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-orange-500" />
              {location}
            </span>
          </div>
        </div>

        {/* Counter Grid */}
        <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-4">
          <div className="grid grid-cols-4 gap-2 sm:gap-4 w-full sm:w-auto">
            {[
              { label: 'DAYS', value: timeLeft.days },
              { label: 'HOURS', value: timeLeft.hours },
              { label: 'MINS', value: timeLeft.minutes },
              { label: 'SECS', value: timeLeft.seconds },
            ].map((unit, idx) => (
              <div
                key={idx}
                className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3 sm:p-4 text-center min-w-[70px] sm:min-w-[90px] shadow-inner group hover:border-orange-500/50 transition-all"
              >
                <div className="font-mono text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-orange-400">
                  {String(unit.value).padStart(2, '0')}
                </div>
                <div className="text-[10px] font-extrabold tracking-widest text-zinc-400 uppercase mt-1">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onRegisterClick}
            id="countdown-register-btn"
            className="w-full sm:w-auto px-6 py-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white shadow-lg shadow-orange-600/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Timer className="w-4 h-4" />
            <span>Secure Your BIB</span>
          </button>
        </div>
      </div>
    </div>
  );
};
