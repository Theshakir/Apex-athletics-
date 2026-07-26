import React, { useState, useEffect } from 'react';
import { db } from '../lib/database';
import { Announcement } from '../types';
import { Bell, Pin, Calendar, Tag, Sparkles } from 'lucide-react';

export const HomeAnnouncements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    db.getAnnouncements().then(setAnnouncements).catch(console.error);
  }, []);

  const getCategoryBadge = (category: Announcement['category']) => {
    switch (category) {
      case 'Important':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Registration':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Route':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Event Day':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-500">
            <Bell className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">Latest Announcements</h3>
            <p className="text-xs text-zinc-400">Official news and updates from Apex Athletics Kulgam</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className={`bg-zinc-900 border rounded-2xl p-5 space-y-3 relative hover:border-orange-500/50 transition-all ${
              ann.pinned ? 'border-orange-500/40 bg-zinc-900/90' : 'border-zinc-800'
            }`}
          >
            {ann.pinned && (
              <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                <Pin className="w-3 h-3 rotate-45" /> Pinned
              </span>
            )}

            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getCategoryBadge(ann.category)}`}>
                {ann.category}
              </span>
              <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {ann.date}
              </span>
            </div>

            <h4 className="font-bold text-white text-base leading-snug">{ann.title}</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">{ann.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
