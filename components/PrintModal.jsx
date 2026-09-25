'use client';

import React from 'react';
import styles from '../app/styles/Modal.module.scss';
import { Download, X, CheckCircle2, Printer } from 'lucide-react';

export default function PrintModal({ isOpen, onClose, onConfirmPrint }) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>
            <Download size={18} color="#10b981" />
            <span>Save as PDF Workflow</span>
          </h3>
          <button 
            type="button" 
            className={styles.closeBtn} 
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <p>
            Template Lab uses high-fidelity browser A4 print drivers to generate clean vector PDFs without needing an external backend.
          </p>

          <div className={styles.stepCard}>
            <div className={styles.stepNum}>1</div>
            <div className={styles.stepText}>
              In the browser print dialog, set <strong>Destination</strong> to <strong>Save as PDF</strong>.
            </div>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepNum}>2</div>
            <div className={styles.stepText}>
              Ensure <strong>Paper size</strong> is set to <strong>A4</strong> and <strong>Background graphics</strong> is checked.
            </div>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepNum}>3</div>
            <div className={styles.stepText}>
              Click <strong>Save</strong> to store the rendered document on your device.
            </div>
          </div>

          <div className={styles.tipBox}>
            💡 <em>Note:</em> The editor UI, tabs, and navigation are automatically excluded from the output. Only your document is printed.
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button type="button" className={styles.btnCancel} onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className={styles.btnAction}
            onClick={() => {
              onClose();
              onConfirmPrint();
            }}
          >
            <Printer size={15} />
            <span>Open Print Dialog</span>
          </button>
        </div>
      </div>
    </div>
  );
}
