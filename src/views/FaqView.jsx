import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MessageSquare, Phone } from 'lucide-react';
import { faqList } from '@/data';
import { getWhatsAppUrl, FRANCHISE_CONTACT } from '@/constants';

export default function FaqView({ openBooking }) {
  const [openIdx, setOpenIdx] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Appointments', 'Services', 'Franchise'];

  const filteredFaqs = selectedCategory === 'All'
    ? faqList
    : faqList.filter(f => f.category === selectedCategory);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#30452F] block">
          Help & Inquiries
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#30452F]">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto">
          Everything you need to know about salon bookings, hair chemistry, scalp treatments, and franchise partnerships.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex justify-center flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              selectedCategory === cat
                ? 'bg-[#30452F] text-[#E6B25C] shadow-md border border-[#E6B25C]/40'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#E8DCB8] overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase font-bold text-[#30452F] bg-[#E8EFE8] px-2.5 py-0.5 rounded-full shrink-0">
                    {faq.category}
                  </span>
                  <span className="font-serif text-base sm:text-lg font-bold text-[#30452F]">
                    {faq.question}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#F5ECDE] flex items-center justify-center shrink-0 border border-gray-200">
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#30452F]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still Have Questions Box */}
      <div className="bg-[#1A2719] text-white p-8 rounded-3xl border border-[#E6B25C]/30 text-center space-y-4">
        <h3 className="font-serif text-2xl font-bold">Still Have a Specific Question?</h3>
        <p className="text-xs text-[#9BB899] max-w-md mx-auto">
          Our guest concierge and franchise advisory directors are on standby to assist you.
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <a
            href={getWhatsAppUrl('Hi ZAYRO Concierge, I have a question regarding salon services / franchise.')}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#1ebd5b] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl shadow-md flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
          <a
            href={FRANCHISE_CONTACT.telLink}
            className="bg-[#30452F] hover:bg-[#476346] text-[#E6B25C] text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl border border-[#E6B25C]/40 flex items-center gap-2 transition-colors"
          >
            <Phone className="w-4 h-4 text-[#E6B25C]" />
            <span>Franchise Desk: {FRANCHISE_CONTACT.phoneDisplay}</span>
          </a>
          <button
            onClick={() => openBooking()}
            className="bg-[#30452F] hover:bg-[#30452F] text-[#E6B25C] hover:text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl border border-[#E6B25C]/40 transition-colors"
          >
            Book Appointment
          </button>
        </div>
      </div>

    </div>
  );
}
