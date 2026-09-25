/**
 * Sample Templates & Corresponding Mock Data
 */

export const SAMPLE_TEMPLATES = [
  {
    id: 'order-confirmation',
    name: 'Order Confirmation Email',
    category: 'Email',
    description: 'Clean e-commerce order receipt optimized for 600px email clients and PDF print.',
    data: {
      companyName: 'Apex Commerce Inc.',
      companyEmail: 'support@apexcommerce.com',
      companyPhone: '+91 (022) 8800-4321',
      customerName: 'Tejas Machhi',
      customerEmail: 'tejas@example.com',
      orderNumber: 'ORD-1024',
      date: '24 September 2026',
      paymentMethod: 'UPI / Credit Card (ending in 8842)',
      shippingAddress: '402 Sunrise Heights, Linking Road, Mumbai 400050',
      items: [
        { name: 'Ergonomic Mechanical Keyboard', sku: 'KB-PRO-RGB', qty: 1, price: '4,500' },
        { name: 'Precision Wireless Gaming Mouse', sku: 'MS-ULTRA-WL', qty: 1, price: '2,200' },
        { name: 'Ultra-wide Desk Mat (900x400mm)', sku: 'MAT-XL-GRY', qty: 2, price: '800' }
      ],
      subtotal: '7,500',
      shippingFee: 'Free',
      tax: '1,350',
      total: '8,850'
    },
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - {{orderNumber}}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #333333;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
    }
    .header {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #ffffff;
      padding: 32px 30px;
      text-align: left;
    }
    .header h1 {
      margin: 0 0 6px 0;
      font-size: 24px;
      letter-spacing: -0.5px;
      color: #10b981;
    }
    .header p {
      margin: 0;
      font-size: 14px;
      color: #94a3b8;
    }
    .content {
      padding: 30px;
    }
    .greeting {
      font-size: 18px;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 8px;
    }
    .subtext {
      font-size: 14px;
      line-height: 1.6;
      color: #64748b;
      margin-bottom: 24px;
    }
    .order-info-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 16px 20px;
      margin-bottom: 24px;
      display: table;
      width: 100%;
      box-sizing: border-box;
    }
    .info-col {
      display: table-cell;
      width: 50%;
      vertical-align: top;
      font-size: 13px;
    }
    .info-label {
      color: #64748b;
      text-transform: uppercase;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .info-value {
      color: #0f172a;
      font-weight: 600;
      line-height: 1.4;
    }
    .table-wrapper {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    .table-wrapper th {
      background: #f1f5f9;
      color: #475569;
      font-size: 12px;
      font-weight: 700;
      text-align: left;
      padding: 10px 12px;
      border-bottom: 2px solid #e2e8f0;
      text-transform: uppercase;
    }
    .table-wrapper td {
      padding: 12px;
      font-size: 13px;
      border-bottom: 1px solid #f1f5f9;
      color: #334155;
    }
    .table-wrapper tr:last-child td {
      border-bottom: none;
    }
    .text-right {
      text-align: right;
    }
    .summary-card {
      background: #f8fafc;
      border-radius: 6px;
      padding: 16px 20px;
      margin-left: auto;
      max-width: 260px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: #64748b;
      margin-bottom: 8px;
    }
    .summary-row.total {
      border-top: 1px solid #cbd5e1;
      padding-top: 10px;
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 0;
    }
    .footer {
      background: #f8fafc;
      padding: 24px 30px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>{{companyName}}</h1>
      <p>Order Confirmation & Tax Invoice</p>
    </div>

    <div class="content">
      <div class="greeting">Hello {{customerName}},</div>
      <div class="subtext">
        Thank you for your order! We are packing your items and will notify you as soon as they ship.
      </div>

      <div class="order-info-card">
        <div class="info-col">
          <div class="info-label">Order Details</div>
          <div class="info-value">Order #{{orderNumber}}</div>
          <div class="info-value">{{date}}</div>
          <div class="info-value">{{paymentMethod}}</div>
        </div>
        <div class="info-col">
          <div class="info-label">Shipping Address</div>
          <div class="info-value">{{customerName}}</div>
          <div class="info-value" style="font-weight: normal; color: #475569;">{{shippingAddress}}</div>
        </div>
      </div>

      <table class="table-wrapper">
        <thead>
          <tr>
            <th>Item</th>
            <th style="width: 50px;" class="text-right">Qty</th>
            <th style="width: 100px;" class="text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          {{#each items}}
          <tr>
            <td>
              <strong style="color: #0f172a;">{{name}}</strong>
              <div style="font-size: 11px; color: #94a3b8;">SKU: {{sku}}</div>
            </td>
            <td class="text-right">{{qty}}</td>
            <td class="text-right" style="font-weight: 600;">₹{{price}}</td>
          </tr>
          {{/each}}
        </tbody>
      </table>

      <div class="summary-card">
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>₹{{subtotal}}</span>
        </div>
        <div class="summary-row">
          <span>Shipping:</span>
          <span style="color: #10b981; font-weight: 600;">{{shippingFee}}</span>
        </div>
        <div class="summary-row">
          <span>Taxes (GST 18%):</span>
          <span>₹{{tax}}</span>
        </div>
        <div class="summary-row total">
          <span>Grand Total:</span>
          <span style="color: #0f172a;">₹{{total}}</span>
        </div>
      </div>
    </div>

    <div class="footer">
      Questions about your order? Reach us at {{companyEmail}} or {{companyPhone}}.<br>
      © 2026 {{companyName}}. All rights reserved.
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'corporate-invoice',
    name: 'Corporate A4 Tax Invoice',
    category: 'Document',
    description: 'Formal corporate invoice formatted with strict A4 print layout, page margins, and tax breakdown.',
    data: {
      companyName: 'Nexis Cloud Solutions Pvt Ltd',
      companyAddress: 'Level 14, Platina Tower, Bandra Kurla Complex, Mumbai 400051',
      companyGst: '27AABCN1234F1Z8',
      invoiceNumber: 'INV-2026-089',
      invoiceDate: '24 Sep 2026',
      dueDate: '08 Oct 2026',
      clientName: 'Tejas Machhi',
      clientCompany: 'TechVentures Studio',
      clientAddress: '401 Trade Avenue, Andheri East, Mumbai 400069',
      clientGst: '27XYZPT9876Q1Z2',
      items: [
        { name: 'Cloud Architecture Consulting (Sprint 1)', hsn: '998313', hours: '40', rate: '2,500', amount: '1,00,000' },
        { name: 'DevOps & CI/CD Pipeline Automation', hsn: '998314', hours: '25', rate: '2,200', amount: '55,000' },
        { name: 'High-Availability Database Clustering', hsn: '998315', hours: '15', rate: '3,000', amount: '45,000' }
      ],
      subtotal: '2,00,000',
      cgst: '18,000',
      sgst: '18,000',
      total: '2,36,000',
      bankName: 'HDFC Bank Ltd',
      accountNumber: '50200012345678',
      ifscCode: 'HDFC0000060',
      notes: 'Payment is due within 14 calendar days of issue. Please mention invoice number in the payment remarks.'
    },
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice - {{invoiceNumber}}</title>
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
      font-family: 'Helvetica Neue', Arial, sans-serif;
      color: #1e293b;
      background: #ffffff;
      font-size: 12px;
      line-height: 1.5;
    }
    .document-page {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      padding: 10px;
    }
    .inv-header {
      display: flex;
      justify-content: space-between;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }
    .inv-brand h1 {
      font-size: 22px;
      color: #0f172a;
      margin: 0 0 6px 0;
      letter-spacing: -0.5px;
    }
    .inv-brand p {
      margin: 2px 0;
      color: #64748b;
      font-size: 11px;
    }
    .inv-meta {
      text-align: right;
    }
    .inv-badge {
      font-size: 22px;
      font-weight: 800;
      color: #10b981;
      margin-bottom: 8px;
    }
    .meta-line {
      font-size: 12px;
      color: #475569;
      margin: 3px 0;
    }
    .meta-line strong {
      color: #0f172a;
    }
    .parties-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 24px;
    }
    .party-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 14px 16px;
    }
    .party-title {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #64748b;
      margin-bottom: 6px;
    }
    .party-name {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 4px;
    }
    .party-text {
      font-size: 11px;
      color: #475569;
      line-height: 1.4;
    }
    .table-invoice {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .table-invoice th {
      background: #0f172a;
      color: #ffffff;
      padding: 10px 12px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      text-align: left;
    }
    .table-invoice td {
      padding: 10px 12px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 11px;
    }
    .table-invoice tr:nth-child(even) td {
      background: #fafafa;
    }
    .text-right {
      text-align: right;
    }
    .bottom-section {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 20px;
      margin-top: 10px;
    }
    .bank-card {
      background: #f8fafc;
      border: 1px dashed #cbd5e1;
      border-radius: 6px;
      padding: 12px 16px;
      font-size: 11px;
    }
    .bank-card strong {
      color: #0f172a;
    }
    .totals-box {
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 12px 16px;
      background: #ffffff;
    }
    .calc-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      font-size: 12px;
      color: #64748b;
    }
    .calc-row.grand {
      border-top: 2px solid #0f172a;
      padding-top: 8px;
      margin-top: 8px;
      font-size: 15px;
      font-weight: 800;
      color: #0f172a;
    }
    .sign-area {
      margin-top: 30px;
      display: flex;
      justify-content: flex-end;
      text-align: center;
    }
    .sign-box {
      width: 200px;
      border-top: 1px solid #94a3b8;
      padding-top: 6px;
      font-size: 11px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="document-page">
    <div class="inv-header">
      <div class="inv-brand">
        <h1>{{companyName}}</h1>
        <p>{{companyAddress}}</p>
        <p><strong>GSTIN:</strong> {{companyGst}}</p>
      </div>
      <div class="inv-meta">
        <div class="inv-badge">TAX INVOICE</div>
        <div class="meta-line">Invoice #: <strong>{{invoiceNumber}}</strong></div>
        <div class="meta-line">Issue Date: <strong>{{invoiceDate}}</strong></div>
        <div class="meta-line">Due Date: <strong>{{dueDate}}</strong></div>
      </div>
    </div>

    <div class="parties-grid">
      <div class="party-card">
        <div class="party-title">Billed To</div>
        <div class="party-name">{{clientCompany}}</div>
        <div class="party-text">Attn: {{clientName}}</div>
        <div class="party-text">{{clientAddress}}</div>
        <div class="party-text" style="margin-top: 4px;"><strong>GSTIN:</strong> {{clientGst}}</div>
      </div>
      <div class="party-card">
        <div class="party-title">Payment Terms & Status</div>
        <div class="party-name" style="color: #10b981;">Net 14 Days (Pending)</div>
        <div class="party-text">Mode: Direct NEFT / RTGS Transfer</div>
        <div class="party-text">{{notes}}</div>
      </div>
    </div>

    <table class="table-invoice">
      <thead>
        <tr>
          <th>Description of Service</th>
          <th>HSN/SAC</th>
          <th class="text-right">Qty/Hours</th>
          <th class="text-right">Rate (₹)</th>
          <th class="text-right">Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        {{#each items}}
        <tr>
          <td><strong>{{name}}</strong></td>
          <td>{{hsn}}</td>
          <td class="text-right">{{hours}}</td>
          <td class="text-right">{{rate}}</td>
          <td class="text-right" style="font-weight: 600;">{{amount}}</td>
        </tr>
        {{/each}}
      </tbody>
    </table>

    <div class="bottom-section">
      <div class="bank-card">
        <div style="font-weight: 700; color: #0f172a; margin-bottom: 6px; font-size: 12px;">Electronic Transfer Details:</div>
        <div>Bank Name: <strong>{{bankName}}</strong></div>
        <div>Account Number: <strong>{{accountNumber}}</strong></div>
        <div>IFSC Code: <strong>{{ifscCode}}</strong></div>
      </div>

      <div class="totals-box">
        <div class="calc-row">
          <span>Subtotal:</span>
          <span>₹{{subtotal}}</span>
        </div>
        <div class="calc-row">
          <span>CGST (9%):</span>
          <span>₹{{cgst}}</span>
        </div>
        <div class="calc-row">
          <span>SGST (9%):</span>
          <span>₹{{sgst}}</span>
        </div>
        <div class="calc-row grand">
          <span>Total Amount:</span>
          <span>₹{{total}}</span>
        </div>
      </div>
    </div>

    <div class="sign-area">
      <div class="sign-box">
        Authorized Signatory<br>
        <strong>{{companyName}}</strong>
      </div>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'customer-welcome',
    name: 'Customer Welcome Email',
    category: 'Email',
    description: 'Vibrant onboarding email with call to action buttons, hero banner, and key features.',
    data: {
      customerName: 'Tejas',
      productName: 'CloudStack Suite',
      supportEmail: 'hello@cloudstack.io',
      loginUrl: 'https://cloudstack.io/dashboard',
      planName: 'Developer Pro'
    },
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to {{productName}}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #f1f5f9;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    .wrapper {
      max-width: 600px;
      margin: 30px auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0,0,0,0.06);
    }
    .hero {
      background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
      padding: 48px 32px;
      text-align: center;
      color: #ffffff;
    }
    .hero h1 {
      margin: 0 0 12px;
      font-size: 28px;
      letter-spacing: -0.5px;
    }
    .hero p {
      margin: 0;
      font-size: 16px;
      opacity: 0.9;
    }
    .body-content {
      padding: 36px 32px;
    }
    .badge {
      display: inline-block;
      background: #e0f2fe;
      color: #0369a1;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 16px;
    }
    .btn-cta {
      display: inline-block;
      background: #10b981;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 14px;
      margin: 24px 0;
    }
    .feature-list {
      border-top: 1px solid #e2e8f0;
      padding-top: 20px;
      margin-top: 20px;
    }
    .feature-item {
      display: flex;
      margin-bottom: 12px;
      font-size: 14px;
      color: #475569;
    }
    .feature-item span {
      color: #10b981;
      font-weight: bold;
      margin-right: 8px;
    }
    .footer {
      background: #f8fafc;
      padding: 20px 32px;
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="hero">
      <h1>Welcome aboard, {{customerName}}! 🚀</h1>
      <p>Your workspace is ready to build and scale with {{productName}}.</p>
    </div>

    <div class="body-content">
      <div class="badge">ACTIVE PLAN: {{planName}}</div>
      <p style="font-size: 15px; color: #334155; line-height: 1.6;">
        We're thrilled to have you with us. With {{productName}}, you can easily render templates, manage document pipelines, and automate workflows effortlessly.
      </p>

      <div style="text-align: center;">
        <a href="{{loginUrl}}" class="btn-cta">Access Your Dashboard →</a>
      </div>

      <div class="feature-list">
        <div style="font-weight: 700; color: #0f172a; margin-bottom: 12px; font-size: 14px;">Next steps to get started:</div>
        <div class="feature-item">
          <span>✔</span> Complete your company profile and billing preferences
        </div>
        <div class="feature-item">
          <span>✔</span> Connect your dynamic data API or import JSON schemas
        </div>
        <div class="feature-item">
          <span>✔</span> Test automated PDF document rendering & print presets
        </div>
      </div>
    </div>

    <div class="footer">
      Need assistance? Reply directly to {{supportEmail}}.<br>
      © 2026 {{productName}} Inc.
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'safety-data-sheet',
    name: 'Technical Safety Data Sheet (A4)',
    category: 'Document',
    description: 'Industrial Chemical Safety Data Sheet formatted for multi-page A4 print.',
    data: {
      chemicalName: 'HYDROCHLORIC ACID 35%',
      casNumber: '7647-01-0',
      unNumber: 'UN 1789',
      manufacturer: 'ChemCorp Industrial Chemicals Ltd',
      emergencyPhone: '+91 (022) 2778-9900',
      revisionDate: '24 September 2026',
      hazardClass: 'Skin Corrosion 1B / Eye Damage 1 / STOT SE 3',
      signalWord: 'DANGER',
      firstAidInhalation: 'Remove victim to fresh air immediately. Seek medical attention.',
      firstAidSkin: 'Wash immediately with abundant water for at least 15 minutes.'
    },
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Safety Data Sheet - {{chemicalName}}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 15mm;
    }
    body {
      font-family: Arial, sans-serif;
      font-size: 11px;
      color: #1e293b;
      margin: 0;
      padding: 0;
      background: #ffffff;
      line-height: 1.4;
    }
    .sds-page {
      max-width: 800px;
      margin: 0 auto;
      padding: 10px;
    }
    .sds-header {
      border-bottom: 3px solid #dc2626;
      padding-bottom: 8px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .sds-title h1 {
      margin: 0 0 4px;
      font-size: 18px;
      color: #991b1b;
    }
    .sds-title h2 {
      margin: 0;
      font-size: 14px;
      color: #0f172a;
    }
    .sds-meta {
      text-align: right;
      font-size: 10px;
      color: #64748b;
    }
    .hazard-banner {
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-left: 6px solid #dc2626;
      padding: 10px 14px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .signal-box {
      background: #dc2626;
      color: #ffffff;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 12px;
      letter-spacing: 1px;
    }
    .sec-header {
      background: #0f172a;
      color: #ffffff;
      padding: 6px 10px;
      font-weight: bold;
      font-size: 11px;
      margin: 14px 0 8px;
      text-transform: uppercase;
    }
    .sds-grid {
      display: grid;
      grid-template-columns: 140px 1fr;
      row-gap: 6px;
      column-gap: 12px;
      margin-bottom: 10px;
    }
    .sds-label {
      font-weight: bold;
      color: #475569;
    }
    .sds-value {
      color: #0f172a;
    }
  </style>
</head>
<body>
  <div class="sds-page">
    <div class="sds-header">
      <div class="sds-title">
        <h1>SAFETY DATA SHEET</h1>
        <h2>{{chemicalName}}</h2>
      </div>
      <div class="sds-meta">
        <div>CAS: <strong>{{casNumber}}</strong></div>
        <div>UN: <strong>{{unNumber}}</strong></div>
        <div>Rev: {{revisionDate}}</div>
      </div>
    </div>

    <div class="hazard-banner">
      <div class="signal-box">{{signalWord}}</div>
      <div>
        <strong>Classification:</strong> {{hazardClass}}<br>
        <span style="color: #64748b; font-size: 10px;">Causes severe skin burns and serious eye damage. May cause respiratory irritation.</span>
      </div>
    </div>

    <div class="sec-header">SECTION 1: Chemical Product & Company Identification</div>
    <div class="sds-grid">
      <div class="sds-label">Product Name:</div>
      <div class="sds-value">{{chemicalName}}</div>
      <div class="sds-label">Manufacturer:</div>
      <div class="sds-value">{{manufacturer}}</div>
      <div class="sds-label">Emergency Tel:</div>
      <div class="sds-value"><strong>{{emergencyPhone}}</strong></div>
    </div>

    <div class="sec-header">SECTION 2: First-Aid Measures</div>
    <div class="sds-grid">
      <div class="sds-label">Inhalation:</div>
      <div class="sds-value">{{firstAidInhalation}}</div>
      <div class="sds-label">Skin Contact:</div>
      <div class="sds-value">{{firstAidSkin}}</div>
    </div>
  </div>
</body>
</html>`
  }
];
