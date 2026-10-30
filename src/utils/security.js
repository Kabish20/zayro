/**
 * ZAYRO Enterprise Security & Hardening Core Module
 * 
 * Provides comprehensive defense-in-depth protection:
 * 1. HTML Escaping & XSS Protection (DOM & Injection Defense)
 * 2. Prototype Pollution Defense (CWE-1321)
 * 3. Spreadsheet Formula Injection Neutralization (CWE-1236 / CSV/Excel Injection)
 * 4. ReDoS-Immune Input Validation & Control Character Stripping
 * 5. Bot Trap, Honeypot & Automation Velocity Detection
 * 6. Dual-Storage Abuse & Flood Throttling (Session + LocalStorage)
 * 7. Path Traversal & Filename Sanitization (CWE-22)
 * 8. Cryptographic Anti-Tamper & Anti-Replay Tokens
 * 9. Safe LocalStorage Operations
 */

// 1. HTML Escaping for safe interpolation in dynamic HTML templates (e.g., Print Window)
export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/`/g, '&#96;')
    .replace(/\//g, '&#x2F;');
}

// 2. Spreadsheet Formula Injection Neutralization (CWE-1236)
export function sanitizeFormulaValue(val) {
  if (typeof val !== 'string') return val;
  const trimmed = val.trim();
  // Neutralize formula trigger prefixes: =, +, -, @, tab (\t), or carriage return (\r)
  if (/^[=+\-@\t\r]/.test(trimmed)) {
    // Prefixing with single apostrophe forces spreadsheet engines to treat it strictly as literal text
    return "'" + val;
  }
  return val;
}

// Blocklist of forbidden property names to eliminate Prototype Pollution (CWE-1321)
const FORBIDDEN_OBJECT_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

// Recursively sanitize all object properties for spreadsheet submission with Prototype Pollution Defense
export function sanitizePayloadForSpreadsheet(payload) {
  if (!payload || typeof payload !== 'object') return {};
  
  const sanitized = {};
  for (const [key, value] of Object.entries(payload)) {
    // Drop any prototype pollution vectors
    if (FORBIDDEN_OBJECT_KEYS.has(key)) {
      continue;
    }

    if (typeof value === 'string') {
      const cleaned = sanitizeInput(value, 1500);
      sanitized[key] = sanitizeFormulaValue(cleaned);
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      sanitized[key] = sanitizePayloadForSpreadsheet(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

// 3. General Input Sanitization (Length bounds & control character stripping)
// Uses direct character code evaluation to eliminate any ReDoS vulnerability
export function sanitizeInput(input, maxLength = 255) {
  if (input === null || input === undefined) return '';
  const str = String(input);
  let cleaned = '';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    // Filter ASCII control characters (0-8, 11-12, 14-31, 127)
    const isControl = (code >= 0 && code <= 8) || code === 11 || code === 12 || (code >= 14 && code <= 31) || code === 127;
    // Filter Unicode Bidirectional override characters (U+202A-U+202E, U+2066-U+2069)
    const isBidi = (code >= 0x202A && code <= 0x202E) || (code >= 0x2066 && code <= 0x2069);
    if (!isControl && !isBidi) {
      cleaned += str[i];
    }
  }
  return cleaned.trim().slice(0, maxLength);
}

// 4. Filename Sanitizer (Path Traversal CWE-22 Defense)
export function sanitizeFilename(name, fallback = 'file') {
  if (!name || typeof name !== 'string') return fallback;
  const cleaned = name
    .replace(/[^a-zA-Z0-9_\-.]/g, '')
    .replace(/\.{2,}/g, '.')
    .slice(0, 64);
  return cleaned || fallback;
}

// 5. Cryptographic Anti-Tamper & Anti-Replay Token
export function generateAntiTamperToken() {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  }
  return 'zyr_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// 6. Automation Velocity Verification (Detects sub-second headless bot scripts)
export function isHumanInteractionDuration(formOpenedAtMs, minDurationMs = 1200) {
  if (!formOpenedAtMs || typeof formOpenedAtMs !== 'number') return true;
  return Date.now() - formOpenedAtMs >= minDurationMs;
}

// 7. Input Validators
export function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[\s-]/g, '');
  return /^[6-9][0-9]{9}$/.test(cleaned);
}

export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return true; // Optional field
  const trimmed = email.trim();
  if (trimmed.length === 0) return true;
  if (trimmed.length > 100) return false;
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(trimmed);
}

export function isValidName(name) {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 80;
}

// 8. Bot & Honeypot Detection
export function isBotSubmission(honeypotValue) {
  return typeof honeypotValue === 'string' && honeypotValue.trim().length > 0;
}

// 9. Dual-Storage Flood & Abuse Rate Limiting (Session + LocalStorage)
const RATE_LIMIT_PREFIX = 'zayro_rl_';
const COOLDOWN_MS = 3000; // 3 seconds minimum between any submissions
const WINDOW_DURATION_MS = 5 * 60 * 1000; // 5-minute sliding window
const MAX_SUBMISSIONS_PER_WINDOW = 6; // Max 6 submissions per 5 minutes

export function checkSubmissionRateLimit(actionType = 'lead') {
  if (typeof window === 'undefined') return { allowed: true };

  try {
    const key = `${RATE_LIMIT_PREFIX}${actionType}`;
    const now = Date.now();
    
    // Read from both session and local storage to prevent tab-switching bypasses
    const rawSession = sessionStorage.getItem(key);
    const rawLocal = localStorage.getItem(key);
    
    let history = [];
    [rawSession, rawLocal].forEach((raw) => {
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            parsed.forEach((t) => {
              if (typeof t === 'number' && now - t < WINDOW_DURATION_MS && !history.includes(t)) {
                history.push(t);
              }
            });
          }
        } catch {
          // ignore corrupted entry
        }
      }
    });

    history.sort((a, b) => a - b);

    // Check 1: Minimum cooldown between successive submissions
    if (history.length > 0) {
      const lastSubmission = history[history.length - 1];
      if (now - lastSubmission < COOLDOWN_MS) {
        const waitSec = Math.ceil((COOLDOWN_MS - (now - lastSubmission)) / 1000);
        return {
          allowed: false,
          error: `Please wait ${waitSec} second(s) before submitting again.`
        };
      }
    }

    // Check 2: Maximum submissions in sliding window
    if (history.length >= MAX_SUBMISSIONS_PER_WINDOW) {
      return {
        allowed: false,
        error: 'Too many submissions in a short period. Please try again in a few minutes or contact us directly on WhatsApp.'
      };
    }

    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}

export function recordSubmissionSuccess(actionType = 'lead') {
  if (typeof window === 'undefined') return;

  try {
    const key = `${RATE_LIMIT_PREFIX}${actionType}`;
    const now = Date.now();
    let history = [];

    const raw = sessionStorage.getItem(key);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          history = parsed.filter((timestamp) => typeof timestamp === 'number' && now - timestamp < WINDOW_DURATION_MS);
        }
      } catch {
        history = [];
      }
    }

    history.push(now);
    const serialized = JSON.stringify(history);
    sessionStorage.setItem(key, serialized);
    localStorage.setItem(key, serialized);
  } catch {
    // Ignore storage quota or disabled errors
  }
}

// 10. Safe LocalStorage Operations
export function safeGetStorageJson(key, defaultVal = []) {
  if (typeof window === 'undefined') return defaultVal;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultVal;
    const parsed = JSON.parse(raw);
    return parsed !== null ? parsed : defaultVal;
  } catch {
    return defaultVal;
  }
}

export function safeSetStorageJson(key, data, maxEntries = 50) {
  if (typeof window === 'undefined') return;
  try {
    let payload = data;
    if (Array.isArray(data) && data.length > maxEntries) {
      payload = data.slice(-maxEntries);
    }
    localStorage.setItem(key, JSON.stringify(payload));
  } catch {
    // Graceful fallback
  }
}

// 11. Safe external URL validation
export function isSafeHttpUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}
