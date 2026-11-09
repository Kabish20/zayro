import React, { useEffect, useState } from "react";
import { salon360Api, generateUUID } from "@/services/salon360Api";
import { Calendar, Clock, User, Phone, Mail, Sparkles, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export const DEFAULT_SERVICES = [
  // ─── Combo Offers (10 Value Packages) ───────────────────────────
  { website_service_id: "combo-1", name: "Combo 1: Haircut + Beard Trim + Oil Massage", duration_minutes: 45, price: 299.0 },
  { website_service_id: "combo-2", name: "Combo 2: Haircut + Beard Trim + De-Tan + Oil Massage", duration_minutes: 60, price: 399.0 },
  { website_service_id: "combo-3", name: "Combo 3: Haircut + Beard Trim + Any Cleanup", duration_minutes: 60, price: 499.0 },
  { website_service_id: "combo-4", name: "Combo 4: Haircut + Beard + Global Color + Face-Neck De-Tan", duration_minutes: 75, price: 599.0 },
  { website_service_id: "combo-5", name: "Combo 5: Haircut + Beard Trim + Gold/Diamond Facial", duration_minutes: 75, price: 699.0 },
  { website_service_id: "combo-6", name: "Combo 6: Haircut + Beard + Dandruff/Hairfall Therapy + Full Arms De-Tan", duration_minutes: 90, price: 799.0 },
  { website_service_id: "combo-7", name: "Combo 7: Haircut + Beard + Nourishing Protein Treatment + Face-Neck De-Tan", duration_minutes: 90, price: 899.0 },
  { website_service_id: "combo-8", name: "Combo 8: Haircut + Beard + Glo Vite Facial + 15-Min Oil Massage", duration_minutes: 100, price: 999.0 },
  { website_service_id: "combo-9", name: "Combo 9: Haircut + Beard + Face-Neck De-Tan + Detox Hair Spa", duration_minutes: 110, price: 1199.0 },
  { website_service_id: "combo-10", name: "Combo 10: Haircut + Beard + Hair Spa (Dry/Repair) + Oxy Radiance Facial", duration_minutes: 120, price: 1499.0 },

  // ─── Massages & Scalp Therapies ────────────────────────────────
  { website_service_id: "rate-head-massage", name: "Relaxing Head Massage & Hair Wash (15 mins)", duration_minutes: 20, price: 199.0 },
  { website_service_id: "botanical-scalp-spa", name: "Ayurvedic Botanical Scalp Spa & Head Massage", duration_minutes: 60, price: 500.0 },
  { website_service_id: "intensive-anti-hairfall", name: "Intensive Follicular Anti-Hairfall Therapy", duration_minutes: 50, price: 600.0 },

  // ─── Haircuts & Beard Grooming ─────────────────────────────────
  { website_service_id: "rate-haircut", name: "Precision Haircut", duration_minutes: 30, price: 99.0 },
  { website_service_id: "rate-beard-trim", name: "Beard Trim (Zero)", duration_minutes: 20, price: 69.0 },
  { website_service_id: "rate-shave", name: "Traditional Barber Shave", duration_minutes: 20, price: 49.0 },
  { website_service_id: "rate-kids-cut", name: "Kids Haircut", duration_minutes: 25, price: 69.0 },
  { website_service_id: "asian-couture-cut", name: "ZAYRO Signature Couture Cut", duration_minutes: 45, price: 400.0 },
  { website_service_id: "master-skin-fade", name: "Master Low/Mid Skin Fade & Crop", duration_minutes: 50, price: 500.0 },
  { website_service_id: "royal-beard-sculpt", name: "Royal Hot Towel Beard Sculpt & Shave", duration_minutes: 40, price: 300.0 },
  { website_service_id: "rate-hair-colour", name: "Global Hair Colour", duration_minutes: 45, price: 349.0 },

  // ─── Facials, Cleanup & De-Tan ─────────────────────────────────
  { website_service_id: "rate-face-cleanup", name: "Deep Pore Face Cleanup", duration_minutes: 35, price: 299.0 },
  { website_service_id: "rate-de-tan", name: "Face & Neck De-Tan", duration_minutes: 25, price: 199.0 },
  { website_service_id: "luxury-hydra-facial", name: "Gentleman's Charcoal Detox & Hydra-Facial", duration_minutes: 60, price: 700.0 },

  // ─── Royal Groom Lounge ────────────────────────────────────────
  { website_service_id: "royal-groom-experience", name: "The Royal Indian Groom's Wedding Lounge Ritual", duration_minutes: 180, price: 1200.0 },
];

export const DEFAULT_STAFF = [
  { staffId: 11881, name: "Asif" },
  { staffId: 11877, name: "Rashid Ali" },
  { staffId: 11878, name: "Sahid" },
  { staffId: 11880, name: "Sharuk" },
  { staffId: 11879, name: "Suhail" },
];

export default function Salon360Booking({ preselectedService }) {
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [staff, setStaff] = useState(DEFAULT_STAFF);
  const [windows, setWindows] = useState([]);

  // Today in YYYY-MM-DD
  const todayStr = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 365);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  const [form, setForm] = useState({
    service_id: "",
    staff_id: "",
    date: todayStr,
    start_time: "10:00:00",
    name: "",
    mobile: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [checkingSlots, setCheckingSlots] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [appointmentId, setAppointmentId] = useState(null);
  const [attemptId, setAttemptId] = useState(null);

  const update = (field, value) => {
    setForm((old) => ({ ...old, [field]: value }));
    setAttemptId(null);
    setAppointmentId(null);
    setMessage("");
    setIsError(false);
  };

  // Load active services and staff on mount
  useEffect(() => {
    let mounted = true;

    salon360Api.getServices()
      .then((data) => {
        if (!mounted) return;
        const list = Array.isArray(data) ? data : (data?.response || []);
        if (list.length > 0) {
          setServices(list);
        }
      })
      .catch((err) => {
        console.warn("Using offline services catalog:", err);
      });

    salon360Api.getStaff()
      .then((data) => {
        if (!mounted) return;
        const rawList = Array.isArray(data?.response) ? data.response : [];
        const staffList = rawList
          .filter((p) => p && p.name && !p.name.toLowerCase().includes("manager"))
          .map((p) => ({ staffId: p.staffId, name: p.name }));
        if (staffList.length > 0) {
          setStaff(staffList);
        }
      })
      .catch((err) => {
        console.warn("Using offline staff catalog:", err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Preselect service if passed from parent (Supports combo offers, massages, and standard services)
  useEffect(() => {
    if (preselectedService && services.length > 0) {
      const raw = typeof preselectedService === 'string' ? preselectedService : (preselectedService.id || preselectedService.name || '');
      const rawLower = raw.toLowerCase();

      // 1. Check combo pattern (e.g. "Combo 1", "combo-1", "Combo 2")
      const comboMatch = rawLower.match(/combo\s*[-_:]?\s*(\d+)/i);
      if (comboMatch) {
        const comboNum = comboMatch[1];
        const found = services.find((s) => s.website_service_id === `combo-${comboNum}`);
        if (found) {
          setForm((old) => ({ ...old, service_id: found.website_service_id }));
          return;
        }
      }

      // 2. Exact website_service_id match
      let matched = services.find((s) => s.website_service_id === raw || s.website_service_id === preselectedService?.id);

      // 3. Name or substring match
      if (!matched) {
        matched = services.find((s) =>
          rawLower.includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(rawLower)
        );
      }

      // 4. Massage / Scalp keyword matching
      if (!matched) {
        if (rawLower.includes("ayurvedic") || rawLower.includes("scalp spa")) {
          matched = services.find((s) => s.website_service_id === "botanical-scalp-spa");
        } else if (rawLower.includes("head massage") || rawLower.includes("oil massage")) {
          matched = services.find((s) => s.website_service_id === "rate-head-massage");
        } else if (rawLower.includes("hairfall")) {
          matched = services.find((s) => s.website_service_id === "intensive-anti-hairfall");
        }
      }

      if (matched) {
        setForm((old) => ({ ...old, service_id: matched.website_service_id }));
      }
    }
  }, [preselectedService, services]);

  async function checkSlots() {
    setCheckingSlots(true);
    setMessage("");
    setIsError(false);
    setWindows([]);
    update("start_time", "");

    try {
      const data = await salon360Api.availability({
        service_id: form.service_id,
        date: form.date,
        staff_id: form.staff_id ? Number(form.staff_id) : null,
      });

      const days = data?.response || [];
      const firstDay = days[0];

      if (firstDay?.status === "AVAILABLE") {
        const foundWindows = firstDay.feasibleWindows || [];
        setWindows(foundWindows);
        setMessage("Available windows found. Select or specify your preferred time below.");
        setIsError(false);
      } else {
        setMessage(data?.dynMsg || "No availability returned for this date. You may specify a desired time or select another date.");
        setIsError(false);
      }
    } catch (error) {
      setMessage(error.message || "Unable to check live availability. You can still submit your preferred appointment slot.");
      setIsError(false);
    } finally {
      setCheckingSlots(false);
    }
  }

  async function confirmBooking(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    // Format start time as HH:MM:SS
    let formattedTime = form.start_time.trim();
    if (/^\d{1,2}:\d{2}$/.test(formattedTime)) {
      formattedTime = `${formattedTime}:00`;
    }
    if (formattedTime.length === 7) {
      formattedTime = `0${formattedTime}`;
    }

    const key = attemptId || generateUUID();
    setAttemptId(key);

    try {
      const payload = {
        service_id: form.service_id,
        date: form.date,
        start_time: formattedTime,
        name: form.name.trim(),
        mobile: form.mobile.trim(),
        email: form.email.trim() || undefined,
        staff_id: form.staff_id ? Number(form.staff_id) : null,
      };

      const data = await salon360Api.createBooking(payload, key);

      if (data.confirmed) {
        setAppointmentId(data.appointmentId);
        setMessage("Appointment confirmed with Salon360!");
        setIsError(false);
      } else {
        setMessage(data.message || "Booking is pending confirmation. Your booking reference was preserved.");
        setIsError(data.status === "FAILED");
      }
    } catch (error) {
      setIsError(true);
      setMessage(
        `${error.message}. If this was submitted already, do not submit a duplicate request with a new attempt ID.`
      );
    } finally {
      setLoading(false);
    }
  }

  // Categorize services into structured groups for clean dropdown navigation
  const comboServices = services.filter((s) => s.website_service_id.startsWith("combo-"));
  const massageServices = services.filter((s) =>
    s.website_service_id.includes("massage") ||
    s.website_service_id.includes("spa") ||
    s.website_service_id.includes("hairfall")
  );
  const groomingServices = services.filter((s) =>
    (s.website_service_id.includes("haircut") ||
     s.website_service_id.includes("beard") ||
     s.website_service_id.includes("shave") ||
     s.website_service_id.includes("fade") ||
     s.website_service_id.includes("couture") ||
     s.website_service_id.includes("colour")) &&
    !s.website_service_id.startsWith("combo-")
  );
  const skinServices = services.filter((s) =>
    (s.website_service_id.includes("cleanup") ||
     s.website_service_id.includes("facial") ||
     s.website_service_id.includes("tan")) &&
    !s.website_service_id.startsWith("combo-") &&
    !s.website_service_id.includes("groom")
  );
  const royalGroomServices = services.filter((s) =>
    s.website_service_id.includes("groom-experience") ||
    s.website_service_id.includes("royal-groom")
  );
  const otherServices = services.filter((s) =>
    !comboServices.includes(s) &&
    !massageServices.includes(s) &&
    !groomingServices.includes(s) &&
    !skinServices.includes(s) &&
    !royalGroomServices.includes(s)
  );

  return (
    <div className="w-full rounded-3xl bg-[#182f20] border-2 border-[#E6B25C]/40 p-6 sm:p-8 text-white shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#E6B25C]/15 border border-[#E6B25C]/40 text-[#E6B25C] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Salon360 Online Booking</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Reserve Confirmed Appointment
          </h2>
        </div>
      </div>

      {appointmentId ? (
        <div className="rounded-2xl bg-gradient-to-br from-[#1b432a] to-[#0f2818] border-2 border-emerald-400/50 p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-2xl font-serif font-bold text-white">
              Appointment Confirmed!
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200">
              Your appointment is recorded directly in the Salon360 calendar.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-emerald-500/30 inline-block text-left space-y-1 min-w-[240px]">
            <p className="text-xs text-stone-400">Salon360 Appointment ID</p>
            <p className="text-2xl font-mono font-black text-[#E6B25C]">#{appointmentId}</p>
            <p className="text-xs text-stone-300 pt-1">
              Date: <span className="text-white font-semibold">{form.date}</span> at <span className="text-white font-semibold">{form.start_time}</span>
            </p>
            <p className="text-xs text-stone-300">
              Customer: <span className="text-white font-semibold">{form.name}</span> ({form.mobile})
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setAppointmentId(null);
                setForm({
                  service_id: "",
                  staff_id: "",
                  date: "",
                  start_time: "",
                  name: "",
                  mobile: "",
                  email: "",
                });
                setMessage("");
              }}
              className="text-xs text-[#E6B25C] hover:underline uppercase font-bold tracking-wider"
            >
              Book Another Appointment
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={confirmBooking} className="space-y-4">
          {/* Step 1: Service Selection */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
              1. Select Service *
            </label>
            <select
              required
              className="w-full rounded-xl bg-black/40 border border-white/20 p-3.5 text-sm text-white focus:outline-none focus:border-[#E6B25C]"
              value={form.service_id}
              onChange={(e) => update("service_id", e.target.value)}
            >
              <option value="" className="bg-[#182f20] text-stone-300">Choose a Salon Service</option>

              {comboServices.length > 0 && (
                <optgroup label="✨ Special Combo Offers (Combos 1 - 10)" className="bg-[#0f2416] text-[#E6B25C] font-semibold">
                  {comboServices.map((service) => (
                    <option key={service.website_service_id} value={service.website_service_id} className="bg-[#182f20] text-white">
                      {service.name} • {service.duration_minutes} mins (₹{service.price})
                    </option>
                  ))}
                </optgroup>
              )}

              {massageServices.length > 0 && (
                <optgroup label="💆 Therapeutic Massages & Scalp Therapy" className="bg-[#0f2416] text-[#E6B25C] font-semibold">
                  {massageServices.map((service) => (
                    <option key={service.website_service_id} value={service.website_service_id} className="bg-[#182f20] text-white">
                      {service.name} • {service.duration_minutes} mins (₹{service.price})
                    </option>
                  ))}
                </optgroup>
              )}

              {groomingServices.length > 0 && (
                <optgroup label="✂️ Haircuts & Beard Grooming" className="bg-[#0f2416] text-[#E6B25C] font-semibold">
                  {groomingServices.map((service) => (
                    <option key={service.website_service_id} value={service.website_service_id} className="bg-[#182f20] text-white">
                      {service.name} • {service.duration_minutes} mins (₹{service.price})
                    </option>
                  ))}
                </optgroup>
              )}

              {skinServices.length > 0 && (
                <optgroup label="🧖 Facials, Cleanup & De-Tan" className="bg-[#0f2416] text-[#E6B25C] font-semibold">
                  {skinServices.map((service) => (
                    <option key={service.website_service_id} value={service.website_service_id} className="bg-[#182f20] text-white">
                      {service.name} • {service.duration_minutes} mins (₹{service.price})
                    </option>
                  ))}
                </optgroup>
              )}

              {royalGroomServices.length > 0 && (
                <optgroup label="👑 Royal Groom Experience" className="bg-[#0f2416] text-[#E6B25C] font-semibold">
                  {royalGroomServices.map((service) => (
                    <option key={service.website_service_id} value={service.website_service_id} className="bg-[#182f20] text-white">
                      {service.name} • {service.duration_minutes} mins (₹{service.price})
                    </option>
                  ))}
                </optgroup>
              )}

              {otherServices.length > 0 && (
                <optgroup label="All Other Salon Services" className="bg-[#0f2416] text-[#E6B25C] font-semibold">
                  {otherServices.map((service) => (
                    <option key={service.website_service_id} value={service.website_service_id} className="bg-[#182f20] text-white">
                      {service.name} • {service.duration_minutes} mins (₹{service.price})
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>

          {/* Step 2: Staff Selection */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
              2. Staff Preference (Optional)
            </label>
            <select
              className="w-full rounded-xl bg-black/40 border border-white/20 p-3.5 text-sm text-white focus:outline-none focus:border-[#E6B25C]"
              value={form.staff_id}
              onChange={(e) => update("staff_id", e.target.value)}
            >
              <option value="" className="bg-[#182f20] text-stone-300">Any Available Specialist</option>
              {staff.map((person) => (
                <option
                  key={person.staffId}
                  value={person.staffId}
                  className="bg-[#182f20] text-white"
                >
                  {person.name}
                </option>
              ))}
            </select>
          </div>

          {/* Step 3: Date & Availability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                3. Date *
              </label>
              <div className="relative">
                <input
                  required
                  type="date"
                  min={todayStr}
                  max={maxDateStr}
                  className="w-full rounded-xl bg-black/40 border border-white/20 p-3.5 text-sm text-white focus:outline-none focus:border-[#E6B25C]"
                  value={form.date}
                  onChange={(e) => update("date", e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                disabled={checkingSlots || !form.service_id || !form.date}
                onClick={checkSlots}
                className="w-full h-[46px] rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed border border-[#E6B25C]/40 text-[#E6B25C] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                {checkingSlots ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>Check Availability</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Feasible Windows Notification */}
          {windows.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-1.5">
              <p className="font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Available time windows for this date:</span>
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {windows.map((w, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => update("start_time", w.startTime || w)}
                    className="px-2.5 py-1 rounded bg-[#E6B25C]/20 border border-[#E6B25C]/40 text-[#E6B25C] hover:bg-[#E6B25C] hover:text-black transition-colors text-xs font-mono font-bold"
                  >
                    {w.startTime || w}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Time Slot */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
              4. Appointment Time (HH:MM:SS) *
            </label>
            <input
              required
              placeholder="e.g. 10:30:00 or 15:00:00"
              pattern="^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$"
              title="Time in HH:MM or HH:MM:SS 24-hour format (e.g. 10:30:00)"
              className="w-full rounded-xl bg-black/40 border border-white/20 p-3.5 text-sm text-white font-mono placeholder:text-stone-500 focus:outline-none focus:border-[#E6B25C]"
              value={form.start_time}
              onChange={(e) => update("start_time", e.target.value)}
            />
            {/* Quick time chip suggestions */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {['10:00:00', '11:30:00', '14:00:00', '16:00:00', '18:00:00', '19:30:00'].map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => update("start_time", slot)}
                  className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/5 hover:bg-[#E6B25C]/20 text-stone-300 hover:text-[#E6B25C] border border-white/10"
                >
                  {slot.slice(0, 5)}
                </button>
              ))}
            </div>
          </div>

          {/* Step 5: Customer Details */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <h4 className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
              5. Customer Information
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input
                  required
                  placeholder="Full Name *"
                  className="w-full rounded-xl bg-black/40 border border-white/20 p-3.5 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-[#E6B25C]"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                />
              </div>

              <div>
                <input
                  required
                  type="tel"
                  placeholder="10-digit Mobile (6-9) *"
                  pattern="^[6-9]\d{9}$"
                  title="10-digit Indian mobile number starting with 6, 7, 8, or 9"
                  maxLength={10}
                  className="w-full rounded-xl bg-black/40 border border-white/20 p-3.5 text-sm text-white font-mono placeholder:text-stone-500 focus:outline-none focus:border-[#E6B25C]"
                  value={form.mobile}
                  onChange={(e) => update("mobile", e.target.value.replace(/\D/g, '').slice(0, 10))}
                />
                {form.mobile && form.mobile.length < 10 && (
                  <p className="text-[11px] text-amber-300 mt-1">Please enter 10 digits ({form.mobile.length}/10)</p>
                )}
              </div>
            </div>

            <div>
              <input
                type="email"
                placeholder="Email Address (Optional)"
                className="w-full rounded-xl bg-black/40 border border-white/20 p-3.5 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-[#E6B25C]"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading || !form.service_id || !form.date || !form.start_time || !form.name || !form.mobile}
            className="w-full py-4 px-6 rounded-2xl bg-[#E6B25C] hover:bg-[#d49f47] disabled:opacity-40 disabled:cursor-not-allowed font-bold text-sm text-black uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Confirming Appointment with Salon360...</span>
              </>
            ) : (
              <span>Confirm Salon360 Appointment</span>
            )}
          </button>
        </form>
      )}

      {/* Status / Message Display */}
      {message && (
        <div
          role="status"
          className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
            isError
              ? "bg-red-950/60 border border-red-500/40 text-red-200"
              : "bg-white/5 border border-white/10 text-stone-300"
          }`}
        >
          {isError ? (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          ) : (
            <Sparkles className="w-4 h-4 text-[#E6B25C] shrink-0 mt-0.5" />
          )}
          <span className="leading-relaxed">{message}</span>
        </div>
      )}
    </div>
  );
}

