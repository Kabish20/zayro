/**
 * Salon360 Online Booking API Client
 * 
 * Integration Guide Reference:
 *   Store: storeId 868, orgId 555
 *   Base URL: https://api.salon360app.com/api/online-booking/v1/external/booking
 * 
 * ⚠️  SECURITY NOTE (from Salon360 integration guide):
 *   The x-api-key grants full access to this store's booking API.
 *   In production, ALL calls MUST go through your own backend proxy
 *   (never expose the secret in browser/client-side code).
 *   In development, Vite proxies /salon360-api → the real endpoint
 *   so the key stays server-side.
 */

// --- Configuration -----------------------------------------------------------

const STORE_ID = 868;
const ORG_ID   = 555;

/**
 * In development  → Vite dev-server proxies /salon360-api/... to the real host
 *                   (key injected by the proxy; never sent to the browser)
 * In production   → Point this to YOUR backend proxy endpoint
 */
const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SALON360_PROXY_URL) || '/salon360-api';

/** Maximum days per availability call (Salon360 limit: 7 days) */
const MAX_DAYS_PER_CALL = 7;

/** Maximum advance booking window (Salon360 limit: 365 days) */
export const MAX_ADVANCE_DAYS = 365;

// --- Response envelope -------------------------------------------------------

/**
 * Unwrap the standard Salon360 response envelope:
 *   { responseCode, responseMsg, dynMsg, response }
 *
 * Throws an Error on API-level failures (non-200 responseCode).
 * @param {Response} httpResponse - raw fetch Response
 * @returns {Promise<any>} - the `response` payload
 */
async function unwrapEnvelope(httpResponse) {
  let body;
  try {
    body = await httpResponse.json();
  } catch {
    throw new Error(`Salon360 returned non-JSON (HTTP ${httpResponse.status})`);
  }

  if (!httpResponse.ok || (body?.responseCode && body.responseCode !== 200)) {
    const code    = body?.responseCode || httpResponse.status;
    const msgCode = body?.responseMsg  || 'UNKNOWN_ERROR';
    const human   = body?.dynMsg       || httpResponse.statusText || 'An unexpected error occurred';
    const err     = new Error(human);
    err.responseCode = code;
    err.responseMsg  = msgCode;
    throw err;
  }

  return ('response' in (body || {})) ? body.response : body;
}

/**
 * Quick diagnostic probe to check if the Salon360 API is active or pending deployment.
 * Never throws.
 *
 * @returns {Promise<{ok: boolean, status: number, isPendingActivation: boolean, message: string}>}
 */
export async function checkApiHealth() {
  try {
    const res = await fetch(`${API_BASE}/config?storeId=${STORE_ID}&orgId=${ORG_ID}`);
    const data = await res.json().catch(() => null);
    if (res.ok && data?.responseCode === 200) {
      return { ok: true, status: 200, isPendingActivation: false, message: 'Salon360 API is active and operational.' };
    }
    if (res.status === 401 || data?.responseCode === 401) {
      return {
        ok: false,
        status: 401,
        isPendingActivation: true,
        message: 'Endpoint reachable, pending API key activation on Salon360 backend.',
      };
    }
    return {
      ok: false,
      status: res.status,
      isPendingActivation: false,
      message: data?.dynMsg || res.statusText || 'Unexpected response',
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      isPendingActivation: false,
      message: `Network/Proxy error: ${err.message}`,
    };
  }
}

// --- Shared fetch helper ------------------------------------------------------

/**
 * @param {string} path   - relative path, e.g. '/config'
 * @param {RequestInit} [init] - fetch options (method, body, extra headers)
 * @param {Record<string,string>} [extraHeaders]
 */
async function salon360Fetch(path, init = {}, extraHeaders = {}) {
  const url = `${API_BASE}${path}`;

  const headers = {
    'Content-Type': 'application/json',
    ...extraHeaders,
    ...(init.headers || {}),
  };

  const response = await fetch(url, { ...init, headers });
  return unwrapEnvelope(response);
}

// --- Public API surface -------------------------------------------------------

/**
 * GET /config
 * Fetch store timezone, rounding, and tax configuration.
 * Cache the result client-side — it rarely changes.
 *
 * @returns {Promise<{storeId, orgId, timeZoneStr, isAmountRoundedOff, configurations, taxMasterList, taxGroupMasterList}>}
 */
export async function fetchStoreConfig() {
  return salon360Fetch(`/config?storeId=${STORE_ID}&orgId=${ORG_ID}`);
}

/**
 * GET /staff
 * List of eligible staff for booking.
 *
 * @returns {Promise<Array<{staffId, name, designation, profileImage}>>}
 */
export async function fetchStaff() {
  return salon360Fetch(`/staff?storeId=${STORE_ID}&orgId=${ORG_ID}`);
}

