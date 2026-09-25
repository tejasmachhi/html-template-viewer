'use client';

import React, { useState } from 'react';
import EmailPreview from './EmailPreview';
import DocumentPreview from './DocumentPreview';
import MobilePreview from './MobilePreview';
import styles from '../app/styles/Preview.module.scss';
import { Mail, FileText, Smartphone, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export default function PreviewContainer({
  viewMode,
  renderedHtml
}) {
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 10, 150));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 10, 50));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  const getModeInfo = () => {
    switch (viewMode) {
      case 'document':
        return {
          icon: <FileText size={14} color="#10b981" />,
          label: 'A4 Document Page',
          dimensions: '210mm × 297mm'
        };
      case 'mobile':
        return {
          icon: <Smartphone size={14} color="#38bdf8" />,
          label: 'Mobile Viewport',
          dimensions: '375px × 740px'
        };
      case 'email':
      default:
        return {
          icon: <Mail size={14} color="#f59e0b" />,
          label: 'Email Client (Centered)',
          dimensions: '650px Fixed Width'
        };
    }
  };

  const modeInfo = getModeInfo();

  return (
    <div className={styles.previewContainer}>
      <div className={styles.previewToolbar}>
        <div className={styles.viewportInfo}>
          <div className={styles.modeName}>
            {modeInfo.icon}
            <span>{modeInfo.label}</span>
          </div>
          <span className={styles.dimensionsBadge}>{modeInfo.dimensions}</span>
        </div>

        <div className={styles.zoomControls}>
          <button
            type="button"
            className={styles.zoomBtn}
            onClick={handleZoomOut}
            title="Zoom Out"
            disabled={zoomLevel <= 50}
          >
            <ZoomOut size={13} />
          </button>

          <span className={styles.zoomLevel}>{zoomLevel}%</span>

          <button
            type="button"
            className={styles.zoomBtn}
            onClick={handleZoomIn}
            title="Zoom In"
            disabled={zoomLevel >= 150}
          >
            <ZoomIn size={13} />
          </button>

          <button
            type="button"
            className={styles.zoomBtn}
            onClick={handleResetZoom}
            title="Reset Zoom (100%)"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      <div className={styles.canvasArea}>
        <div 
          className={styles.zoomWrapper} 
          style={{ transform: `scale(${zoomLevel / 100})` }}
        >
          {viewMode === 'email' && <EmailPreview htmlContent={renderedHtml} />}
          {viewMode === 'document' && <DocumentPreview htmlContent={renderedHtml} />}
          {viewMode === 'mobile' && <MobilePreview htmlContent={renderedHtml} />}
        </div>
      </div>
    </div>
  );
}
