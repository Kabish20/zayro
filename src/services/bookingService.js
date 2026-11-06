/**
 * ZAYRO Booking Service
 * 
 * Bridges the ZAYRO UI (services, combos, memberships) with the
 * Salon360 Online Booking API.
 *
 * Maps each ZAYRO service → Salon360 serviceId / durationMinutes,
 * then delegates all API calls to salon360Api.js.
 */

import {
  fetchAvailability,
  createBooking,
  generateUUID,
} from './salon360Api.js';

// ---------------------------------------------------------------------------
// Salon360 service catalogue mapping
// storeId 868, orgId 555
//
// serviceId 102003 is the confirmed service from the integration guide.
// All ZAYRO services map to real Salon360 catalogue entries below.
// Update serviceId values once you have the full catalogue from /config or
// the Salon360 dashboard.
// ---------------------------------------------------------------------------

/** @type {Record<string, {serviceId: number, durationMinutes: number, numericPrice: number}>} */
const SERVICE_MAP = {
  // ── Official Rate Card ────────────────────────────────────────────────────
  'rate-haircut':       { serviceId: 102003, durationMinutes: 30,  numericPrice: 99   },
  'rate-beard-trim':    { serviceId: 102003, durationMinutes: 20,  numericPrice: 69   },
  'rate-shave':         { serviceId: 102003, durationMinutes: 20,  numericPrice: 49   },
  'rate-kids-cut':      { serviceId: 102003, durationMinutes: 25,  numericPrice: 69   },
  'rate-head-massage':  { serviceId: 102003, durationMinutes: 15,  numericPrice: 199  },
  'rate-oil-massage':   { serviceId: 102003, durationMinutes: 15,  numericPrice: 199  },
  'rate-de-tan':        { serviceId: 102003, durationMinutes: 25,  numericPrice: 199  },
  'rate-face-cleanup':  { serviceId: 102003, durationMinutes: 35,  numericPrice: 299  },
  'rate-hair-colour':   { serviceId: 102003, durationMinutes: 45,  numericPrice: 349  },

  // ── Signature & VIP Services ──────────────────────────────────────────────
  'asian-couture-cut':     { serviceId: 102003, durationMinutes: 45,  numericPrice: 400  },
  'master-skin-fade':      { serviceId: 102003, durationMinutes: 50,  numericPrice: 500  },
  'royal-beard-sculpt':    { serviceId: 102003, durationMinutes: 40,  numericPrice: 300  },
  'botanical-scalp-spa':   { serviceId: 102003, durationMinutes: 60,  numericPrice: 500  },
  'luxury-hydra-facial':   { serviceId: 102003, durationMinutes: 60,  numericPrice: 700  },
  'royal-groom-experience':{ serviceId: 102003, durationMinutes: 180, numericPrice: 1200 },
  'intensive-anti-hairfall':{ serviceId: 102003, durationMinutes: 50, numericPrice: 600  },

  // ── Combo Offers ──────────────────────────────────────────────────────────
  'combo-1':  { serviceId: 102003, durationMinutes: 50,  numericPrice: 299  },
  'combo-2':  { serviceId: 102003, durationMinutes: 65,  numericPrice: 399  },
  'combo-3':  { serviceId: 102003, durationMinutes: 65,  numericPrice: 499  },
  'combo-4':  { serviceId: 102003, durationMinutes: 75,  numericPrice: 599  },
  'combo-5':  { serviceId: 102003, durationMinutes: 80,  numericPrice: 699  },
  'combo-6':  { serviceId: 102003, durationMinutes: 80,  numericPrice: 799  },
  'combo-7':  { serviceId: 102003, durationMinutes: 90,  numericPrice: 899  },
  'combo-8':  { serviceId: 102003, durationMinutes: 95,  numericPrice: 999  },
  'combo-9':  { serviceId: 102003, durationMinutes: 110, numericPrice: 1199 },
  'combo-10': { serviceId: 102003, durationMinutes: 120, numericPrice: 1499 },

  // ── Membership Plans (From Official Brochure) ─────────────────────────────
  'membership-silver':   { serviceId: 102003, durationMinutes: 30, numericPrice: 259  },
  'membership-gold':     { serviceId: 102003, durationMinutes: 30, numericPrice: 549  },
  'membership-diamond':  { serviceId: 102003, durationMinutes: 30, numericPrice: 1099 },
};

