'use client';

import React from 'react';
import { 
  FileText, 
  Mail, 
  Smartphone, 
  Printer, 
  Download, 
  Layers,
  Send,
  Sun,
  Moon
} from 'lucide-react';
import styles from '../app/styles/Navbar.module.scss';

export default function Navbar({
  viewMode,
  onChangeViewMode,
  onTriggerPrint,
  onOpenPdfModal,
  onOpenSendEmailModal,
  theme,
  onToggleTheme
}) {
  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>
        <div className={styles.logoIcon}>
          <Layers size={18} />
        </div>
        <div className={styles.titleArea}>
          <div className={styles.title}>
            Template Lab
            <span className={styles.badge}>Live Studio</span>
          </div>
          <div className={styles.statusIndicator}>
            <span className={styles.dot}></span>
            Document &amp; Email Viewer
          </div>
        </div>
      </div>

      <div className={styles.centerControls}>
        <div className={styles.viewModeToggle}>
          <button
            type="button"
            className={`${styles.viewBtn} ${viewMode === 'email' ? styles.active : ''}`}
            onClick={() => onChangeViewMode('email')}
            title="Email Client View (600-640px centered)"
          >
            <Mail size={14} />
            <span>Email</span>
          </button>

          <button
            type="button"
            className={`${styles.viewBtn} ${viewMode === 'document' ? styles.active : ''}`}
            onClick={() => onChangeViewMode('document')}
            title="A4 Printable Document View (210mm x 297mm)"
          >
            <FileText size={14} />
            <span>A4 Document</span>
          </button>

          <button
            type="button"
            className={`${styles.viewBtn} ${viewMode === 'mobile' ? styles.active : ''}`}
            onClick={() => onChangeViewMode('mobile')}
            title="Mobile Device Preview (375px)"
          >
            <Smartphone size={14} />
            <span>Mobile</span>
          </button>
        </div>
      </div>

      <div className={styles.actions}>
        {/* Dark / Light Mode Toggle */}
        <button
          type="button"
          className={styles.themeToggleBtn}
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Send Email Action */}
        <button
          type="button"
          className={styles.btnSendEmail}
          onClick={onOpenSendEmailModal}
          title="Send this rendered template directly via Email"
        >
          <Send size={14} />
          <span>Send Email</span>
        </button>

        <button
          type="button"
          className={styles.btnSecondary}
          onClick={onTriggerPrint}
          title="Print document using browser print dialog"
        >
          <Printer size={14} />
          <span>Print</span>
        </button>

        <button
          type="button"
          className={styles.btnPrimary}
          onClick={onOpenPdfModal}
          title="Save document as PDF"
        >
          <Download size={14} />
          <span>Save PDF</span>
        </button>
      </div>
    </nav>
  );
}
