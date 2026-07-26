import React, { useState, useEffect } from 'react';
import { db } from '../lib/database';
import { GalleryItem } from '../types';
import { LightboxModal } from './LightboxModal';
import { Image as ImageIcon, Video, Filter, Play, Maximize2 } from 'lucide-react';

export const GalleryView: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    db.getGallery()
      .then((data) => {
        setGalleryItems(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  const categories = ['All', 'Marathons', 'Medal Ceremony', 'Kulgam Scenic Route', 'Community & Fitness'];

  const filteredItems = galleryItems.filter(
    (item) => selectedCategory === 'All' || item.category === selectedCategory
  );

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest mb-2">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Captured Marathon Moments</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Photo & Video Gallery</h2>
          <p className="text-xs text-zinc-400">
            Browse official race day photos, podium celebrations, and scenic Aharbal route highlights.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Layout */}
      {loading ? (
        <div className="text-center py-16 text-zinc-500">Loading gallery...</div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">No media found in this category.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-all duration-300 group cursor-pointer shadow-lg relative flex flex-col justify-between"
            >
              {/* Media Thumbnail Container */}
              <div className="relative h-60 overflow-hidden bg-zinc-950">
                <img
                  src={item.thumbnail || item.url}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />

                {/* Video Play Icon overlay if video */}
                {item.type === 'video' ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-orange-600/90 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 ml-1 fill-white" />
                    </div>
                  </div>
                ) : (
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="p-2 rounded-xl bg-black/60 text-white backdrop-blur-md">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                )}

                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-zinc-950/80 text-orange-400 border border-zinc-800 uppercase backdrop-blur-md">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Caption */}
              <div className="p-4 space-y-1">
                <h3 className="font-bold text-white text-sm group-hover:text-orange-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-1">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <LightboxModal
        item={activeItem}
        items={filteredItems}
        onClose={() => setActiveItem(null)}
        onNavigate={(newItem) => setActiveItem(newItem)}
      />
    </div>
  );
};
