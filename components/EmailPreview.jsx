'use client';

import React, { useRef, useEffect } from 'react';
import styles from '../app/styles/Preview.module.scss';

export default function EmailPreview({ htmlContent }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    // Dynamically adjust iframe height to content height to prevent internal scrollbars
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      try {
        if (iframe.contentWindow && iframe.contentWindow.document.body) {
          const contentHeight = iframe.contentWindow.document.body.scrollHeight;
          iframe.style.height = `${Math.max(contentHeight + 20, 600)}px`;
        }
      } catch (e) {
        // Fallback for sandboxed restrictions
      }
    };

    iframe.addEventListener('load', handleLoad);
    return () => iframe.removeEventListener('load', handleLoad);
  }, [htmlContent]);

  return (
    <div className={styles.emailWrapper}>
      <div className={styles.emailHeaderMeta}>
        <span>Inbox Preview • 650px Centered</span>
        <span>Standard HTML Email Standard</span>
      </div>

      <iframe
        ref={iframeRef}
        className={styles.emailIframe}
        srcDoc={htmlContent}
        title="Email Live Preview"
        sandbox="allow-same-origin"
      />
    </div>
  );
}
