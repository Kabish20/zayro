/**
 * Google Sheets Integration Service for ZAYRO
 * Connects frontend forms to Google Apps Script Web App Endpoint.
 */

export const GOOGLE_SHEET_ENDPOINT = 
  import.meta.env.VITE_GOOGLE_SCRIPT_URL || 
  'https://script.google.com/macros/s/AKfycby-dh-7Q_o6OrvyABbAFyhweK_6PHYQmXSubl-38n7-lNfEC2bgkyMggEszocl-nCME/exec';

/**
 * Submit form payload to Google Sheets via Google Apps Script Web App
 * @param {Object} payload Form data with formType ('Bookings' | 'Contact' | 'Franchise')
 * @returns {Promise<{success: boolean, error?: any}>}
 */
export async function submitToGoogleSheets(payload) {
  try {
    // We send payload as text/plain with mode: 'no-cors' so that Google Apps Script
    // redirect doesn't fail due to browser CORS policies while doPost() receives the JSON string.
    await fetch(GOOGLE_SHEET_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to submit form data to Google Sheets:', error);
    return { success: false, error };
  }
}
