/**
 * Booking Pass Generator & Print Utility for ZAYRO Men's Grooming Lounge
 * Generates ultra-luxury, high-resolution downloadable VIP passes and print-ready receipts.
 */

// Preload the brand logo image
const loadLogoImage = (src = '/images/logo/Transparent Logo.png') => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
};

/**
 * Renders the ultra-luxury, high-resolution VIP Booking Pass canvas element.
 * Features the authentic centered ZAYRO logo, clean typography, and balanced 2-column layout.
 * @param {Object} data 
 * @returns {Promise<HTMLCanvasElement|null>}
 */
export async function renderBookingPassCanvas({
  bookingRef = 'ZYR-849201',
  name = 'Guest',
  phone = '',
  email = '',
  service = '',
  location = '',
  address = '',
  date = '',
  time = '',
  notes = ''
}) {
  if (typeof document === 'undefined') return null;

  // Ensure fonts are loaded before rasterizing canvas
  if (document.fonts) {
    try {
      await document.fonts.ready;
    } catch {
      // Continue even if font loading fails
    }
  }

  // Preload authentic brand logo
  const logoImg = await loadLogoImage('/images/logo/Transparent Logo.png');

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // High-resolution canvas: 1000 x 1420 (or 1480 if notes present)
  canvas.width = 1000;
  canvas.height = notes ? 1480 : 1420;

  // Reset letter spacing globally
  if ('letterSpacing' in ctx) {
    ctx.letterSpacing = '0px';
  }

  // 1. Background Gradient (Deep Regal Emerald)
  const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bgGrad.addColorStop(0, '#0C160E');
  bgGrad.addColorStop(0.3, '#162719');
  bgGrad.addColorStop(0.7, '#1A2E1D');
  bgGrad.addColorStop(1, '#0A130B');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle radial gold glow behind header
  const radialGlow = ctx.createRadialGradient(canvas.width / 2, 160, 20, canvas.width / 2, 160, 480);
  radialGlow.addColorStop(0, 'rgba(230, 178, 92, 0.08)');
  radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = radialGlow;
  ctx.fillRect(0, 0, canvas.width, 500);

  // Subtle fine vertical pinstripes
  ctx.save();
  ctx.strokeStyle = 'rgba(230, 178, 92, 0.025)';
  ctx.lineWidth = 1;
  for (let i = 0; i < canvas.width; i += 28) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
    ctx.stroke();
  }
  ctx.restore();

  // 2. Luxury Double Gold Borders
  // Outer Gold Border
  ctx.strokeStyle = '#E6B25C';
  ctx.lineWidth = 3.5;
  ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

  // Inner Fine Gold Border
  ctx.strokeStyle = 'rgba(230, 178, 92, 0.45)';
  ctx.lineWidth = 1;
  ctx.strokeRect(42, 42, canvas.width - 84, canvas.height - 84);

  // Corner ornamental accents (diamonds at the four corners)
  const corners = [
    [42, 42],
    [canvas.width - 42, 42],
    [42, canvas.height - 42],
    [canvas.width - 42, canvas.height - 42]
  ];
  corners.forEach(([x, y]) => {
    ctx.fillStyle = '#E6B25C';
    ctx.beginPath();
    ctx.moveTo(x, y - 6);
    ctx.lineTo(x + 6, y);
    ctx.lineTo(x, y + 6);
    ctx.lineTo(x - 6, y);
    ctx.closePath();
    ctx.fill();
  });

  // 3. Top Ribbon Badge
  const ribbonW = 430;
  const ribbonH = 30;
  const ribbonX = (canvas.width - ribbonW) / 2;
  const ribbonY = 60;

  ctx.fillStyle = 'rgba(230, 178, 92, 0.12)';
  ctx.beginPath();
  ctx.roundRect(ribbonX, ribbonY, ribbonW, ribbonH, 15);
  ctx.fill();

  ctx.strokeStyle = '#E6B25C';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#E6B25C';
  ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '2px';
  ctx.fillText('• OFFICIAL APPOINTMENT PASS • PRIVATE CONCIERGE •', canvas.width / 2, ribbonY + 19);
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';

  // 4. Centered Brand Logo (Top Center)
  if (logoImg) {
    // Logo natural aspect ratio ~2.47 (1646 x 666)
    const logoW = 290;
    const logoH = 117;
    const logoX = (canvas.width - logoW) / 2;
    const logoY = 104;
    ctx.drawImage(logoImg, logoX, logoY, logoW, logoH);
  } else {
    // Fallback if image fails
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 42px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('Z A Y R O', canvas.width / 2, 150);

    ctx.fillStyle = '#E6B25C';
    ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
    if ('letterSpacing' in ctx) ctx.letterSpacing = '3px';
    ctx.fillText("MEN'S GROOMING LOUNGE • LUXURY MADE AFFORDABLE", canvas.width / 2, 185);
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
  }

  // 5. Gold Divider Line with Center Diamond
  const divY = 236;
  ctx.strokeStyle = 'rgba(230, 178, 92, 0.45)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(110, divY);
  ctx.lineTo(canvas.width - 110, divY);
  ctx.stroke();

  // Center Diamond
  ctx.fillStyle = '#E6B25C';
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, divY - 7);
  ctx.lineTo(canvas.width / 2 + 7, divY);
  ctx.lineTo(canvas.width / 2, divY + 7);
  ctx.lineTo(canvas.width / 2 - 7, divY);
  ctx.closePath();
  ctx.fill();

  // Flanking diamond dots
  [-24, 24].forEach((offset) => {
    ctx.beginPath();
    ctx.arc(canvas.width / 2 + offset, divY, 2, 0, Math.PI * 2);
    ctx.fill();
  });

  // 6. Booking Reference Capsule
  const refW = 390;
  const refH = 58;
  const refX = (canvas.width - refW) / 2;
  const refY = 256;

  ctx.fillStyle = '#182C1B';
  ctx.beginPath();
  ctx.roundRect(refX, refY, refW, refH, 16);
  ctx.fill();

  ctx.strokeStyle = '#E6B25C';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#9BB899';
  ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '2px';
  ctx.fillText('BOOKING REFERENCE CODE', canvas.width / 2, refY + 20);
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 22px "Plus Jakarta Sans", monospace';
  ctx.fillText(`#${bookingRef}`, canvas.width / 2, refY + 46);

  // Status Badge
  ctx.fillStyle = '#2ECC71';
  ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('● CONFIRMED APPOINTMENT RESERVATION', canvas.width / 2, 336);

  // Helper function to draw rounded cards
  const drawCard = (x, y, w, h, bg, stroke) => {
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 16);
    ctx.fill();

    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  const cardW = canvas.width - 140; // 860px
  const cardX = 70;
  const col1X = cardX + 30; // 100px
  const col2X = cardX + 440; // 510px

  const formattedDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  // 7. Section 1: Guest Information Card (y = 358, h = 180)
  const guestCardY = 358;
  const guestCardH = 180;
  drawCard(cardX, guestCardY, cardW, guestCardH, 'rgba(255, 255, 255, 0.035)', 'rgba(230, 178, 92, 0.28)');

  // Section Header
  ctx.textAlign = 'left';
  ctx.fillStyle = '#E6B25C';
  ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '1.5px';
  ctx.fillText('GUEST INFORMATION', col1X, guestCardY + 28);
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';

  // Hairline divider
  ctx.strokeStyle = 'rgba(230, 178, 92, 0.18)';
  ctx.beginPath();
  ctx.moveTo(col1X, guestCardY + 38);
  ctx.lineTo(cardX + cardW - 30, guestCardY + 38);
  ctx.stroke();

  // Col 1 - Field 1: Full Name (Stacked: Label then Value)
  ctx.fillStyle = '#8FA88D';
  ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '1px';
  ctx.fillText('FULL NAME', col1X, guestCardY + 68);
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 18px "Playfair Display", Georgia, serif';
  ctx.fillText(name || 'Valued Guest', col1X, guestCardY + 94);

  // Col 1 - Field 2: Mobile Number (Stacked: Label then Value)
  ctx.fillStyle = '#8FA88D';
  ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '1px';
  ctx.fillText('MOBILE CONTACT', col1X, guestCardY + 130);
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '600 15px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(phone ? `+91 ${phone}` : '—', col1X, guestCardY + 154);

  // Col 2 - Field 3: Email Address (Stacked: Label then Value)
  ctx.fillStyle = '#8FA88D';
  ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '1px';
  ctx.fillText('EMAIL ADDRESS', col2X, guestCardY + 68);
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';

  ctx.fillStyle = email ? '#FFFFFF' : '#718096';
  ctx.font = '600 14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(email || 'Not Provided', col2X, guestCardY + 94);

  // Col 2 - Field 4: Issued Date (Stacked: Label then Value)
  ctx.fillStyle = '#8FA88D';
  ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '1px';
  ctx.fillText('ISSUED DATE', col2X, guestCardY + 130);
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '600 14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(formattedDate, col2X, guestCardY + 154);

  // 8. Section 2: Appointment Details Card (y = 560, h = 265)
  const apptCardY = 560;
  const apptCardH = 265;
  drawCard(cardX, apptCardY, cardW, apptCardH, 'rgba(255, 255, 255, 0.035)', 'rgba(230, 178, 92, 0.28)');

  // Section Header
  ctx.fillStyle = '#E6B25C';
  ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '1.5px';
  ctx.fillText('APPOINTMENT DETAILS', col1X, apptCardY + 28);
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';

  // Hairline divider
  ctx.strokeStyle = 'rgba(230, 178, 92, 0.18)';
  ctx.beginPath();
  ctx.moveTo(col1X, apptCardY + 38);
  ctx.lineTo(cardX + cardW - 30, apptCardY + 38);
  ctx.stroke();

  // Service Row (Full width prominent)
  ctx.fillStyle = '#8FA88D';
  ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '1px';
  ctx.fillText('SELECTED SERVICE / TREATMENT', col1X, apptCardY + 68);
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';

  ctx.fillStyle = '#E6B25C';
  ctx.font = 'bold 20px "Playfair Display", Georgia, serif';
  ctx.fillText(service || 'ZAYRO Signature Grooming Experience', col1X, apptCardY + 95);

  // 2 Columns below for Date/Time and Branch
  // Col 1: Date & Time Slot
  ctx.fillStyle = '#8FA88D';
  ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '1px';
  ctx.fillText('DATE & TIME SLOT', col1X, apptCardY + 140);
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`${date || 'Confirmed Date'}  •  ${time || 'Slot'}`, col1X, apptCardY + 166);

  ctx.fillStyle = '#9BB899';
  ctx.font = '11px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Priority Concierge Seating (Zero Waiting)', col1X, apptCardY + 188);

  // Col 2: Salon Branch Location
  ctx.fillStyle = '#8FA88D';
  ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '1px';
  ctx.fillText('SALON BRANCH LOCATION', col2X, apptCardY + 140);
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(location || 'ZAYRO Flagship Lounge', col2X, apptCardY + 166);

  if (address) {
    ctx.fillStyle = '#9BB899';
    ctx.font = '11px "Plus Jakarta Sans", sans-serif';
    const displayAddr = address.length > 56 ? address.substring(0, 54) + '...' : address;
    ctx.fillText(displayAddr, col2X, apptCardY + 188);
  }

  // 9. Section 3: Concierge Privileges Card (y = 845, h = 175)
  const privCardY = 845;
  const privCardH = 175;
  drawCard(cardX, privCardY, cardW, privCardH, 'rgba(40, 62, 42, 0.45)', 'rgba(230, 178, 92, 0.35)');

  // Section Header
  ctx.fillStyle = '#E6B25C';
  ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '1.5px';
  ctx.fillText('COMPLIMENTARY CONCIERGE PRIVILEGES', col1X, privCardY + 28);
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';

  // Hairline divider
  ctx.strokeStyle = 'rgba(230, 178, 92, 0.18)';
  ctx.beginPath();
  ctx.moveTo(col1X, privCardY + 38);
  ctx.lineTo(cardX + cardW - 30, privCardY + 38);
  ctx.stroke();

  // Perks in 2 clean, uncrowded columns
  const perksCol1 = [
    '✦  1-on-1 Hair & Scalp Texture Diagnosis',
    '✦  Signature Botanical Cleanse & Hot Towel'
  ];
  const perksCol2 = [
    '✦  Reserved VIP Chair with Zero Waiting',
    '✦  Artisan Espresso / Herbal Refreshment'
  ];

  ctx.fillStyle = '#E8DCB8';
  ctx.font = '500 12.5px "Plus Jakarta Sans", sans-serif';
  perksCol1.forEach((perk, i) => {
    ctx.fillText(perk, col1X, privCardY + 74 + (i * 38));
  });
  perksCol2.forEach((perk, i) => {
    ctx.fillText(perk, col2X, privCardY + 74 + (i * 38));
  });

  // 10. Client Notes (if provided)
  let nextY = 1040;
  if (notes) {
    drawCard(cardX, nextY, cardW, 55, 'rgba(255, 255, 255, 0.03)', 'rgba(230, 178, 92, 0.2)');
    ctx.fillStyle = '#9BB899';
    ctx.font = 'italic 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`Special Notes: "${notes}"`, col1X, nextY + 32);
    nextY += 75;
  }

  // 11. Perforated Ticket Line & Barcode
  const cutY = nextY + 20;
  ctx.save();
  // Cutout circles on sides
  ctx.fillStyle = '#0C160E';
  ctx.beginPath();
  ctx.arc(30, cutY, 12, -Math.PI / 2, Math.PI / 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(canvas.width - 30, cutY, 12, Math.PI / 2, (3 * Math.PI) / 2);
  ctx.fill();

  // Dashed divider line
  ctx.setLineDash([8, 8]);
  ctx.strokeStyle = 'rgba(230, 178, 92, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(50, cutY);
  ctx.lineTo(canvas.width - 50, cutY);
  ctx.stroke();
  ctx.restore();

  // Barcode
  const barcodeY = cutY + 28;
  const barStart = (canvas.width - 440) / 2;
  const barWidth = 440;
  const pattern = [2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 4, 2, 3, 1, 2, 4, 1, 3, 2];
  
  ctx.fillStyle = '#E6B25C';
  let curX = barStart;
  for (let i = 0; i < pattern.length && curX < barStart + barWidth; i++) {
    const w = pattern[i] * 3.2;
    if (i % 2 === 0) {
      ctx.fillRect(curX, barcodeY, w, 36);
    }
    curX += w + 2.8;
  }

  // Barcode Text
  ctx.textAlign = 'center';
  ctx.fillStyle = '#E6B25C';
  ctx.font = 'bold 12px "Plus Jakarta Sans", monospace';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '3px';
  ctx.fillText(`* ${bookingRef} *`, canvas.width / 2, barcodeY + 54);
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';

  // 12. Footer & Verification Instructions
  const footerY = barcodeY + 84;
  ctx.fillStyle = '#9BB899';
  ctx.font = '500 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Please present this pass or state your booking reference upon arrival at the salon reception.', canvas.width / 2, footerY);

  ctx.fillStyle = '#E8DCB8';
  ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Concierge Hotline: +91 91500 22115   •   Website: www.zayrosalon.com   •   Central Lounge: Trichy, Tamil Nadu', canvas.width / 2, footerY + 24);

  ctx.fillStyle = 'rgba(230, 178, 92, 0.7)';
  ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '2px';
  ctx.fillText("AUTHENTICATED DIGITAL PASS • ZAYRO MEN'S GROOMING LOUNGE", canvas.width / 2, footerY + 48);
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';

  return canvas;
}