/**
 * POST /availability
 * Check available slots for one or more services on the given date(s).
 *
 * @param {Object} params
 * @param {string}   params.startDate          - 'YYYY-MM-DD'
 * @param {string}   params.endDate            - 'YYYY-MM-DD' (max 7 days from startDate)
 * @param {number}   [params.slotIntervalMinutes=30]
 * @param {string}   [params.staffSelectionMode='ANY']  - 'ANY' | 'SINGLE' | 'PER_SERVICE'
 * @param {Array<{serviceId:number, durationMinutes:number}>} params.services
 * @param {number|null}  [params.staffId=null]          - only for SINGLE mode
 * @param {Array|null}   [params.serviceStaffAssignments=null] - only for PER_SERVICE mode
 *
 * @returns {Promise<Array<{date:string, status:string, feasibleWindows:Array<{startTime:string,endTime:string}>}>>}
 */
export async function fetchAvailability({
  startDate,
  endDate,
  slotIntervalMinutes = 30,
  staffSelectionMode  = 'ANY',
  services,
  staffId             = null,
  serviceStaffAssignments = null,
}) {
  const payload = {
    storeId: STORE_ID,
    orgId:   ORG_ID,
    startDate,
    endDate,
    slotIntervalMinutes,
    staffSelectionMode,
    services,
    staffId,
    serviceStaffAssignments,
  };

  return salon360Fetch('/availability', {
    method: 'POST',
    body:   JSON.stringify(payload),
  });
}

/**
 * POST /create
 * Create a new booking appointment.
 *
 * Requires a fresh Idempotency-Key UUID per booking attempt.
 * Reuse the same UUID ONLY when retrying the exact same attempt after a timeout.
 *
 * @param {Object} params
 * @param {string}   params.date              - 'YYYY-MM-DD'
 * @param {string}   params.startTime         - 'HH:mm:ss' (store-local time)
 * @param {{name:string, mobile:string, email?:string}} params.customer
 * @param {string}   [params.staffSelectionMode='ANY']
 * @param {Array<{id:number, price:number, taxId?:number|null, taxGroupId?:number|null, startTime:string, endTime:string, artistShares?:Array}>} params.lineItems
 * @param {string|null} [params.appointmentNotes=null]
 * @param {string}   params.idempotencyKey    - fresh UUID per attempt
 *
 * @returns {Promise<{success:boolean, appointmentId:number, customerId:number, lines:Array}>}
 */
export async function createBooking({
  date,
  startTime,
  customer,
  staffSelectionMode = 'ANY',
  lineItems,
  appointmentNotes   = null,
  idempotencyKey,
}) {
  const payload = {
    storeId: STORE_ID,
    orgId:   ORG_ID,
    date,
    startTime,
    customer,
    staffSelectionMode,
    lineItems,
    appointmentNotes,
  };

  return salon360Fetch(
    '/create',
    {
      method: 'POST',
      body:   JSON.stringify(payload),
    },
    {
      'Idempotency-Key': idempotencyKey,
    },
  );
}

// --- Convenience helpers -----------------------------------------------------

export { STORE_ID, ORG_ID };

/**
 * Generate a RFC4122-compliant UUID v4 for idempotency keys.
 * Falls back to a crypto-random hex string when crypto.randomUUID is unavailable.
 */
export function generateUUID() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Polyfill for environments without crypto.randomUUID
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant RFC4122
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join('-');
}

/**
 * Split a date range into chunks of at most MAX_DAYS_PER_CALL days
 * and fetch availability for all of them, returning a flat merged array.
 *
 * @param {string} startDate - 'YYYY-MM-DD'
 * @param {string} endDate   - 'YYYY-MM-DD'
 * @param {Object} options   - same options as fetchAvailability (minus startDate/endDate)
 * @returns {Promise<Array>}
 */
export async function fetchAvailabilityRange(startDate, endDate, options) {
  const start = new Date(startDate);
  const end   = new Date(endDate);
  const results = [];
  let cursor = new Date(start);

  while (cursor <= end) {
    const chunkEnd = new Date(cursor);
    chunkEnd.setDate(chunkEnd.getDate() + MAX_DAYS_PER_CALL - 1);
    if (chunkEnd > end) chunkEnd.setTime(end.getTime());

    const chunk = await fetchAvailability({
      ...options,
      startDate: toYMD(cursor),
      endDate:   toYMD(chunkEnd),
    });

    if (Array.isArray(chunk)) results.push(...chunk);

    cursor = new Date(chunkEnd);
    cursor.setDate(cursor.getDate() + 1);
  }

  return results;
}

/** Format a Date to 'YYYY-MM-DD' */
function toYMD(d) {
  return d.toISOString().slice(0, 10);
}

