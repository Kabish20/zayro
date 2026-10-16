import React, { useState } from 'react';
import { Search, Clock, Sparkles, Filter, ChevronRight, Calendar, Check, ArrowRight } from 'lucide-react';
import { categories, services } from '../data/servicesData';

export default function ServicesView({ openBooking, openServiceDetail }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = services.filter((svc) => {
    const matchesCategory = selectedCategory === 'all' || svc.category === selectedCategory;
    const matchesSearch = 
      svc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header Banner */}
      <div className="bg-[#30452F] rounded-3xl p-8 sm:p-12 text-white border border-[#E6B25C]/30 relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E6B25C] block">
            Couture Salon Menu
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold">
            All ZAYRO Salon Services
          </h1>
          <p className="text-xs sm:text-sm text-[#9BB899] leading-relaxed">
            Every service is tailored around individual facial architecture and hair texture biology. Choose your category or search below.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search grooming services (e.g. Skin Fade, Beard Sculpt, Hot Towel, Facial)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C] shadow-sm"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#30452F] text-[#E6B25C] shadow-md border border-[#E6B25C]/40'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-gray-200">
          <p className="text-gray-500 text-sm">No services matched your search term "{searchQuery}".</p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            className="mt-3 text-xs font-bold text-[#30452F] underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#E8DCB8] hover:border-[#E6B25C] shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Image Banner */}
              <div className="relative h-64 overflow-hidden bg-gray-100">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 bg-[#1A2719]/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#E6B25C] border border-[#E6B25C]/30 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{service.duration}</span>
                </div>
                <div className="absolute bottom-3 right-3 bg-[#F5ECDE]/95 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-[#30452F] shadow-sm">
                  {service.price}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#30452F] group-hover:text-[#30452F] transition-colors line-clamp-2 min-h-[3.25rem] flex items-center leading-snug">
                    {service.name}
                  </h3>
                  <p className="text-[11px] font-semibold text-[#967456] mt-1 line-clamp-1">
                    {service.tagline}
                  </p>
                  <p className="text-xs text-stone-600 mt-2.5 leading-relaxed line-clamp-2 min-h-[2.5rem]">
                    {service.description}
                  </p>

                  {/* Highlight bullets */}
                  {service.highlights && (
                    <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5">
                      {service.highlights.slice(0, 3).map((h, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-gray-700 line-clamp-1">
                          <Check className="w-3.5 h-3.5 text-[#30452F] shrink-0" />
                          <span className="truncate">{h}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2 mt-auto">
                  <button
                    onClick={() => openServiceDetail(service)}
                    className="text-xs font-semibold text-[#30452F] hover:text-[#1A2719] flex items-center gap-1 transition-colors"
                  >
                    <span>Treatment Steps</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#E6B25C]" />
                  </button>

                  <button
                    onClick={() => openBooking(service)}
                    className="bg-[#30452F] hover:bg-[#1A2719] text-[#E6B25C] hover:text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Now</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Advisory Banner */}
      <div className="bg-[#F5ECDE] p-6 rounded-2xl border border-[#E6B25C]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-gray-600">
          <span className="font-bold text-[#30452F]">Need a custom styling package?</span> Our master stylists provide complimentary 15-minute consultations over coffee to assess your hair and scalp requirements.
        </div>
        <button
          onClick={() => openBooking('Consultation')}
          className="bg-[#30452F] text-[#E6B25C] text-xs font-bold px-5 py-2.5 rounded-xl border border-[#E6B25C]/30 shrink-0 hover:bg-[#1A2719] transition-colors"
        >
          Book Free Consultation
        </button>
      </div>

    </div>
  );
}
