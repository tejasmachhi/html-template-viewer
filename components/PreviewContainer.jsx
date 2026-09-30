'use client';

import React, { useState } from 'react';
import EmailPreview from './EmailPreview';
import DocumentPreview from './DocumentPreview';
import MobilePreview from './MobilePreview';
import IronPdfViewer from './IronPdfViewer';
import styles from '../app/styles/Preview.module.scss';
import { Mail, FileText, Smartphone, ZoomIn, ZoomOut, RotateCcw, FileCheck } from 'lucide-react';

export default function PreviewContainer({
  viewMode,
  renderedHtml,
  templateTitle = 'Document Preview'
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
      case 'ironpdf':
        return {
          icon: <FileCheck size={14} color="#0071e3" />,
          label: 'IronPDF Multi-Page Studio',
          dimensions: 'ISO A4 (210 × 297mm) Vector PDF'
        };
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

  if (viewMode === 'ironpdf') {
    return (
      <div className={styles.previewContainer} style={{ padding: 0 }}>
        <IronPdfViewer
          htmlContent={renderedHtml}
          templateTitle={templateTitle}
        />
      </div>
    );
  }

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
