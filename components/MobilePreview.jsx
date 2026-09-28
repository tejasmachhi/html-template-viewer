'use client';

import React from 'react';
import styles from '../app/styles/Preview.module.scss';

export default function MobilePreview({ htmlContent }) {
  const isContentEmpty = !htmlContent || !htmlContent.replace(/<!--[\s\S]*?-->/g, '').trim();

  const previewSrc = isContentEmpty
    ? `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;padding:60px 20px;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#86868b;text-align:center;background:#ffffff;display:flex;flex-direction:column;align-items:center;justify-content:center;box-sizing:border-box;min-height:500px;}.icon{width:48px;height:48px;border-radius:12px;background:#f5f5f7;border:1px dashed #d2d2d7;display:flex;align-items:center;justify-content:center;margin-bottom:14px;font-size:20px;color:#0071e3;}h3{margin:0 0 6px 0;font-size:15px;font-weight:600;color:#1d1d1f;}p{margin:0;font-size:12px;line-height:1.4;max-width:240px;color:#86868b;}</style></head><body><div class="icon">&#128241;</div><h3>Mobile Preview</h3><p>Paste your HTML template to see how it scales on mobile viewports.</p></body></html>`
    : htmlContent;

  return (
    <div className={styles.mobileDeviceFrame}>
      <div className={styles.phoneNotch}>
        <div className={styles.speaker} />
      </div>

      <iframe
        className={styles.mobileIframe}
        srcDoc={previewSrc}
        title="Mobile Live Preview"
        sandbox="allow-same-origin"
      />

      <div className={styles.phoneHomeBar}>
        <div className={styles.homeIndicator} />
      </div>
    </div>
  );
}
