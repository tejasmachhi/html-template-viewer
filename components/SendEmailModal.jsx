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
  const [providerConfig, setProviderConfig] = useState({ configured: false, provider: 'None' });

  // Inline SMTP Setup State
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [smtpEmail, setSmtpEmail] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [smtpStatus, setSmtpStatus] = useState('idle'); // 'idle' | 'verifying' | 'success' | 'error'
  const [smtpError, setSmtpError] = useState('');

  // Sync default values and check provider config when modal opens
  useEffect(() => {
    if (isOpen) {
      setEmailTo(defaultRecipient || '');
      setSubject(defaultSubject || `Your ${templateName || 'Document'}`);
      setStatus('idle');
      setErrorMessage('');
      setDeliveryResult(null);
      setIsConfigOpen(false);
      setSmtpStatus('idle');
      setSmtpError('');

      // Check if SMTP or Resend is configured
      fetch('/api/send-email')
        .then((res) => res.json())
        .then((data) => {
          setProviderConfig(data);
          if (!data.configured) {
            setSmtpEmail(defaultRecipient || 'tejasmachhi2710@gmail.com');
          }
        })
        .catch(() => setProviderConfig({ configured: false, provider: 'None' }));
    }
  }, [isOpen, defaultRecipient, defaultSubject, templateName]);

  const handleSaveSmtp = async (e) => {
    if (e) e.preventDefault();
    if (!smtpEmail || !smtpPassword) {
      setSmtpError('Please provide both your Gmail address and 16-character App Password.');
      return;
    }

    try {
      setSmtpStatus('verifying');
      setSmtpError('');

      const res = await fetch('/api/configure-smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: smtpEmail,
          appPassword: smtpPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to authenticate SMTP.');
      }

      setSmtpStatus('success');
      setProviderConfig({ configured: true, provider: 'Gmail SMTP' });
      setIsConfigOpen(false);
    } catch (err) {
      setSmtpStatus('error');
      setSmtpError(err.message || 'SMTP verification failed.');
    }
  };

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
                <span className={styles.tmplTag}>
                  {providerConfig.configured ? `🟢 ${providerConfig.provider} Active` : '⚠️ No SMTP Server'}
                </span>
              </div>

              {!providerConfig.configured && (
                <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '10px', padding: '12px 14px', fontSize: '12px', color: 'var(--text-primary)', marginBottom: '16px', lineHeight: 1.5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ fontWeight: 600, color: '#f59e0b' }}>
                      ⚠️ Real Email Server Not Connected
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsConfigOpen(!isConfigOpen)}
                      style={{
                        background: isConfigOpen ? 'transparent' : '#f59e0b',
                        color: isConfigOpen ? '#f59e0b' : '#000000',
                        border: '1px solid #f59e0b',
                        borderRadius: '6px',
                        padding: '3px 8px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {isConfigOpen ? 'Hide Setup' : '⚡ Connect Gmail SMTP'}
                    </button>
                  </div>

                  <div>
                    Real emails cannot reach inboxes without an authenticated mail server.
                  </div>

                  {isConfigOpen ? (
                    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed rgba(245, 158, 11, 0.3)' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                        1-Minute Google SMTP Connect:
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div>
                          <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>Your Gmail Address:</label>
                          <input
                            type="email"
                            className={styles.inputField}
                            style={{ height: '34px', fontSize: '12px' }}
                            value={smtpEmail}
                            onChange={(e) => setSmtpEmail(e.target.value)}
                            placeholder="your_email@gmail.com"
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>
                            16-character Google App Password:
                            <a
                              href="https://myaccount.google.com/apppasswords"
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: '#0071e3', marginLeft: '6px', textDecoration: 'underline' }}
                            >
                              (Get one here)
                            </a>
                          </label>
                          <input
                            type="password"
                            className={styles.inputField}
                            style={{ height: '34px', fontSize: '12px' }}
                            value={smtpPassword}
                            onChange={(e) => setSmtpPassword(e.target.value)}
                            placeholder="e.g. abcd efgh ijkl mnop"
                          />
                        </div>

                        {smtpError && (
                          <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>
                            {smtpError}
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={handleSaveSmtp}
                          disabled={smtpStatus === 'verifying'}
                          style={{
                            background: '#0071e3',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            marginTop: '4px',
                          }}
                        >
                          {smtpStatus === 'verifying' ? 'Verifying with Gmail...' : 'Save & Enable Real Delivery'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ marginTop: '6px', color: 'var(--text-secondary)' }}>
                      👉 Click <strong>"Connect Gmail SMTP"</strong> above to enable real delivery, or use <strong>"Open in Mail App"</strong> below.
                    </div>
                  )}
                </div>
              )}

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
