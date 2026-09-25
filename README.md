# HTML Template Viewer & Doc Studio 📄✉️

A modern, fast, and interactive Next.js application for designing, testing, and previewing dynamic HTML email templates and printable A4 documents with real-time data injection.

---

## ✨ Features

- **Multi-Device & Print Previews**:
  - 📧 **Email Client Preview**: Test responsive newsletter and transactional email designs.
  - 📄 **A4 Document Preview**: Pixel-perfect view simulated for standard printable paper formats (invoices, receipts, certificates, letters).
  - 📱 **Mobile Device Preview**: Interactive mobile viewport with realistic device bezel framing.
- **Dynamic Data Injection**:
  - **Live JSON Editor**: Input and test dynamic variables using Mustache / Handlebars style syntax (`{{variable}}`, `{{#each items}}...{{/each}}`, `{{#if condition}}...{{/if}}`).
  - **Form Data Mode**: Visual interactive form generated directly from payload fields for quick data edits.
- **HTML & Template Editor**:
  - Integrated code editing with syntax assistance, template switching, and quick reset.
  - Built-in sample templates (Transactional Invoices, Welcome Onboarding, Order Confirmations, Delivery Summaries).
- **Print & PDF Export**:
  - One-click browser print dialog triggering native clean paper print styles.
  - Built-in PDF configuration preview modal with margin and orientation options.

---

## 🗂️ Project Structure

```text
html-template-viewer/
├── app/
│   ├── layout.jsx            # Next.js root layout with font imports & metadata
│   ├── page.jsx              # Main interactive workspace and state orchestrator
│   └── styles/               # SCSS modules & design tokens
│       ├── _variables.scss   # Global color schemes, shadows, and spacing tokens
│       ├── _mixins.scss      # Reusable responsive and flexbox mixins
│       ├── globals.scss      # CSS reset and base styling
│       ├── Workspace.module.scss
│       ├── Navbar.module.scss
│       ├── Toolbar.module.scss
│       ├── Editor.module.scss
│       ├── Preview.module.scss
│       └── Modal.module.scss
├── components/               # Modular UI components
│   ├── Navbar.jsx            # Top navigation and template selector
│   ├── Toolbar.jsx           # Action toolbar (zoom, format, copy, print)
│   ├── HtmlEditor.jsx        # Raw HTML code editor
│   ├── DataEditor.jsx        # Wrapper for JSON and Form views
│   ├── JsonEditor.jsx        # JSON payload editor with validation
│   ├── FormEditor.jsx        # Auto-generated form fields editor
│   ├── PreviewContainer.jsx  # Viewport controller
│   ├── DocumentPreview.jsx   # A4 paper preview renderer
│   ├── EmailPreview.jsx      # Email client simulation iframe
│   ├── MobilePreview.jsx     # Mobile viewport wrapper
│   └── PrintModal.jsx        # Print / PDF preview modal
├── utils/                    # Core utilities and engines
│   ├── formatters.js         # HTML & JSON code formatters
│   ├── printDocument.js      # Isolated iframe printing helper
│   ├── sampleTemplates.js    # Built-in industry template presets
│   ├── templateEngine.js     # Fast token replacement & loop/conditional engine
│   └── validateJson.js       # JSON parser with friendly error reporting
├── next.config.mjs           # Next.js build configuration
├── package.json              # Project dependencies and scripts
└── .gitignore                # Git ignore rules for node_modules and builds
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.17.0 or higher
- **npm**, **yarn**, or **pnpm**

### Installation

1. Navigate to the repository directory:
   ```bash
   cd html-template-viewer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```

---

## 📦 Deployment Guide

### Deploying to Vercel (Recommended)

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete html template viewer application"
   git branch -M main
   git push -u origin main
   ```
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository (`html-template-viewer`).
4. Framework Preset will automatically detect **Next.js**.
5. Click **Deploy**.

### Deploying with Vercel CLI
```bash
npm install -g vercel
vercel
```

### Deploying to Netlify / Other Hosts
1. Build the production output:
   ```bash
   npm run build
   ```
2. Run the production server:
   ```bash
   npm run start
   ```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI & State**: React 18
- **Icons**: Lucide React
- **Styling**: SCSS Modules
