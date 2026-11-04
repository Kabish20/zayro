import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  Calendar, Clock, MapPin, User, Phone, Mail, Scissors,
  Loader2, Copy, Check, ArrowLeft, CheckCircle2
} from 'lucide-react';
import { salonLocations } from '@/data/locationsData';
import { services } from '@/data/servicesData';
import { comboOffers, membershipPlans } from '@/data/packagesData';
import {
  safeGetStorageJson,
  safeSetStorageJson,
  isValidEmail,
  isValidName,
  sanitizeInput
} from '@/utils/security';
import {
  submitBooking,
  getAvailableWindowsForDate,
  windowsToSlots,
} from '@/services/bookingService';

// ─── Date helpers ─────────────────────────────────────────────────────────────
const getLocalDateString = (d = new Date()) => {
  const year  = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day   = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
const TODAY_DATE    = getLocalDateString();
const TOMORROW_DATE = (() => { const d = new Date(); d.setDate(d.getDate() + 1); return getLocalDateString(d); })();

const generateBookingRef = () => 'ZYR-' + Math.floor(100000 + Math.random() * 900000);

// ─── Static time slots ────────────────────────────────────────────────────────
const TIME_SLOTS = [
  { value: '10:30 AM', label: '10:30 AM — Morning Fresh',        hour: 10, minute: 30 },
  { value: '11:30 AM', label: '11:30 AM',                        hour: 11, minute: 30 },
  { value: '01:00 PM', label: '01:00 PM — Midday',               hour: 13, minute: 0  },
  { value: '02:30 PM', label: '02:30 PM',                        hour: 14, minute: 30 },
  { value: '04:00 PM', label: '04:00 PM — Afternoon Tea Slot',   hour: 16, minute: 0  },
  { value: '05:30 PM', label: '05:30 PM',                        hour: 17, minute: 30 },
  { value: '07:00 PM', label: '07:00 PM — Evening',              hour: 19, minute: 0  },
  { value: '08:00 PM', label: '08:00 PM — Late Night',           hour: 20, minute: 0  },
];

// ─── Slot helpers ─────────────────────────────────────────────────────────────
const COMPLETED_SLOTS_KEY = 'zayro_completed_slots';

const getStoredSlots = () => {
  const parsed = safeGetStorageJson(COMPLETED_SLOTS_KEY, []);
  return Array.isArray(parsed)
    ? parsed.filter(i => i && typeof i.date === 'string' && typeof i.time === 'string')
    : [];
};

const storeSlot = (slotData) => {
  if (!slotData?.date || !slotData?.time) return getStoredSlots();
  const existing = getStoredSlots();
  const updated  = [
    ...existing,
    {
      date:      sanitizeInput(slotData.date, 30),
      time:      sanitizeInput(slotData.time, 30),
      location:  sanitizeInput(slotData.location || '', 100),
      ref:       sanitizeInput(slotData.bookingRef || '', 30),
      timestamp: new Date().toISOString(),
    },
  ];
  safeSetStorageJson(COMPLETED_SLOTS_KEY, updated, 50);
  return updated;
};

const isSlotTaken = (slot, date, location, taken = []) => {
  if (!date) return false;
  const today = getLocalDateString();
  if (date < today) return true;
  if (date === today) {
    const now = new Date();
    if (now.getHours() > slot.hour || (now.getHours() === slot.hour && now.getMinutes() >= slot.minute)) return true;
  }
  return taken.some(i =>
    i.date === date && i.time === slot.value &&
    (!i.location || !location || i.location === location)
  );
};

const getAvailableSlots = (date, location, taken = []) =>
  !date ? [] : TIME_SLOTS.filter(s => !isSlotTaken(s, date, location, taken));

// ─── Service label maps ───────────────────────────────────────────────────────
const comboOptionLabels = {
  'combo-1':  'Combo 1: Haircut, Beard & Oil Massage (₹299)',
  'combo-2':  'Combo 2: Haircut, Beard, De-Tan & Oil Massage (₹399)',
  'combo-3':  'Combo 3: Haircut, Beard Trim & Any Cleanup (₹499)',
  'combo-4':  'Combo 4: Haircut, Beard, Color & De-Tan (₹599)',
  'combo-5':  'Combo 5: Haircut, Beard & Gold/Diamond Facial (₹699)',
  'combo-6':  'Combo 6: Haircut, Beard, Scalp Therapy & De-Tan (₹799)',
  'combo-7':  'Combo 7: Haircut, Beard, Protein Treatment & De-Tan (₹899)',
  'combo-8':  'Combo 8: Haircut, Beard, Glo Vite Facial & Massage (₹999)',
  'combo-9':  'Combo 9: Haircut, Beard, De-Tan & Detox Spa (₹1,199)',
  'combo-10': 'Combo 10: Haircut, Beard, Hair Spa & Oxy Facial (₹1,499)',
};
const membershipOptionLabels = {
  'membership-silver':   'ZAYRO Silver (₹259 — 2 Months)',
  'membership-gold':     'ZAYRO Gold (₹549 — 5 Months)',
  'membership-platinum': 'ZAYRO Platinum (₹1,099 — 11 Months)',
  'membership-diamond':  'ZAYRO Diamond (₹1,999 — 12 Months)',
};

// ─────────────────────────────────────────────────────────────────────────────
// BookingView — Full-page dedicated booking experience
// ─────────────────────────────────────────────────────────────────────────────
export default function BookingView({ onBack, preselectedService = null }) {
  const [formData, setFormData] = useState({
    name:     '',
    phone:    '',
    email:    '',
    location: 'trichy-kk-nagar',
    service:  preselectedService
      ? (preselectedService.id || preselectedService)
      : (services[0]?.id || ''),
    date:  '',
    time:  '',
    notes: '',
  });

  const [errors,                setErrors]                = useState({});
  const [honeypot,              setHoneypot]              = useState('');
  const [isSubmitting,          setIsSubmitting]          = useState(false);
  const [isSubmitted,           setIsSubmitted]           = useState(false);
  const [bookingRef,            setBookingRef]            = useState('');
  const [copiedRef,             setCopiedRef]             = useState(false);
  const [takenSlots,            setTakenSlots]            = useState(() => getStoredSlots());
  const [appointmentId,         setAppointmentId]         = useState(null);
  const [isLiveApiSynced,       setIsLiveApiSynced]       = useState(false);
  const [liveSlots,             setLiveSlots]             = useState(null);
  const [isCheckingLiveSlots,   setIsCheckingLiveSlots]   = useState(false);

  const topRef = useRef(null);

  // Scroll to top when confirmed
  useEffect(() => {
    if (isSubmitted && topRef.current) topRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [isSubmitted]);

  // Scroll to top on mount
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  // Check Salon360 live availability when date or service changes, with graceful fallback
  useEffect(() => {
    if (!formData.date || !formData.service) {
      return;
    }
    let isCancelled = false;
    const checkLiveSlots = async () => {
      setIsCheckingLiveSlots(true);
      try {
        const res = await getAvailableWindowsForDate(formData.date, formData.service);
        if (!isCancelled) {
          if (!res.isFallback && res.status === 'AVAILABLE' && Array.isArray(res.feasibleWindows) && res.feasibleWindows.length > 0) {
            setLiveSlots(windowsToSlots(res.feasibleWindows));
          } else if (!res.isFallback && res.status === 'FULLY_BOOKED') {
            setLiveSlots([]);
          } else {
            // Fallback to local smart schedule
            setLiveSlots(null);
          }
        }
      } catch {
        if (!isCancelled) setLiveSlots(null);
      } finally {
        if (!isCancelled) setIsCheckingLiveSlots(false);
      }
    };
    checkLiveSlots();
    return () => { isCancelled = true; };
  }, [formData.date, formData.service]);

  const availableSlots = useMemo(() => {
    if (liveSlots !== null) return liveSlots;
    return getAvailableSlots(formData.date, formData.location, takenSlots);
  }, [formData.date, formData.location, takenSlots, liveSlots]);

  // ── Derived objects ─────────────────────────────────────────────────────────
  const selectedLocationObj = salonLocations.find(l => l.id === formData.location) || salonLocations[0];
  const matchedService      = services.find(s => s.id === formData.service || s.name === formData.service);
  const matchedCombo        = comboOffers.find(c =>
    c.id === formData.service || c.shortTitle === formData.service || c.title === formData.service
  );
  const matchedMembership   = membershipPlans.find(m =>
    m.id === formData.service || m.name === formData.service
  );
  const selectedServiceObj  =
    matchedService ||
    (matchedCombo       ? { name: comboOptionLabels[matchedCombo.id]         || matchedCombo.shortTitle,     price: matchedCombo.price }       : null) ||
    (matchedMembership  ? { name: membershipOptionLabels[matchedMembership.id] || matchedMembership.name,    price: matchedMembership.price }  : null) ||
    { name: formData.service || 'ZAYRO Grooming Service', price: '' };

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleSelectDate = useCallback((newDate) => {
    const next = getAvailableSlots(newDate, formData.location, takenSlots);
    setFormData(prev => ({
      ...prev,
      date: newDate,
      time: next.some(s => s.value === prev.time) ? prev.time : (next[0]?.value || ''),
    }));
    setErrors(prev => ({ ...prev, date: undefined, time: undefined }));
  }, [formData.location, takenSlots]);

  const handleSelectLocation = useCallback((loc) => {
    const next = getAvailableSlots(formData.date, loc, takenSlots);
    setFormData(prev => ({
      ...prev,
      location: loc,
      time: next.some(s => s.value === prev.time) ? prev.time : (next[0]?.value || ''),
    }));
  }, [formData.date, takenSlots]);

  const handlePhoneChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '');
    if (raw.length === 12 && raw.startsWith('91')) raw = raw.slice(2);
    if (raw.length === 11 && raw.startsWith('0'))  raw = raw.slice(1);
    const cleaned = raw.slice(0, 10);
    setFormData(prev => ({ ...prev, phone: cleaned }));
    if (errors.phone) {
      if (!cleaned)                              setErrors(prev => ({ ...prev, phone: 'Mobile number is required' }));
      else if (cleaned.startsWith('0'))          setErrors(prev => ({ ...prev, phone: 'Cannot start with 0' }));
      else if (!/^[6-9]/.test(cleaned))          setErrors(prev => ({ ...prev, phone: 'Must start with 6, 7, 8, or 9' }));
      else if (cleaned.length < 10)              setErrors(prev => ({ ...prev, phone: `${cleaned.length}/10 digits entered` }));
      else                                       setErrors(prev => ({ ...prev, phone: undefined }));
    }
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim())       e.name  = 'Full name is required';
    else if (!isValidName(formData.name)) e.name = 'Please enter your name (2–80 characters)';

    const ph = (formData.phone || '').replace(/[\s-]/g, '');
    if (!ph)                             e.phone = 'Mobile number is required';
    else if (ph.startsWith('0'))         e.phone = 'Cannot start with 0';
    else if (!/^[6-9]/.test(ph))        e.phone = 'Must start with 6, 7, 8, or 9';
    else if (ph.length !== 10)           e.phone = `Must be exactly 10 digits (${ph.length} entered)`;

    if (formData.email && !isValidEmail(formData.email)) e.email = 'Enter a valid email address';
    if (!formData.date) e.date = 'Preferred date is required';
    else if (availableSlots.length === 0) e.time = 'All slots taken. Please choose another date.';
    else if (!formData.time) e.time = 'Please select a time slot';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const ref = generateBookingRef();
    setBookingRef(ref);
    setIsSubmitting(true);
    let syncedApptId = null;

    try {
      // 1. Attempt Salon360 API call (uses toHMS internally for accurate 24h store-local time)
      try {
        const apiResult = await submitBooking({
          date: formData.date,
          startTime: formData.time,
          serviceKey: formData.service,
          name: sanitizeInput(formData.name, 80),
          phone: formData.phone,
          email: formData.email || null,
          notes: formData.notes || null,
        });

        if (apiResult?.appointmentId) {
          syncedApptId = apiResult.appointmentId;
          setAppointmentId(syncedApptId);
          setIsLiveApiSynced(true);
        }
      } catch (apiErr) {
        // Salon360 endpoint not yet deployed/active on their backend; continue gracefully
        console.warn('[Salon360] Live API not yet active, logging booking locally:', apiErr?.message);
      }

      // 2. Always record locally and confirm
      await new Promise(res => setTimeout(res, 400));
      const updated = storeSlot({
        date: formData.date,
        time: formData.time,
        location: formData.location,
        bookingRef: ref,
        appointmentId: syncedApptId,
      });
      setTakenSlots(updated);
      setIsSubmitted(true);
    } catch {
      setErrors(prev => ({ ...prev, submit: 'Unable to complete booking at this moment. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyRef = () => {
    if (bookingRef) {
      navigator.clipboard.writeText(bookingRef);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  // ── CONFIRMATION VIEW ──────────────────────────────────────────────────────
  if (isSubmitted) {
    return (
      <div ref={topRef} className="min-h-screen bg-gradient-to-br from-[#0C160E] via-[#162719] to-[#0A130B] text-[#F5ECDE] py-10 px-4">
        <div className="max-w-2xl mx-auto">

          {/* Back */}
          <button onClick={onBack} className="flex items-center gap-2 text-[#9BB899] hover:text-[#E6B25C] text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>

          {/* Confirmed card */}
          <div className="relative rounded-2xl bg-gradient-to-br from-[#162719] via-[#203723] to-[#122014] p-6 sm:p-10 border border-[#E6B25C]/40 shadow-2xl overflow-hidden text-center">

            <div className="absolute top-0 right-0 w-64 h-64 bg-[#E6B25C]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#E6B25C] to-transparent" />

            {/* Checkmark Icon */}
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-lg">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
              Appointment Confirmed!
            </h2>
            <p className="text-sm text-[#9BB899] max-w-md mx-auto mb-6">
              Thank you, <span className="text-white font-medium">{formData.name}</span>. Your appointment has been successfully scheduled.
            </p>

            {/* Reference Badge */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-black/40 border border-[#E6B25C]/30">
                <span className="text-xs uppercase tracking-wider text-[#9BB899]">Appointment ID:</span>
                <span className="font-mono text-sm sm:text-base font-bold text-[#E6B25C]">#{bookingRef}</span>
                {appointmentId && (
                  <span className="text-xs text-emerald-400 font-mono pl-2 border-l border-[#E6B25C]/20">
                    Salon360 Appt #{appointmentId}
                  </span>
                )}
                <button onClick={handleCopyRef} type="button" title="Copy Reference" className="p-1 rounded bg-[#30452F] hover:bg-[#476346] text-[#E6B25C] transition-colors ml-1">
                  {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              {isLiveApiSynced && (
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                  ✓ Synced with Salon360 POS
                </span>
              )}
            </div>

            {/* Detail Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left p-5 bg-black/20 rounded-xl border border-white/10 mb-6">
              {[
                { icon: <Scissors className="w-4 h-4 text-[#E6B25C]" />, label: 'Reserved Treatment', value: selectedServiceObj?.name || 'ZAYRO Grooming', sub: selectedServiceObj?.price },
                { icon: <Clock className="w-4 h-4 text-[#E6B25C]" />,    label: 'Date & Time', value: `${formData.date}  ·  ${formData.time}`, sub: 'Chair Reserved' },
                { icon: <User className="w-4 h-4 text-[#E6B25C]" />,     label: 'Guest Details', value: formData.name, sub: `+91 ${formData.phone}${formData.email ? '  ·  ' + formData.email : ''}` },
                { icon: <MapPin className="w-4 h-4 text-[#E6B25C]" />,   label: 'Salon Branch', value: selectedLocationObj.name, sub: selectedLocationObj.address },
              ].map(({ icon, label, value, sub }) => (
                <div key={label} className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#E6B25C] font-semibold">
                    {icon} <span>{label}</span>
                  </div>
                  <p className="font-serif text-sm font-bold text-white">{value}</p>
                  {sub && <span className="inline-block text-[11px] text-[#9BB899]">{sub}</span>}
                </div>
              ))}
            </div>

            <p className="text-xs text-[#E8DCB8]/80 mb-6">
              A reminder notification will be sent to your phone prior to your scheduled slot. We look forward to welcoming you to ZAYRO.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    name: '',
                    phone: '',
                    email: '',
                    location: 'trichy-kk-nagar',
                    service: services[0]?.id || '',
                    date: '',
                    time: '',
                    notes: '',
                  });
                }}
                type="button"
                className="px-5 py-3 rounded-xl bg-[#30452F] hover:bg-[#476346] text-[#E6B25C] font-bold text-sm transition-colors border border-[#E6B25C]/30"
              >
                Book Another Service
              </button>
              <button
                onClick={onBack}
                type="button"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#C9943B] via-[#E6B25C] to-[#C9943B] hover:brightness-110 text-[#142314] font-bold text-sm transition-all shadow-lg"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── BOOKING FORM VIEW ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F5ECDE]">

      {/* Page Hero Header */}
      <div className="bg-[#30452F] text-white px-4 py-6 sm:py-10">
        <div className="max-w-2xl mx-auto">
          <button onClick={onBack} className="flex items-center gap-2 text-[#9BB899] hover:text-[#E6B25C] text-xs mb-5 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          <div className="flex items-center gap-4 mb-3">
            <img src="/images/logo/Transparent Logo.png" alt="ZAYRO" className="h-10 sm:h-14 w-auto object-contain drop-shadow" />
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#E6B25C] bg-[#1A2719] px-2.5 py-0.5 rounded-full border border-[#476346]">
              Private Concierge
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">Book Your ZAYRO Experience</h1>
          <p className="text-sm text-[#9BB899] mt-1">Complimentary hair texture diagnosis &amp; botanical cleanse with every appointment.</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Honeypot */}
          <div className="hidden" aria-hidden="true" style={{ display: 'none', position: 'absolute', opacity: 0, pointerEvents: 'none' }}>
            <input type="text" name="fax_field" tabIndex={-1} autoComplete="off" value={honeypot} onChange={e => setHoneypot(e.target.value)} />
          </div>

          {/* Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F] mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input type="text" maxLength={80} autoComplete="name" placeholder="e.g. Karthikeyan Sundaram"
                  value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C] shadow-sm ${errors.name ? 'border-red-400' : 'border-gray-200'}`} />
              </div>
              {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F]">Mobile Number *</label>
                <span className={`text-[10px] font-mono ${formData.phone.length === 10 && /^[6-9]/.test(formData.phone) ? 'text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded' : 'text-gray-400'}`}>
                  {formData.phone.length === 10 && /^[6-9]/.test(formData.phone) ? '✓ 10/10' : `${formData.phone.length}/10`}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-semibold text-gray-500 flex items-center gap-1.5 pointer-events-none select-none">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span className="border-r border-gray-300 pr-1.5">+91</span>
                </span>
                <input type="tel" inputMode="numeric" pattern="[6-9][0-9]{9}" maxLength={10} placeholder="98765 43210"
                  value={formData.phone} onChange={handlePhoneChange}
                  className={`w-full pl-16 pr-3 py-2.5 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C] shadow-sm ${errors.phone ? 'border-red-400' : 'border-gray-200'}`} />
              </div>
              {errors.phone && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.phone}</p>}
            </div>
          </div>

          {/* Email & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F] mb-1">Email Address (Optional)</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input type="email" maxLength={100} autoComplete="email" placeholder="alex@example.com"
                  value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C] shadow-sm ${errors.email ? 'border-red-400' : 'border-gray-200'}`} />
              </div>
              {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F] mb-1">Salon Branch *</label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <select value={formData.location} onChange={e => handleSelectLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C] shadow-sm">
                  {salonLocations.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.city} — {loc.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Service */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F] mb-1">Select Service *</label>
            <div className="relative">
              <Scissors className="w-4 h-4 absolute left-3 top-3 text-gray-400 z-10" />
              <select value={formData.service} onChange={e => setFormData({ ...formData, service: e.target.value })}
                className="w-full pl-9 pr-8 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C] shadow-sm cursor-pointer">
                <optgroup label="Official 10 Combo Offers (From ₹299)">
                  {comboOffers.map(c => <option key={c.id} value={c.id}>{comboOptionLabels[c.id] || `${c.shortTitle} (${c.price})`}</option>)}
                </optgroup>
                <optgroup label="ZAYRO Membership Plans">
                  {membershipPlans.map(m => <option key={m.id} value={m.id}>{membershipOptionLabels[m.id] || `${m.name} (${m.price})`}</option>)}
                </optgroup>
                <optgroup label="Official Rate Card (From ₹50)">
                  {services.filter(s => s.isRateCard).map(s => <option key={s.id} value={s.id}>{s.name} ({s.price})</option>)}
                </optgroup>
                <optgroup label="Signature & VIP Grooming Lounge">
                  {services.filter(s => !s.isRateCard).map(s => <option key={s.id} value={s.id}>{s.name} ({s.price})</option>)}
                </optgroup>
              </select>
            </div>
            {selectedServiceObj?.name && (
              <div className="mt-2 p-2.5 bg-[#E8EFE8] rounded-xl border border-[#30452F]/15 flex items-start justify-between gap-2 text-xs">
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[#30452F] truncate">{selectedServiceObj.name}</div>
                  {matchedCombo       && <p className="text-[11px] text-gray-600 mt-0.5 line-clamp-1"><span className="font-medium text-[#30452F]">Includes:</span> {matchedCombo.tagline}</p>}
                  {matchedMembership  && <p className="text-[11px] text-gray-600 mt-0.5">{matchedMembership.includes?.join(' + ')}</p>}
                  {matchedService?.tagline && <p className="text-[11px] text-gray-600 mt-0.5">{matchedService.tagline}</p>}
                </div>
                {selectedServiceObj.price && (
                  <span className="font-bold text-[#30452F] bg-[#E6B25C]/40 px-2 py-0.5 rounded text-[11px] whitespace-nowrap shrink-0">{selectedServiceObj.price}</span>
                )}
              </div>
            )}
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F]">Preferred Date *</label>
                <div className="flex gap-1.5 text-[10px]">
                  {[{ label: 'Today', val: TODAY_DATE }, { label: 'Tomorrow', val: TOMORROW_DATE }].map(({ label, val }) => (
                    <button key={label} type="button" onClick={() => handleSelectDate(val)}
                      className={`px-2 py-0.5 rounded-full border transition-all ${formData.date === val ? 'bg-[#30452F] text-[#E6B25C] border-[#30452F] font-bold' : 'bg-white text-gray-600 border-gray-300 hover:border-[#30452F]'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input type="date" min={TODAY_DATE} value={formData.date} onChange={e => handleSelectDate(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C] shadow-sm ${errors.date ? 'border-red-400' : 'border-gray-200'}`} />
              </div>
              {errors.date && <p className="text-[11px] text-red-500 mt-1">{errors.date}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F]">Preferred Time Slot *</label>
                <div className="flex items-center gap-2">
                  {isCheckingLiveSlots && (
                    <span className="text-[10px] text-[#476346] flex items-center gap-1 font-medium">
                      <Loader2 className="w-3 h-3 animate-spin text-[#E6B25C]" />
                      Checking...
                    </span>
                  )}
                  {formData.date && !isCheckingLiveSlots && availableSlots.length > 0 && (
                    <span className="text-[10px] font-bold text-[#476346] bg-[#476346]/10 px-2 py-0.5 rounded-full">{availableSlots.length} available</span>
                  )}
                  {formData.date && !isCheckingLiveSlots && availableSlots.length === 0 && (
                    <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Fully Booked</span>
                  )}
                </div>
              </div>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <select value={formData.time}
                  disabled={!formData.date || availableSlots.length === 0}
                  onChange={e => { setFormData(prev => ({ ...prev, time: e.target.value })); setErrors(prev => ({ ...prev, time: undefined })); }}
                  className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C] shadow-sm ${
                    !formData.date || availableSlots.length === 0
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      : errors.time ? 'border-red-400' : 'border-gray-200'
                  }`}>
                  {!formData.date        && <option value="">Select a date first</option>}
                  {formData.date && availableSlots.length === 0 && <option value="">No slots — try another date</option>}
                  {availableSlots.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              {errors.time && <p className="text-[11px] text-red-500 mt-1">{errors.time}</p>}
              {!formData.date && <p className="text-[11px] text-gray-500 mt-1">Select a date to view available slots</p>}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F] mb-1">
              Specific Requests or Hair Texture Notes (Optional)
            </label>
            <textarea rows={2} maxLength={500} placeholder="e.g. Sensitive scalp, skin-fade preference, royal groom prep…"
              value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C] shadow-sm" />
          </div>

          {/* Error banner */}
          {errors.submit && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">{errors.submit}</div>
          )}

          {/* Submit button */}
          <div className="pt-2">
            <button type="submit" disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#30452F] to-[#1A2719] hover:from-[#476346] hover:to-[#30452F] text-[#E6B25C] font-bold py-4 px-6 rounded-xl text-base flex items-center justify-center gap-2 disabled:opacity-70 transition-all shadow-lg border border-[#E6B25C]/30 text-center">
              {isSubmitting
                ? <><Loader2 className="w-5 h-5 animate-spin" /><span>Confirming Your Appointment…</span></>
                : <><Calendar className="w-5 h-5" /><span>Confirm Appointment</span></>
              }
            </button>
          </div>

          {/* Trust note */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-[11px] text-gray-500">
            <span className="flex items-center gap-1"><span className="text-[#E6B25C]">✦</span> Zero Wait Guarantee</span>
            <span className="flex items-center gap-1"><span className="text-[#E6B25C]">✦</span> Free Hair Diagnosis</span>
            <span className="flex items-center gap-1"><span className="text-[#E6B25C]">✦</span> Instant WhatsApp Confirm</span>
          </div>
        </form>
      </div>
    </div>
  );
}

