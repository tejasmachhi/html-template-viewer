/**
 * Sample Templates & Corresponding Mock Data
 * Apple-inspired sleek, modern templates & clean typography
 */

export const SAMPLE_TEMPLATES = [
  {
    id: 'apple-store-receipt',
    name: 'Apple Store Order Receipt',
    category: 'Email',
    description: 'Minimalist Apple Store order & delivery confirmation with product breakdowns and Apple Pay payment.',
    data: {
      companyName: 'Apple Store',
      companyUrl: 'https://www.apple.com/in',
      supportPhone: '000800 040 1966',
      customerName: 'Tejas Machhi',
      customerEmail: 'tejas.machhi@icloud.com',
      orderNumber: 'W109842104',
      date: '25 September 2026',
      paymentMethod: 'Apple Pay (Mastercard ending in 4092)',
      shippingAddress: 'Apple Bandra, Maker Maxity, Bandra Kurla Complex, Mumbai, MH 400051',
      deliveryEstimate: 'Tomorrow, 26 Sep by 10:30 AM',
      items: [
        { 
          name: 'iPhone 16 Pro Max 256GB - Natural Titanium', 
          sku: 'MYWV3HN/A', 
          qty: 1, 
          price: '1,44,900' 
        },
        { 
          name: 'Apple Watch Ultra 2 (GPS + Cellular) 49mm Titanium Case with Dark Gray Trail Loop', 
          sku: 'MX4A3HN/A', 
          qty: 1, 
          price: '89,900' 
        },
        { 
          name: 'AirPods Pro 2 with USB-C MagSafe Case (Active Noise Cancellation)', 
          sku: 'MTJV3HN/A', 
          qty: 1, 
          price: '24,900' 
        }
      ],
      subtotal: '2,59,700',
      shippingFee: 'Free Express Shipping',
      tax: '39,615',
      total: '2,59,700'
    },
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Apple Order {{orderNumber}}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f5f5f7;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Icons', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #1d1d1f;
      -webkit-font-smoothing: antialiased;
    }
    .email-container {
      max-width: 620px;
      margin: 32px auto;
      background: #ffffff;
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
      border: 1px solid #e5e5ea;
    }
    .header-bar {
      padding: 36px 36px 20px;
      text-align: center;
      border-bottom: 1px solid #f2f2f5;
    }
    .apple-logo {
      display: inline-block;
      margin-bottom: 12px;
    }
    .header-bar h1 {
      margin: 8px 0 4px 0;
      font-size: 26px;
      font-weight: 700;
      letter-spacing: -0.6px;
      color: #1d1d1f;
    }
    .header-bar p {
      margin: 0;
      font-size: 14px;
      color: #86868b;
    }
    .order-status-banner {
      background: #fbfbfd;
      margin: 24px 36px 0;
      padding: 16px 20px;
      border-radius: 12px;
      border: 1px solid #e5e5ea;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .status-badge {
      display: inline-block;
      background: #0071e3;
      color: #ffffff;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.3px;
    }
    .delivery-eta {
      font-size: 13px;
      font-weight: 600;
      color: #1d1d1f;
      text-align: right;
    }
    .content-body {
      padding: 24px 36px 36px;
    }
    .info-grid {
      display: table;
      width: 100%;
      margin-bottom: 28px;
      border-collapse: separate;
      border-spacing: 0;
    }
    .info-cell {
      display: table-cell;
      width: 50%;
      vertical-align: top;
      padding-right: 14px;
    }
    .label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: #86868b;
      margin-bottom: 6px;
    }
    .value {
      font-size: 13px;
      line-height: 1.5;
      color: #1d1d1f;
      font-weight: 500;
    }
    .divider {
      height: 1px;
      background-color: #e5e5ea;
      margin: 24px 0;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    .items-table th {
      text-align: left;
      font-size: 11px;
      font-weight: 600;
      color: #86868b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding-bottom: 12px;
      border-bottom: 1px solid #e5e5ea;
    }
    .items-table td {
      padding: 16px 0;
      border-bottom: 1px solid #f2f2f5;
      vertical-align: middle;
      font-size: 13px;
    }
    .product-title {
      font-weight: 600;
      color: #1d1d1f;
      font-size: 14px;
      margin-bottom: 3px;
    }
    .product-sku {
      font-size: 12px;
      color: #86868b;
      font-family: -apple-system, monospace;
    }
    .text-right {
      text-align: right;
    }
    .summary-section {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      margin-top: 10px;
    }
    .summary-card {
      width: 100%;
      max-width: 290px;
    }
    .summary-line {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: #6e6e73;
      margin-bottom: 8px;
    }
    .summary-line.total {
      border-top: 1px solid #1d1d1f;
      padding-top: 12px;
      margin-top: 12px;
      font-size: 17px;
      font-weight: 700;
      color: #1d1d1f;
    }
    .btn-track {
      display: block;
      text-align: center;
      background: #0071e3;
      color: #ffffff !important;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      padding: 14px 28px;
      border-radius: 980px;
      margin: 28px 0 8px;
      transition: background 0.2s;
    }
    .footer-bar {
      background: #fbfbfd;
      padding: 28px 36px;
      border-top: 1px solid #e5e5ea;
      text-align: center;
      font-size: 11px;
      line-height: 1.7;
      color: #86868b;
    }
    .footer-bar a {
      color: #0071e3;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header-bar">
      <div class="apple-logo">
        <svg width="28" height="34" viewBox="0 0 170 170" fill="#1d1d1f">
          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-6.42-9.78-11.45-20.93-15.09-33.45-3.63-12.52-5.46-24.16-5.46-34.92 0-14.67 3.75-26.68 11.24-36.03 7.5-9.35 16.94-14.15 28.34-14.4 5.34.13 10.66 1.48 15.96 4.07 5.3 2.59 9.07 3.93 11.3 4.02 2.01-.1 5.86-1.5 11.55-4.21 5.69-2.71 10.9-3.99 15.64-3.83 14.07.74 24.89 5.86 32.46 15.37-12.39 7.48-18.42 17.65-18.09 30.51.33 10.15 4.3 18.57 11.91 25.26 5.69 5.03 12.39 8.24 20.1 9.64-2.83 8.35-6.45 16.96-10.87 25.82zM119.22 33.15c0-7.39 2.76-14.54 8.28-21.46 5.52-6.92 12.39-11.35 20.61-13.29.21 1.7.32 3.17.32 4.41 0 7.39-2.87 14.54-8.61 21.46-5.74 6.92-12.8 11.13-21.18 12.63-.43-1.28-.64-2.48-.64-3.75z"/>
        </svg>
      </div>
      <h1>Thank you for your order.</h1>
      <p>Order number: <strong style="color: #1d1d1f;">{{orderNumber}}</strong> • Placed on {{date}}</p>
    </div>

    <div class="order-status-banner">
      <div>
        <span class="status-badge">PREPARING TO SHIP</span>
        <div style="font-size: 12px; color: #86868b; margin-top: 4px;">Carrier: Apple Express Logistics</div>
      </div>
      <div class="delivery-eta">
        <div>Estimated Delivery</div>
        <div style="color: #0071e3; font-size: 14px;">{{deliveryEstimate}}</div>
      </div>
    </div>

    <div class="content-body">
      <div class="info-grid">
        <div class="info-cell">
          <div class="label">Delivers To</div>
          <div class="value">{{customerName}}</div>
          <div class="value" style="color: #6e6e73;">{{shippingAddress}}</div>
        </div>
        <div class="info-cell">
          <div class="label">Payment Method</div>
          <div class="value">{{paymentMethod}}</div>
          <div class="value" style="color: #6e6e73;">Billed to {{customerEmail}}</div>
        </div>
      </div>

      <div class="divider"></div>

      <table class="items-table">
        <thead>
          <tr>
            <th>Product Description</th>
            <th class="text-right" style="width: 50px;">Qty</th>
            <th class="text-right" style="width: 110px;">Price</th>
          </tr>
        </thead>
        <tbody>
          {{#each items}}
          <tr>
            <td>
              <div class="product-title">{{name}}</div>
              <div class="product-sku">Part No: {{sku}}</div>
            </td>
            <td class="text-right" style="font-weight: 500;">{{qty}}</td>
            <td class="text-right" style="font-weight: 600; color: #1d1d1f;">₹{{price}}</td>
          </tr>
          {{/each}}
        </tbody>
      </table>

      <div class="summary-section">
        <div class="summary-card">
          <div class="summary-line">
            <span>Subtotal</span>
            <span>₹{{subtotal}}</span>
          </div>
          <div class="summary-line">
            <span>Shipping</span>
            <span style="color: #28cd41; font-weight: 600;">{{shippingFee}}</span>
          </div>
          <div class="summary-line">
            <span>Includes GST (18%)</span>
            <span>₹{{tax}}</span>
          </div>
          <div class="summary-line total">
            <span>Total</span>
            <span>₹{{total}}</span>
          </div>
        </div>
      </div>

      <a href="{{companyUrl}}" class="btn-track">Track Your Order in Apple Store App →</a>
    </div>

    <div class="footer-bar">
      Need assistance? Call Apple Support at {{supportPhone}} or visit <a href="{{companyUrl}}">apple.com/support</a>.<br>
      Apple India Private Limited • UB City, Bengaluru 560001 • CIN: U30007KA1996PTC019630<br>
      © 2026 Apple Inc. All rights reserved. | <a href="#">Privacy Policy</a> | <a href="#">Sales Policy</a>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'apple-tax-invoice',
    name: 'Apple Official Tax Invoice (A4)',
    category: 'Document',
    description: 'Apple India official printable A4 GST tax invoice with serial numbers, AppleCare+, and tax breakdown.',
    data: {
      companyName: 'Apple India Private Limited',
      companyAddress: '19th Floor, Concorde Tower C, UB City, 24 Vittal Mallya Road, Bengaluru 560001 Karnataka, India',
      companyGst: '29AABCA1234F1Z0',
      companyCin: 'U30007KA1996PTC019630',
      invoiceNumber: 'APL-INV-2026-99214',
      invoiceDate: '25 Sep 2026',
      poNumber: 'APL-PO-88412',
      clientName: 'Tejas Machhi',
      clientCompany: 'Tejas Studio Technologies',
      clientAddress: 'Flat 402, Ocean Vista, Linking Road, Bandra West, Mumbai 400050, Maharashtra',
      clientGst: '27ABCDE1234F1Z5',
      clientPan: 'ABCDE1234F',
      items: [
        { 
          name: 'iPhone 16 Pro Max 256GB Natural Titanium (Serial: H7K92X41L, IMEI: 359128092819201)', 
          hsn: '85171300', 
          hours: '1', 
          rate: '1,22,796.61', 
          amount: '1,22,796.61' 
        },
        { 
          name: 'AppleCare+ for iPhone 16 Pro Max (Plan Agreement: 994012849)', 
          hsn: '998713', 
          hours: '1', 
          rate: '17,711.86', 
          amount: '17,711.86' 
        },
        { 
          name: 'Apple 30W USB-C Power Adapter (Model: A2164)', 
          hsn: '85044090', 
          hours: '1', 
          rate: '3,220.34', 
          amount: '3,220.34' 
        }
      ],
      subtotal: '1,43,728.81',
      cgst: '12,935.59',
      sgst: '12,935.59',
      total: '1,69,600.00',
      bankName: 'Citibank N.A. India',
      accountNumber: '030018492019',
      ifscCode: 'CITI0000003',
      notes: 'Supply made from Apple India Distribution Hub. This is a computer-generated tax invoice and requires no physical signature.'
    },
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Tax Invoice - {{invoiceNumber}}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif;
      color: #1d1d1f;
      background: #ffffff;
      font-size: 11.5px;
      line-height: 1.5;
    }
    .document-page {
      width: 100%;
      max-width: 820px;
      margin: 0 auto;
      background: #ffffff;
      padding: 12px;
    }
    .inv-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #1d1d1f;
      padding-bottom: 22px;
      margin-bottom: 24px;
    }
    .apple-brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .apple-brand h1 {
      font-size: 20px;
      font-weight: 700;
      margin: 0 0 2px;
      color: #1d1d1f;
      letter-spacing: -0.5px;
    }
    .apple-brand p {
      margin: 0;
      font-size: 10.5px;
      color: #6e6e73;
      max-width: 380px;
      line-height: 1.4;
    }
    .inv-header-meta {
      text-align: right;
    }
    .inv-type-pill {
      display: inline-block;
      font-size: 18px;
      font-weight: 800;
      color: #0071e3;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }
    .meta-row {
      font-size: 11px;
      color: #6e6e73;
      margin: 2px 0;
    }
    .meta-row strong {
      color: #1d1d1f;
    }
    .party-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
    }
    .party-box {
      background: #fbfbfd;
      border: 1px solid #e5e5ea;
      border-radius: 8px;
      padding: 14px 18px;
    }
    .party-head {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #86868b;
      margin-bottom: 6px;
    }
    .party-name {
      font-size: 13.5px;
      font-weight: 700;
      color: #1d1d1f;
      margin-bottom: 4px;
    }
    .party-desc {
      font-size: 11px;
      color: #48484a;
      line-height: 1.5;
    }
    .tax-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    .tax-table th {
      background: #1d1d1f;
      color: #ffffff;
      padding: 9px 12px;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      text-align: left;
    }
    .tax-table td {
      padding: 12px;
      border-bottom: 1px solid #e5e5ea;
      font-size: 11px;
      color: #1d1d1f;
    }
    .tax-table tr:nth-child(even) td {
      background: #fafafa;
    }
    .text-right {
      text-align: right;
    }
    .totals-area {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 20px;
      margin-top: 10px;
    }
    .payment-note-card {
      background: #fbfbfd;
      border: 1px dashed #d2d2d7;
      border-radius: 8px;
      padding: 14px 18px;
      font-size: 11px;
      color: #48484a;
    }
    .payment-note-card strong {
      color: #1d1d1f;
    }
    .calculation-box {
      border: 1px solid #e5e5ea;
      border-radius: 8px;
      padding: 14px 18px;
      background: #ffffff;
    }
    .calc-item {
      display: flex;
      justify-content: space-between;
      font-size: 11.5px;
      color: #6e6e73;
      margin-bottom: 6px;
    }
    .calc-item.grand-total {
      border-top: 2px solid #1d1d1f;
      padding-top: 10px;
      margin-top: 10px;
      font-size: 15px;
      font-weight: 800;
      color: #1d1d1f;
    }
    .signature-area {
      margin-top: 36px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .auth-badge {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 10.5px;
      color: #86868b;
    }
    .sign-container {
      width: 210px;
      text-align: center;
      border-top: 1px solid #86868b;
      padding-top: 6px;
      font-size: 11px;
      color: #6e6e73;
    }
    .sign-container strong {
      color: #1d1d1f;
    }
  </style>
</head>
<body>
  <div class="document-page">
    <div class="inv-top-bar">
      <div>
        <div class="apple-brand">
          <svg width="22" height="26" viewBox="0 0 170 170" fill="#1d1d1f">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-6.42-9.78-11.45-20.93-15.09-33.45-3.63-12.52-5.46-24.16-5.46-34.92 0-14.67 3.75-26.68 11.24-36.03 7.5-9.35 16.94-14.15 28.34-14.4 5.34.13 10.66 1.48 15.96 4.07 5.3 2.59 9.07 3.93 11.3 4.02 2.01-.1 5.86-1.5 11.55-4.21 5.69-2.71 10.9-3.99 15.64-3.83 14.07.74 24.89 5.86 32.46 15.37-12.39 7.48-18.42 17.65-18.09 30.51.33 10.15 4.3 18.57 11.91 25.26 5.69 5.03 12.39 8.24 20.1 9.64-2.83 8.35-6.45 16.96-10.87 25.82zM119.22 33.15c0-7.39 2.76-14.54 8.28-21.46 5.52-6.92 12.39-11.35 20.61-13.29.21 1.7.32 3.17.32 4.41 0 7.39-2.87 14.54-8.61 21.46-5.74 6.92-12.8 11.13-21.18 12.63-.43-1.28-.64-2.48-.64-3.75z"/>
          </svg>
          <div>
            <h1>{{companyName}}</h1>
          </div>
        </div>
        <p style="margin-top: 6px; font-size: 10.5px; color: #6e6e73;">
          {{companyAddress}}<br>
          <strong>GSTIN:</strong> {{companyGst}} • <strong>CIN:</strong> {{companyCin}}
        </p>
      </div>

      <div class="inv-header-meta">
        <div class="inv-type-pill">TAX INVOICE</div>
        <div class="meta-row">Invoice No: <strong>{{invoiceNumber}}</strong></div>
        <div class="meta-row">Invoice Date: <strong>{{invoiceDate}}</strong></div>
        <div class="meta-row">Purchase Order: <strong>{{poNumber}}</strong></div>
      </div>
    </div>

    <div class="party-grid">
      <div class="party-box">
        <div class="party-head">Billed To (Customer Details)</div>
        <div class="party-name">{{clientCompany}}</div>
        <div class="party-desc">
          Attn: <strong>{{clientName}}</strong><br>
          {{clientAddress}}<br>
          <strong>GSTIN:</strong> {{clientGst}} | <strong>PAN:</strong> {{clientPan}}
        </div>
      </div>

      <div class="party-box">
        <div class="party-head">Delivery & Supply Details</div>
        <div class="party-name" style="color: #0071e3;">Official Apple India Fulfillment</div>
        <div class="party-desc">
          State of Supply: <strong>Maharashtra (Code 27)</strong><br>
          Original Serialized Apple Hardware<br>
          Warranty: <strong>Apple 1-Year Limited + AppleCare+ Active</strong>
        </div>
      </div>
    </div>

    <table class="tax-table">
      <thead>
        <tr>
          <th>Description of Goods / Hardware</th>
          <th>HSN Code</th>
          <th class="text-right" style="width: 45px;">Qty</th>
          <th class="text-right" style="width: 100px;">Rate (₹)</th>
          <th class="text-right" style="width: 110px;">Taxable Value (₹)</th>
        </tr>
      </thead>
      <tbody>
        {{#each items}}
        <tr>
          <td>
            <strong>{{name}}</strong>
          </td>
          <td>{{hsn}}</td>
          <td class="text-right">{{hours}}</td>
          <td class="text-right">{{rate}}</td>
          <td class="text-right" style="font-weight: 600;">₹{{amount}}</td>
        </tr>
        {{/each}}
      </tbody>
    </table>

    <div class="totals-area">
      <div class="payment-note-card">
        <div style="font-weight: 700; color: #1d1d1f; margin-bottom: 6px; font-size: 11px;">Payment & Statutory Details:</div>
        <div>Bank Name: <strong>{{bankName}}</strong></div>
        <div>Virtual Account: <strong>{{accountNumber}}</strong></div>
        <div>IFSC Code: <strong>{{ifscCode}}</strong></div>
        <div style="margin-top: 8px; font-size: 10px; color: #86868b;">{{notes}}</div>
      </div>

      <div class="calculation-box">
        <div class="calc-item">
          <span>Total Taxable Amount</span>
          <span>₹{{subtotal}}</span>
        </div>
        <div class="calc-item">
          <span>CGST (9.00%)</span>
          <span>₹{{cgst}}</span>
        </div>
        <div class="calc-item">
          <span>SGST (9.00%)</span>
          <span>₹{{sgst}}</span>
        </div>
        <div class="calc-item grand-total">
          <span>Total Invoice Amount</span>
          <span style="color: #0071e3;">₹{{total}}</span>
        </div>
      </div>
    </div>

    <div class="signature-area">
      <div class="auth-badge">
        <span>Verified E-Invoice • QR Authenticated under GST Rules</span>
      </div>
      <div class="sign-container">
        Digitally Signed by<br>
        <strong>For {{companyName}}</strong><br>
        Authorized Signatory
      </div>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'apple-keynote-pass',
    name: 'Apple Keynote VIP Pass (A4)',
    category: 'Document',
    description: 'Apple Special Event Keynote pass with Steve Jobs Theater reservation, badge QR, and security clearances.',
    data: {
      eventName: 'Apple Special Event',
      eventSubtitle: "It's Glowtime • Special Keynote Presentation",
      passNumber: 'APL-VIP-0925-88',
      attendeeName: 'Tejas Machhi',
      attendeeAffiliation: 'Lead Engineering & Architecture Studio',
      attendeeEmail: 'tejas.machhi@icloud.com',
      dateTime: 'Friday, September 25, 2026 • 10:00 AM PDT',
      location: 'Steve Jobs Theater, Apple Park',
      address: 'One Apple Park Way, Cupertino, CA 95014',
      seatRow: 'Section A • Row 03 • Seat 14 (VIP Press & Engineering)',
      accessTier: 'ALL ACCESS VIP CREDENTIAL',
      badgeNote: 'Please present this digital credential or printed A4 document with government-issued photo ID at the Apple Park Visitor Center security checkpoint.'
    },
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>{{eventName}} - VIP Pass</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif;
      background: #000000;
      color: #ffffff;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .badge-container {
      max-width: 600px;
      margin: 20px auto;
      background: #111113;
      border-radius: 24px;
      border: 1px solid #2c2c2e;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
    }
    .badge-hero {
      background: linear-gradient(180deg, #1c1c1e 0%, #111113 100%);
      padding: 44px 36px 30px;
      text-align: center;
      border-bottom: 1px solid #2c2c2e;
      position: relative;
    }
    .event-pill {
      display: inline-block;
      background: linear-gradient(90deg, #2997ff, #a259ff);
      color: #ffffff;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 14px;
      border-radius: 30px;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    .badge-hero h1 {
      margin: 0 0 8px;
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -0.8px;
      color: #ffffff;
    }
    .badge-hero p {
      margin: 0;
      font-size: 15px;
      color: #86868b;
    }
    .badge-body {
      padding: 36px 36px;
    }
    .attendee-card {
      background: #1c1c1e;
      border: 1px solid #3a3a3c;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
      text-align: center;
    }
    .attendee-name {
      font-size: 26px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.5px;
      margin-bottom: 4px;
    }
    .attendee-sub {
      font-size: 13px;
      color: #2997ff;
      font-weight: 500;
      margin-bottom: 8px;
    }
    .attendee-email {
      font-size: 12px;
      color: #86868b;
      font-family: -apple-system, monospace;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }
    .meta-box {
      background: #1c1c1e;
      border-radius: 12px;
      padding: 14px 16px;
      border: 1px solid #2c2c2e;
    }
    .meta-title {
      font-size: 10px;
      color: #86868b;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 4px;
      font-weight: 700;
    }
    .meta-val {
      font-size: 13px;
      font-weight: 600;
      color: #f5f5f7;
    }
    .security-notice {
      background: rgba(41, 151, 255, 0.1);
      border: 1px solid rgba(41, 151, 255, 0.3);
      border-radius: 12px;
      padding: 14px 18px;
      font-size: 12px;
      color: #2997ff;
      line-height: 1.5;
      margin-bottom: 24px;
    }
    .barcode-section {
      text-align: center;
      padding-top: 10px;
      border-top: 1px solid #2c2c2e;
    }
    .pass-code {
      font-size: 18px;
      font-weight: 800;
      letter-spacing: 4px;
      color: #ffffff;
      font-family: -apple-system, monospace;
      margin-top: 8px;
    }
  </style>
</head>
<body>
  <div class="badge-container">
    <div class="badge-hero">
      <div class="event-pill">{{accessTier}}</div>
      <h1>{{eventName}}</h1>
      <p>{{eventSubtitle}}</p>
    </div>

    <div class="badge-body">
      <div class="attendee-card">
        <div class="attendee-name">{{attendeeName}}</div>
        <div class="attendee-sub">{{attendeeAffiliation}}</div>
        <div class="attendee-email">{{attendeeEmail}}</div>
      </div>

      <div class="meta-grid">
        <div class="meta-box">
          <div class="meta-title">Date & Time</div>
          <div class="meta-val">{{dateTime}}</div>
        </div>
        <div class="meta-box">
          <div class="meta-title">Auditorium Venue</div>
          <div class="meta-val">{{location}}</div>
        </div>
        <div class="meta-box">
          <div class="meta-title">Assigned Seating</div>
          <div class="meta-val" style="color: #2997ff;">{{seatRow}}</div>
        </div>
        <div class="meta-box">
          <div class="meta-title">Campus Address</div>
          <div class="meta-val">{{address}}</div>
        </div>
      </div>

      <div class="security-notice">
        ℹ️ {{badgeNote}}
      </div>

      <div class="barcode-section">
        <div style="font-size: 11px; color: #86868b; text-transform: uppercase; letter-spacing: 1px;">Digital Check-in ID</div>
        <div class="pass-code">{{passNumber}}</div>
      </div>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'apple-icloud-subscription',
    name: 'Apple Services & iCloud+ Receipt',
    category: 'Email',
    description: 'Clean Apple Media Services subscription renewal receipt for Apple One & iCloud+ with Manage Subscription link.',
    data: {
      customerName: 'Tejas',
      appleId: 'tejas.machhi@icloud.com',
      subscriptionName: 'Apple One Premier Plan',
      features: 'iCloud+ 2TB, Apple Music Family, Apple TV+, Apple Arcade, Apple Fitness+',
      billingDate: '25 September 2026',
      nextBillingDate: '25 October 2026',
      billedTo: 'Mastercard ending in 4092',
      monthlyCost: '365.00',
      orderId: 'MKY492L019P',
      documentNumber: '194029104829'
    },
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Your receipt from Apple</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f5f5f7;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif;
      color: #1d1d1f;
    }
    .wrapper {
      max-width: 600px;
      margin: 32px auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      border: 1px solid #e5e5ea;
    }
    .receipt-header {
      padding: 36px 36px 20px;
      text-align: center;
    }
    .receipt-header h1 {
      margin: 12px 0 4px;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .receipt-header p {
      margin: 0;
      font-size: 13px;
      color: #86868b;
    }
    .receipt-body {
      padding: 20px 36px 36px;
    }
    .meta-table {
      width: 100%;
      border-bottom: 1px solid #e5e5ea;
      padding-bottom: 18px;
      margin-bottom: 24px;
    }
    .meta-table td {
      font-size: 12px;
      color: #6e6e73;
      padding: 3px 0;
    }
    .meta-table td strong {
      color: #1d1d1f;
    }
    .service-card {
      background: #fbfbfd;
      border: 1px solid #e5e5ea;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .service-info h2 {
      margin: 0 0 4px;
      font-size: 16px;
      font-weight: 700;
      color: #1d1d1f;
    }
    .service-info p {
      margin: 0;
      font-size: 12.5px;
      color: #86868b;
      max-width: 380px;
    }
    .service-price {
      font-size: 18px;
      font-weight: 700;
      color: #1d1d1f;
      text-align: right;
    }
    .service-price span {
      font-size: 11px;
      color: #86868b;
      font-weight: normal;
      display: block;
    }
    .btn-manage {
      display: inline-block;
      background: #0071e3;
      color: #ffffff !important;
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      padding: 10px 20px;
      border-radius: 20px;
      margin-top: 10px;
    }
    .receipt-footer {
      background: #fbfbfd;
      padding: 24px 36px;
      border-top: 1px solid #e5e5ea;
      text-align: center;
      font-size: 11px;
      color: #86868b;
      line-height: 1.6;
    }
    .receipt-footer a {
      color: #0071e3;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="receipt-header">
      <svg width="24" height="28" viewBox="0 0 170 170" fill="#1d1d1f">
        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-6.42-9.78-11.45-20.93-15.09-33.45-3.63-12.52-5.46-24.16-5.46-34.92 0-14.67 3.75-26.68 11.24-36.03 7.5-9.35 16.94-14.15 28.34-14.4 5.34.13 10.66 1.48 15.96 4.07 5.3 2.59 9.07 3.93 11.3 4.02 2.01-.1 5.86-1.5 11.55-4.21 5.69-2.71 10.9-3.99 15.64-3.83 14.07.74 24.89 5.86 32.46 15.37-12.39 7.48-18.42 17.65-18.09 30.51.33 10.15 4.3 18.57 11.91 25.26 5.69 5.03 12.39 8.24 20.1 9.64-2.83 8.35-6.45 16.96-10.87 25.82zM119.22 33.15c0-7.39 2.76-14.54 8.28-21.46 5.52-6.92 12.39-11.35 20.61-13.29.21 1.7.32 3.17.32 4.41 0 7.39-2.87 14.54-8.61 21.46-5.74 6.92-12.8 11.13-21.18 12.63-.43-1.28-.64-2.48-.64-3.75z"/>
      </svg>
      <h1>Your receipt from Apple</h1>
      <p>Apple ID: <strong>{{appleId}}</strong></p>
    </div>

    <div class="receipt-body">
      <table class="meta-table">
        <tr>
          <td>Order ID: <strong>{{orderId}}</strong></td>
          <td style="text-align: right;">Billed To: <strong>{{billedTo}}</strong></td>
        </tr>
        <tr>
          <td>Document No: <strong>{{documentNumber}}</strong></td>
          <td style="text-align: right;">Date: <strong>{{billingDate}}</strong></td>
        </tr>
      </table>

      <div class="service-card">
        <div class="service-info">
          <h2>{{subscriptionName}}</h2>
          <p>{{features}}</p>
          <div style="font-size: 11px; color: #28cd41; font-weight: 600; margin-top: 6px;">Next automatic renewal: {{nextBillingDate}}</div>
        </div>
        <div class="service-price">
          ₹{{monthlyCost}}
          <span>per month</span>
        </div>
      </div>

      <div style="text-align: center;">
        <a href="https://appleid.apple.com" class="btn-manage">Manage Subscriptions →</a>
      </div>
    </div>

    <div class="receipt-footer">
      To cancel subscription or view purchase history, visit <a href="https://reportaproblem.apple.com">reportaproblem.apple.com</a>.<br>
      Apple Distribution International Ltd. • Hollyhill Industrial Estate, Cork, Ireland.<br>
      © 2026 Apple Inc. All rights reserved.
    </div>
  </div>
</body>
</html>`
  }
];
