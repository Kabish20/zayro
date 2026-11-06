import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, User, Phone, Scissors, CheckCircle2,
  ArrowRight, ShieldCheck, Sparkles, MessageCircle, AlertCircle, Loader2
} from 'lucide-react';
import { fetchStaff } from '@/services/salon360Api';

const ZAYRO_SERVICES = [
  { id: 102001, name: 'Royal Haircut & Styling', duration: 30, price: 299 },
  { id: 102002, name: 'Signature Beard Sculpt & Hot Towel', duration: 20, price: 199 },
  { id: 102003, name: 'Zayro Classic Combo (Haircut + Beard)', duration: 45, price: 449 },
  { id: 102004, name: 'De-Tan Facial Therapy & Clean Up', duration: 40, price: 499 },
  { id: 102005, name: 'Luxury Head Massage & Hair Spa', duration: 45, price: 599 },
  { id: 102006, name: 'Groom & Glow Complete Makeover', duration: 75, price: 999 },
];

export default function BookingView({ onBack }) {
  const [staffList, setStaffList] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [selectedService, setSelectedService] = useState(ZAYRO_SERVICES[2]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState('11:00');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Load live staff from Salon360 API via Django backend
  useEffect(() => {
    async function loadStaff() {
      try {
        setLoadingStaff(true);
        const data = await fetchStaff();
        if (Array.isArray(data) && data.length > 0) {
          // Filter out generic admin accounts
          const eligible = data.filter((s) => !s.name?.toLowerCase().includes('manager login'));
          setStaffList(eligible.length > 0 ? eligible : data);
        }
      } catch (err) {
        console.warn('Could not load staff from Salon360:', err);
      } finally {
        setLoadingStaff(false);
      }
    }
    loadStaff();
  }, []);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (!customerName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

    setSubmitting(true);

    try {
      // Time calculations
      const startTimeFormatted = `${selectedTime}:00`;
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const endTotalMinutes = hours * 60 + minutes + selectedService.duration;
      const endHour = String(Math.floor(endTotalMinutes / 60)).padStart(2, '0');
      const endMin = String(endTotalMinutes % 60).padStart(2, '0');
      const endTimeFormatted = `${endHour}:${endMin}:00`;

      const payload = {
        storeId: 868,
        orgId: 555,
        date: selectedDate,
        startTime: startTimeFormatted,
        customer: {
          name: customerName.trim(),
          mobile: cleanPhone.slice(-10),
          email: null,
        },
        staffSelectionMode: selectedStaff ? 'SINGLE' : 'ANY',
        lineItems: [
          {
            id: selectedService.id,
            price: selectedService.price,
            taxId: null,
            taxGroupId: null,
            startTime: startTimeFormatted,
            endTime: endTimeFormatted,
            artistShares: selectedStaff ? [{ empId: selectedStaff.staffId }] : [],
          },
        ],
        appointmentNotes: 'Booked via Zayro Online Portal',
      };

      const res = await fetch('/api/salon360/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': crypto.randomUUID(),
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok && result.responseCode === 200) {
        const apptId = result?.response?.appointmentId || result?.appointmentId || Math.floor(1000 + Math.random() * 9000);
        setConfirmedBooking({
          appointmentId: apptId,
          name: customerName,
          phone: cleanPhone,
          service: selectedService.name,
          staff: selectedStaff ? selectedStaff.name : 'Any Available Stylist',
          date: selectedDate,
          time: selectedTime,
          price: selectedService.price,
        });
      } else {
        const dyn = result?.dynMsg || (result?.responseMsg ? result.responseMsg.replace(/_/g, ' ') : 'The selected slot is currently not available');
        setErrorMsg(`Salon360: ${dyn}. Please select another time or tap "Book directly on WhatsApp" below.`);
      }
    } catch (err) {
      setErrorMsg('Booking request could not be processed. Please try again or book via WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello ZAYRO Salon! I would like to book an appointment for ${selectedService.name} on ${selectedDate} at ${selectedTime}.`
  );
  const whatsappUrl = `https://wa.me/919944477888?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-[#1F2E1E] text-white pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header Badge */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#E6B25C]/15 text-[#E6B25C] border border-[#E6B25C]/30 mb-3">
            <ShieldCheck className="w-4 h-4" /> Official Salon360 Online Booking
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#E6B25C] mb-2">
            Reserve Your Grooming Experience
          </h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-lg mx-auto">
            KK Nagar Flagship • Real-time live synchronization with our salon management system.
          </p>
        </div>

        {/* Confirmation Screen */}
        {confirmedBooking ? (
          <div className="bg-[#273826] border border-[#E6B25C]/40 rounded-3xl p-8 sm:p-10 shadow-2xl text-center">
            <div className="w-16 h-16 bg-[#E6B25C]/20 border border-[#E6B25C] rounded-full flex items-center justify-center mx-auto mb-5 text-[#E6B25C]">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#E6B25C] mb-2">
              Appointment Confirmed!
            </h2>
            <p className="text-gray-300 text-sm mb-6">
              Your appointment has been registered with Salon360.
            </p>

            {/* Pass details */}
            <div className="bg-[#1F2E1E] border border-white/10 rounded-2xl p-6 text-left space-y-3 mb-6">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="text-xs uppercase text-gray-400">Appointment Ref</span>
                <span className="text-sm font-bold text-[#E6B25C]">#{confirmedBooking.appointmentId}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="text-xs uppercase text-gray-400">Customer</span>
                <span className="text-sm font-semibold">{confirmedBooking.name}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="text-xs uppercase text-gray-400">Service</span>
                <span className="text-sm font-semibold">{confirmedBooking.service}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="text-xs uppercase text-gray-400">Stylist</span>
                <span className="text-sm font-semibold">{confirmedBooking.staff}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="text-xs uppercase text-gray-400">Date & Time</span>
                <span className="text-sm font-semibold">
                  {confirmedBooking.date} at {confirmedBooking.time}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-xs uppercase text-gray-400">Estimated Price</span>
                <span className="text-base font-bold text-[#E6B25C]">₹{confirmedBooking.price}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-5 bg-[#25D366] text-white font-bold text-sm rounded-xl hover:brightness-105 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" /> Save on WhatsApp
              </a>
              <button
                onClick={() => setConfirmedBooking(null)}
                className="py-3 px-5 bg-white/10 text-white font-semibold text-sm rounded-xl hover:bg-white/15 transition-all"
              >
                Book Another
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleBookingSubmit}
            className="bg-[#273826] border border-[#E6B25C]/25 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
          >
            {/* Step 1: Select Service */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#E6B25C] mb-3">
                1. Select Signature Service
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ZAYRO_SERVICES.map((srv) => {
                  const isSelected = selectedService.id === srv.id;
                  return (
                    <button
                      type="button"
                      key={srv.id}
                      onClick={() => setSelectedService(srv)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-[#E6B25C]/20 border-[#E6B25C] text-white shadow-md'
                          : 'bg-[#1F2E1E]/60 border-white/10 text-gray-300 hover:border-white/25'
                      }`}
                    >
                      <div className="font-semibold text-sm text-white">{srv.name}</div>
                      <div className="flex justify-between text-xs mt-1 text-[#E6B25C]">
                        <span>{srv.duration} mins</span>
                        <span className="font-bold">₹{srv.price}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Stylist (Live from Salon360) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#E6B25C] mb-3">
                2. Select Stylist (Live from Salon360)
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedStaff(null)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    selectedStaff === null
                      ? 'bg-[#E6B25C] text-[#1F2E1E] border-[#E6B25C]'
                      : 'bg-[#1F2E1E]/60 text-gray-300 border-white/10 hover:border-white/20'
                  }`}
                >
                  ✨ Any Available Stylist
                </button>
                {staffList.map((st) => (
                  <button
                    type="button"
                    key={st.staffId}
                    onClick={() => setSelectedStaff(st)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedStaff?.staffId === st.staffId
                        ? 'bg-[#E6B25C] text-[#1F2E1E] border-[#E6B25C]'
                        : 'bg-[#1F2E1E]/60 text-gray-300 border-white/10 hover:border-white/20'
                    }`}
                  >
                    ✂️ {st.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#E6B25C] mb-2">
                  3. Preferred Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                    className="w-full bg-[#1F2E1E] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#E6B25C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#E6B25C] mb-2">
                  4. Preferred Time Slot
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full bg-[#1F2E1E] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#E6B25C]"
                >
                  <option value="10:00">10:00 AM — Morning Fresh</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:30">01:30 PM — Afternoon</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="16:30">04:30 PM — Tea Slot</option>
                  <option value="18:00">06:00 PM — Evening</option>
                  <option value="19:30">07:30 PM</option>
                  <option value="20:30">08:30 PM — Late Night</option>
                </select>
              </div>
            </div>

            {/* Step 4: Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#E6B25C] mb-2">
                  5. Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="w-full bg-[#1F2E1E] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#E6B25C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#E6B25C] mb-2">
                  6. Mobile Number
                </label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                  required
                  className="w-full bg-[#1F2E1E] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#E6B25C]"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-6 bg-gradient-to-r from-[#E6B25C] to-[#d49e47] text-[#1F2E1E] font-bold text-base rounded-2xl shadow-xl hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Connecting to Salon360 Engine…</span>
                </>
              ) : (
                <>
                  <span>Confirm Online Booking (Store #868)</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Or Instant WhatsApp Booking */}
            <div className="text-center pt-2">
              <p className="text-xs text-gray-400 mb-2">Prefer instant 1-tap booking without filling details?</p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#25D366] hover:underline"
              >
                <MessageCircle className="w-4 h-4" /> Book directly on WhatsApp (+91 99444 77888)
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
