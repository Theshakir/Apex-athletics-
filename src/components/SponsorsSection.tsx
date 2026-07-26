import React, { useState, useEffect } from 'react';
import { db } from '../lib/database';
import { Sponsor } from '../types';
import { Handshake } from 'lucide-react';

export const SponsorsSection: React.FC = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    db.getSponsors().then(setSponsors).catch(console.error);
  }, []);

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest">
          <Handshake className="w-3.5 h-3.5" />
          <span>Our Community Partners</span>
        </div>
        <h3 className="text-2xl font-black text-white">Official Sponsors & Partners</h3>
        <p className="text-xs text-zinc-400 max-w-lg mx-auto">
          Proudly supported by local sports bodies, tourism boards, and health partners dedicated to Kulgam's athletic growth.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
        {sponsors.map((sp) => (
          <div
            key={sp.id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-3 hover:border-orange-500/40 transition-all group"
          >
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-950 p-1 border border-zinc-800 group-hover:scale-105 transition-transform">
              <img
                src={sp.logo}
                alt={sp.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-lg grayscale group-hover:grayscale-0 transition-all"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold text-orange-400 block uppercase tracking-wider">
                {sp.category}
              </span>
              <p className="text-xs font-bold text-white leading-tight">{sp.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
