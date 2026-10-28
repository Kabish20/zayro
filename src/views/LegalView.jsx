import React, { useState } from 'react';
import { ShieldCheck, FileText, CheckCircle2, AlertCircle, Mail, Phone, MapPin, Printer } from 'lucide-react';
import { CONTACT } from '@/constants';

export default function LegalView({ initialTab = 'privacy' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [prevInitialTab, setPrevInitialTab] = useState(initialTab);

  if (initialTab !== prevInitialTab) {
    setPrevInitialTab(initialTab);
    setActiveTab(initialTab);
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-[#30452F] rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-white border border-[#E6B25C]/30 relative overflow-hidden shadow-luxury">
        <div className="max-w-2xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A2719] text-[#E6B25C] text-[10px] sm:text-xs font-bold uppercase tracking-wider border border-[#476346]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Corporate Governance & Guest Assurance</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            Legal & Compliance
          </h1>
          <p className="text-xs sm:text-sm text-[#9BB899] leading-relaxed">
            Transparent, professional terms governing our luxury salon operations, digital appointment booking, client health safety protocols, and data protection standards.
          </p>
        </div>
      </div>

      {/* Tab Controls & Print Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-gray-200 pb-3">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all flex items-center gap-2 ${
              activeTab === 'privacy'
                ? 'bg-[#30452F] text-[#E6B25C] shadow-md border border-[#E6B25C]/40'
                : 'bg-white text-gray-600 hover:text-[#30452F] hover:bg-[#F5ECDE]/60 border border-gray-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Privacy Policy</span>
          </button>
          
          <button
            onClick={() => setActiveTab('terms')}
            className={`py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all flex items-center gap-2 ${
              activeTab === 'terms'
                ? 'bg-[#30452F] text-[#E6B25C] shadow-md border border-[#E6B25C]/40'
                : 'bg-white text-gray-600 hover:text-[#30452F] hover:bg-[#F5ECDE]/60 border border-gray-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Terms & Conditions</span>
          </button>
        </div>

        <button
          onClick={handlePrint}
          className="self-end sm:self-auto text-xs text-stone-600 hover:text-[#30452F] flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 hover:border-[#E6B25C] transition-colors"
          title="Print Document"
        >
          <Printer className="w-3.5 h-3.5 text-[#E6B25C]" />
          <span>Print Document</span>
        </button>
      </div>

      {/* 1. PRIVACY POLICY */}
      {activeTab === 'privacy' && (
        <article className="bg-white p-6 sm:p-12 rounded-2xl sm:rounded-3xl border border-[#E8DCB8] shadow-sm space-y-8 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <div className="border-b border-gray-200/80 pb-6 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#967456]">
              ZAYRO Men's Grooming Lounge Pvt Ltd
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#30452F]">
              Comprehensive Guest & Digital Privacy Policy
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pt-1">
              <span><strong>Effective Date:</strong> October 16, 2026</span>
              <span>•</span>
              <span><strong>Jurisdiction:</strong> Republic of India (IT Act 2000 & DPDP Compliant)</span>
            </div>
          </div>

          <section className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#30452F] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E8EFE8] text-[#30452F] text-xs font-mono font-bold flex items-center justify-center">1</span>
              <span>Corporate Commitment to Privacy</span>
            </h3>
            <p>
              ZAYRO Men's Grooming Lounge Pvt Ltd ("ZAYRO", "we", "us", or "our") is dedicated to protecting the privacy, confidentiality, and data sovereignty of every guest, investor, and website visitor. This Privacy Policy governs your use of our digital portals, WhatsApp Concierge desk, appointment booking systems, and franchise evaluation channels.
            </p>
            <p>
              By accessing our platform or sharing personal details with our concierge desk, you consent to the collection, processing, and handling of information in accordance with this policy, the <em>Information Technology Act, 2000</em>, and the <em>Digital Personal Data Protection (DPDP) Act</em>.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#30452F] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E8EFE8] text-[#30452F] text-xs font-mono font-bold flex items-center justify-center">2</span>
              <span>Categories of Information We Collect</span>
            </h3>
            <p>
              To deliver our precision grooming services and maintain seamless operational coordination, we collect the following categories of data:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#FBF7F0] border border-[#E8DCB8]/60 space-y-2">
                <h4 className="font-bold text-xs uppercase text-[#30452F] tracking-wider">A. Personal & Contact Identifiers</h4>
                <ul className="space-y-1.5 text-xs text-stone-600 list-disc list-inside">
                  <li>Full legal name or guest preferred name</li>
                  <li>10-digit mobile contact number</li>
                  <li>Personal or corporate email address</li>
                  <li>City and residential address (for bridal or franchise inquiries)</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#FBF7F0] border border-[#E8DCB8]/60 space-y-2">
                <h4 className="font-bold text-xs uppercase text-[#30452F] tracking-wider">B. Grooming & Consultation Profiles</h4>
                <ul className="space-y-1.5 text-xs text-stone-600 list-disc list-inside">
                  <li>Preferred haircut, beard fade, and texturizing styling notes</li>
                  <li>Allergy declarations & chemical patch-test records</li>
                  <li>Preferred appointment timings and Master Stylist selection</li>
                  <li>Service frequency, billing history, and membership credits</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#FBF7F0] border border-[#E8DCB8]/60 space-y-2">
                <h4 className="font-bold text-xs uppercase text-[#30452F] tracking-wider">C. Franchise & Commercial Data</h4>
                <ul className="space-y-1.5 text-xs text-stone-600 list-disc list-inside">
                  <li>Investment capital readiness bracket (e.g. ₹28 – ₹50 Lakhs)</li>
                  <li>Target commercial property details (carpet sq.ft, high-street zone)</li>
                  <li>Professional background and business retail experience</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#FBF7F0] border border-[#E8DCB8]/60 space-y-2">
                <h4 className="font-bold text-xs uppercase text-[#30452F] tracking-wider">D. Technical & Device Telemetry</h4>
                <ul className="space-y-1.5 text-xs text-stone-600 list-disc list-inside">
                  <li>Browser type, viewport dimensions, and operating system</li>
                  <li>IP address and approximate geographic location</li>
                  <li>Session cookies strictly used for navigation state</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#30452F] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E8EFE8] text-[#30452F] text-xs font-mono font-bold flex items-center justify-center">3</span>
              <span>Purpose & Legal Basis of Processing</span>
            </h3>
            <p>ZAYRO uses your data strictly for legitimate operational purposes:</p>
            <ul className="space-y-2 list-none pt-1">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#30452F] shrink-0 mt-0.5" />
                <span><strong>Appointment Execution:</strong> Allocating certified stylists, managing calendar slots, and sending automated SMS / WhatsApp booking reminders.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#30452F] shrink-0 mt-0.5" />
                <span><strong>Hair Biology & Skin Safety:</strong> Recording scalp conditions, patch test confirmations, and product sensitivities to avoid allergic reactions.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#30452F] shrink-0 mt-0.5" />
                <span><strong>Franchise Assessment:</strong> Evaluating applicant financial eligibility, catchment territory feasibility, and dispatching the Franchise Information Memorandum (FIM).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#30452F] shrink-0 mt-0.5" />
                <span><strong>Statutory Compliance:</strong> Generating GST invoices, maintaining audited accounting books, and complying with consumer protection regulations.</span>
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#30452F] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E8EFE8] text-[#30452F] text-xs font-mono font-bold flex items-center justify-center">4</span>
              <span>Strict Non-Disclosure & No Sale of Data</span>
            </h3>
            <div className="bg-[#E8EFE8]/70 border border-[#30452F]/20 p-4 rounded-xl">
              <p className="font-semibold text-[#30452F]">
                Our Zero Data Brokerage Guarantee:
              </p>
              <p className="text-stone-700 mt-1">
                ZAYRO has never sold, rented, leased, or monetized guest or investor contact details to third-party telemarketers, credit aggregators, or external advertisers, and will never do so. Your contact data remains strictly within our enterprise firewall.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#30452F] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E8EFE8] text-[#30452F] text-xs font-mono font-bold flex items-center justify-center">5</span>
              <span>WhatsApp Integration & Communications</span>
            </h3>
            <p>
              Our website provides direct interactive pre-filled WhatsApp action buttons. When you initiate a message via WhatsApp, the conversation is transmitted across Meta's end-to-end encrypted protocol under WhatsApp's Privacy Policy. We store records strictly within our customer relations register to confirm appointments and provide client support. You may opt out of promotional WhatsApp messages at any time by replying "STOP".
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#30452F] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E8EFE8] text-[#30452F] text-xs font-mono font-bold flex items-center justify-center">6</span>
              <span>Data Security & Enterprise Safeguards</span>
            </h3>
            <p>
              We implement industry-recognized technical, administrative, and physical safeguards:
            </p>
            <ul className="space-y-1.5 list-disc list-inside text-stone-600">
              <li>256-bit SSL/TLS encryption for all website communications and cloud POS data transmission</li>
              <li>Role-based access controls (RBAC) restricting customer record access to authorized salon front desk and management personnel</li>
              <li>Encrypted off-site cloud backups with multi-factor authentication</li>
              <li>Physical security access control at our Trichy corporate headquarters</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#30452F] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E8EFE8] text-[#30452F] text-xs font-mono font-bold flex items-center justify-center">7</span>
              <span>Your Rights & Grievance Redressal</span>
            </h3>
            <p>
              Under Indian personal data protection regulations, you possess full sovereignty over your information:
            </p>
            <ul className="space-y-1 list-disc list-inside text-stone-600">
              <li><strong>Right to Access:</strong> Request a full copy of your salon service history and stored records.</li>
              <li><strong>Right to Rectification:</strong> Update inaccurate contact or styling information.</li>
              <li><strong>Right to Erasure ("Right to Be Forgotten"):</strong> Request complete deletion of your records from our CRM.</li>
            </ul>

            <div className="mt-4 p-5 rounded-2xl bg-[#F5ECDE] border border-[#E6B25C]/40 space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#30452F]">
                Designated Grievance & Compliance Officer
              </h4>
              <p className="text-xs text-stone-700">
                In compliance with the Information Technology Act, 2000, any inquiries, requests for data deletion, or grievances should be addressed to our legal department:
              </p>
              <div className="space-y-1 pt-1 text-xs text-stone-700">
                <p><strong>Officer:</strong> Grievance Redressal Directorate, ZAYRO Men's Grooming Lounge Pvt Ltd</p>
                <p><strong>Email:</strong> <a href={CONTACT.mailLink} className="text-[#30452F] font-semibold underline">{CONTACT.email}</a></p>
                <p><strong>Contact Desk:</strong> {CONTACT.phoneDisplay}</p>
                <p><strong>Address:</strong> 5, Crescent Park Apartment, Hazrath Sulaiman Street, Kaja Nagar, Trichy – 620020, Tamil Nadu, India</p>
                <p className="text-[11px] text-stone-500 pt-1">All grievance notices are acknowledged within 48 hours and resolved within 30 days as mandated by law.</p>
              </div>
            </div>
          </section>
        </article>
      )}

      {/* 2. TERMS & CONDITIONS */}
      {activeTab === 'terms' && (
        <article className="bg-white p-6 sm:p-12 rounded-2xl sm:rounded-3xl border border-[#E8DCB8] shadow-sm space-y-8 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <div className="border-b border-gray-200/80 pb-6 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#967456]">
              ZAYRO Men's Grooming Lounge Pvt Ltd
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#30452F]">
              Terms of Service, Salon Etiquette & Commercial Policy
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pt-1">
              <span><strong>Effective Date:</strong> October 16, 2026</span>
              <span>•</span>
              <span><strong>Jurisdiction:</strong> Tiruchirappalli, Tamil Nadu, India</span>
            </div>
          </div>

          <section className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#30452F] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E8EFE8] text-[#30452F] text-xs font-mono font-bold flex items-center justify-center">1</span>
              <span>Acceptance & Contractual Scope</span>
            </h3>
            <p>
              Welcome to ZAYRO Men's Grooming Lounge. These Terms and Conditions govern your interaction with our website, digital appointment booking portals, in-salon guest experiences, membership packages, and franchise representations. By scheduling an appointment, entering our lounges, or browsing this platform, you agree to be bound by these Terms.
            </p>
            <p>
              If you do not accept these terms in full, please refrain from using our digital booking services and contact our central desk for clarification.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#30452F] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E8EFE8] text-[#30452F] text-xs font-mono font-bold flex items-center justify-center">2</span>
              <span>Appointment Scheduling, Punctuality & Grace Period</span>
            </h3>
            <ul className="space-y-2 list-none">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#30452F] shrink-0 mt-0.5" />
                <span><strong>Reservation Nature:</strong> Submitting an online appointment form constitutes a priority reservation request. Our salon front desk confirms your exact slot via WhatsApp or telephone within 15 minutes of submission.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#30452F] shrink-0 mt-0.5" />
                <span><strong>Arrival Time:</strong> Gentlemen are respectfully requested to arrive 10 minutes prior to scheduled appointments to enjoy our complimentary espresso or herbal tea bar and undergo crown diagnosis.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#30452F] shrink-0 mt-0.5" />
                <span><strong>15-Minute Grace Period:</strong> To honor the schedule of subsequent waitlisted gentlemen, a 15-minute grace period applies. Beyond 15 minutes of unnotified delay, ZAYRO reserves the right to reallocate the master stylist or modify the service scope.</span>
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#30452F] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E8EFE8] text-[#30452F] text-xs font-mono font-bold flex items-center justify-center">3</span>
              <span>Cancellation, Rescheduling & No-Show Guidelines</span>
            </h3>
            <p>
              We understand schedules shift unpredictably. We request a minimum of <strong>2 hours advance notice</strong> for any appointment cancellation or rescheduling so that we may accommodate gentlemen on our standby list.
            </p>
            <p>
              In the event of repeated no-shows without prior notice, ZAYRO reserves the right to require prepayment for future booking confirmations.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#30452F] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E8EFE8] text-[#30452F] text-xs font-mono font-bold flex items-center justify-center">4</span>
              <span>Hospital-Grade Hygiene & Client Health Disclosure</span>
            </h3>
            <div className="bg-[#FBF7F0] p-4 rounded-xl border border-[#E8DCB8] space-y-2">
              <div className="flex items-center gap-2 text-[#30452F] font-bold text-xs uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 text-[#E6B25C]" />
                <span>Client Health Declaration & Patch Test Protocol</span>
              </div>
              <p className="text-xs text-stone-700">
                Guests are requested to inform their barber or skin specialist of active skin allergies, recent dermatological procedures, scalp psoriasis, or medical sensitivities prior to commencement.
              </p>
              <p className="text-xs text-stone-700">
                For chemical treatments (such as permanent hair coloring, keratin, or intensive follicle therapies), a 24-hour skin patch test is strongly advised. ZAYRO is not responsible for adverse allergic reactions where the guest opted out of patch testing or did not disclose known medical conditions.
              </p>
            </div>
            <p className="text-xs text-stone-600">
              In return, ZAYRO enforces strict clinical hygiene: every scissor and clipper blade is sanitized in medical-grade UV sterilizers, and each client receives fresh, single-use biodegradable styling capes and neck strips.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#30452F] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E8EFE8] text-[#30452F] text-xs font-mono font-bold flex items-center justify-center">5</span>
              <span>Affordable Pricing, Invoicing & Payment Methods</span>
            </h3>
            <p>
              All prices displayed across our catalogues (e.g. ₹99 for Precision Haircut, ₹50 for Shave, ₹199 for Oil Massage, and ₹299 for Combo 1) are in Indian Rupees (INR) and represent our core brand guarantee of <em>"Luxury Made Affordable"</em>.
            </p>
            <ul className="space-y-1.5 list-disc list-inside text-stone-600">
              <li>Prices are inclusive/exclusive of Goods and Services Tax (GST) as explicitly itemized on your final tax invoice.</li>
              <li>Confirmed appointments honor the rates agreed upon at the time of reservation.</li>
              <li>Accepted payment methods across all lounges: UPI (Google Pay, PhonePe, Paytm, BHIM), all major Credit & Debit Cards (Visa, MasterCard, RuPay), and Cash.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#30452F] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E8EFE8] text-[#30452F] text-xs font-mono font-bold flex items-center justify-center">6</span>
              <span>Franchise Information & ROI Projections Disclaimer</span>
            </h3>
            <p>
              All franchise metrics, annual ROI calculations (e.g. 38% annual ROI), EBITDA margins, daily footfall models, and payback horizons displayed on this website represent financial model simulations based on flagship operations and historical performance.
            </p>
            <p>
              These simulations are provided for educational and illustrative evaluation purposes only and do not constitute an explicit earnings warranty or commercial guarantee. Binding franchise rights, territory allocations, fee structures, and capital obligations are governed exclusively by the formal signed bilateral <em>ZAYRO Franchise Agreement</em> and <em>Franchise Disclosure Document</em>.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#30452F] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E8EFE8] text-[#30452F] text-xs font-mono font-bold flex items-center justify-center">7</span>
              <span>Intellectual Property & Trademarks</span>
            </h3>
            <p>
              All content on this website — including the "ZAYRO" wordmark, logotypes, insignia, architectural interior imagery, hairstyle lookbook photography, editorial service descriptions, and proprietary "South Asian Hair Architecture" styling frameworks — is the exclusive intellectual property of ZAYRO Men's Grooming Lounge Pvt Ltd.
            </p>
            <p>
              Any unauthorized reproduction, modification, scraping, or commercial exploitation without prior written consent from our Board of Directors is strictly prohibited and subject to legal prosecution under the <em>Copyright Act, 1957</em> and <em>Trade Marks Act, 1999</em>.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#30452F] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E8EFE8] text-[#30452F] text-xs font-mono font-bold flex items-center justify-center">8</span>
              <span>Personal Valuables & Salon Conduct</span>
            </h3>
            <p>
              While dedicated wardrobe and storage amenities are provided at our flagship lounge, guests are advised to safeguard their personal belongings, jewelry, and mobile devices. ZAYRO accepts no liability for loss or damage to unattended personal property.
            </p>
            <p>
              To preserve our tranquil luxury atmosphere, gentlemen are requested to maintain courteous decorum, keep mobile ringers on discreet vibration, and respect fellow guests and styling staff.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#30452F] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E8EFE8] text-[#30452F] text-xs font-mono font-bold flex items-center justify-center">9</span>
              <span>Governing Law & Jurisdiction</span>
            </h3>
            <p>
              These Terms and Conditions shall be governed by and construed in accordance with the laws of the Republic of India. In the event of any dispute arising out of salon services, website interaction, or franchise inquiries, the exclusive legal jurisdiction shall lie with the competent courts located in <strong>Tiruchirappalli (Trichy), Tamil Nadu, India</strong>.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-gray-100">
            <h3 className="font-serif text-lg font-bold text-[#30452F] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E8EFE8] text-[#30452F] text-xs font-mono font-bold flex items-center justify-center">10</span>
              <span>Official Registered Contacts</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div className="p-3 rounded-xl bg-[#FBF7F0] border border-[#E8DCB8]/60 flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#30452F] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#30452F] block">Legal & Inquiries</span>
                  <a href={CONTACT.mailLink} className="hover:underline text-stone-700">{CONTACT.email}</a>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#FBF7F0] border border-[#E8DCB8]/60 flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#30452F] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#30452F] block">Contact Number</span>
                  <a href={CONTACT.telLink} className="hover:underline text-stone-700">{CONTACT.phoneDisplay}</a>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#FBF7F0] border border-[#E8DCB8]/60 flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#30452F] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#30452F] block">Registered Office</span>
                  <span className="text-stone-700">5, Crescent Park Apt, Kaja Nagar, Trichy – 620020</span>
                </div>
              </div>
            </div>
          </section>
        </article>
      )}

    </div>
  );
}
