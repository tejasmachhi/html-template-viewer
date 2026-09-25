'use client';

import React from 'react';
import styles from '../app/styles/Preview.module.scss';

export default function MobilePreview({ htmlContent }) {
  return (
    <div className={styles.mobileDeviceFrame}>
      <div className={styles.phoneNotch}>
        <div className={styles.speaker} />
      </div>

      <iframe
        className={styles.mobileIframe}
        srcDoc={htmlContent}
        title="Mobile Live Preview"
        sandbox="allow-same-origin"
      />

      <div className={styles.phoneHomeBar}>
        <div className={styles.homeIndicator} />
      </div>
    </div>
  );
}
