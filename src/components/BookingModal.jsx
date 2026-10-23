import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, User, Phone, Mail, Scissors, MessageSquare, CheckCircle } from 'lucide-react';
import { salonLocations } from '../data/locationsData';
import { services } from '../data/servicesData';
import { comboOffers, membershipPlans } from '../data/packagesData';

export default function BookingModal({ isOpen, onClose, preselectedService = null }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: 'trichy-kk-nagar',
    service: '',
    stylistTier: 'master',
    date: '',
    time: '11:00 AM',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (preselectedService) {
      setFormData(prev => ({
        ...prev,
        service: preselectedService.id || preselectedService
      }));
    } else if (services.length > 0 && !formData.service) {
      setFormData(prev => ({ ...prev, service: services[0].id }));
    }
  }, [preselectedService, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.date) newErrors.date = 'Preferred date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const selectedLocationObj = salonLocations.find(l => l.id === formData.location) || salonLocations[0];
  
  // Find selected service from services list, comboOffers list, or membershipPlans list
  const matchedService = services.find(s => s.id === formData.service || s.name === formData.service);
  const matchedCombo = comboOffers.find(c => c.id === formData.service || c.shortTitle === formData.service || c.title === formData.service || formData.service?.startsWith?.(c.shortTitle));
  const matchedMembership = membershipPlans.find(m => m.id === formData.service || m.name === formData.service || formData.service?.startsWith?.(m.name));
  
  const selectedServiceObj = matchedService || 
    (matchedCombo ? { name: `${matchedCombo.shortTitle} (${matchedCombo.price})`, price: matchedCombo.price } : null) ||
    (matchedMembership ? { name: `${matchedMembership.name} (${matchedMembership.price})`, price: matchedMembership.price } : null) ||
    { name: formData.service || 'ZAYRO Grooming Service', price: '' };

  const buildWhatsAppMessage = () => {
    const text = `*New ZAYRO Salon Appointment Request* 🌿✨
---------------------------------
👤 *Guest Name:* ${formData.name || 'Guest'}
📱 *Phone:* ${formData.phone || 'Not provided'}
📍 *Salon Branch:* ${selectedLocationObj.name}
✂️ *Service:* ${selectedServiceObj?.name || formData.service || 'Consultation'}
💈 *Stylist Tier:* ${formData.stylistTier === 'master' ? 'Master Creative Director' : formData.stylistTier === 'senior' ? 'Senior Stylist' : 'First Available'}
📅 *Preferred Date:* ${formData.date || 'Earliest available'}
⏰ *Preferred Time:* ${formData.time}
📝 *Notes:* ${formData.notes || 'None'}
---------------------------------
_Sent via ZAYRO Online Concierge Portal_`;

    return `https://wa.me/${selectedLocationObj.whatsapp || '919150022115'}?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitted(true);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-[#F5ECDE] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#E6B25C]/30 overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#30452F] text-white p-4 sm:p-6 relative flex items-center justify-between border-b border-[#E6B25C]/30">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <img src="/images/logo/Transparent Logo.png" alt="ZAYRO Men's Grooming" className="h-10 sm:h-14 w-auto object-contain drop-shadow" />
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#E6B25C] bg-[#1A2719] px-2.5 py-0.5 rounded-full border border-[#476346]">
                Private Concierge
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span>Book Your ZAYRO Experience</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-[#9BB899] mt-0.5 sm:mt-1">
              Complimentary hair texture diagnosis & botanical cleanse with every appointment.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1A2719] hover:bg-[#E6B25C] text-[#F5ECDE] hover:text-[#30452F] flex items-center justify-center transition-colors border border-[#476346] shrink-0"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#30452F]/20 text-[#30452F] mx-auto flex items-center justify-center border-2 border-[#30452F]">
                <CheckCircle className="w-10 h-10 text-[#30452F]" />
              </div>
              <h4 className="font-serif text-2xl font-bold text-[#30452F]">
                Appointment Enquiry Received!
              </h4>
              <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                Thank you, <span className="font-semibold text-[#30452F]">{formData.name}</span>. Your request for <span className="font-semibold text-[#30452F]">{selectedServiceObj?.name}</span> at <span className="font-semibold text-[#30452F]">{selectedLocationObj.name}</span> has been logged.
              </p>
              
              <div className="bg-[#E8EFE8] p-4 rounded-xl border border-[#30452F]/30 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Date & Time:</span>
                  <span className="font-semibold text-[#30452F]">{formData.date} at {formData.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Stylist Tier:</span>
                  <span className="font-semibold text-[#30452F]">{formData.stylistTier === 'master' ? 'Master Creative Director' : 'Senior Stylist'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Mobile:</span>
                  <span className="font-semibold text-[#30452F]">{formData.phone}</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={buildWhatsAppMessage()}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1ebd5b] text-white text-sm font-bold px-6 py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-105"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Request to WhatsApp Now</span>
                </a>
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto bg-[#30452F] text-[#E6B25C] text-sm font-bold px-6 py-3 rounded-xl border border-[#E6B25C]/30 hover:bg-[#1A2719] transition-colors"
                >
                  Done
                </button>
              </div>

              <p className="text-[11px] text-gray-400 italic">
                Note: As this is a static website, appointments are finalized once verified by our branch manager over call or WhatsApp.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F] mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="e.g. Karthikeyan Sundaram / Rajesh Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C] ${
                        errors.name ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F] mb-1">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C] ${
                        errors.phone ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Email & Salon Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F] mb-1">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="email"
                      placeholder="alex@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C] ${
                        errors.email ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F] mb-1">
                    Salon Branch *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <select
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C]"
                    >
                      {salonLocations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.city} — {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Service & Stylist Tier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F] mb-1">
                    Select Service *
                  </label>
                  <div className="relative">
                    <Scissors className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C]"
                    >
                      {/* If custom preselected string is not in standard list, display it at top */}
                      {formData.service && 
                        !services.some(s => s.id === formData.service) && 
                        !comboOffers.some(c => c.id === formData.service) && 
                        !membershipPlans.some(m => m.id === formData.service) && (
                          <option value={formData.service}>
                            {formData.service}
                          </option>
                      )}

                      <optgroup label="ZAYRO Salon — Membership Plans (4 Tiers)">
                        {membershipPlans.map((plan) => (
                          <option key={plan.id} value={plan.id}>
                            {plan.name} ({plan.price} — {plan.duration})
                          </option>
                        ))}
                      </optgroup>

                      <optgroup label="Official 10 Combo Offers (From ₹299)">
                        {comboOffers.map((combo) => (
                          <option key={combo.id} value={combo.id}>
                            {combo.shortTitle}: {combo.tagline} ({combo.price})
                          </option>
                        ))}
                      </optgroup>

                      <optgroup label="Official Rate Card (Brochure Page 1)">
                        {services.filter(s => s.isRateCard).map((svc) => (
                          <option key={svc.id} value={svc.id}>
                            {svc.name} ({svc.price})
                          </option>
                        ))}
                      </optgroup>

                      <optgroup label="Signature & VIP Grooming Lounge">
                        {services.filter(s => !s.isRateCard).map((svc) => (
                          <option key={svc.id} value={svc.id}>
                            {svc.name} ({svc.price})
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F] mb-1">
                    Stylist Preference
                  </label>
                  <select
                    value={formData.stylistTier}
                    onChange={(e) => setFormData({ ...formData, stylistTier: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C]"
                  >
                    <option value="master">Master Creative Director (Senior Asian Hair Artistry)</option>
                    <option value="senior">Senior Stylist (Toni&Guy / L’Oréal Certified)</option>
                    <option value="any">First Available Expert Stylist</option>
                  </select>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F] mb-1">
                    Preferred Date *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C] ${
                        errors.date ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {errors.date && <p className="text-[11px] text-red-500 mt-1">{errors.date}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F] mb-1">
                    Preferred Time Slot
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <select
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C]"
                    >
                      <option value="10:30 AM">10:30 AM (Morning Fresh)</option>
                      <option value="11:30 AM">11:30 AM</option>
                      <option value="01:00 PM">01:00 PM (Midday)</option>
                      <option value="02:30 PM">02:30 PM</option>
                      <option value="04:00 PM">04:00 PM (Afternoon Tea Slot)</option>
                      <option value="05:30 PM">05:30 PM</option>
                      <option value="07:00 PM">07:00 PM (Evening)</option>
                      <option value="08:00 PM">08:00 PM (Late Night Polish)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F] mb-1">
                  Specific Requests or Hair Texture Notes (Optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Sensitive scalp, skin-fade preference, royal groom prep..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C]"
                ></textarea>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#30452F] to-[#1A2719] hover:from-[#476346] hover:to-[#30452F] text-[#E6B25C] hover:text-white font-bold py-3 px-4 rounded-xl text-sm transition-all border border-[#E6B25C]/30 shadow-md flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Submit Appointment Enquiry</span>
                </button>

                <a
                  href={buildWhatsAppMessage()}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#25D366] hover:bg-[#1ebd5b] text-white font-bold py-3 px-5 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 hover:scale-[1.02]"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Book via WhatsApp</span>
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
