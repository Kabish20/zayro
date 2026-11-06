import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Sparkles, 
  MessageSquare, 
  ChevronRight, 
  ShieldCheck, 
  AlertCircle, 
  Info,
  RefreshCw
} from 'lucide-react';
import { rateCardServices, comboOffers } from '@/data/packagesData';
import { BRAND, CONTACT } from '@/constants/brand';

// Format time from "HH:mm:ss" or "HH:mm" to 12-hour AM/PM
function format12Hour(timeStr) {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1] || '00';
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours}:${minutes} ${ampm}`;
}

// Compute end time by adding duration minutes to startTime
function calculateEndTime(startTimeStr, durationMinutes = 30) {
  if (!startTimeStr) return '09:30:00';
  const parts = startTimeStr.split(':');
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const totalMinutes = h * 60 + m + durationMinutes;
  const endH = Math.floor(totalMinutes / 60) % 24;
  const endM = totalMinutes % 60;
  return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}:00`;
}

// Consolidated services list for booking
const BOOKING_SERVICES = [
  ...rateCardServices.map(s => ({
    id: s.id,
    name: s.name,
    price: s.price,
    numericPrice: s.numericPrice,
    durationMinutes: s.id === 'rate-hair-colour' ? 45 : s.id === 'rate-face-cleanup' ? 35 : s.id === 'rate-kids-cut' ? 25 : s.id === 'rate-de-tan' ? 25 : s.id === 'rate-oil-massage' || s.id === 'rate-head-massage' ? 15 : 30,
    category: 'Rate Card'
  })),
  ...comboOffers.map(c => ({
    id: c.id,
    name: c.shortTitle + ' - ' + c.tagline,
    price: c.price,
    numericPrice: c.numericPrice,
    durationMinutes: 45,
    category: 'Combo Offer'
  }))
];

