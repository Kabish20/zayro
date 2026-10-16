import React, { useState } from 'react';

export default function LegalView({ initialTab = 'privacy' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Tab Switcher */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('privacy')}
          className={`py-3 px-6 text-sm font-bold tracking-wider uppercase border-b-2 transition-all ${
            activeTab === 'privacy'
              ? 'border-[#E6B25C] text-[#30452F]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Privacy Policy
        </button>
        <button
          onClick={() => setActiveTab('terms')}
          className={`py-3 px-6 text-sm font-bold tracking-wider uppercase border-b-2 transition-all ${
            activeTab === 'terms'
              ? 'border-[#E6B25C] text-[#30452F]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Terms & Conditions
        </button>
      </div>

      {activeTab === 'privacy' ? (
        <div className="bg-white p-8 rounded-3xl border border-[#E8DCB8] space-y-6 text-xs text-gray-700 leading-relaxed">
          <h2 className="font-serif text-2xl font-bold text-[#30452F]">
            ZAYRO Privacy Policy
          </h2>
          <p className="text-gray-500">Effective Date: October 2026</p>

          <section className="space-y-2">
            <h3 className="font-bold text-[#30452F] text-sm">1. Commitment to Privacy</h3>
            <p>
              At ZAYRO Men's Grooming Lounge Pvt Ltd ("ZAYRO", "we", "us"), your privacy is paramount. This policy outlines how we handle personal details when you interact with our appointment portals, concierge WhatsApp services, and franchise applications.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-[#30452F] text-sm">2. Data We Collect</h3>
            <p>
              We collect your name, mobile contact number, email address, preferred branch, and styling preferences when you submit an appointment enquiry or request franchise information. We do not sell or trade your personal information to third parties.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-[#30452F] text-sm">3. Communication & WhatsApp</h3>
            <p>
              Our appointment enquiry portal generates pre-filled links for WhatsApp. When you message us via WhatsApp, communications are encrypted according to WhatsApp's standard privacy protocols. We use this data solely to confirm appointments and provide client care.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-[#30452F] text-sm">4. Data Security</h3>
            <p>
              We enforce industry-standard security measures to protect your contact records against unauthorized access. If you wish to delete your records from our guest CRM, contact us at partner@zayroclub.com.
            </p>
          </section>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-3xl border border-[#E8DCB8] space-y-6 text-xs text-gray-700 leading-relaxed">
          <h2 className="font-serif text-2xl font-bold text-[#30452F]">
            Terms of Service & Salon Protocol
          </h2>
          <p className="text-gray-500">Effective Date: October 2026</p>

          <section className="space-y-2">
            <h3 className="font-bold text-[#30452F] text-sm">1. Nature of the Website</h3>
            <p>
              This website serves as an informational catalogue, hairstyle lookbook, and appointment enquiry interface for ZAYRO salons. All appointment bookings submitted through this platform represent inquiries subject to final confirmation by the branch manager.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-[#30452F] text-sm">2. Pricing & Timings</h3>
            <p>
              All listed service rates, package discounts, and estimated treatment durations are indicative starting references and may vary slightly based on individual hair length, thickness, or personalized color chemistry formulated during consultation.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-[#30452F] text-sm">3. Franchise Inquiries</h3>
            <p>
              Projections regarding Return on Investment (ROI) and payback schedules on the Franchise portal represent historical and model estimations and do not constitute an outright financial guarantee. Prospective franchise partners are encouraged to review the complete Franchise Disclosure Document.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-[#30452F] text-sm">4. Health & Safety</h3>
            <p>
              Please inform your stylist prior to any chemical or facial service if you have active allergies, scalp abrasions, or known dermatological sensitivities. A patch test is recommended 24 hours prior to permanent hair coloring.
            </p>
          </section>
        </div>
      )}

    </div>
  );
}
