'use client';

import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Send, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import styles from '../app/styles/Modal.module.scss';

export default function SendEmailModal({
  isOpen,
  onClose,
  renderedHtml,
  templateName,
  defaultRecipient = '',
  defaultSubject = ''
}) {
  const [emailTo, setEmailTo] = useState('');
  const [subject, setSubject] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [deliveryResult, setDeliveryResult] = useState(null);

  // Sync default values when modal opens or template changes
  useEffect(() => {
    if (isOpen) {
      setEmailTo(defaultRecipient || '');
      setSubject(defaultSubject || `Your ${templateName || 'Document'} from Apple Store`);
      setStatus('idle');
      setErrorMessage('');
      setDeliveryResult(null);
    }
  }, [isOpen, defaultRecipient, defaultSubject, templateName]);

  if (!isOpen) return null;

  const handleSend = async (e) => {
    if (e) e.preventDefault();

    if (!emailTo || !emailTo.includes('@')) {
      setStatus('error');
      setErrorMessage('Please enter a valid recipient email address.');
      return;
    }

    try {
      setStatus('sending');
      setErrorMessage('');

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: emailTo,
          subject: subject,
          html: renderedHtml,
          templateName: templateName
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to dispatch email.');
      }

      setDeliveryResult(data);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message || 'Error sending email. Please try again.');
    }
  };

  // Mailto fallback link
  const mailtoUrl = `mailto:${encodeURIComponent(emailTo)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("Please view the attached HTML email template.")}`;

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h3>
            <Mail size={18} color="#0071e3" />
            Send Template via Email
          </h3>
          <button 
            type="button" 
            className={styles.closeBtn} 
            onClick={onClose}
            aria-label="Close Modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          {status === 'success' ? (
            <div className={styles.successCard}>
              <div className={styles.successIcon}>
                <CheckCircle2 size={24} />
              </div>
              <div className={styles.successTitle}>Email Dispatched Successfully!</div>
              <div className={styles.successMsg}>
                The rendered template has been delivered to <strong>{deliveryResult?.to}</strong>.
              </div>
              {deliveryResult?.messageId && (
                <div className={styles.metaInfo}>
                  ID: {deliveryResult.messageId} • {new Date().toLocaleTimeString()}
                </div>
              )}
            </div>
          ) : (
            <>
              <div className={styles.templateSummaryBanner}>
                <div>
                  <div style={{ fontSize: '11px', color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Template</div>
                  <div className={styles.tmplTitle}>{templateName}</div>
                </div>
                <span className={styles.tmplTag}>Ready to Send</span>
              </div>

              {/* Recipient Email Field */}
              <div className={styles.formGroup}>
                <label htmlFor="recipientEmail">
                  Recipient Email Address
                  <span className={styles.badgeRequired}>* Required</span>
                </label>
                <input
                  id="recipientEmail"
                  type="email"
                  className={styles.inputField}
                  placeholder="e.g. tejas@icloud.com"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  disabled={status === 'sending'}
                  autoFocus
                  required
                />
                {defaultRecipient && defaultRecipient !== emailTo && (
                  <div className={styles.quickPillWrapper}>
                    <button
                      type="button"
                      className={styles.pillBtn}
                      onClick={() => setEmailTo(defaultRecipient)}
                    >
                      <Sparkles size={11} style={{ marginRight: '4px', verticalAlign: '-1px' }} />
                      Use template email: {defaultRecipient}
                    </button>
                  </div>
                )}
              </div>

              {/* Subject Line Field */}
              <div className={styles.formGroup}>
                <label htmlFor="emailSubject">Email Subject</label>
                <input
                  id="emailSubject"
                  type="text"
                  className={styles.inputField}
                  placeholder="Enter email subject..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={status === 'sending'}
                />
              </div>

              {/* Error Alert */}
              {status === 'error' && (
                <div className={styles.errorBanner}>
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className={styles.tipBox}>
                💡 <strong>Tip:</strong> The live rendered HTML will be sent directly as the message body. You can test with any email ID!
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <div className={styles.footerLeft}>
            {status !== 'success' && emailTo && (
              <a 
                href={mailtoUrl} 
                className={styles.btnMailto}
                title="Open system default mail client"
              >
                <ExternalLink size={13} />
                <span>Open in Mail App</span>
              </a>
            )}
          </div>

          <div className={styles.footerRight}>
            {status === 'success' ? (
              <>
                <button
                  type="button"
                  className={styles.btnCancel}
                  onClick={() => {
                    setStatus('idle');
                    setDeliveryResult(null);
                  }}
                >
                  Send to Another
                </button>
                <button
                  type="button"
                  className={styles.btnAction}
                  onClick={onClose}
                >
                  Done
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className={styles.btnCancel}
                  onClick={onClose}
                  disabled={status === 'sending'}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={styles.btnAction}
                  onClick={handleSend}
                  disabled={status === 'sending' || !emailTo.trim()}
                >
                  {status === 'sending' ? (
                    <>
                      <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Send Email</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
