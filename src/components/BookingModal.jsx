import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  X, Calendar, Clock, MapPin, User, Phone, Mail, Scissors, MessageSquare, 
  Loader2, Copy, Check, Sparkles, Download
} from 'lucide-react';
import { salonLocations } from '../data/locationsData';
import { services } from '../data/servicesData';
import { comboOffers, membershipPlans } from '../data/packagesData';
import { submitToGoogleSheets } from '../services/googleSheetsService';
import { downloadBookingPassImage } from '../utils/bookingPassGenerator';

// Helper for local YYYY-MM-DD date string (robust against timezone/UTC shifts)
const getLocalDateString = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const TODAY_DATE = getLocalDateString();
const TOMORROW_DATE = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return getLocalDateString(d);
})();

const generateBookingRef = () => 'ZYR-' + Math.floor(100000 + Math.random() * 900000);

const TIME_SLOTS = [
  { value: '10:30 AM', label: '10:30 AM (Morning Fresh)', hour: 10, minute: 30 },
  { value: '11:30 AM', label: '11:30 AM', hour: 11, minute: 30 },
  { value: '01:00 PM', label: '01:00 PM (Midday)', hour: 13, minute: 0 },
  { value: '02:30 PM', label: '02:30 PM', hour: 14, minute: 30 },
  { value: '04:00 PM', label: '04:00 PM (Afternoon Tea Slot)', hour: 16, minute: 0 },
  { value: '05:30 PM', label: '05:30 PM', hour: 17, minute: 30 },
  { value: '07:00 PM', label: '07:00 PM (Evening)', hour: 19, minute: 0 },
  { value: '08:00 PM', label: '08:00 PM (Late Night Polish)', hour: 20, minute: 0 },
];

const COMPLETED_SLOTS_KEY = 'zayro_completed_slots';

const getStoredCompletedSlots = () => {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(COMPLETED_SLOTS_KEY) : null;
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error reading completed slots:', e);
    return [];
  }
};

const storeCompletedSlot = (slotData) => {
  try {
    const existing = getStoredCompletedSlots();
    const updated = [
      ...existing,
      {
        date: slotData.date,
        time: slotData.time,
        location: slotData.location,
        ref: slotData.bookingRef || slotData.ref || '',
        timestamp: new Date().toISOString()
      }
    ];
    if (typeof window !== 'undefined') {
      localStorage.setItem(COMPLETED_SLOTS_KEY, JSON.stringify(updated));
    }
    return updated;
  } catch (e) {
    console.error('Error saving completed slot:', e);
    return [];
  }
};

const isSlotCompleted = (slot, selectedDate, selectedLocation, completedList = []) => {
  if (!selectedDate) return false;

  const todayStr = getLocalDateString();

  // 1. If selected date is in the past, all slots are completed
  if (selectedDate < todayStr) {
    return true;
  }

  // 2. If selected date is today, check if current clock time is past slot time
  if (selectedDate === todayStr) {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    if (currentHour > slot.hour || (currentHour === slot.hour && currentMinute >= slot.minute)) {
      return true;
    }
  }

  // 3. Check if slot was completed / booked for this date & location
  const isBooked = completedList.some((item) => {
    if (item.date !== selectedDate) return false;
    if (item.time !== slot.value) return false;
    if (item.location && selectedLocation && item.location !== selectedLocation) {
      return false;
    }
    return true;
  });

  return isBooked;
};

const getAvailableSlots = (date, location, completedList = []) => {
  if (!date) return [];
  return TIME_SLOTS.filter((slot) => !isSlotCompleted(slot, date, location, completedList));
};

const comboOptionLabels = {
  'combo-1': 'Combo 1: Haircut, Beard & Oil Massage (₹299)',
  'combo-2': 'Combo 2: Haircut, Beard, De-Tan & Oil Massage (₹399)',
  'combo-3': 'Combo 3: Haircut, Beard Trim & Any Cleanup (₹499)',
  'combo-4': 'Combo 4: Haircut, Beard, Color & De-Tan (₹599)',
  'combo-5': 'Combo 5: Haircut, Beard & Gold/Diamond Facial (₹699)',
  'combo-6': 'Combo 6: Haircut, Beard, Scalp Therapy & De-Tan (₹799)',
  'combo-7': 'Combo 7: Haircut, Beard, Protein Treatment & De-Tan (₹899)',
  'combo-8': 'Combo 8: Haircut, Beard, Glo Vite Facial & Massage (₹999)',
  'combo-9': 'Combo 9: Haircut, Beard, De-Tan & Detox Spa (₹1,199)',
  'combo-10': 'Combo 10: Haircut, Beard, Hair Spa & Oxy Facial (₹1,499)',
};

