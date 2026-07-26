import React, { useState, useEffect } from 'react';
import { db } from '../lib/database';
import { MarathonEvent } from '../types';
import { EventCard } from './EventCard';
import { Calendar, Filter } from 'lucide-react';

interface EventsViewProps {
  onRegister: (event: MarathonEvent) => void;
}

export const EventsView: React.FC<EventsViewProps> = ({ onRegister }) => {
  const [events, setEvents] = useState<MarathonEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'upcoming' | 'completed'>('all');

  useEffect(() => {
    db.getEvents()
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  const filteredEvents = events.filter((e) => {
    if (filter === 'all') return true;
    if (filter === 'open') return e.registrationStatus === 'open';
    if (filter === 'upcoming') return e.registrationStatus === 'upcoming';
    if (filter === 'completed') return e.registrationStatus === 'completed';
    return true;
  });

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Race Schedule & Fixtures</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Apex Athletics Marathons</h2>
          <p className="text-xs text-zinc-400">
            Explore upcoming and past marathons, trail runs, and youth fitness events in Kulgam, J&K.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-orange-500" />
          {[
            { id: 'all', label: 'All Races' },
            { id: 'open', label: 'Open Registration' },
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'completed', label: 'Previous Races' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === f.id
                  ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="text-center py-16 text-zinc-500">Loading events...</div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">No events found in this category.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => (
            <EventCard key={evt.id} event={evt} onRegister={onRegister} />
          ))}
        </div>
      )}
    </div>
  );
};