export default function BookingView({ preselectedService, onBack }) {
  // Store Config from Salon360
  const [storeConfig, setStoreConfig] = useState({
    storeId: 868,
    orgId: 555,
    timeZoneStr: 'Asia/Kolkata',
  });

  // Services
  const [selectedService, setSelectedService] = useState(BOOKING_SERVICES[0]);

  // Live Staff from Salon360
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('ANY');
  const [loadingStaff, setLoadingStaff] = useState(true);

  // Date selection (default today)
  const [bookingDate, setBookingDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  // Availability from Salon360 POST /availability
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState(null); // 'AVAILABLE' | 'CLOSED' | 'FULLY_BOOKED'
  const [feasibleWindows, setFeasibleWindows] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('10:00:00');

  // Customer form inputs
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [appointmentNotes, setAppointmentNotes] = useState('');

  // Submit states
  const [submitting, setSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [apiError, setApiError] = useState(null);

  // 1. Fetch Store Config & Staff from Salon360 via Django proxy
  useEffect(() => {
    let isMounted = true;
    async function initSalon360() {
      try {
        setLoadingStaff(true);
        // GET /config
        fetch('/api/salon360/config')
          .then(res => res.json())
          .then(data => {
            if (isMounted && data?.response) {
              setStoreConfig(prev => ({
                ...prev,
                ...data.response
              }));
            }
          })
          .catch(() => {});

        // GET /staff
        const staffRes = await fetch('/api/salon360/staff');
        if (staffRes.ok) {
          const staffData = await staffRes.json();
          const list = staffData?.response || staffData || [];
          if (isMounted && Array.isArray(list)) {
            // Filter out admin logins e.g. "Store manager login"
            const realStylists = list.filter(stf => 
              stf.name && !stf.name.toLowerCase().includes('manager')
            );
            setStaffList(realStylists.length > 0 ? realStylists : list);
          }
        }
      } catch (err) {
        console.warn('Error loading Salon360 config/staff:', err);
      } finally {
        if (isMounted) setLoadingStaff(false);
      }
    }

    initSalon360();
    return () => { isMounted = false; };
  }, []);

  // Handle preselected service if passed via props
  useEffect(() => {
    if (preselectedService) {
      const match = BOOKING_SERVICES.find(s => 
        s.name.toLowerCase().includes(preselectedService.toLowerCase()) ||
        preselectedService.toLowerCase().includes(s.name.toLowerCase())
      );
      if (match) setSelectedService(match);
    }
  }, [preselectedService]);

  // 2. Query Salon360 POST /availability whenever Date, Staff, or Service changes
  const checkAvailability = useCallback(async () => {
    if (!bookingDate) return;
    setCheckingAvailability(true);
    setApiError(null);

    const isSingle = selectedStaff !== 'ANY';
    const payload = {
      storeId: 868,
      orgId: 555,
      startDate: bookingDate,
      endDate: bookingDate,
      slotIntervalMinutes: 30,
      staffSelectionMode: isSingle ? 'SINGLE' : 'ANY',
      services: [
        {
          serviceId: 102003,
          durationMinutes: selectedService?.durationMinutes || 30
        }
      ],
      staffId: isSingle ? Number(selectedStaff) : null,
      serviceStaffAssignments: null
    };

    try {
      const res = await fetch('/api/salon360/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      const dayData = Array.isArray(data?.response) ? data.response[0] : null;

      if (dayData) {
        setAvailabilityStatus(dayData.status);
        const windows = dayData.feasibleWindows || [];
        setFeasibleWindows(windows);
        if (windows.length > 0) {
          setSelectedSlot(windows[0].startTime);
        }
      } else {
        setAvailabilityStatus('UNKNOWN');
        setFeasibleWindows([]);
      }
    } catch (err) {
      setAvailabilityStatus('ERROR');
      setFeasibleWindows([]);
    } finally {
      setCheckingAvailability(false);
    }
  }, [bookingDate, selectedStaff, selectedService]);

  useEffect(() => {
    checkAvailability();
  }, [checkAvailability]);

  // 3. Handle Create Booking: POST /create
  const handleCreateBooking = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!customerName.trim() || !customerMobile.trim()) {
      setApiError({
        message: 'Please provide both your name and 10-digit mobile number.'
      });
      return;
    }

    if (customerMobile.replace(/\D/g, '').length < 10) {
      setApiError({
        message: 'Please enter a valid 10-digit mobile phone number.'
      });
      return;
    }

    setSubmitting(true);

    const isSingle = selectedStaff !== 'ANY';
    const startTimeFormatted = selectedSlot.length === 5 ? `${selectedSlot}:00` : selectedSlot;
    const durationMins = selectedService?.durationMinutes || 30;
    const endTimeFormatted = calculateEndTime(startTimeFormatted, durationMins);

    const createPayload = {
      storeId: 868,
      orgId: 555,
      date: bookingDate,
      startTime: startTimeFormatted,
      customer: {
        name: customerName.trim(),
        mobile: customerMobile.trim(),
        email: customerEmail.trim() || null,
      },
      staffSelectionMode: isSingle ? 'SINGLE' : 'ANY',
      lineItems: [
        {
          id: 102003,
          price: selectedService.numericPrice || 99.00,
          taxId: null,
          taxGroupId: null,
          startTime: startTimeFormatted,
          endTime: endTimeFormatted,
          artistShares: isSingle ? [{ empId: Number(selectedStaff) }] : []
        }
      ],
      appointmentNotes: appointmentNotes.trim() 
        ? `Service: ${selectedService.name} | Note: ${appointmentNotes.trim()}`
        : `Service: ${selectedService.name}`,
    };

    const idempotencyKey = crypto.randomUUID ? crypto.randomUUID() : `zayro-${Date.now()}`;

    try {
      const resp = await fetch('/api/salon360/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(createPayload),
      });

      const data = await resp.json().catch(() => ({}));

      if (resp.ok && (data.responseCode === 200 || data.success || data.response?.appointmentId)) {
        const appointmentId = data.response?.appointmentId || data.appointmentId || 4821;
        const customerId = data.response?.customerId || data.customerId || null;
        setBookingResult({
          success: true,
          appointmentId: appointmentId,
          customerId: customerId,
          serviceName: selectedService.name,
          servicePrice: selectedService.price,
          date: bookingDate,
          time: startTimeFormatted,
          endTime: endTimeFormatted,
          customerName: customerName.trim(),
          customerMobile: customerMobile.trim(),
        });
      } else {
        // Real Salon360 API Error
        const errorMsg = data.dynMsg || data.responseMsg || 'Salon360 booking could not be completed for this slot.';
        const errorCode = data.responseCode || resp.status;
        setApiError({
          code: errorCode,
          message: errorMsg,
          isSlotUnavailable: errorCode === 409,
          raw: data
        });
      }
    } catch (err) {
      setApiError({
        code: 500,
        message: 'Network connection error while contacting Salon360 booking gateway.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const whatsAppBookingText = encodeURIComponent(
    `Hello ZAYRO Salon Concierge, I would like to confirm my appointment:\n\n` +
    `• Service: ${selectedService.name} (${selectedService.price})\n` +
    `• Date: ${bookingDate}\n` +
    `• Time: ${format12Hour(selectedSlot)}\n` +
    `• Stylist: ${selectedStaff === 'ANY' ? 'Any Available Stylist' : (staffList.find(s => String(s.staffId) === String(selectedStaff))?.name || 'Stylist')}\n` +
    `• Name: ${customerName || 'Gentleman'}\n` +
    `• Mobile: ${customerMobile || ''}\n\n` +
    `Please confirm my slot!`
  );

  return (
    <div className="min-h-screen bg-[#112015] text-[#F5ECDE] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header with Salon360 Integration Status */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E6B25C]/15 border border-[#E6B25C]/40 text-[#E6B25C] text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Salon360 Live Booking Integration</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-wide">
            Book Your Appointment
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto">
            Direct server-to-server connection to Salon360 Online Booking API. Store ID 868 • Org ID 555 • Timezone {storeConfig.timeZoneStr}.
          </p>
          <div className="text-[11px] text-[#E6B25C] font-semibold flex items-center justify-center gap-2">
            <span>⏰ Salon Hours: 7:00 AM – 9:00 PM (Monday – Sunday)</span>
            <span>•</span>
            <span>📞 Concierge: +91 79042 42311</span>
          </div>
        </div>

        {/* Success View */}
        {bookingResult?.success ? (
          <div className="bg-[#1b3424] border-2 border-[#E6B25C] rounded-3xl p-6 sm:p-10 text-center space-y-6 shadow-2xl animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-[#E6B25C]/20 border-2 border-[#E6B25C] text-[#E6B25C] flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1.5">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#E6B25C]">
                Salon360 Confirmed Appointment
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Appointment ID: #{bookingResult.appointmentId}
              </h2>
              {bookingResult.customerId && (
                <p className="text-xs text-stone-300">
                  Customer Record ID: #{bookingResult.customerId}
                </p>
              )}
            </div>

            {/* Appointment Summary Box */}
            <div className="max-w-md mx-auto bg-black/40 border border-[#E6B25C]/30 rounded-2xl p-5 text-left space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-stone-400">Service</span>
                <span className="font-bold text-[#E6B25C] text-right">{bookingResult.serviceName}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-stone-400">Rate</span>
                <span className="font-bold text-white">{bookingResult.servicePrice}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-stone-400">Date & Slot</span>
                <span className="font-bold text-white">{bookingResult.date} at {format12Hour(bookingResult.time)}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-stone-400">Customer</span>
                <span className="font-bold text-white">{bookingResult.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Mobile</span>
                <span className="font-bold text-white">{bookingResult.customerMobile}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <a
                href={`https://wa.me/917904242311?text=${whatsAppBookingText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-xl bg-[#25D366] hover:bg-[#1ebd5b] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Confirm via WhatsApp</span>
              </a>
              <button
                onClick={() => {
                  setBookingResult(null);
                  checkAvailability();
                }}
                className="w-full py-3.5 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 font-bold text-xs uppercase tracking-wider transition-all"
              >
                Book Another Slot
              </button>
            </div>
          </div>
        ) : (
          /* Main Interactive Booking Form */
          <form onSubmit={handleCreateBooking} className="bg-[#182f20] border border-[#E6B25C]/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            
            {/* 1. Service Selection */}
            <div className="space-y-2">
              <label className="text-xs uppercase font-extrabold tracking-wider text-[#E6B25C] flex items-center justify-between">
                <span>1. Select Service (Official Catalog)</span>
                <span className="text-[11px] font-sans font-bold text-[#E6B25C]">
                  {selectedService.price}
                </span>
              </label>
              <select
                value={selectedService.id}
                onChange={(e) => {
                  const srv = BOOKING_SERVICES.find(s => s.id === e.target.value);
                  if (srv) setSelectedService(srv);
                }}
                className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-hidden focus:border-[#E6B25C]"
              >
                <optgroup label="Official Rate Card Services">
                  {BOOKING_SERVICES.filter(s => s.category === 'Rate Card').map(s => (
                    <option key={s.id} value={s.id} className="bg-[#112015] text-white">
                      {s.name} — {s.price} ({s.durationMinutes} mins)
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Official 10 Combo Offers">
                  {BOOKING_SERVICES.filter(s => s.category === 'Combo Offer').map(s => (
                    <option key={s.id} value={s.id} className="bg-[#112015] text-white">
                      {s.name} — {s.price}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* 2. Stylist Selection (Live from Salon360 /staff) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase font-extrabold tracking-wider text-[#E6B25C]">
                  2. Select Stylist (Live Salon360 Sync)
                </label>
                {loadingStaff && (
                  <span className="text-[10px] text-stone-400 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin text-[#E6B25C]" />
                    <span>Loading staff…</span>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedStaff('ANY')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                    selectedStaff === 'ANY'
                      ? 'bg-[#E6B25C] text-[#112015] border-[#E6B25C] shadow-sm'
                      : 'bg-black/30 text-stone-300 border-white/15 hover:bg-white/5'
                  }`}
                >
                  ⚡ Any Available Stylist
                </button>
                {staffList.map((stf) => (
                  <button
                    key={stf.staffId}
                    type="button"
                    onClick={() => setSelectedStaff(String(stf.staffId))}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                      selectedStaff === String(stf.staffId)
                        ? 'bg-[#E6B25C] text-[#112015] border-[#E6B25C] shadow-sm'
                        : 'bg-black/30 text-stone-300 border-white/15 hover:bg-white/5'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>{stf.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Date & Live Availability Check */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase font-extrabold tracking-wider text-[#E6B25C] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>3. Choose Date & Live Availability</span>
                </label>
                <button
                  type="button"
                  onClick={checkAvailability}
                  className="text-[10px] text-[#E6B25C] hover:underline flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${checkingAvailability ? 'animate-spin' : ''}`} />
                  <span>Check Availability</span>
                </button>
              </div>

              <input
                type="date"
                required
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-hidden focus:border-[#E6B25C]"
              />

              {/* Availability Results from Salon360 API */}
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-300">Salon360 Calendar Status:</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                    availabilityStatus === 'AVAILABLE' 
                      ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-900/40 text-amber-300 border border-amber-500/30'
                  }`}>
                    {checkingAvailability ? 'Querying API…' : (availabilityStatus || 'CHECKING')}
                  </span>
                </div>

                {/* If Salon360 returned feasible windows */}
                {feasibleWindows.length > 0 ? (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] text-stone-400 block">
                      Select Available Slot from Salon360:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {feasibleWindows.map((win, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedSlot(win.startTime)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            selectedSlot === win.startTime
                              ? 'bg-[#E6B25C] text-[#112015] border-[#E6B25C]'
                              : 'bg-white/5 border-white/15 text-stone-200 hover:bg-white/10'
                          }`}
                        >
                          {format12Hour(win.startTime)}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* When status is CLOSED or windows empty */
                  <div className="space-y-2 pt-1 text-xs text-stone-300">
                    <p className="text-[11px] text-amber-200/90 leading-relaxed flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>
                        Salon360 calendar indicates <strong>{availabilityStatus || 'CLOSED'}</strong> for this date. You may specify your requested time slot below (7:00 AM – 9:00 PM), or confirm instantly via WhatsApp concierge.
                      </span>
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <label className="text-[11px] text-stone-400 shrink-0">
                        Requested Time:
                      </label>
                      <select
                        value={selectedSlot}
                        onChange={(e) => setSelectedSlot(e.target.value)}
                        className="bg-black/40 border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-hidden focus:border-[#E6B25C]"
                      >
                        <option value="07:00:00">07:00 AM</option>
                        <option value="08:00:00">08:00 AM</option>
                        <option value="09:00:00">09:00 AM</option>
                        <option value="10:00:00">10:00 AM</option>
                        <option value="11:00:00">11:00 AM</option>
                        <option value="12:00:00">12:00 PM</option>
                        <option value="13:00:00">01:00 PM</option>
                        <option value="14:00:00">02:00 PM</option>
                        <option value="15:00:00">03:00 PM</option>
                        <option value="16:00:00">04:00 PM</option>
                        <option value="17:00:00">05:00 PM</option>
                        <option value="18:00:00">06:00 PM</option>
                        <option value="19:00:00">07:00 PM</option>
                        <option value="20:00:00">08:00 PM</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 4. Customer Contact Details */}
            <div className="space-y-3 pt-1">
              <label className="text-xs uppercase font-extrabold tracking-wider text-[#E6B25C] block">
                4. Your Contact Details
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] text-stone-400">Full Name *</span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arun Kumar"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-black/40 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-[#E6B25C]"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-stone-400">10-Digit Mobile Number *</span>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={customerMobile}
                    onChange={(e) => setCustomerMobile(e.target.value)}
                    className="w-full bg-black/40 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-[#E6B25C]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-stone-400">Email Address (Optional)</span>
                <input
                  type="email"
                  placeholder="e.g. arun@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-[#E6B25C]"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-stone-400">Special Notes / Style Requests (Optional)</span>
                <input
                  type="text"
                  placeholder="e.g. Low skin fade with beard taper"
                  value={appointmentNotes}
                  onChange={(e) => setAppointmentNotes(e.target.value)}
                  className="w-full bg-black/40 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-[#E6B25C]"
                />
              </div>
            </div>

            {/* Error Message Display */}
            {apiError && (
              <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-red-300">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>Salon360 API Notice {apiError.code ? `(${apiError.code})` : ''}:</span>
                </div>
                <p className="pl-6 text-stone-300 leading-relaxed">
                  {apiError.message}
                </p>
                {apiError.isSlotUnavailable && (
                  <p className="pl-6 text-amber-300 text-[11px] pt-1">
                    Tip: The slot interval was unavailable. You can click "Book on WhatsApp" below to instantly secure your slot with the salon desk.
                  </p>
                )}
              </div>
            )}

            {/* Submit Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#E6B25C] to-[#C9943B] hover:from-[#F3CF8A] hover:to-[#E6B25C] text-[#112015] font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Calling Salon360 API…</span>
                  </>
                ) : (
                  <>
                    <span>Book via Salon360 API ({selectedService.price})</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <a
                href={`https://wa.me/917904242311?text=${whatsAppBookingText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-[#25D366] hover:bg-[#1ebd5b] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Book on WhatsApp</span>
              </a>
            </div>

            <div className="pt-2 text-center border-t border-white/10">
              <p className="text-[11px] text-stone-400 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E6B25C]" />
                <span>API Endpoint: api.salon360app.com/api/online-booking/v1/external/booking • Store ID 868</span>
              </p>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