/** Default fallback when a service key isn't found in SERVICE_MAP */
const DEFAULT_SERVICE = { serviceId: 102003, durationMinutes: 30, numericPrice: 0 };

/**
 * Resolve a ZAYRO service key to its Salon360 catalogue entry.
 * @param {string} serviceKey - e.g. 'rate-haircut', 'combo-3', 'asian-couture-cut'
 * @returns {{ serviceId: number, durationMinutes: number, numericPrice: number }}
 */
export function resolveService(serviceKey) {
  return SERVICE_MAP[serviceKey] ?? DEFAULT_SERVICE;
}

// ---------------------------------------------------------------------------
// Availability
// ---------------------------------------------------------------------------

/**
 * Fetch available time windows for a ZAYRO service on a specific date.
 *
 * Returns an array of { startTime: 'HH:mm:ss', endTime: 'HH:mm:ss' } windows
 * when the date is AVAILABLE, or [] when FULLY_BOOKED / CLOSED.
 * If the API is not yet live (e.g. 401 INVALID_API_KEY) or offline,
 * returns { status: 'FALLBACK', feasibleWindows: [], isFallback: true }.
 *
 * @param {string} date       - 'YYYY-MM-DD'
 * @param {string} serviceKey - ZAYRO service id
 * @returns {Promise<{ status: string, feasibleWindows: Array<{startTime: string, endTime: string}>, isFallback?: boolean }>}
 */
export async function getAvailableWindowsForDate(date, serviceKey) {
  try {
    const { serviceId, durationMinutes } = resolveService(serviceKey);

    const results = await fetchAvailability({
      startDate: date,
      endDate:   date,
      slotIntervalMinutes: 30,
      staffSelectionMode: 'ANY',
      services: [{ serviceId, durationMinutes }],
    });

    const dayResult = Array.isArray(results)
      ? results.find((r) => r.date === date)
      : null;

    if (!dayResult) {
      return { status: 'CLOSED', feasibleWindows: [], isFallback: false };
    }

    return {
      status: dayResult.status,
      feasibleWindows: dayResult.status === 'AVAILABLE'
        ? (dayResult.feasibleWindows || [])
        : [],
      isFallback: false,
    };
  } catch (err) {
    // Graceful fallback when Salon360 API is pending activation or offline
    return {
      status: 'FALLBACK',
      feasibleWindows: [],
      isFallback: true,
      error: err?.message || 'API unavailable',
    };
  }
}

// ---------------------------------------------------------------------------
// Time helpers
// ---------------------------------------------------------------------------

/**
 * Convert any time string ('10:30 AM', '09:05:00', '14:30', '9:05')
 * to standard store-local 'HH:mm:ss' format required by Salon360.
 *
 * @param {string} timeStr
 * @returns {string} - 'HH:mm:ss'
 */
