import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export default function LightboxModal({ isOpen, onClose, items = [], currentIndex, setCurrentIndex, openBooking }) {
  const totalItems = items?.length || 0;

  const handleNext = useCallback(() => {
    if (totalItems > 0) {
      setCurrentIndex((prev) => (prev + 1) % totalItems);
    }
  }, [totalItems, setCurrentIndex]);

  const handlePrev = useCallback(() => {
    if (totalItems > 0) {
      setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
    }
  }, [totalItems, setCurrentIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen || !items || items.length === 0) return null;

  const currentItem = items[currentIndex];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative max-w-5xl w-full bg-[#1A2719] border border-[#E6B25C]/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-[#E6B25C] text-white hover:text-[#30452F] flex items-center justify-center transition-colors border border-white/20"
          aria-label="Close Lightbox"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Display Area with Navigation */}
        <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px] md:min-h-[500px]">
          <img
            src={currentItem.image}
            alt={currentItem.title}
            className="w-full h-full object-contain max-h-[70vh] md:max-h-[85vh]"
          />

          {/* Navigation Controls */}
          {items.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 hover:bg-[#E6B25C] text-white hover:text-[#30452F] flex items-center justify-center transition-all border border-white/20"
                aria-label="Previous style"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 hover:bg-[#E6B25C] text-white hover:text-[#30452F] flex items-center justify-center transition-all border border-white/20"
                aria-label="Next style"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Item Counter */}
          <div className="absolute bottom-4 left-4 bg-black/60 text-[#E6B25C] text-xs font-mono px-3 py-1 rounded-full border border-[#E6B25C]/30">
            {currentIndex + 1} / {items.length}
          </div>
        </div>

        {/* Sidebar Information */}
        <div className="w-full md:w-80 bg-[#30452F] p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-[#476346]">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E6B25C]">
                {currentItem.categoryName}
              </span>
              <h3 className="font-serif text-2xl font-bold text-white mt-1">
                {currentItem.title}
              </h3>
            </div>

            <p className="text-xs text-[#9BB899] leading-relaxed">
              {currentItem.description}
            </p>

            {currentItem.tags && (
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 block font-semibold">
                  Styling Notes & Techniques:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentItem.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="text-[10px] font-medium bg-[#1A2719] text-[#E6B25C] px-2.5 py-1 rounded-md border border-[#476346]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-[#476346] space-y-3">
            <button
              onClick={() => {
                onClose();
                openBooking(currentItem.title);
              }}
              className="w-full bg-gradient-to-r from-[#E6B25C] to-[#C9943B] hover:from-[#F3CF8A] hover:to-[#E6B25C] text-[#30452F] font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
            >
              <Calendar className="w-4 h-4" />
              <span>Book This Exact Look</span>
            </button>
            <p className="text-[10px] text-center text-[#9BB899]">
              Use keyboard ← → arrows to navigate | Esc to close
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