const membershipOptionLabels = {
  'membership-silver': 'ZAYRO Silver (₹259 — 2 Months)',
  'membership-gold': 'ZAYRO Gold (₹549 — 5 Months)',
  'membership-platinum': 'ZAYRO Platinum (₹1,099 — 11 Months)',
  'membership-diamond': 'ZAYRO Diamond (₹1,999 — 12 Months)',
};

export default function BookingModal({ isOpen, onClose, preselectedService = null }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: 'trichy-kk-nagar',
    service: preselectedService ? (preselectedService.id || preselectedService) : (services[0]?.id || ''),
    date: '',
    time: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [copiedRef, setCopiedRef] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const modalBodyRef = useRef(null);

  useEffect(() => {
    if (isSubmitted && modalBodyRef.current) {
      modalBodyRef.current.scrollTop = 0;
    }
  }, [isSubmitted]);

  const [completedSlots, setCompletedSlots] = useState(() => getStoredCompletedSlots());

  const [prevPreselected, setPrevPreselected] = useState(preselectedService);

  if (preselectedService !== prevPreselected) {
    setPrevPreselected(preselectedService);
    if (preselectedService) {
      const nextService = preselectedService.id || preselectedService;
      setFormData((prev) => ({ ...prev, service: nextService }));
    }
  }

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setCompletedSlots(getStoredCompletedSlots());
    }
  }

  // Compute available slots for currently selected date and location
  const availableSlots = useMemo(() => {
    return getAvailableSlots(formData.date, formData.location, completedSlots);
  }, [formData.date, formData.location, completedSlots]);

  // Synchronize selected time whenever date or location changes
  const handleSelectDate = (newDate) => {
    const nextAvailable = getAvailableSlots(newDate, formData.location, completedSlots);
    setFormData((prev) => ({
      ...prev,
      date: newDate,
      time: nextAvailable.some((s) => s.value === prev.time)
        ? prev.time
        : nextAvailable[0]?.value || ''
    }));
    if (errors.date) {
      setErrors((prev) => ({ ...prev, date: undefined }));
    }
    if (errors.time) {
      setErrors((prev) => ({ ...prev, time: undefined }));
    }
  };

  const handleSelectLocation = (newLoc) => {
    const nextAvailable = getAvailableSlots(formData.date, newLoc, completedSlots);
    setFormData((prev) => ({
      ...prev,
      location: newLoc,
      time: nextAvailable.some((s) => s.value === prev.time)
        ? prev.time
        : nextAvailable[0]?.value || ''
    }));
  };

  const handlePhoneChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '');

    // Auto-strip leading 91 if full 12 digits pasted (e.g. +91 9876543210)
    if (raw.length === 12 && raw.startsWith('91')) {
      raw = raw.slice(2);
    }
    // Auto-strip leading 0 if 11 digits pasted (e.g. 09876543210)
    if (raw.length === 11 && raw.startsWith('0')) {
      raw = raw.slice(1);
    }

    // Hard limitation strictly to 10 digits
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

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    const cleanedPhone = (formData.phone || '').replace(/[\s-]/g, '');
    if (!cleanedPhone) {
      newErrors.phone = 'Mobile number is required';
    } else if (cleanedPhone.startsWith('0')) {
      newErrors.phone = 'Mobile number cannot start with 0';
    } else if (!/^[6-9]/.test(cleanedPhone)) {
      newErrors.phone = 'Mobile number must start with 6, 7, 8, or 9';
    } else if (cleanedPhone.length !== 10) {
      newErrors.phone = `Must be exactly 10 digits (${cleanedPhone.length}/10 entered)`;
    } else if (!/^[6-9][0-9]{9}$/.test(cleanedPhone)) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.date) {
      newErrors.date = 'Preferred date is required';
    } else if (availableSlots.length === 0) {
      newErrors.time = 'All slots for this date are completed. Please select another date.';
    } else if (!formData.time) {
      newErrors.time = 'Please select a preferred time slot';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const selectedLocationObj = salonLocations.find(l => l.id === formData.location) || salonLocations[0];
  
  // Find selected service from services list, comboOffers list, or membershipPlans list
  const matchedService = services.find(s => s.id === formData.service || s.name === formData.service);
  const matchedCombo = comboOffers.find(c => c.id === formData.service || c.shortTitle === formData.service || c.title === formData.service || formData.service?.startsWith?.(c.shortTitle));
  const matchedMembership = membershipPlans.find(m => m.id === formData.service || m.name === formData.service || formData.service?.startsWith?.(m.name));
  
  const selectedServiceObj = matchedService || 
    (matchedCombo ? { 
      name: comboOptionLabels[matchedCombo.id] || `${matchedCombo.shortTitle} (${matchedCombo.price})`, 
      price: matchedCombo.price 
    } : null) ||
    (matchedMembership ? { 
      name: membershipOptionLabels[matchedMembership.id] || `${matchedMembership.name} (${matchedMembership.price})`, 
      price: matchedMembership.price 
    } : null) ||
    { name: formData.service || 'ZAYRO Grooming Service', price: '' };

  const buildWhatsAppMessage = () => {
    const text = `*New ZAYRO Salon Appointment Request* 🌿✨
---------------------------------
👤 *Guest Name:* ${formData.name || 'Guest'}
📱 *Phone:* ${formData.phone || 'Not provided'}
📍 *Salon Branch:* ${selectedLocationObj.name}
✂️ *Service:* ${selectedServiceObj?.name || formData.service || 'Consultation'}
📅 *Preferred Date:* ${formData.date || 'Earliest available'}
⏰ *Preferred Time:* ${formData.time}
📝 *Notes:* ${formData.notes || 'None'}
---------------------------------
_Sent via ZAYRO Online Concierge Portal_`;

    return `https://wa.me/${selectedLocationObj.whatsapp || '919150022115'}?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    const generatedRef = generateBookingRef();
    setBookingRef(generatedRef);
    setIsSubmitting(true);
    
    try {
      await submitToGoogleSheets({
        formType: 'Bookings',
        bookingRef: generatedRef,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        location: selectedLocationObj.name,
        service: selectedServiceObj?.name || formData.service,
        date: formData.date,
        time: formData.time,
        notes: formData.notes
      });
      // Store completed slot so it is immediately removed from display for this date
      const updatedList = storeCompletedSlot({
        date: formData.date,
        time: formData.time,
        location: formData.location,
        bookingRef: generatedRef
      });
      setCompletedSlots(updatedList);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Error submitting booking:', err);
      const updatedList = storeCompletedSlot({
        date: formData.date,
        time: formData.time,
        location: formData.location,
        bookingRef: generatedRef
      });
      setCompletedSlots(updatedList);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppBooking = () => {
    if (formData.date && formData.time) {
      const updatedList = storeCompletedSlot({
        date: formData.date,
        time: formData.time,
        location: formData.location,
        bookingRef: generateBookingRef()
      });
      setCompletedSlots(updatedList);
    }
  };



  const handleCopyRef = () => {
    if (bookingRef) {
      navigator.clipboard.writeText(bookingRef);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const handleDownloadPass = async () => {
    setIsDownloading(true);
    try {
      await downloadBookingPassImage({
        bookingRef: bookingRef || 'ZYR-849201',
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        service: selectedServiceObj?.name || formData.service || 'ZAYRO Signature Grooming',
        location: selectedLocationObj.name,
        address: selectedLocationObj.address,
        date: formData.date,
        time: formData.time,
        notes: formData.notes
      });
    } catch (err) {
      console.error('Error generating booking pass:', err);
    } finally {
      setIsDownloading(false);
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
        <div ref={modalBodyRef} className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6">
          {isSubmitted ? (
            <div className="py-2 sm:py-3 space-y-4 animate-fadeIn">
              
              {/* Status Header */}
              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#30452F]/15 border border-[#30452F]/30 text-[#30452F] text-[11px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-[#C9943B]" />
                  <span>Appointment Confirmed & Logged</span>
                </div>
                <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#30452F]">
                  Your VIP Booking Pass
                </h4>
              </div>

              {/* Luxury Pass Card */}
              <div className="relative rounded-2xl bg-gradient-to-br from-[#162719] via-[#203723] to-[#122014] p-5 sm:p-7 text-[#F5ECDE] border-2 border-[#E6B25C]/70 shadow-2xl overflow-hidden">
                
                {/* Decorative Accent Glow */}
                <div className="absolute top-0 right-0 w-44 h-44 bg-[#E6B25C]/10 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#E6B25C] to-transparent"></div>

                {/* Card Top: Centered Brand Logo & Ribbon */}
                <div className="text-center pb-4 border-b border-[#E6B25C]/25 space-y-2.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E6B25C]/15 border border-[#E6B25C]/40 text-[#E6B25C] text-[10px] font-bold uppercase tracking-widest">
                    <span>Official Appointment Pass • Private Concierge</span>
                  </div>
                  
                  {/* Brand Logo Centered */}
                  <div className="flex justify-center py-1">
                    <img 
                      src="/images/logo/Transparent Logo.png" 
                      alt="ZAYRO Men's Grooming Lounge" 
                      className="h-12 sm:h-14 w-auto object-contain drop-shadow" 
                    />
                  </div>

                  {/* Gold Divider with Center Diamond */}
                  <div className="relative flex items-center justify-center my-1.5">
                    <div className="w-full border-t border-[#E6B25C]/30"></div>
                    <div className="absolute px-2 bg-[#1B2F1E] text-[#E6B25C] text-[10px]">♦</div>
                  </div>

                  {/* Pass ID Pill & Status Badge */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-1">
                    <div className="flex items-center gap-2 bg-black/40 px-3.5 py-1.5 rounded-xl border border-[#E6B25C]/35">
                      <div className="text-left">
                        <span className="text-[8px] uppercase tracking-wider text-[#9BB899] block font-semibold">Pass Reference</span>
                        <span className="font-mono text-xs sm:text-sm font-bold text-[#E6B25C]">#{bookingRef}</span>
                      </div>
                      <button
                        onClick={handleCopyRef}
                        type="button"
                        title="Copy Pass Reference"
                        className="p-1.5 rounded-lg bg-[#30452F] hover:bg-[#476346] text-[#E6B25C] transition-colors"
                      >
                        {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2ECC71] bg-black/30 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                      <span className="w-2 h-2 rounded-full bg-[#2ECC71] animate-pulse"></span>
                      <span>Confirmed Appointment Request</span>
                    </div>
                  </div>
                </div>

                {/* Card Grid Details: Stacked Labels & Values */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-b border-[#E6B25C]/20 text-left">
                  
                  {/* Service */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#E6B25C] font-semibold">
                      <Scissors className="w-3.5 h-3.5 text-[#E6B25C]" />
                      <span>Reserved Treatment</span>
                    </div>
                    <p className="font-serif text-sm sm:text-base font-bold text-white">
                      {selectedServiceObj?.name || formData.service || 'ZAYRO Signature Grooming'}
                    </p>
                    {selectedServiceObj?.price && (
                      <span className="inline-block text-[11px] font-bold text-[#E6B25C] bg-[#162316] px-2 py-0.5 rounded border border-[#E6B25C]/30">
                        {selectedServiceObj.price}
                      </span>
                    )}
                  </div>

                  {/* Schedule */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#E6B25C] font-semibold">
                      <Clock className="w-3.5 h-3.5 text-[#E6B25C]" />
                      <span>Date & Preferred Time</span>
                    </div>
                    <p className="font-sans text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      <span>{formData.date}</span>
                      <span className="text-xs font-normal text-[#9BB899]">at</span>
                      <span className="text-[#E6B25C]">{formData.time}</span>
                    </p>
                    <span className="text-[11px] text-[#9BB899] block">
                      Priority Concierge Seating (Zero Waiting)
                    </span>
                  </div>

                  {/* Guest */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#E6B25C] font-semibold">
                      <User className="w-3.5 h-3.5 text-[#E6B25C]" />
                      <span>Guest Contact Details</span>
                    </div>
                    <p className="text-sm font-bold text-white">
                      {formData.name}
                    </p>
                    <p className="text-xs text-[#9BB899] font-mono">
                      +91 {formData.phone}
                    </p>
                    {formData.email && (
                      <p className="text-xs text-[#9BB899]">
                        {formData.email}
                      </p>
                    )}
                  </div>

                  {/* Branch */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#E6B25C] font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-[#E6B25C]" />
                      <span>Salon Branch</span>
                    </div>
                    <p className="text-sm font-bold text-white">
                      {selectedLocationObj.name}
                    </p>
                    <p className="text-[11px] text-[#9BB899] line-clamp-1">
                      {selectedLocationObj.address || 'Trichy, Tamil Nadu'}
                    </p>
                  </div>
                </div>

                {/* Complimentary Concierge Privileges */}
                <div className="pt-3 pb-1 text-left">
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#E6B25C] block mb-2">
                    Included Concierge Privileges:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#E8DCB8]">
                    <div className="flex items-center gap-2">
                      <span className="text-[#E6B25C]">✦</span>
                      <span>1-on-1 Hair Texture Diagnosis</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#E6B25C]">✦</span>
                      <span>Botanical Cleanse & Warm Towel</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#E6B25C]">✦</span>
                      <span>Artisan Espresso / Herbal Refreshment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#E6B25C]">✦</span>
                      <span>Zero Waiting Chair Allocation</span>
                    </div>
                  </div>
                </div>

                {/* Perforated Ticket Line */}
                <div className="relative my-3.5 flex items-center justify-between">
                  <div className="w-3 h-5 bg-[#F5ECDE] rounded-r-full -ml-5 sm:-ml-7"></div>
                  <div className="flex-1 border-t border-dashed border-[#E6B25C]/40 mx-2"></div>
                  <div className="w-3 h-5 bg-[#F5ECDE] rounded-l-full -mr-5 sm:-mr-7"></div>
                </div>

                {/* Barcode & Salon Note */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
                  <p className="text-[11px] text-[#9BB899]">
                    Present this pass or Pass ID at salon desk upon arrival.
                  </p>
                  <div className="font-mono text-[10px] text-[#E6B25C] tracking-widest bg-black/40 px-3 py-1.5 rounded-lg border border-[#E6B25C]/20">
                    |||| || |||||| || ||| #{bookingRef}
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-1">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Download VIP Pass (PNG) */}
                  <button
                    onClick={handleDownloadPass}
                    disabled={isDownloading}
                    type="button"
                    className="bg-gradient-to-r from-[#C9943B] via-[#E6B25C] to-[#C9943B] hover:brightness-110 text-[#142314] font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-2 font-sans hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#142314]" />
                        <span>Generating VIP Pass...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 text-[#142314]" />
                        <span>Download VIP Pass (PNG)</span>
                      </>
                    )}
                  </button>

                  {/* Send via WhatsApp */}
                  <a
                    href={buildWhatsAppMessage()}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#25D366] hover:bg-[#1ebd5b] text-white font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 hover:scale-[1.01]"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send to WhatsApp Concierge</span>
                  </a>
                </div>

                {/* Done / Close Button */}
                <button
                  onClick={handleReset}
                  type="button"
                  className="w-full bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-colors border border-stone-300"
                >
                  Done / Close
                </button>

              </div>

              <p className="text-[11px] text-gray-500 text-center">
                Your appointment request is saved in our system. Our branch manager will reach out over call or WhatsApp to confirm your slot.
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
                  <div className="flex items-center justify-between mb-1">
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
                      onChange={(e) => handleSelectLocation(e.target.value)}
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

              {/* Service */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F] mb-1">
                  Select Service *
                </label>
                <div className="relative">
                  <Scissors className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full pl-9 pr-8 py-2.5 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C] truncate cursor-pointer shadow-xs"
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

                    <optgroup label="Official 10 Combo Offers (From ₹299)">
                      {comboOffers.map((combo) => (
                        <option key={combo.id} value={combo.id}>
                          {comboOptionLabels[combo.id] || `${combo.shortTitle} (${combo.price})`}
                        </option>
                      ))}
                    </optgroup>

                    <optgroup label="ZAYRO Membership Plans (4 Tiers)">
                      {membershipPlans.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {membershipOptionLabels[plan.id] || `${plan.name} (${plan.price})`}
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

                {/* Selected Service Detail Info */}
                {selectedServiceObj && selectedServiceObj.name && (
                  <div className="mt-2 p-2.5 bg-[#E8EFE8] rounded-lg border border-[#30452F]/20 flex items-start justify-between gap-2 text-xs">
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[#30452F] truncate">
                        {selectedServiceObj.name}
                      </div>
                      {matchedCombo && (
                        <p className="text-[11px] text-gray-600 mt-0.5 line-clamp-1">
                          <span className="font-medium text-[#30452F]">Includes:</span> {matchedCombo.tagline}
                        </p>
                      )}
                      {matchedMembership && (
                        <p className="text-[11px] text-gray-600 mt-0.5">
                          <span className="font-medium text-[#30452F]">Includes:</span> {matchedMembership.includes?.join(' + ')}
                        </p>
                      )}
                      {matchedService?.tagline && (
                        <p className="text-[11px] text-gray-600 mt-0.5 line-clamp-1">
                          {matchedService.tagline}
                        </p>
                      )}
                    </div>
                    {selectedServiceObj.price && (
                      <span className="font-bold text-[#30452F] bg-[#E6B25C]/40 px-2 py-0.5 rounded text-[11px] whitespace-nowrap shrink-0">
                        {selectedServiceObj.price}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F]">
                      Preferred Date *
                    </label>
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <button
                        type="button"
                        onClick={() => handleSelectDate(TODAY_DATE)}
                        className={`px-2 py-0.5 rounded-full border transition-all ${
                          formData.date === TODAY_DATE
                            ? 'bg-[#30452F] text-[#E6B25C] border-[#30452F] font-bold shadow-xs'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-[#30452F]'
                        }`}
                      >
                        Today
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectDate(TOMORROW_DATE)}
                        className={`px-2 py-0.5 rounded-full border transition-all ${
                          formData.date === TOMORROW_DATE
                            ? 'bg-[#30452F] text-[#E6B25C] border-[#30452F] font-bold shadow-xs'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-[#30452F]'
                        }`}
                      >
                        Tomorrow
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="date"
                      min={TODAY_DATE}
                      value={formData.date}
                      onChange={(e) => handleSelectDate(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C] ${
                        errors.date ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {errors.date && <p className="text-[11px] text-red-500 mt-1">{errors.date}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F]">
                      Preferred Time Slot *
                    </label>
                    {formData.date && availableSlots.length > 0 && (
                      <span className="text-[10px] font-bold text-[#476346] bg-[#476346]/10 px-2 py-0.5 rounded-full">
                        {availableSlots.length} available
                      </span>
                    )}
                    {formData.date && availableSlots.length === 0 && (
                      <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                        Completed
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Clock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <select
                      value={formData.time}
                      disabled={!formData.date || availableSlots.length === 0}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, time: e.target.value }));
                        if (errors.time) setErrors((prev) => ({ ...prev, time: undefined }));
                      }}
                      className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#E6B25C] ${
                        !formData.date || availableSlots.length === 0
                          ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed'
                          : errors.time
                          ? 'border-red-500'
                          : 'border-gray-200'
                      }`}
                    >
                      {!formData.date ? (
                        <option value="">Select a date first to view slots</option>
                      ) : availableSlots.length === 0 ? (
                        <option value="">No slots available (All completed)</option>
                      ) : (
                        availableSlots.map((slot) => (
                          <option key={slot.value} value={slot.value}>
                            {slot.label}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  {errors.time && <p className="text-[11px] text-red-500 mt-1">{errors.time}</p>}
                  {!formData.date && !errors.date && (
                    <p className="text-[11px] text-gray-500 mt-1">Select a date above to display available time slots</p>
                  )}
                  {formData.date && availableSlots.length === 0 && (
                    <p className="text-[11px] text-red-600 font-medium mt-1">
                      All time slots for this date are completed or fully booked. Please select another date.
                    </p>
                  )}
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
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-[#30452F] to-[#1A2719] hover:from-[#476346] hover:to-[#30452F] text-[#E6B25C] hover:text-white font-bold py-3 px-4 rounded-xl text-sm transition-all border border-[#E6B25C]/30 shadow-md flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#E6B25C]" />
                      <span>Recording Appointment...</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      <span>Submit Appointment Enquiry</span>
                    </>
                  )}
                </button>

                <a
                  href={buildWhatsAppMessage()}
                  target="_blank"
                  rel="noreferrer"
                  onClick={handleWhatsAppBooking}
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
