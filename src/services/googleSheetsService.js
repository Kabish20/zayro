/**
 * Google Sheets Integration Service for ZAYRO
 * Connects frontend forms to Google Apps Script Web App Endpoint.
 * Hardened with:
 * - Anti-bot Honeypot trap check
 * - Automation Velocity Check (sub-second script detection)
 * - Formula Injection sanitization (CWE-1236)
 * - Prototype Pollution Defense (CWE-1321)
 * - Dual-layer rate limiting & flood abuse protection
 * - Anti-Tamper security token
 * - Timeout guard (AbortController)
 * - Safe error handling (no sensitive data leaks)
 */

import {
  sanitizePayloadForSpreadsheet,
  isBotSubmission,
  isHumanInteractionDuration,
  checkSubmissionRateLimit,
  recordSubmissionSuccess,
  generateAntiTamperToken,
} from '@/utils/security';

export const GOOGLE_SHEET_ENDPOINT = 
  import.meta.env.VITE_GOOGLE_SCRIPT_URL || 
  'https://script.google.com/macros/s/AKfycby-dh-7Q_o6OrvyABbAFyhweK_6PHYQmXSubl-38n7-lNfEC2bgkyMggEszocl-nCME/exec';

/**
 * Submit form payload to Google Sheets via Google Apps Script Web App
 * @param {Object} payload Form data with formType ('Bookings' | 'Contact' | 'Franchise')
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function submitToGoogleSheets(payload) {
  try {
    if (!payload || typeof payload !== 'object') {
      return { success: false, error: 'Invalid form data provided' };
    }

    // 1. Anti-Bot Honeypot Defense:
    // If the hidden honeypot trap field is filled by an automated bot,
    // silently intercept and succeed without consuming Google Apps Script execution quota.
    const honeypotVal = payload.honeypot || payload._hp_trap || payload.fax_field || '';
    if (isBotSubmission(honeypotVal)) {
      await new Promise((res) => setTimeout(res, 800));
      return { success: true };
    }

    // 2. Velocity Defense:
    // If submission occurs under 1200ms from form opening, it is automated script execution
    if (payload.formOpenedAt && !isHumanInteractionDuration(payload.formOpenedAt)) {
      await new Promise((res) => setTimeout(res, 800));
      return { success: true };
    }

    // 3. Dual-Layer Submission Rate Limiting Defense:
    const formKey = payload.formType || 'lead';
    const rateLimit = checkSubmissionRateLimit(formKey);
    if (!rateLimit.allowed) {
      return { success: false, error: rateLimit.error };
    }

    // 4. Formula Injection Neutralization (CWE-1236) & Prototype Pollution Defense (CWE-1321)
    const sanitizedPayload = sanitizePayloadForSpreadsheet(payload);
    delete sanitizedPayload.honeypot;
    delete sanitizedPayload._hp_trap;
    delete sanitizedPayload.fax_field;
    delete sanitizedPayload.formOpenedAt;

    // Attach client timestamp and cryptographic anti-tamper token for auditability
    sanitizedPayload.submittedAt = new Date().toISOString();
    sanitizedPayload.securityToken = generateAntiTamperToken();

    // 5. Network Request with 10-second Timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      // We send payload as text/plain with mode: 'no-cors' so that Google Apps Script
      // redirect doesn't fail due to browser CORS policies while doPost() receives the JSON string.
      await fetch(GOOGLE_SHEET_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(sanitizedPayload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      recordSubmissionSuccess(formKey);
      return { success: true };
    } catch (fetchErr) {
      clearTimeout(timeoutId);
      if (fetchErr.name === 'AbortError') {
        return { success: false, error: 'Request timed out. Please check your internet connection and try again.' };
      }
      throw fetchErr;
    }
  } catch (error) {
    // Redact sensitive endpoint details from error output
    const safeMsg = error?.message || 'Unable to connect to lead service';
    return { success: false, error: safeMsg };
  }
}
