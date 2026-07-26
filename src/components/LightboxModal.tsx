import React from 'react';
import { GalleryItem } from '../types';
import { X, ChevronLeft, ChevronRight, Calendar, Tag, Play } from 'lucide-react';

interface LightboxModalProps {
  item: GalleryItem | null;
  items: GalleryItem[];
  onClose: () => void;
  onNavigate: (newItem: GalleryItem) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  item,
  items,
  onClose,
  onNavigate,
}) => {
  if (!item) return null;

  const currentIndex = items.findIndex((i) => i.id === item.id);

  const handlePrev = () => {
    if (currentIndex > 0) {
      onNavigate(items[currentIndex - 1]);
    } else {
      onNavigate(items[items.length - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      onNavigate(items[currentIndex + 1]);
    } else {
      onNavigate(items[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-4 sm:p-6 animate-in fade-in duration-200 select-none">
      {/* Header controls */}
      <div className="w-full max-w-6xl flex items-center justify-between text-white pb-4 border-b border-zinc-800">
        <div>
          <span className="text-xs font-bold text-orange-500 uppercase tracking-widest block">
            Apex Gallery • {item.category}
          </span>
          <h3 className="text-lg font-black">{item.title}</h3>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-400 hidden sm:inline">
            {currentIndex + 1} of {items.length}
          </span>
          <button
            onClick={onClose}
            id="lightbox-close-btn"
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Media Preview Container */}
      <div className="relative flex-1 w-full max-w-5xl flex items-center justify-center my-4">
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          id="lightbox-prev-btn"
          className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-zinc-900/80 hover:bg-orange-600 text-white transition-all shadow-xl hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Media content */}
        <div className="max-h-[70vh] max-w-full flex items-center justify-center overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
          {item.type === 'video' ? (
            <div className="w-full aspect-video min-w-[320px] sm:min-w-[640px]">
              <iframe
                src={item.url}
                title={item.title}
                className="w-full h-full rounded-2xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <img
              src={item.url}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="max-h-[70vh] w-auto max-w-full object-contain rounded-2xl"
            />
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          id="lightbox-next-btn"
          className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-zinc-900/80 hover:bg-orange-600 text-white transition-all shadow-xl hover:scale-110"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Caption & Metadata Footer */}
      <div className="w-full max-w-4xl bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-300">
        <div className="space-y-1">
          <p className="font-semibold text-white">{item.caption}</p>
          <div className="flex items-center justify-center sm:justify-start gap-3 text-zinc-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-orange-500" /> {item.date}
            </span>
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-orange-500" /> {item.category}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold"
        >
          Return to Gallery
        </button>
      </div>
    </div>
  );
};
