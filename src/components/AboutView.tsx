import React from 'react';
import { Target, Eye, ShieldCheck, HeartPulse, Flame, Users, Sparkles, MapPin } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-12 py-6">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-800 rounded-3xl p-8 sm:p-12 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-extrabold uppercase tracking-widest">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>Kulgam's Premier Fitness Movement</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Apex Athletics <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">Kulgam</span>
          </h1>

          <p className="text-base text-zinc-300 leading-relaxed font-normal">
            Based in the serene valley of Kulgam, Jammu & Kashmir, Apex Athletics is a premier sports and fitness organization committed to igniting endurance, promoting health, and nurturing young athletic talent across Kashmir.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-semibold text-zinc-400">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-orange-500" /> Kulgam, Jammu & Kashmir, India
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Official Sports Council Partner
            </span>
          </div>
        </div>
      </div>

      {/* Mission & Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mission */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-4 hover:border-orange-500/50 transition-all shadow-xl group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 to-orange-500 p-[2px]">
            <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
              <Target className="w-7 h-7 text-orange-500 group-hover:scale-110 transition-transform" />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-extrabold text-orange-400 uppercase tracking-widest">
              Core Mission
            </span>
            <h3 className="text-2xl font-black text-white">Promote Fitness & Drug-Free Youth</h3>
          </div>

          <p className="text-sm text-zinc-400 leading-relaxed">
            Our mission is to foster a vibrant culture of physical endurance, healthy lifestyle choices, and athletic discipline. Through organized marathons, trail runs, and youth sports camps, we empower young men and women in South Kashmir to say <strong className="text-white">"No to Drugs, Yes to Sports"</strong>.
          </p>
        </div>

        {/* Vision */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-4 hover:border-orange-500/50 transition-all shadow-xl group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 p-[2px]">
            <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
              <Eye className="w-7 h-7 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest">
              Long-term Vision
            </span>
            <h3 className="text-2xl font-black text-white">Build the Largest Marathon Community in Kashmir</h3>
          </div>

          <p className="text-sm text-zinc-400 leading-relaxed">
            Our vision is to transform Kulgam and the surrounding valley into an international hub for mountain running and distance marathons. We strive to establish world-class timing standards, transparent certificate verification, and inclusive athletic access for runners of all ages.
          </p>
        </div>
      </div>

      {/* Core Values / Pillars */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold text-orange-500 uppercase tracking-widest">
            Our Core Pillars
          </span>
          <h3 className="text-3xl font-black text-white">What Drives Apex Athletics</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          {[
            {
              title: 'Community Empowerment',
              desc: 'Bringing together runners from Kulgam, Anantnag, Pulwama, Srinagar, and across India in brotherhood and fitness.',
              icon: Users,
            },
            {
              title: 'Health & Endurance',
              desc: 'Providing professional training guidelines, hydration stations, and medical safety for long-distance runners.',
              icon: HeartPulse,
            },
            {
              title: 'Transparency & Merit',
              desc: 'Chip timing, verified result leaderboards, and tamper-proof digital certificate verification records.',
              icon: ShieldCheck,
            },
          ].map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-3">
                <Icon className="w-8 h-8 text-orange-500" />
                <h4 className="font-bold text-white text-lg">{pillar.title}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
