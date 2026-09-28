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

  const isContentEmpty = !htmlContent || !htmlContent.replace(/<!--[\s\S]*?-->/g, '').trim();

  const previewSrc = isContentEmpty
    ? `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;padding:80px 24px;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#86868b;text-align:center;background:#ffffff;display:flex;flex-direction:column;align-items:center;justify-content:center;box-sizing:border-box;min-height:400px;}.icon{width:52px;height:52px;border-radius:14px;background:#f5f5f7;border:1px dashed #d2d2d7;display:flex;align-items:center;justify-content:center;margin-bottom:16px;font-size:22px;color:#0071e3;}h3{margin:0 0 8px 0;font-size:16px;font-weight:600;color:#1d1d1f;}p{margin:0;font-size:13px;line-height:1.5;max-width:320px;color:#86868b;}</style></head><body><div class="icon">&#9993;</div><h3>Paste Your Template</h3><p>Paste your HTML code into the editor on the left to see your email preview live here.</p></body></html>`
    : htmlContent;

  return (
    <div className={styles.emailWrapper}>
      <div className={styles.emailHeaderMeta}>
        <span>Inbox Preview • 650px Centered</span>
        <span>Standard HTML Email Standard</span>
      </div>

      <iframe
        ref={iframeRef}
        className={styles.emailIframe}
        srcDoc={previewSrc}
        title="Email Live Preview"
        sandbox="allow-same-origin"
      />
    </div>
  );
}