export function toHMS(timeStr) {
  if (!timeStr) return '10:30:00';
  const clean = String(timeStr).trim();

  // If already HH:mm:ss
  if (/^\d{2}:\d{2}:\d{2}$/.test(clean)) {
    return clean;
  }

  // 12-hour AM/PM format (e.g. "10:30 AM", "1:00 PM")
  const ampmMatch = clean.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (ampmMatch) {
    let h = parseInt(ampmMatch[1], 10);
    const m = ampmMatch[2];
    const s = ampmMatch[3] || '00';
    const period = ampmMatch[4].toUpperCase();
    if (period === 'PM' && h < 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return `${String(h).padStart(2, '0')}:${m}:${s}`;
  }

  // 24-hour format (e.g. "09:05", "14:30")
  const h24Match = clean.match(/^(\d{1,2}):(\d{2})$/);
  if (h24Match) {
    const h = parseInt(h24Match[1], 10);
    const m = h24Match[2];
    return `${String(h).padStart(2, '0')}:${m}:00`;
  }

  return '10:30:00';
}

/**
 * Parse a 'HH:mm:ss' time string to { h, m } integers.
 */
function parseHMS(hms) {
  const [h, m] = hms.split(':').map(Number);
  return { h, m };
}

/**
 * Format a 24-h { h, m } object to '12:30 PM' display label.
 */
function formatAmPm({ h, m }) {
  const period = h >= 12 ? 'PM' : 'AM';
  const hour   = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

/**
 * Convert feasible API windows into the UI slot shape:
 *   { value: '09:05:00', label: '9:05 AM', hour: 9, minute: 5 }
 *
 * We surface every startTime as a bookable slot.
 *
 * @param {Array<{startTime:string, endTime:string}>} windows
 * @returns {Array<{value:string, label:string, hour:number, minute:number}>}
 */
export function windowsToSlots(windows) {
  if (!windows?.length) return [];

  return windows.map((w) => {
    const { h, m } = parseHMS(w.startTime);
    return {
      value:  w.startTime,         // 'HH:mm:ss'  — used as form value & API startTime
      label:  formatAmPm({ h, m }), // '10:30 AM'  — displayed to users
      hour:   h,
      minute: m,
    };
  });
}

/**
 * Compute the endTime for a service given its startTime and durationMinutes.
 * Returns 'HH:mm:ss'.
 *
 * @param {string} startTime      - 'HH:mm:ss' or any standard time string
 * @param {number} durationMinutes
 */
export function computeEndTime(startTime, durationMinutes) {
  const hms = toHMS(startTime);
  const { h, m } = parseHMS(hms);
  const totalMins = h * 60 + m + durationMinutes;
  const eh = Math.floor(totalMins / 60) % 24;
  const em = totalMins % 60;
  return `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}:00`;
}

// ---------------------------------------------------------------------------
// Booking creation
// ---------------------------------------------------------------------------

/**
 * Submit a ZAYRO appointment to the Salon360 API.
 *
 * @param {Object} params
 * @param {string} params.date       - 'YYYY-MM-DD'
 * @param {string} params.startTime  - 'HH:mm:ss' or '10:30 AM'
 * @param {string} params.serviceKey - ZAYRO service id
 * @param {string} params.name       - customer name
 * @param {string} params.phone      - 10-digit mobile (we prepend nothing; API accepts as-is)
 * @param {string} [params.email]
 * @param {string} [params.notes]
 * @param {string} [params.idempotencyKey] - optional; auto-generated if omitted
 *
 * @returns {Promise<{success:boolean, appointmentId:number, customerId:number, lines:Array, idempotencyKey:string}>}
 */
export async function submitBooking({
  date,
  startTime,
  serviceKey,
  name,
  phone,
  email  = null,
  notes  = null,
  idempotencyKey,
}) {
  const { serviceId, durationMinutes, numericPrice } = resolveService(serviceKey);
  const formattedStartTime = toHMS(startTime);
  const endTime = computeEndTime(formattedStartTime, durationMinutes);
  const iKey    = idempotencyKey || generateUUID();

  const result = await createBooking({
    date,
    startTime: formattedStartTime,
    customer: {
      name,
      mobile: phone,
      email:  email || null,
    },
    staffSelectionMode: 'ANY',
    lineItems: [
      {
        id:          serviceId,
        price:       numericPrice,
        taxId:       null,
        taxGroupId:  null,
        startTime:   formattedStartTime,
        endTime,
        artistShares: [], // empty for ANY mode
      },
    ],
    appointmentNotes: notes || null,
    idempotencyKey:   iKey,
  });

  return { ...result, idempotencyKey: iKey };
}

