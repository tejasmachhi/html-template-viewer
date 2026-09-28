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

  const isContentEmpty = !htmlContent || !htmlContent.replace(/<!--[\s\S]*?-->/g, '').trim();

  const previewSrc = isContentEmpty
    ? `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;padding:120px 32px;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#86868b;text-align:center;background:#ffffff;display:flex;flex-direction:column;align-items:center;justify-content:center;box-sizing:border-box;min-height:800px;}.icon{width:56px;height:56px;border-radius:14px;background:#f5f5f7;border:1px dashed #d2d2d7;display:flex;align-items:center;justify-content:center;margin-bottom:16px;font-size:24px;color:#0071e3;}h3{margin:0 0 8px 0;font-size:18px;font-weight:600;color:#1d1d1f;}p{margin:0;font-size:14px;line-height:1.5;max-width:340px;color:#86868b;}</style></head><body><div class="icon">&#128196;</div><h3>A4 Document Ready</h3><p>Paste your HTML template code into the editor to preview it formatted as a printable A4 document.</p></body></html>`
    : htmlContent;

  return (
    <div className={styles.documentPageWrapper}>
      <div className={styles.a4Sheet}>
        <iframe
          ref={iframeRef}
          className={styles.documentIframe}
          srcDoc={previewSrc}
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
