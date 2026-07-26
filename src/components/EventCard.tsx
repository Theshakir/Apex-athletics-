import React, { useState } from 'react';
import { MarathonEvent } from '../types';
import { Calendar, MapPin, Trophy, ArrowRight, Route, DollarSign, CheckCircle2 } from 'lucide-react';

interface EventCardProps {
  event: MarathonEvent;
  onRegister: (event: MarathonEvent) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onRegister }) => {
  const [showRouteModal, setShowRouteModal] = useState(false);

  const getStatusBadge = (status: MarathonEvent['registrationStatus']) => {
    switch (status) {
      case 'open':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Registration Open
          </span>
        );
      case 'upcoming':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
            Upcoming Soon
          </span>
        );
      case 'closed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/40">
            Registration Closed
          </span>
        );
      case 'completed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-zinc-800 text-zinc-400 border border-zinc-700">
            Event Completed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-all duration-300 flex flex-col group shadow-xl">
      {/* Event Header Image */}
      <div className="relative h-52 overflow-hidden bg-zinc-950">
        <img
          src={event.image}
          alt={event.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          {getStatusBadge(event.registrationStatus)}
          {event.featured && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md">
              Featured Race
            </span>
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-xs font-medium text-orange-400 tracking-wide uppercase">
            Apex Athletics Kulgam
          </p>
          <h3 className="text-xl font-black text-white leading-snug group-hover:text-orange-400 transition-colors">
            {event.title}
          </h3>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <p className="text-xs italic text-zinc-400 line-clamp-2">{event.tagline}</p>

          <div className="space-y-2 text-xs font-medium text-zinc-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-500 shrink-0" />
              <span>{event.date} • {event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-orange-500 shrink-0" />
              <span className="text-zinc-300 font-semibold">{event.registrationFee}</span>
            </div>
          </div>

          {/* Distances Chips */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-zinc-400 block mb-1.5 uppercase tracking-wider">
              Race Categories
            </span>
            <div className="flex flex-wrap gap-1.5">
              {event.distances.map((dist, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-semibold"
                >
                  {dist}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-zinc-800 flex items-center gap-2">
          <button
            onClick={() => setShowRouteModal(true)}
            className="flex-1 px-3 py-2.5 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-all flex items-center justify-center gap-1.5"
          >
            <Route className="w-3.5 h-3.5 text-orange-400" />
            <span>Route Info</span>
          </button>

          {event.registrationStatus === 'open' ? (
            <button
              onClick={() => onRegister(event)}
              className="flex-1 px-3 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Register</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              disabled
              className="flex-1 px-3 py-2.5 rounded-xl text-xs font-bold bg-zinc-800/50 text-zinc-500 border border-zinc-800 cursor-not-allowed text-center"
            >
              {event.registrationStatus === 'completed' ? 'Results Published' : 'Closed'}
            </button>
          )}
        </div>
      </div>

      {/* Route & Details Modal */}
      {showRouteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <h4 className="text-lg font-black text-white">{event.title}</h4>
                <p className="text-xs text-orange-400">{event.date} • {event.location}</p>
              </div>
              <button
                onClick={() => setShowRouteModal(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg bg-zinc-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
              <div>
                <span className="font-bold text-white block mb-1">Race Overview</span>
                <p className="text-zinc-400">{event.description}</p>
              </div>

              <div>
                <span className="font-bold text-white block mb-1 flex items-center gap-1.5">
                  <Route className="w-4 h-4 text-orange-500" />
                  Route & Water Stations
                </span>
                <p className="text-zinc-400">{event.routeDetails}</p>
              </div>

              <div>
                <span className="font-bold text-white block mb-1">Registration Inclusions</span>
                <ul className="space-y-1 text-zinc-400">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Official Dry-Fit Running T-Shirt
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Personalized BIB with Timing Chip
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Heavy Metal Finisher Medal
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Verified E-Certificate
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Hot Kehwa & Healthy Refreshment Box
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setShowRouteModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white"
              >
                Close
              </button>
              {event.registrationStatus === 'open' && (
                <button
                  onClick={() => {
                    setShowRouteModal(false);
                    onRegister(event);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-orange-500 text-white"
                >
                  Register Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
