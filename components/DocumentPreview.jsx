'use client';

import React, { useRef, useEffect } from 'react';
import styles from '../app/styles/Preview.module.scss';

export default function DocumentPreview({ htmlContent }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      try {
        if (iframe.contentWindow && iframe.contentWindow.document.body) {
          const contentHeight = iframe.contentWindow.document.body.scrollHeight;
          iframe.style.height = `${Math.max(contentHeight + 20, 1120)}px`;
        }
      } catch (e) {
        // Fallback
      }
    };

    iframe.addEventListener('load', handleLoad);
    return () => iframe.removeEventListener('load', handleLoad);
  }, [htmlContent]);

  return (
    <div className={styles.documentPageWrapper}>
      <div className={styles.a4Sheet}>
        <iframe
          ref={iframeRef}
          className={styles.documentIframe}
          srcDoc={htmlContent}
          title="A4 Document Live Preview"
          sandbox="allow-same-origin"
        />
      </div>

      <div className={styles.pageFooterLabel}>
        <span>📄 Standard ISO 216 A4 (210mm × 297mm) • Print-Ready</span>
      </div>
    </div>
  );
}
