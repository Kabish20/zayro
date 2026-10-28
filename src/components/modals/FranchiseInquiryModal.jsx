import React, { useState } from 'react';
import { X, Briefcase, CheckCircle, MessageSquare, Loader2, Phone } from 'lucide-react';
import { submitToGoogleSheets } from '@/services/googleSheetsService';

export default function FranchiseInquiryModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    space: '1200 - 1500 sq.ft',
    budget: '₹35 - ₹50 Lakhs (FOCO Model)',
    model: 'foco',
    experience: 'Yes, retail/service business',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

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
    if (!formData.name.trim()) err.name = 'Full name is required';
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
    if (!formData.city.trim()) err.city = 'City/Target Location is required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const buildFranchiseWhatsApp = () => {
    const text = `*New ZAYRO Franchise Partnership Application* 💼💎
---------------------------------
👤 *Investor Name:* ${formData.name}
📱 *Phone:* ${formData.phone}
✉️ *Email:* ${formData.email || 'Not provided'}
🏙️ *Target City:* ${formData.city}
📐 *Space Available:* ${formData.space}
💰 *Investment Budget:* ${formData.budget}
🏢 *Preferred Model:* ${formData.model.toUpperCase()}
💼 *Prior Experience:* ${formData.experience}
📝 *Remarks:* ${formData.notes || 'Interested in earliest setup opportunity.'}
---------------------------------
_Request for ZAYRO Franchise Information Memorandum_`;

    return `https://wa.me/919150022115?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      await submitToGoogleSheets({
        formType: 'Franchise',
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        city: formData.city,
        space: formData.space,
        budget: formData.budget,
        model: formData.model,
        experience: formData.experience,
        notes: formData.notes
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting franchise inquiry:', err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative bg-[#F5ECDE] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#E6B25C]/30 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1A2719] text-white p-6 relative flex items-center justify-between border-b border-[#E6B25C]/30">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <img src="/images/logo/Transparent Logo.png" alt="ZAYRO Men's Grooming" className="h-12 sm:h-14 w-auto object-contain drop-shadow" />
              <div className="flex items-center gap-1.5 bg-[#30452F] px-2.5 py-0.5 rounded-full border border-[#476346]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E6B25C] animate-pulse"></span>
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#E6B25C]">
                  Expansion Opportunity 2026-2027
                </span>
              </div>
            </div>
            <h3 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#E6B25C]" />
              <span>Partner with ZAYRO Men's Grooming Lounge</span>
            </h3>
            <p className="text-xs text-[#9BB899] mt-1">
              Join India's fastest-growing luxury men's grooming lounge network with proven 38% annual ROI and turnkey corporate support.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#30452F] hover:bg-[#E6B25C] text-[#F5ECDE] hover:text-[#30452F] flex items-center justify-center transition-colors border border-[#476346]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {submitted ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#30452F] text-[#E6B25C] mx-auto flex items-center justify-center border-2 border-[#E6B25C]">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h4 className="font-serif text-2xl font-bold text-[#30452F]">
                Franchise Application Received!
              </h4>
              <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                Thank you, <span className="font-bold text-[#30452F]">{formData.name}</span>. Our Vice President of Brand Expansion will contact you within 24 hours to schedule a confidential Discovery Meeting for <span className="font-bold text-[#30452F]">{formData.city}</span>.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={buildFranchiseWhatsApp()}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1ebd5b] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-105"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Connect with Franchise VP on WhatsApp</span>
                </a>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto bg-[#30452F] text-[#E6B25C] text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl border border-[#E6B25C]/30"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F] mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Kumar / Sarah Chen"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3 py-2 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C] ${
                      errors.name ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F]">
                      Contact Phone *
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
                    <span className="absolute left-3 top-2.5 text-xs font-semibold text-gray-500 select-none flex items-center gap-1.5 pointer-events-none">
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
                      className={`w-full pl-16 pr-3 py-2 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C] ${
                        errors.phone ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="investor@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F] mb-1">
                    Target City / Locality *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pune, Kochi, Chandigarh..."
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={`w-full px-3 py-2 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C] ${
                      errors.city ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.city && <p className="text-[11px] text-red-500 mt-1">{errors.city}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F] mb-1">
                    Franchise Model Preference
                  </label>
                  <select
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C]"
                  >
                    <option value="foco">FOCO (Franchise Owned, Company Operated)</option>
                    <option value="fofo">FOFO (Franchise Owned, Franchise Operated)</option>
                    <option value="luxe">ZAYRO Luxe Flagship Lounge</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F] mb-1">
                    Available Commercial Space
                  </label>
                  <select
                    value={formData.space}
                    onChange={(e) => setFormData({ ...formData, space: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C]"
                  >
                    <option value="800 - 1200 sq.ft">800 – 1,200 sq.ft (Studio format)</option>
                    <option value="1200 - 1800 sq.ft">1,200 – 1,800 sq.ft (Standard flagship)</option>
                    <option value="2000+ sq.ft">2,000+ sq.ft (Luxe multi-floor)</option>
                    <option value="Looking for property">Currently scouting location</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F] mb-1">
                    Investment Capital Range
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C]"
                  >
                    <option value="₹25 - ₹35 Lakhs">₹25 – ₹35 Lakhs</option>
                    <option value="₹35 - ₹50 Lakhs">₹35 – ₹50 Lakhs</option>
                    <option value="₹50 - ₹75 Lakhs">₹50 – ₹75 Lakhs</option>
                    <option value="₹75 Lakhs+">₹75 Lakhs+ (Multi-Unit Area Developer)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F] mb-1">
                    Commercial Background
                  </label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C]"
                  >
                    <option value="Experienced retail / F&B franchisee">Experienced Retail / F&B Owner</option>
                    <option value="Corporate executive transitioning to business">Corporate Professional / Investor</option>
                    <option value="Existing salon owner seeking brand upgrade">Existing Salon Owner</option>
                    <option value="First-time entrepreneur">First-Time Entrepreneur</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-[#30452F] to-[#1A2719] hover:from-[#476346] hover:to-[#30452F] text-[#E6B25C] hover:text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all border border-[#E6B25C]/30 shadow-md flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#E6B25C]" />
                      <span>Submitting Proposal...</span>
                    </>
                  ) : (
                    <>
                      <Briefcase className="w-4 h-4" />
                      <span>Submit Partnership Proposal</span>
                    </>
                  )}
                </button>

                <a
                  href={buildFranchiseWhatsApp()}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#25D366] hover:bg-[#1ebd5b] text-white font-bold py-3 px-5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Franchise Team</span>
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
