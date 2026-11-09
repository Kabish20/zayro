/**
 * Salon360 Online Booking API Client (DRF Backend Proxy)
 * All client requests route through the secure Django backend.
 */

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 'http://127.0.0.1:8000';

async function request(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      data?.dynMsg || data?.error || data?.message || data?.responseMsg || `Booking request failed (${response.status})`
    );
  }
  return data;
}

export const salon360Api = {
  getStaff: () => request("/api/salon360/staff/"),
  getConfig: () => request("/api/salon360/config/"),
  getServices: () => request("/api/salon360/services/"),
  availability: (payload) =>
    request("/api/salon360/availability/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  createBooking: (payload, attemptId) =>
    request("/api/salon360/create/", {
      method: "POST",
      headers: {
        "Idempotency-Key": attemptId,
      },
      body: JSON.stringify(payload),
    }),
};

export function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const fetchStaff = salon360Api.getStaff;
export const fetchConfig = salon360Api.getConfig;
export const fetchServices = salon360Api.getServices;
export const fetchAvailability = salon360Api.availability;
export const createBooking = salon360Api.createBooking;

export default salon360Api;
