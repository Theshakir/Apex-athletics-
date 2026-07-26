import React, { useState, useEffect } from 'react';
import { MarathonResult } from '../types';
import { db } from '../lib/database';
import { Search, Trophy, Medal, Award, Filter, ShieldCheck, ArrowUpDown } from 'lucide-react';

interface ResultsTableProps {
  onVerifyCert: (certNo: string) => void;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ onVerifyCert }) => {
  const [results, setResults] = useState<MarathonResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<string>('All');
  const [selectedDistance, setSelectedDistance] = useState<string>('All');

  useEffect(() => {
    const loadResults = async () => {
      try {
        const data = await db.getResults();
        setResults(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadResults();
  }, []);

  // Extract unique events & distances for filters
  const eventsList = ['All', ...Array.from(new Set(results.map((r) => r.eventName)))];
  const distancesList = ['All', ...Array.from(new Set(results.map((r) => r.distance)))];

  // Filtered Results
  const filteredResults = results.filter((r) => {
    const matchesSearch =
      r.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.bibNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.certificateNo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesEvent = selectedEvent === 'All' || r.eventName === selectedEvent;
    const matchesDistance = selectedDistance === 'All' || r.distance === selectedDistance;

    return matchesSearch && matchesEvent && matchesDistance;
  });

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/50 flex items-center justify-center font-bold text-xs shadow-md">
          🥇 1
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="w-8 h-8 rounded-full bg-slate-300/20 text-slate-200 border border-slate-300/50 flex items-center justify-center font-bold text-xs shadow-md">
          🥈 2
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="w-8 h-8 rounded-full bg-amber-700/20 text-amber-500 border border-amber-700/50 flex items-center justify-center font-bold text-xs shadow-md">
          🥉 3
        </span>
      );
    }
    return (
      <span className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-300 font-mono text-xs flex items-center justify-center font-bold">
        {rank}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest mb-2">
            <Trophy className="w-3.5 h-3.5 text-orange-500" />
            <span>Leaderboard & Times</span>
          </div>
          <h2 className="text-3xl font-black text-white">Marathon Results</h2>
          <p className="text-xs text-zinc-400">
            Search official finish times, ranks, and bib numbers across Apex Athletics Kulgam events.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search Name, BIB # or Cert ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* Event Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-orange-500 shrink-0" />
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
          >
            {eventsList.map((evt, idx) => (
              <option key={idx} value={evt}>
                {evt === 'All' ? 'All Events' : evt}
              </option>
            ))}
          </select>
        </div>

        {/* Distance Filter */}
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-orange-500 shrink-0" />
          <select
            value={selectedDistance}
            onChange={(e) => setSelectedDistance(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
          >
            {distancesList.map((dist, idx) => (
              <option key={idx} value={dist}>
                {dist === 'All' ? 'All Distances' : dist}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 uppercase font-mono text-[11px] border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-4">Rank</th>
                <th className="py-3.5 px-4">BIB #</th>
                <th className="py-3.5 px-4">Participant Name</th>
                <th className="py-3.5 px-4">Event</th>
                <th className="py-3.5 px-4">Distance</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Finish Time</th>
                <th className="py-3.5 px-4">Pace</th>
                <th className="py-3.5 px-4 text-right">Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-zinc-500">
                    Loading results leaderboard...
                  </td>
                </tr>
              ) : filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-zinc-500">
                    No marathon results match your search filters.
                  </td>
                </tr>
              ) : (
                filteredResults.map((r) => (
                  <tr key={r.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold">{getRankBadge(r.rank)}</td>
                    <td className="py-3.5 px-4 font-mono text-orange-400 font-bold">{r.bibNumber}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{r.participantName}</td>
                    <td className="py-3.5 px-4 text-zinc-400">{r.eventName}</td>
                    <td className="py-3.5 px-4 font-semibold text-zinc-200">{r.distance}</td>
                    <td className="py-3.5 px-4 text-zinc-400">{r.category}</td>
                    <td className="py-3.5 px-4 font-mono font-black text-amber-400">{r.finishTime}</td>
                    <td className="py-3.5 px-4 font-mono text-zinc-400">{r.pace}</td>
                    <td className="py-3.5 px-4 text-right">
                      {r.certificateNo ? (
                        <button
                          onClick={() => onVerifyCert(r.certificateNo)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[11px] font-bold transition-all"
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>Verify</span>
                        </button>
                      ) : (
                        <span className="text-zinc-600 text-[10px]">N/A</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