/**
 * Downloads an ultra-luxury, high-resolution VIP Booking Pass image (.png)
 * @param {Object} data 
 */
export async function downloadBookingPassImage(data) {
  const canvas = await renderBookingPassCanvas(data);
  if (!canvas) return;

  const bookingRef = data.bookingRef || 'ZYR-849201';

  // Download Trigger as PNG Image
  try {
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `ZAYRO-VIP-Booking-Pass-${bookingRef}.png`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      if (a.parentNode) {
        document.body.removeChild(a);
      }
    }, 300);
  } catch {
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ZAYRO-VIP-Booking-Pass-${bookingRef}.png`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        if (a.parentNode) {
          document.body.removeChild(a);
        }
        URL.revokeObjectURL(url);
      }, 1500);
    }, 'image/png');
  }
}

/**
 * Opens a print-ready window with a clean, luxury styled booking pass for PDF saving / printing.
 * @param {Object} data 
 */
export function printBookingPass({
  bookingRef = 'ZYR-849201',
  name = 'Guest',
  phone = '',
  email = '',
  service = '',
  location = '',
  address = '',
  date = '',
  time = '',
  notes = ''
}) {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'width=800,height=950');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>ZAYRO VIP Booking Pass - #${bookingRef}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          @page {
            size: A4 portrait;
            margin: 15mm;
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          }
          body {
            background: #ffffff;
            color: #1a2719;
            padding: 24px;
          }
          .ticket-card {
            max-width: 680px;
            margin: 0 auto;
            border: 2px solid #E6B25C;
            border-radius: 18px;
            padding: 36px;
            background: #faf7f2;
            box-shadow: 0 6px 24px rgba(0,0,0,0.08);
            position: relative;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #E6B25C;
            padding-bottom: 24px;
            margin-bottom: 24px;
          }
          .brand-logo {
            height: 64px;
            width: auto;
            margin: 0 auto 10px;
            display: block;
          }
          .badge {
            display: inline-block;
            background: #30452F;
            color: #E6B25C;
            font-size: 11px;
            font-weight: 700;
            padding: 5px 16px;
            border-radius: 20px;
            margin-top: 10px;
            letter-spacing: 1.5px;
            text-transform: uppercase;
          }
          .ref-box {
            background: #E8EFE8;
            border: 1px dashed #30452F;
            border-radius: 12px;
            padding: 14px 22px;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .ref-label {
            font-size: 11px;
            color: #4A6349;
            text-transform: uppercase;
            font-weight: 700;
            letter-spacing: 1px;
          }
          .ref-number {
            font-size: 20px;
            font-weight: 800;
            color: #1A2719;
            font-family: monospace;
          }
          .section-title {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #936B2B;
            font-weight: 800;
            margin-bottom: 12px;
            border-bottom: 1px solid #E8DCB8;
            padding-bottom: 4px;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 18px;
            margin-bottom: 22px;
          }
          .field-label {
            font-size: 10px;
            text-transform: uppercase;
            color: #666;
            margin-bottom: 3px;
            font-weight: 700;
            letter-spacing: 0.5px;
          }
          .field-value {
            font-size: 15px;
            font-weight: 700;
            color: #1A2719;
          }
          .service-name {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 18px;
            color: #30452F;
          }
          .privileges {
            background: #ffffff;
            border: 1px solid #E8DCB8;
            border-radius: 12px;
            padding: 16px 20px;
            margin-bottom: 22px;
          }
          .privileges-title {
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            color: #30452F;
            margin-bottom: 8px;
            letter-spacing: 1px;
          }
          .privileges ul {
            list-style: none;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            font-size: 12px;
            color: #333;
            font-weight: 500;
          }
          .footer {
            text-align: center;
            font-size: 11px;
            color: #666;
            border-top: 1px solid #E8DCB8;
            padding-top: 18px;
            line-height: 1.6;
          }
          @media print {
            body { padding: 0; background: none; }
            .ticket-card { box-shadow: none; border-color: #30452F; }
          }
        </style>
      </head>
      <body>
        <div class="ticket-card">
          <div class="header">
            <img src="/images/logo/Transparent Logo.png" alt="ZAYRO" class="brand-logo" onerror="this.style.display='none'" />
            <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: 700; color: #30452F; letter-spacing: 4px;">ZAYRO</div>
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #936B2B; font-weight: 600;">Men's Grooming Lounge • Luxury Made Affordable</div>
            <div class="badge">Official Appointment Confirmation Pass</div>
          </div>

          <div class="ref-box">
            <div>
              <div class="ref-label">Booking Reference Number</div>
              <div class="ref-number">#${bookingRef}</div>
            </div>
            <div>
              <div class="ref-label">Status</div>
              <div style="color: #27ae60; font-weight: bold; font-size: 13px;">● Confirmed Request</div>
            </div>
          </div>

          <div class="section-title">Guest Details</div>
          <div class="grid">
            <div>
              <div class="field-label">Full Name</div>
              <div class="field-value">${name || 'Valued Guest'}</div>
            </div>
            <div>
              <div class="field-label">Mobile Number</div>
              <div class="field-value">${phone ? `+91 ${phone}` : '—'}</div>
            </div>
            <div>
              <div class="field-label">Email Address</div>
              <div class="field-value">${email || 'Not Provided'}</div>
            </div>
            <div>
              <div class="field-label">Issued Date</div>
              <div class="field-value">${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
            </div>
          </div>

          <div class="section-title">Appointment Schedule</div>
          <div class="grid">
            <div style="grid-column: span 2;">
              <div class="field-label">Reserved Treatment / Service</div>
              <div class="field-value service-name">${service || 'ZAYRO Signature Grooming'}</div>
            </div>
            <div>
              <div class="field-label">Date & Scheduled Time</div>
              <div class="field-value">${date} at ${time}</div>
            </div>
            <div>
              <div class="field-label">Salon Branch</div>
              <div class="field-value">${location || 'ZAYRO Flagship Lounge'}</div>
              ${address ? `<div style="font-size: 11px; color: #777; margin-top: 2px;">${address}</div>` : ''}
            </div>
          </div>

          <div class="privileges">
            <div class="privileges-title">Complimentary Concierge Privileges Included:</div>
            <ul>
              <li>✦ 1-on-1 Hair & Scalp Texture Diagnosis</li>
              <li>✦ Signature Botanical Cleanse & Hot Towel</li>
              <li>✦ Reserved VIP Chair with Zero Waiting</li>
              <li>✦ Artisan Welcome Refreshment Service</li>
            </ul>
          </div>

          ${notes ? `
          <div style="font-size: 11px; color: #555; background: #fff; padding: 12px 16px; border-radius: 8px; border: 1px solid #eee; margin-bottom: 22px;">
            <strong>Special Requests:</strong> ${notes}
          </div>` : ''}

          <div class="footer">
            <div style="font-weight: 600; color: #30452F;">Please present this pass or state your booking reference upon arrival at salon reception.</div>
            <div>Central Concierge Desk: +91 91500 22115 &nbsp;•&nbsp; www.zayrosalon.com &nbsp;•&nbsp; Trichy, Tamil Nadu</div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          }
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
