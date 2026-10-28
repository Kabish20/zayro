
import React, { useState } from 'react';
import { Eye, Calendar } from 'lucide-react';
import { galleryCategories, galleryItems } from '../data/galleryData';

export default function GalleryView({ openLightbox, openBooking }) {
  const [selectedCat, setSelectedCat] = useState('all');

  const filteredItems = selectedCat === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCat);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="bg-[#30452F] rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-white border border-[#E6B25C]/30 relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E6B25C] block">
            Editorial Portfolio
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold">
            Hairstyle & Grooming Gallery
          </h1>
          <p className="text-xs sm:text-sm text-[#9BB899] leading-relaxed">
            Precision razor fades, royal beard architecture, and traditional barber rituals captured live in our flagship grooming chairs. Click any style to zoom and view styling notes.
          </p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {galleryCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              selectedCat === cat.id
                ? 'bg-[#30452F] text-[#E6B25C] shadow-md border border-[#E6B25C]/40'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredItems.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => openLightbox(filteredItems, idx)}
            className="group bg-white rounded-2xl overflow-hidden border border-[#E8DCB8] hover:border-[#E6B25C] shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col cursor-pointer"
          >
            <div className="relative h-80 overflow-hidden bg-black">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
              
              <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white/20">
                <Eye className="w-4 h-4 text-[#E6B25C]" />
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E6B25C] block mb-1">
                  {item.categoryName}
                </span>
                <h3 className="font-serif text-xl font-bold">
                  {item.title}
                </h3>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <p className="text-xs text-gray-600 leading-relaxed">
                {item.description}
              </p>

              {item.tags && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.tags.map((t, i) => (
                    <span 
                      key={i} 
                      className="text-[10px] font-medium bg-[#E8EFE8] text-[#30452F] px-2 py-0.5 rounded-md"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-400">Click to expand</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openBooking(item.title);
                  }}
                  className="bg-[#30452F] hover:bg-[#30452F] text-[#E6B25C] hover:text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Calendar className="w-3 h-3" />
                  <span>Book Look</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
