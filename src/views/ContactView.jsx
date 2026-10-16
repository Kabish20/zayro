import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, CheckCircle, Sparkles } from 'lucide-react';
import { salonLocations } from '../data/locationsData';

export default function ContactView() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Salon Inquiry',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const err = {};
    if (!formData.name.trim()) err.name = 'Full name is required';
    if (!formData.phone.trim()) {
      err.phone = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      err.phone = 'Enter a valid 10-digit number';
    }
    if (!formData.message.trim()) err.message = 'Please type your message';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="bg-[#30452F] rounded-3xl p-8 sm:p-12 text-white border border-[#E6B25C]/30 relative overflow-hidden">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Contact Info & Branches */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-[#E8DCB8] shadow-sm space-y-6">
            <h3 className="font-serif text-2xl font-bold text-[#30452F]">
              Corporate & Concierge Desk
            </h3>

            <div className="space-y-4 text-xs text-gray-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#30452F] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#30452F] block">Head Office (Trichy, India 🇮🇳):</span>
                  <span>5, Crescent Park Apartment, Hazrath Sulaiman Street, Kaja Nagar, Trichy – 620020</span>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-gray-100">
                <MapPin className="w-4 h-4 text-[#30452F] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#30452F] block">Flagship Salon & Lounge:</span>
                  <span>Door No, 115, Rajaram Rd, opp. to KK Nagar bus terminus, K K Nagar, Tiruchirappalli, Tamil Nadu 620021</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#30452F] shrink-0" />
                <div>
                  <span className="font-bold text-[#30452F] block">Contact Number:</span>
                  <a href="tel:+919150022115" className="hover:text-[#30452F] transition-colors font-medium">
                    +91 91500 22115
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#30452F] shrink-0" />
                <div>
                  <span className="font-bold text-[#30452F] block">Email Inquiries:</span>
                  <a href="mailto:partner@zayroclub.com" className="hover:text-[#30452F] transition-colors">
                    partner@zayroclub.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#30452F] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#30452F] block">Salon Hours:</span>
                  <span>10:00 AM – 09:30 PM (Monday to Sunday)</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/919150022115"
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#1ebd5b] text-white text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message Our Concierge on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Branch Directory */}
          <div className="bg-[#F5ECDE] p-6 rounded-3xl border border-[#E6B25C]/30 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#30452F]">
              Trichy Headquarters & Flagship 🇮🇳
            </h4>
            <div className="space-y-2.5 text-xs text-stone-700">
              <div className="py-1.5 border-b border-gray-200/60">
                <span className="font-bold text-[#30452F] block">Head Office:</span>
                <span className="text-gray-600">5, Crescent Park Apartment, Hazrath Sulaiman St, Kaja Nagar, Trichy – 620020</span>
              </div>
              <div className="py-1.5 border-b border-gray-200/60">
                <span className="font-bold text-[#30452F] block">Flagship Lounge:</span>
                <span className="text-gray-600">Door No. 115, Rajaram Rd, opp. KK Nagar Bus Terminus, Trichy – 620021</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="font-medium text-gray-700">Valet & Parking</span>
                <span className="text-[#30452F] font-semibold">Available at Flagship</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="font-medium text-gray-700">Contact Number</span>
                <a href="tel:+919150022115" className="text-[#30452F] font-semibold hover:underline">
                  +91 91500 22115
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Message Form */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#E8DCB8] shadow-luxury">
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
                className="text-xs font-bold text-[#30452F] underline mt-3"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-serif text-2xl font-bold text-[#30452F] mb-2">
                Send Us a Note
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3 py-2 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C] ${
                      errors.name ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F] mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="10-digit number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-3 py-2 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C] ${
                      errors.phone ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F] mb-1">
                    Topic of Inquiry
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C]"
                  >
                    <option value="General Salon Inquiry">General Lounge Inquiry</option>
                    <option value="Royal Groom Suite & Events">Royal Groom Suite & Wedding Bookings</option>
                    <option value="Franchise Partnership">Franchise Partnership Inquiry</option>
                    <option value="Corporate / Brand Tie-up">Corporate Tie-up</option>
                    <option value="Client Feedback">Guest Feedback & Review</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F] mb-1">
                  Your Message *
                </label>
                <textarea
                  rows="4"
                  placeholder="How can our styling concierge assist you?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`w-full px-3 py-2 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C] ${
                    errors.message ? 'border-red-500' : 'border-gray-200'
                  }`}
                ></textarea>
                {errors.message && <p className="text-[11px] text-red-500 mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-[#30452F] hover:bg-[#30452F] text-[#E6B25C] hover:text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
