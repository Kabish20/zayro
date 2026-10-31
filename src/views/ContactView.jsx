import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, CheckCircle, Loader2, Briefcase } from 'lucide-react';
import { submitToGoogleSheets } from '@/services';
import { CONTACT, FRANCHISE_CONTACT, getWhatsAppUrl } from '@/constants';
import { isValidEmail, isValidName, sanitizeInput } from '@/utils/security';

export default function ContactView() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Salon Inquiry',
    message: ''
  });

  const [honeypot, setHoneypot] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const formOpenedAtRef = useRef(null);

  useEffect(() => {
    formOpenedAtRef.current = Date.now();
  }, []);

  const handlePhoneChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '');
    if (raw.length === 12 && raw.startsWith('91')) {
      raw = raw.slice(2);
    }
    if (raw.length === 11 && raw.startsWith('0')) {
      raw = raw.slice(1);
    }
    const cleaned = raw.slice(0, 10);
    setFormData((prev) => ({ ...prev, phone: cleaned }));

    if (errors.phone) {
      if (!cleaned) {
        setErrors((prev) => ({ ...prev, phone: 'Mobile number is required' }));
      } else if (cleaned.startsWith('0')) {
        setErrors((prev) => ({ ...prev, phone: 'Mobile number cannot start with 0' }));
      } else if (!/^[6-9]/.test(cleaned)) {
        setErrors((prev) => ({ ...prev, phone: 'Must start with 6, 7, 8, or 9' }));
      } else if (cleaned.length < 10) {
        setErrors((prev) => ({ ...prev, phone: `10 digits required (${cleaned.length}/10 entered)` }));
      } else {
        setErrors((prev) => ({ ...prev, phone: undefined }));
      }
    }
  };

  const validate = () => {
    const err = {};
    if (!formData.name.trim()) {
      err.name = 'Full name is required';
    } else if (!isValidName(formData.name)) {
      err.name = 'Please enter your name (2 to 80 characters)';
    }

    const cleanedPhone = (formData.phone || '').replace(/[\s-]/g, '');
    if (!cleanedPhone) {
      err.phone = 'Mobile number is required';
    } else if (cleanedPhone.startsWith('0')) {
      err.phone = 'Mobile number cannot start with 0';
    } else if (!/^[6-9]/.test(cleanedPhone)) {
      err.phone = 'Mobile number must start with 6, 7, 8, or 9';
    } else if (cleanedPhone.length !== 10) {
      err.phone = `Must be exactly 10 digits (${cleanedPhone.length}/10 entered)`;
    } else if (!/^[6-9][0-9]{9}$/.test(cleanedPhone)) {
      err.phone = 'Enter a valid 10-digit mobile number';
    }

    if (formData.email && !isValidEmail(formData.email)) {
      err.email = 'Enter a valid email address';
    }

    if (!formData.message.trim()) {
      err.message = 'Please type your message';
    } else if (formData.message.trim().length > 1000) {
      err.message = 'Message cannot exceed 1000 characters';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      const res = await submitToGoogleSheets({
        formType: 'Contact',
        name: sanitizeInput(formData.name, 80),
        phone: sanitizeInput(formData.phone, 15),
        email: sanitizeInput(formData.email, 100),
        subject: sanitizeInput(formData.subject, 100),
        message: sanitizeInput(formData.message, 1000),
        honeypot,
        formOpenedAt: formOpenedAtRef.current
      });

      if (!res.success) {
        setErrors((prev) => ({ ...prev, submit: res.error || 'Submission could not be completed.' }));
        setIsSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setErrors((prev) => ({ ...prev, submit: 'Network connection issue. Please connect via WhatsApp.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="bg-[#30452F] rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-white border border-[#E6B25C]/30 relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E6B25C] block">
            We Are Here For You
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold">
            Connect with ZAYRO
          </h1>
          <p className="text-xs sm:text-sm text-[#9BB899] leading-relaxed">
            Have questions regarding royal groom appointments, corporate bookings, feedback, or media inquiries? Reach out to our central desk.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        
        {/* Left: Contact Info & Branches */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card 1: Concierge Desk Info */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#E8DCB8] shadow-sm space-y-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9943B] block mb-1">
                Central Concierge
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#30452F]">
                Concierge & Inquiries Desk
              </h3>
            </div>

            <div className="space-y-4 text-xs text-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#30452F]/10 flex items-center justify-center text-[#30452F] shrink-0">
                  <Phone className="w-4 h-4 text-[#30452F]" />
                </div>
                <div>
                  <span className="font-bold text-[#30452F] block">Central Hotline:</span>
                  <a href={CONTACT.telLink} className="hover:text-[#30452F] transition-colors font-semibold text-sm">
                    {CONTACT.phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#E6B25C]/20 flex items-center justify-center text-[#30452F] shrink-0 border border-[#E6B25C]/30">
                  <Briefcase className="w-4 h-4 text-[#30452F]" />
                </div>
                <div>
                  <span className="font-bold text-[#30452F] block">Franchise Inquiries:</span>
                  <a href={FRANCHISE_CONTACT.telLink} className="hover:text-[#30452F] transition-colors font-semibold text-sm">
                    {FRANCHISE_CONTACT.phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#30452F]/10 flex items-center justify-center text-[#30452F] shrink-0">
                  <Mail className="w-4 h-4 text-[#30452F]" />
                </div>
                <div>
                  <span className="font-bold text-[#30452F] block">Email Desk:</span>
                  <a href={CONTACT.mailLink} className="hover:text-[#30452F] transition-colors font-medium">
                    {CONTACT.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#30452F]/10 flex items-center justify-center text-[#30452F] shrink-0 mt-0.5">
                  <Clock className="w-4 h-4 text-[#30452F]" />
                </div>
                <div>
                  <span className="font-bold text-[#30452F] block">Salon Hours:</span>
                  <span className="text-stone-600">{CONTACT.hours}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <a
                href={getWhatsAppUrl('Hi ZAYRO Concierge, I would like to inquire about your services.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#1ebd5b] text-white text-xs font-bold uppercase tracking-wider py-3.5 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message Concierge on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Card 2: Physical Locations */}
          <div className="bg-[#F5ECDE] p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-[#E6B25C]/35 space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9943B] block mb-1">
                Lounge Locations
              </span>
              <h4 className="font-serif text-lg font-bold text-[#30452F]">
                Trichy Flagship & Headquarters 🇮🇳
              </h4>
            </div>

            <div className="space-y-3 text-xs text-stone-700">
              <div className="p-3 bg-white/70 rounded-xl border border-[#E6B25C]/20 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#30452F] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C9943B]" />
                    Flagship Lounge:
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Valet Available
                  </span>
                </div>
                <p className="text-gray-600 pl-5">Door No. 115, Rajaram Rd, KK Nagar, Trichy – 620021</p>
              </div>

              <div className="p-3 bg-white/70 rounded-xl border border-[#E6B25C]/20 space-y-1">
                <span className="font-bold text-[#30452F] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C9943B]" />
                  Registered Corporate Office:
                </span>
                <p className="text-gray-600 pl-5">5, Crescent Park Apartment, Hazrath Sulaiman St, Kaja Nagar, Trichy – 620020</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right: Message Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-9 rounded-2xl sm:rounded-3xl border border-[#E8DCB8] shadow-luxury">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#E8EFE8] text-[#30452F] mx-auto flex items-center justify-center border-2 border-[#30452F]">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#30452F]">Message Received!</h3>
              <p className="text-xs text-gray-600 max-w-md mx-auto">
                Thank you, <span className="font-bold text-[#30452F]">{formData.name}</span>. Our guest relations director will respond to you within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-bold text-[#30452F] underline mt-3 hover:text-[#E6B25C] transition-colors"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Anti-Bot Honeypot Field */}
              <div 
                className="hidden" 
                aria-hidden="true" 
                style={{ display: 'none', position: 'absolute', opacity: 0, pointerEvents: 'none' }}
              >
                <label htmlFor="zyr_ct_fax">Security verification (leave blank)</label>
                <input
                  id="zyr_ct_fax"
                  type="text"
                  name="fax_field"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div className="space-y-1 mb-2 border-b border-stone-100 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C9943B] block">
                  Direct Inquiries & Feedback
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#30452F]">
                  Send Us a Note
                </h3>
                <p className="text-xs text-stone-500">
                  Have a special grooming requirement, wedding package query, or partnership inquiry? Reach out directly.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F] mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    maxLength={80}
                    autoComplete="name"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-stone-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C] transition-all ${
                      errors.name ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F]">
                      Mobile Number *
                    </label>
                    <span className={`text-[10px] font-mono transition-colors ${
                      formData.phone.length === 10 && /^[6-9]/.test(formData.phone)
                        ? 'text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded'
                        : formData.phone.startsWith('0')
                        ? 'text-red-600 font-bold'
                        : 'text-gray-400'
                    }`}>
                      {formData.phone.length === 10 && /^[6-9]/.test(formData.phone) ? '✓ 10/10' : `${formData.phone.length}/10 digits`}
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-xs font-semibold text-gray-500 select-none flex items-center gap-1.5 pointer-events-none">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-gray-500 font-bold border-r border-gray-300 pr-1.5">+91</span>
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      pattern="[6-9][0-9]{9}"
                      maxLength={10}
                      placeholder="98765 43210"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className={`w-full pl-16 pr-3.5 py-2.5 text-sm rounded-xl border bg-stone-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C] transition-all ${
                        errors.phone ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F] mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    maxLength={100}
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-stone-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C] transition-all ${
                      errors.email ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F] mb-1.5">
                    Topic of Inquiry
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 bg-stone-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C] transition-all"
                  >
                    <option value="General Salon Inquiry">General Lounge Inquiry</option>
                    <option value="Royal Groom Suite & Events">Royal Groom Suite & Wedding Bookings</option>
                    <option value="Franchise Partnership">Franchise Partnership Inquiry</option>
                    <option value="Corporate / Brand Tie-up">Corporate Tie-up</option>
                    <option value="Client Feedback">Guest Feedback & Review</option>
                  </select>
                  {formData.subject === 'Franchise Partnership' && (
                    <div className="mt-2.5 p-3 rounded-xl bg-[#30452F]/10 border border-[#30452F]/20 text-xs text-[#30452F] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 animate-fadeIn">
                      <span>Franchise Expansion Desk Direct Hotline: <strong>{FRANCHISE_CONTACT.phoneDisplay}</strong></span>
                      <a href={FRANCHISE_CONTACT.telLink} className="font-bold underline hover:text-[#C9943B] shrink-0">
                        Call {FRANCHISE_CONTACT.phoneDisplay}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F] mb-1.5">
                  Your Message *
                </label>
                <textarea
                  rows="4"
                  maxLength={1000}
                  placeholder="How can our styling concierge assist you?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-stone-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C] transition-all ${
                    errors.message ? 'border-red-500' : 'border-gray-200'
                  }`}
                ></textarea>
                {errors.message && <p className="text-[11px] text-red-500 mt-1">{errors.message}</p>}
              </div>

              {/* Submission Error Banner */}
              {errors.submit && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  {errors.submit}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#30452F] hover:bg-[#1A2719] text-[#E6B25C] hover:text-white font-bold text-xs uppercase tracking-wider py-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed border border-[#E6B25C]/30 hover:shadow-lg hover:scale-[1.005] active:scale-[0.995]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#E6B25C]" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#E6B25C]" />
                    <span>Send Message</span>
                  </>
                )}
              </button>

              {/* Reassurance Footer inside Card */}
              <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-500">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-stone-600 font-medium">Concierge response guaranteed within 24 hours</span>
                </div>
                <div className="text-stone-500">
                  Direct: <a href={CONTACT.telLink} className="font-bold text-[#30452F] hover:underline">{CONTACT.phoneDisplay}</a>
                </div>
              </div>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
