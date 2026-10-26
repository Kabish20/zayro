/**
 * Booking Pass Generator & Print Utility for ZAYRO Men's Grooming Lounge
 * Generates high-resolution downloadable VIP passes and print-ready receipts.
 */

/**
 * Downloads a high-resolution, beautifully styled VIP Booking Pass image (.png)
 * @param {Object} data 
 */
export async function downloadBookingPassImage({
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
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // High-resolution 2x retina canvas: 1000 x 1350
  canvas.width = 1000;
  canvas.height = 1380;

  // Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bgGrad.addColorStop(0, '#101B11');
  bgGrad.addColorStop(0.5, '#1A2A1C');
  bgGrad.addColorStop(1, '#0C140C');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle watermark background pattern
  ctx.save();
  ctx.strokeStyle = 'rgba(230, 178, 92, 0.03)';
  ctx.lineWidth = 1;
  for (let i = 0; i < canvas.width; i += 30) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
    ctx.stroke();
  }
  ctx.restore();

  // Outer Gold Border
  ctx.strokeStyle = '#E6B25C';
  ctx.lineWidth = 4;
  ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

  // Inner Fine Gold Border
  ctx.strokeStyle = 'rgba(230, 178, 92, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(42, 42, canvas.width - 84, canvas.height - 84);

  // Corner decorative accents
  const corners = [
    [42, 42],
    [canvas.width - 42, 42],
    [42, canvas.height - 42],
    [canvas.width - 42, canvas.height - 42]
  ];
  corners.forEach(([x, y]) => {
    ctx.fillStyle = '#E6B25C';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Header Ribbon Badge
  ctx.fillStyle = 'rgba(230, 178, 92, 0.15)';
  ctx.fillRect(160, 60, canvas.width - 320, 36);
  ctx.strokeStyle = '#E6B25C';
  ctx.lineWidth = 1;
  ctx.strokeRect(160, 60, canvas.width - 320, 36);

  ctx.fillStyle = '#E6B25C';
  ctx.font = 'bold 13px "Cinzel", "Playfair Display", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '5px';
  ctx.fillText('OFFICIAL APPOINTMENT PASS • PRIVATE CONCIERGE', canvas.width / 2, 84);

  // ZAYRO Brand Title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 44px "Cinzel", "Playfair Display", Georgia, serif';
  ctx.fillText('Z A Y R O', canvas.width / 2, 145);

  ctx.fillStyle = '#E6B25C';
  ctx.font = '600 13px "Inter", "Segoe UI", sans-serif';
  ctx.fillText("MEN'S GROOMING LOUNGE • LUXURY MADE AFFORDABLE", canvas.width / 2, 175);

  // Gold Divider Line with Center Diamond
  ctx.strokeStyle = 'rgba(230, 178, 92, 0.5)';
  ctx.beginPath();
  ctx.moveTo(120, 200);
  ctx.lineTo(canvas.width - 120, 200);
  ctx.stroke();

  ctx.fillStyle = '#E6B25C';
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 194);
  ctx.lineTo(canvas.width / 2 + 7, 200);
  ctx.lineTo(canvas.width / 2, 206);
  ctx.lineTo(canvas.width / 2 - 7, 200);
  ctx.closePath();
  ctx.fill();

  // Booking Reference Pill
  ctx.fillStyle = '#233725';
  ctx.beginPath();
  ctx.roundRect(canvas.width / 2 - 180, 225, 360, 50, 25);
  ctx.fill();
  ctx.strokeStyle = '#E6B25C';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#9BB899';
  ctx.font = '11px "Inter", sans-serif';
  ctx.fillText('BOOKING REFERENCE', canvas.width / 2, 245);

  ctx.fillStyle = '#E6B25C';
  ctx.font = 'bold 18px monospace';
  ctx.fillText(`#${bookingRef}`, canvas.width / 2, 266);

  // Status Badge
  ctx.fillStyle = '#2ECC71';
  ctx.font = 'bold 12px "Inter", sans-serif';
  ctx.fillText('● CONFIRMED APPOINTMENT REQUEST', canvas.width / 2, 305);

  // Section 1: Guest Information Box
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.strokeStyle = 'rgba(230, 178, 92, 0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(70, 330, canvas.width - 140, 150, 16);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#E6B25C';
  ctx.font = 'bold 12px "Inter", sans-serif';
  ctx.fillText('GUEST INFORMATION', 95, 360);

  ctx.fillStyle = '#9BB899';
  ctx.font = '13px "Inter", sans-serif';
  ctx.fillText('Full Name:', 95, 395);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 18px "Cinzel", Georgia, serif';
  ctx.fillText(name || 'Guest', 200, 395);

  ctx.fillStyle = '#9BB899';
  ctx.font = '13px "Inter", sans-serif';
  ctx.fillText('Mobile:', 95, 430);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '600 15px "Inter", sans-serif';
  ctx.fillText(phone || '—', 200, 430);

  if (email) {
    ctx.fillStyle = '#9BB899';
    ctx.fillText('Email:', 520, 430);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(email, 580, 430);
  }

  ctx.fillStyle = '#9BB899';
  ctx.fillText('Issued On:', 95, 460);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '13px "Inter", sans-serif';
  ctx.fillText(new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), 200, 460);

  // Section 2: Appointment Details Box
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.strokeStyle = 'rgba(230, 178, 92, 0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(70, 505, canvas.width - 140, 270, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#E6B25C';
  ctx.font = 'bold 12px "Inter", sans-serif';
  ctx.fillText('APPOINTMENT DETAILS', 95, 535);

  // Service
  ctx.fillStyle = '#9BB899';
  ctx.font = '13px "Inter", sans-serif';
  ctx.fillText('Selected Service:', 95, 570);
  ctx.fillStyle = '#E6B25C';
  ctx.font = 'bold 17px "Cinzel", Georgia, serif';
  ctx.fillText(service || 'ZAYRO Grooming Experience', 95, 595);

  // Date & Time
  ctx.fillStyle = '#9BB899';
  ctx.font = '13px "Inter", sans-serif';
  ctx.fillText('Date & Time Slot:', 95, 635);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 16px "Inter", sans-serif';
  ctx.fillText(`${date}  •  ${time}`, 95, 660);

  // Location / Branch
  ctx.fillStyle = '#9BB899';
  ctx.font = '13px "Inter", sans-serif';
  ctx.fillText('Salon Branch:', 95, 700);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 15px "Inter", sans-serif';
  ctx.fillText(location || 'ZAYRO Flagship Lounge', 95, 725);
  if (address) {
    ctx.fillStyle = '#9BB899';
    ctx.font = '12px "Inter", sans-serif';
    ctx.fillText(address, 95, 745);
  }

  // Section 3: Complimentary Concierge Inclusions
  ctx.fillStyle = 'rgba(48, 69, 47, 0.4)';
  ctx.strokeStyle = 'rgba(230, 178, 92, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(70, 800, canvas.width - 140, 170, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#E6B25C';
  ctx.font = 'bold 12px "Inter", sans-serif';
  ctx.fillText('COMPLIMENTARY CONCIERGE PRIVILEGES', 95, 830);

  const perks = [
    '✓ 1-on-1 Hair & Scalp Texture Diagnosis with Senior Stylist',
    '✓ Signature Botanical Cleanse & Purifying Hot Towel Finish',
    '✓ Reserved VIP Styling Chair with Zero Waiting Queue',
    '✓ Complimentary Artisan Espresso / Herbal Tea Service'
  ];

  ctx.fillStyle = '#E8DCB8';
  ctx.font = '13px "Inter", sans-serif';
  perks.forEach((perk, i) => {
    ctx.fillText(perk, 95, 865 + (i * 26));
  });

  // Client notes (if any)
  if (notes) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.beginPath();
    ctx.roundRect(70, 990, canvas.width - 140, 60, 12);
    ctx.fill();
    ctx.fillStyle = '#9BB899';
    ctx.font = 'italic 12px "Inter", sans-serif';
    ctx.fillText(`Special Notes: "${notes}"`, 95, 1025);
  }

  // Barcode Visual Representation
  const barcodeY = notes ? 1075 : 1000;
  ctx.fillStyle = '#E6B25C';
  ctx.textAlign = 'center';
  ctx.font = '10px monospace';

  // Draw modern decorative barcode lines
  const barStart = 250;
  const barWidth = canvas.width - 500;
  ctx.fillStyle = '#E6B25C';
  const pattern = [2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1, 4, 2];
  let curX = barStart;
  for (let i = 0; i < pattern.length && curX < barStart + barWidth; i++) {
    const w = pattern[i] * 3.5;
    if (i % 2 === 0) {
      ctx.fillRect(curX, barcodeY, w, 40);
    }
    curX += w + 3;
  }

  ctx.fillStyle = '#9BB899';
  ctx.font = '11px monospace';
  ctx.letterSpacing = '3px';
  ctx.fillText(`* ${bookingRef} *`, canvas.width / 2, barcodeY + 60);

  // Footer & Instructions
  const footerY = barcodeY + 95;
  ctx.fillStyle = '#9BB899';
  ctx.font = '11px "Inter", sans-serif';
  ctx.letterSpacing = 'normal';
  ctx.fillText('Please present this pass or state your booking reference upon arrival at the salon reception.', canvas.width / 2, footerY);
  ctx.fillText('Concierge Hotline: +91 91500 22115   |   Website: www.zayro.in   |   Central Desk: Trichy, Tamil Nadu', canvas.width / 2, footerY + 22);

  // Download Trigger
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ZAYRO-VIP-Booking-Pass-${bookingRef}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 'image/png');
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
  const printWindow = window.open('', '_blank', 'width=800,height=950');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>ZAYRO Booking Pass - #${bookingRef}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 15mm;
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          }
          body {
            background: #ffffff;
            color: #1a2719;
            padding: 20px;
          }
          .ticket-card {
            max-width: 650px;
            margin: 0 auto;
            border: 2px solid #E6B25C;
            border-radius: 16px;
            padding: 30px;
            background: #faf7f2;
            box-shadow: 0 4px 20px rgba(0,0,0,0.06);
            position: relative;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #E6B25C;
            padding-bottom: 20px;
            margin-bottom: 25px;
          }
          .brand-name {
            font-family: Georgia, 'Times New Roman', serif;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 6px;
            color: #30452F;
            margin-bottom: 4px;
          }
          .brand-sub {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 3px;
            color: #936B2B;
            font-weight: 600;
          }
          .badge {
            display: inline-block;
            background: #30452F;
            color: #E6B25C;
            font-size: 11px;
            font-weight: bold;
            padding: 4px 14px;
            border-radius: 20px;
            margin-top: 12px;
            letter-spacing: 1.5px;
          }
          .ref-box {
            background: #E8EFE8;
            border: 1px dashed #30452F;
            border-radius: 10px;
            padding: 12px 20px;
            margin-bottom: 25px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .ref-label {
            font-size: 11px;
            color: #555;
            text-transform: uppercase;
            font-weight: 600;
          }
          .ref-number {
            font-size: 18px;
            font-weight: bold;
            color: #30452F;
            font-family: monospace;
          }
          .section-title {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #936B2B;
            font-weight: bold;
            margin-bottom: 12px;
            border-bottom: 1px solid #E8DCB8;
            padding-bottom: 4px;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 20px;
          }
          .field-label {
            font-size: 11px;
            color: #666;
            margin-bottom: 2px;
          }
          .field-value {
            font-size: 14px;
            font-weight: 600;
            color: #1A2719;
          }
          .privileges {
            background: #ffffff;
            border: 1px solid #E8DCB8;
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 20px;
          }
          .privileges ul {
            list-style: none;
            font-size: 12px;
            color: #333;
            line-height: 1.8;
          }
          .footer {
            text-align: center;
            font-size: 11px;
            color: #777;
            border-top: 1px solid #E8DCB8;
            padding-top: 15px;
            line-height: 1.5;
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
            <div class="brand-name">Z A Y R O</div>
            <div class="brand-sub">Men's Grooming Lounge • Luxury Made Affordable</div>
            <div class="badge">Official Appointment Confirmation Pass</div>
          </div>

          <div class="ref-box">
            <div>
              <div class="ref-label">Booking Reference Number</div>
              <div class="ref-number">#${bookingRef}</div>
            </div>
            <div>
              <div class="ref-label">Status</div>
              <div style="color: #27ae60; font-weight: bold; font-size: 13px;">✓ Confirmed Request</div>
            </div>
          </div>

          <div class="section-title">Guest Details</div>
          <div class="grid">
            <div>
              <div class="field-label">Full Name</div>
              <div class="field-value">${name}</div>
            </div>
            <div>
              <div class="field-label">Mobile Number</div>
              <div class="field-value">${phone}</div>
            </div>
            ${email ? `
            <div>
              <div class="field-label">Email Address</div>
              <div class="field-value">${email}</div>
            </div>` : ''}
            <div>
              <div class="field-label">Issued Date</div>
              <div class="field-value">${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
            </div>
          </div>

          <div class="section-title">Appointment Schedule</div>
          <div class="grid">
            <div>
              <div class="field-label">Service Selected</div>
              <div class="field-value" style="color: #30452F; font-size: 15px;">${service}</div>
            </div>
            <div>
              <div class="field-label">Date & Scheduled Time</div>
              <div class="field-value">${date} at ${time}</div>
            </div>
            <div>
              <div class="field-label">Lounge Branch</div>
              <div class="field-value">${location}</div>
              ${address ? `<div style="font-size: 11px; color: #777;">${address}</div>` : ''}
            </div>
            <div>
              <div class="field-label">Queue Priority</div>
              <div class="field-value" style="color: #936B2B;">VIP Priority Chair</div>
            </div>
          </div>

          <div class="privileges">
            <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #30452F; margin-bottom: 6px;">Included Concierge Privileges:</div>
            <ul>
              <li>✓ Complimentary 1-on-1 Hair & Scalp Texture Diagnosis</li>
              <li>✓ Purifying Botanical Scalp Cleanse & Warm Towel Service</li>
              <li>✓ Artisan Welcome Refreshment upon arrival</li>
            </ul>
          </div>

          ${notes ? `
          <div style="font-size: 11px; color: #555; background: #fff; padding: 10px 14px; border-radius: 8px; border: 1px solid #eee; margin-bottom: 20px;">
            <strong>Special Requests:</strong> ${notes}
          </div>` : ''}

          <div class="footer">
            <div>Please present this pass or reference number at salon reception.</div>
            <div>Central Concierge Desk: +91 91500 22115 &nbsp;|&nbsp; www.zayro.in</div>
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
