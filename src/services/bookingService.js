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
} from './salon360Api';

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
  'rate-shave':         { serviceId: 102003, durationMinutes: 20,  numericPrice: 50   },
  'rate-kids-cut':      { serviceId: 102003, durationMinutes: 25,  numericPrice: 75   },
  'rate-oil-massage':   { serviceId: 102003, durationMinutes: 15,  numericPrice: 199  },
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

  // ── Membership Plans (booking inquiry only — no live-pricing on API) ───────
  'membership-silver':   { serviceId: 102003, durationMinutes: 30, numericPrice: 259  },
  'membership-gold':     { serviceId: 102003, durationMinutes: 30, numericPrice: 549  },
  'membership-platinum': { serviceId: 102003, durationMinutes: 30, numericPrice: 1099 },
  'membership-diamond':  { serviceId: 102003, durationMinutes: 30, numericPrice: 1999 },
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
 *
 * @param {string} date       - 'YYYY-MM-DD'
 * @param {string} serviceKey - ZAYRO service id
 * @returns {Promise<{ status: string, feasibleWindows: Array<{startTime: string, endTime: string}> }>}
 */
export async function getAvailableWindowsForDate(date, serviceKey) {
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
    return { status: 'CLOSED', feasibleWindows: [] };
  }

  return {
    status: dayResult.status,
    feasibleWindows: dayResult.status === 'AVAILABLE'
      ? (dayResult.feasibleWindows || [])
      : [],
  };
}

// ---------------------------------------------------------------------------
// Time helpers
// ---------------------------------------------------------------------------

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
 * @param {string} startTime      - 'HH:mm:ss'
 * @param {number} durationMinutes
 */
export function computeEndTime(startTime, durationMinutes) {
  const { h, m } = parseHMS(startTime);
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
 * @param {string} params.startTime  - 'HH:mm:ss'
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
  const endTime = computeEndTime(startTime, durationMinutes);
  const iKey    = idempotencyKey || generateUUID();

  const result = await createBooking({
    date,
    startTime,
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
        startTime,
        endTime,
        artistShares: [], // empty for ANY mode
      },
    ],
    appointmentNotes: notes || null,
    idempotencyKey:   iKey,
  });

  return { ...result, idempotencyKey: iKey };
}

