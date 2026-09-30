'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  FileText,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Printer,
  Download,
  Upload,
  Sliders,
  PanelLeftClose,
  PanelLeft,
  Layers,
  X,
  FileX2,
  FileCheck
} from 'lucide-react';
import { convertHtmlToPdfBytes } from '../utils/ironPdfEngine';
import styles from '../app/styles/IronPdfViewer.module.scss';

export default function IronPdfViewer({
  htmlContent,
  templateTitle = 'Document Preview'
}) {
  // Navigation & Page State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [viewLayout, setViewLayout] = useState('continuous'); // 'single' | 'continuous'
  const [isThumbnailsOpen, setIsThumbnailsOpen] = useState(true);

  // PDF File Upload Mode (Optional for viewing local .pdf files)
  const [uploadedPdfBytes, setUploadedPdfBytes] = useState(null);
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Customization Options (Watermark & Headers)
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [showWatermark, setShowWatermark] = useState(false);
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.12);
  const [watermarkColor, setWatermarkColor] = useState('#0071e3');
  const [showHeader, setShowHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);

  // Loading state
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // References
  const fileInputRef = useRef(null);
  const htmlMeasureIframeRef = useRef(null);
  const viewportAreaRef = useRef(null);
  const uploadedPdfCanvasRef = useRef(null);
  const uploadedPdfThumbRefs = useRef({});
  const uploadedPdfContinuousRefs = useRef({});

  // Check if substantive HTML code is provided
  const hasUserHtml = useMemo(() => {
    if (!htmlContent) return false;
    const stripped = htmlContent
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/\s+/g, '')
      .trim();
    return stripped.length > 0;
  }, [htmlContent]);

  // Mode: 'uploaded' if user uploaded a file, otherwise 'html'
  const mode = uploadedPdfBytes ? 'uploaded' : 'html';

  // Compute document title
  const docTitle = useMemo(() => {
    if (uploadedFileName) return uploadedFileName;
    if (templateTitle && templateTitle !== 'Document Preview') {
      return `${templateTitle}.pdf`;
    }
    return 'Document_Preview.pdf';
  }, [uploadedFileName, templateTitle]);

  // Measure content height and calculate standard A4 pages
  useEffect(() => {
    if (mode !== 'html' || !hasUserHtml) {
      if (!uploadedPdfBytes) setTotalPages(1);
      return;
    }

    const iframe = htmlMeasureIframeRef.current;
    if (!iframe) return;

    const timer = setTimeout(() => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        if (doc && doc.body) {
          const scrollH = doc.body.scrollHeight;
          // Standard A4 printable height at 96 DPI: 1123px (minus 100px margins = ~1020px)
          const PAGE_H = 1020;
          const calculated = Math.max(1, Math.ceil(scrollH / PAGE_H));
          setTotalPages(calculated);
          if (currentPage > calculated) {
            setCurrentPage(calculated);
          }
        }
      } catch (e) {
        setTotalPages(1);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [htmlContent, hasUserHtml, mode, currentPage, uploadedPdfBytes]);

  // Handle uploaded PDF rendering using PDF.js
  useEffect(() => {
    if (mode !== 'uploaded' || !uploadedPdfBytes) return;

    let isCancelled = false;

    async function loadUploadedPdf() {
      try {
        setIsUploading(true);
        const pdfjs = await import('pdfjs-dist/build/pdf.mjs');
        if (!pdfjs.GlobalWorkerOptions.workerSrc) {
          pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version || '4.3.136'}/build/pdf.worker.min.mjs`;
        }

        const loadingTask = pdfjs.getDocument({
          data: uploadedPdfBytes.slice(),
          cMapUrl: 'https://unpkg.com/pdfjs-dist/cmaps/',
          cMapPacked: true,
        });

        const doc = await loadingTask.promise;
        if (isCancelled) return;

        setUploadedDoc(doc);
        setTotalPages(doc.numPages);
        setCurrentPage(1);
      } catch (err) {
        console.error('Error loading uploaded PDF:', err);
      } finally {
        if (!isCancelled) setIsUploading(false);
      }
    }

    loadUploadedPdf();

    return () => {
      isCancelled = true;
    };
  }, [mode, uploadedPdfBytes]);

  // Render uploaded PDF canvases
  useEffect(() => {
    if (!uploadedDoc || mode !== 'uploaded') return;

    let isCancelled = false;

    async function renderUploadedCanvases() {
      const dpr = window.devicePixelRatio || 1;
      const scale = (zoomLevel / 100) * 1.4;

      if (viewLayout === 'single') {
        try {
          const page = await uploadedDoc.getPage(currentPage);
          const canvas = uploadedPdfCanvasRef.current;
          if (!canvas || isCancelled) return;

          const totalRot = (page.rotate + rotation) % 360;
          const viewport = page.getViewport({ scale: scale * dpr, rotation: totalRot });
          const cssViewport = page.getViewport({ scale: scale, rotation: totalRot });

          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);
          canvas.style.width = `${Math.floor(cssViewport.width)}px`;
          canvas.style.height = `${Math.floor(cssViewport.height)}px`;

          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          await page.render({
            canvasContext: ctx,
            viewport: viewport,
          }).promise;
        } catch (e) {}
      } else {
        // Continuous layout
        for (let pNum = 1; pNum <= uploadedDoc.numPages; pNum++) {
          if (isCancelled) break;
          try {
            const page = await uploadedDoc.getPage(pNum);
            const canvas = uploadedPdfContinuousRefs.current[pNum];
            if (!canvas) continue;

            const totalRot = (page.rotate + rotation) % 360;
            const viewport = page.getViewport({ scale: scale * dpr, rotation: totalRot });
            const cssViewport = page.getViewport({ scale: scale, rotation: totalRot });

            canvas.width = Math.floor(viewport.width);
            canvas.height = Math.floor(viewport.height);
            canvas.style.width = `${Math.floor(cssViewport.width)}px`;
            canvas.style.height = `${Math.floor(cssViewport.height)}px`;

            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            await page.render({
              canvasContext: ctx,
              viewport: viewport,
            }).promise;
          } catch (e) {}
        }
      }

      // Render thumbnails
      if (isThumbnailsOpen) {
        for (let pNum = 1; pNum <= uploadedDoc.numPages; pNum++) {
          if (isCancelled) break;
          try {
            const page = await uploadedDoc.getPage(pNum);
            const canvas = uploadedPdfThumbRefs.current[pNum];
            if (!canvas) continue;

            const totalRot = (page.rotate + rotation) % 360;
            const viewport = page.getViewport({ scale: 0.28 * dpr, rotation: totalRot });

            canvas.width = Math.floor(viewport.width);
            canvas.height = Math.floor(viewport.height);

            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            await page.render({
              canvasContext: ctx,
              viewport: viewport,
            }).promise;
          } catch (e) {}
        }
      }
    }

    renderUploadedCanvases();

    return () => {
      isCancelled = true;
    };
  }, [uploadedDoc, mode, currentPage, zoomLevel, rotation, viewLayout, isThumbnailsOpen]);

  // Page Jump Action
  const handleJumpToPage = (pageNum) => {
    const p = Math.max(1, Math.min(pageNum, totalPages));
    setCurrentPage(p);

    if (viewLayout === 'continuous') {
      const pageEl = document.getElementById(`doc-page-${p}`);
      if (pageEl) {
        pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Zoom Controls
  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 15, 200));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 15, 50));
  const handleFitWidth = () => setZoomLevel(105);
  const handleFitPage = () => setZoomLevel(80);

  // Rotation Controls
  const handleRotateCw = () => setRotation((r) => (r + 90) % 360);
  const handleRotateCcw = () => setRotation((r) => (r - 90 + 360) % 360);

  // File Upload Action
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a valid .pdf file.');
      return;
    }

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedPdfBytes(new Uint8Array(event.target.result));
      setRotation(0);
    };
    reader.readAsArrayBuffer(file);
  };

  // Switch back from uploaded PDF to HTML Source
  const handleClearUploadedFile = () => {
    setUploadedPdfBytes(null);
    setUploadedDoc(null);
    setUploadedFileName('');
    setCurrentPage(1);
  };

  // Print Action
  const handlePrint = () => {
    if (mode === 'html') {
      const printIframe = document.createElement('iframe');
      printIframe.style.position = 'fixed';
      printIframe.style.right = '0';
      printIframe.style.bottom = '0';
      printIframe.style.width = '0';
      printIframe.style.height = '0';
      printIframe.style.border = '0';
      document.body.appendChild(printIframe);

      const doc = printIframe.contentWindow.document;
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>${templateTitle || 'Print Document'}</title>
            <style>
              @page { size: A4 portrait; margin: 15mm; }
              body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #fff; color: #111; }
            </style>
          </head>
          <body>${htmlContent}</body>
        </html>
      `);
      doc.close();

      setTimeout(() => {
        printIframe.contentWindow.focus();
        printIframe.contentWindow.print();
        setTimeout(() => document.body.removeChild(printIframe), 1000);
      }, 400);
    } else if (uploadedPdfBytes) {
      const blob = new Blob([uploadedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const printWin = window.open(url, '_blank');
      if (printWin) {
        printWin.addEventListener('load', () => printWin.print());
      }
    }
  };

  // Download PDF Action
  const handleDownloadPdf = async () => {
    if (mode === 'html') {
      try {
        setIsGeneratingPdf(true);
        const bytes = await convertHtmlToPdfBytes(htmlContent, {
          documentTitle: templateTitle || 'Document',
          showWatermark,
          watermarkText,
          watermarkOpacity,
          watermarkColor,
          showHeader,
          showFooter,
          rotation,
        });

        const blob = new Blob([bytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = docTitle;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error('PDF Download Error:', err);
      } finally {
        setIsGeneratingPdf(false);
      }
    } else if (uploadedPdfBytes) {
      const blob = new Blob([uploadedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = docTitle;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  // Prepared HTML document source
  const safeHtmlSrcDoc = useMemo(() => {
    if (!hasUserHtml) return '';
    return htmlContent.includes('<html') || htmlContent.includes('<body')
      ? htmlContent
      : `<!DOCTYPE html><html><head><meta charset="utf-8"><style>* { box-sizing: border-box; } body { margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #ffffff; color: #111827; }</style></head><body>${htmlContent}</body></html>`;
  }, [htmlContent, hasUserHtml]);

  return (
    <div className={styles.pdfViewerRoot}>
      {/* Offscreen frame for measuring content height */}
      {hasUserHtml && (
        <iframe
          ref={htmlMeasureIframeRef}
          style={{ position: 'fixed', left: '-9999px', top: '0', width: '794px', height: '1123px', border: 'none' }}
          srcDoc={safeHtmlSrcDoc}
          title="Measure Frame"
        />
      )}

      {/* Top Studio Toolbar */}
      <header className={styles.studioToolbar}>
        {/* Left: Thumbnail Drawer Toggle & Title */}
        <div className={styles.leftControls}>
          <button
            type="button"
            className={`${styles.sidebarToggleBtn} ${isThumbnailsOpen ? styles.active : ''}`}
            onClick={() => setIsThumbnailsOpen(!isThumbnailsOpen)}
            title={isThumbnailsOpen ? 'Hide Thumbnails' : 'Show Thumbnails'}
          >
            {isThumbnailsOpen ? <PanelLeftClose size={15} /> : <PanelLeft size={15} />}
          </button>

          <div className={styles.docTitleArea}>
            <span className={styles.docTitle} title={docTitle}>
              {docTitle}
            </span>
            <span className={styles.engineBadge}>
              <FileCheck size={11} />
              {mode === 'uploaded' ? 'PDF File' : 'HTML Live'}
            </span>
          </div>

          {mode === 'uploaded' && (
            <button
              type="button"
              className={styles.iconBtn}
              onClick={handleClearUploadedFile}
              title="Return to HTML Editor template"
              style={{ fontSize: '11px', width: 'auto', padding: '0 6px', color: '#0071e3' }}
            >
              Back to HTML
            </button>
          )}
        </div>

        {/* Center: Pagination, Zoom, Rotation, Layout */}
        <div className={styles.centerControls}>
          {/* Page Jump */}
          <div className={styles.controlGroup}>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => handleJumpToPage(currentPage - 1)}
              disabled={currentPage <= 1 || (!hasUserHtml && mode === 'html')}
              title="Previous Page"
            >
              <ChevronLeft size={15} />
            </button>

            <div className={styles.pageIndicator}>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={currentPage}
                onChange={(e) => handleJumpToPage(parseInt(e.target.value) || 1)}
                disabled={!hasUserHtml && mode === 'html'}
              />
              <span className={styles.totalPages}>/ {totalPages}</span>
            </div>

            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => handleJumpToPage(currentPage + 1)}
              disabled={currentPage >= totalPages || (!hasUserHtml && mode === 'html')}
              title="Next Page"
            >
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className={styles.controlGroup}>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={handleZoomOut}
              disabled={zoomLevel <= 50}
              title="Zoom Out (-15%)"
            >
              <ZoomOut size={13} />
            </button>

            <select
              className={styles.zoomSelect}
              value={zoomLevel}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'fit-width') handleFitWidth();
                else if (val === 'fit-page') handleFitPage();
                else setZoomLevel(parseInt(val));
              }}
            >
              <option value="50">50%</option>
              <option value="75">75%</option>
              <option value="100">100%</option>
              <option value="125">125%</option>
              <option value="150">150%</option>
              <option value="fit-width">Fit Width</option>
              <option value="fit-page">Fit Page</option>
            </select>

            <button
              type="button"
              className={styles.iconBtn}
              onClick={handleZoomIn}
              disabled={zoomLevel >= 200}
              title="Zoom In (+15%)"
            >
              <ZoomIn size={13} />
            </button>
          </div>

          {/* Rotation */}
          <div className={styles.controlGroup}>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={handleRotateCcw}
              title="Rotate 90° Counter-Clockwise"
            >
              <RotateCcw size={13} />
            </button>

            <button
              type="button"
              className={styles.iconBtn}
              onClick={handleRotateCw}
              title="Rotate 90° Clockwise"
            >
              <RotateCw size={13} />
            </button>
          </div>

          {/* Layout Mode */}
          <div className={styles.controlGroup}>
            <button
              type="button"
              className={`${styles.iconBtn} ${viewLayout === 'single' ? styles.active : ''}`}
              onClick={() => setViewLayout('single')}
              title="Single Page Mode"
            >
              <FileText size={13} />
            </button>

            <button
              type="button"
              className={`${styles.iconBtn} ${viewLayout === 'continuous' ? styles.active : ''}`}
              onClick={() => setViewLayout('continuous')}
              title="Continuous Scroll Mode"
            >
              <Layers size={13} />
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className={styles.rightControls}>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={() => fileInputRef.current?.click()}
            title="Open and preview any local PDF file"
          >
            <Upload size={13} />
            <span>Open PDF</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className={styles.hiddenFileInput}
            onChange={handleFileUpload}
          />

          <button
            type="button"
            className={`${styles.actionBtn} ${isOptionsOpen ? styles.primary : ''}`}
            onClick={() => setIsOptionsOpen(!isOptionsOpen)}
            title="Document Watermark & Header Settings"
          >
            <Sliders size={13} />
          </button>

          <button
            type="button"
            className={styles.actionBtn}
            onClick={handlePrint}
            disabled={!hasUserHtml && mode === 'html'}
            title="Print Document"
          >
            <Printer size={13} />
          </button>

          <button
            type="button"
            className={`${styles.actionBtn} ${styles.primary}`}
            onClick={handleDownloadPdf}
            disabled={!hasUserHtml && mode === 'html'}
            title="Save as PDF Document"
          >
            <Download size={13} />
            <span>Save PDF</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Stage */}
      <div className={styles.mainStage}>
        {/* Left Thumbnails Sidebar */}
        {hasUserHtml || mode === 'uploaded' ? (
          <aside className={`${styles.thumbnailsSidebar} ${!isThumbnailsOpen ? styles.closed : ''}`}>
            <div className={styles.sidebarHeader}>
              <span>Pages ({totalPages})</span>
            </div>

            <div className={styles.thumbnailsList}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <div
                  key={`thumb-${pageNum}`}
                  className={`${styles.thumbnailCard} ${currentPage === pageNum ? styles.active : ''}`}
                  onClick={() => handleJumpToPage(pageNum)}
                >
                  <div className={styles.thumbnailPreviewBox}>
                    {mode === 'html' ? (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          overflow: 'hidden',
                          position: 'relative',
                          background: '#ffffff',
                        }}
                      >
                        <iframe
                          srcDoc={safeHtmlSrcDoc}
                          style={{
                            width: '794px',
                            height: `${Math.max(1123, totalPages * 1020)}px`,
                            border: 'none',
                            transform: `scale(0.18) translateY(-${(pageNum - 1) * 1020}px)`,
                            transformOrigin: 'top left',
                            pointerEvents: 'none',
                          }}
                          title={`Thumb Frame ${pageNum}`}
                        />
                      </div>
                    ) : (
                      <canvas
                        ref={(el) => {
                          if (el) uploadedPdfThumbRefs.current[pageNum] = el;
                        }}
                      />
                    )}
                  </div>
                  <span className={styles.thumbnailBadge}>Page {pageNum}</span>
                </div>
              ))}
            </div>
          </aside>
        ) : null}

        {/* Viewport Area */}
        <main className={styles.viewportArea} ref={viewportAreaRef}>
          {mode === 'html' && !hasUserHtml ? (
            /* ============================================================
               NO DATA FOUND STATE (When no HTML is in editor)
               ============================================================ */
            <div className={styles.noDataContainer}>
              <div className={styles.noDataCard}>
                <div className={styles.noDataIcon}>
                  <FileX2 size={36} />
                </div>
                <h3>No Document Data Found</h3>
                <p>
                  Please paste or enter your HTML code in the editor on the left to render your live document preview.
                </p>
                <div className={styles.noDataBadge}>
                  Waiting for HTML Template Code
                </div>
              </div>
            </div>
          ) : (
            /* ============================================================
               LIVE DOCUMENT VIEW (Multi-Page A4 / Uploaded PDF)
               ============================================================ */
            <div
              className={styles.canvasStage}
              style={{
                transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                transformOrigin: 'top center',
              }}
            >
              {mode === 'html' ? (
                // HTML Multi-Page A4 Render
                viewLayout === 'single' ? (
                  // Single Page Mode
                  <div className={styles.pageContainer} style={{ width: '794px', height: '1123px' }}>
                    {showHeader && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '42px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0 32px',
                          borderBottom: '1px solid #e5e7eb',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#6b7280',
                          background: '#ffffff',
                          zIndex: 3,
                        }}
                      >
                        <span>{templateTitle || 'Document Preview'}</span>
                        <span style={{ color: '#0071e3' }}>DOCUMENT VIEW</span>
                      </div>
                    )}

                    {showWatermark && (
                      <div className={styles.watermarkOverlay}>
                        <span style={{ color: watermarkColor, opacity: watermarkOpacity }}>
                          {watermarkText}
                        </span>
                      </div>
                    )}

                    <div
                      style={{
                        position: 'absolute',
                        top: showHeader ? '42px' : 0,
                        bottom: showFooter ? '38px' : 0,
                        left: 0,
                        right: 0,
                        overflow: 'hidden',
                        background: '#ffffff',
                      }}
                    >
                      <iframe
                        srcDoc={safeHtmlSrcDoc}
                        style={{
                          width: '794px',
                          height: `${Math.max(1123, totalPages * 1020)}px`,
                          border: 'none',
                          transform: `translateY(-${(currentPage - 1) * 1020}px)`,
                          transition: 'transform 0.15s ease',
                        }}
                        title="Single Page Document"
                      />
                    </div>

                    {showFooter && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '38px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0 32px',
                          borderTop: '1px solid #e5e7eb',
                          fontSize: '11px',
                          color: '#9ca3af',
                          background: '#ffffff',
                          zIndex: 3,
                        }}
                      >
                        <span>Print-Ready A4 Document</span>
                        <span style={{ fontWeight: 600, color: '#4b5563' }}>
                          Page {currentPage} of {totalPages}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  // Continuous Vertical Scroll Mode
                  Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <div
                      key={`page-${pageNum}`}
                      id={`doc-page-${pageNum}`}
                      className={styles.pageContainer}
                      style={{ width: '794px', height: '1123px', position: 'relative', marginBottom: '32px' }}
                    >
                      {showHeader && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '42px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0 32px',
                            borderBottom: '1px solid #e5e7eb',
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#6b7280',
                            background: '#ffffff',
                            zIndex: 3,
                          }}
                        >
                          <span>{templateTitle || 'Document Preview'}</span>
                          <span style={{ color: '#0071e3' }}>DOCUMENT VIEW</span>
                        </div>
                      )}

                      {showWatermark && (
                        <div className={styles.watermarkOverlay}>
                          <span style={{ color: watermarkColor, opacity: watermarkOpacity }}>
                            {watermarkText}
                          </span>
                        </div>
                      )}

                      <div
                        style={{
                          position: 'absolute',
                          top: showHeader ? '42px' : 0,
                          bottom: showFooter ? '38px' : 0,
                          left: 0,
                          right: 0,
                          overflow: 'hidden',
                          background: '#ffffff',
                        }}
                      >
                        <iframe
                          srcDoc={safeHtmlSrcDoc}
                          style={{
                            width: '794px',
                            height: `${Math.max(1123, totalPages * 1020)}px`,
                            border: 'none',
                            transform: `translateY(-${(pageNum - 1) * 1020}px)`,
                          }}
                          title={`Page Frame ${pageNum}`}
                        />
                      </div>

                      {showFooter && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '38px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0 32px',
                            borderTop: '1px solid #e5e7eb',
                            fontSize: '11px',
                            color: '#9ca3af',
                            background: '#ffffff',
                            zIndex: 3,
                          }}
                        >
                          <span>Print-Ready A4 Document</span>
                          <span style={{ fontWeight: 600, color: '#4b5563' }}>
                            Page {pageNum} of {totalPages}
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                )
              ) : (
                // Uploaded PDF Canvas Render
                viewLayout === 'single' ? (
                  <div className={styles.pageContainer}>
                    <canvas ref={uploadedPdfCanvasRef} />
                    <span className={styles.pageNumberBadge}>
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>
                ) : (
                  Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <div key={`upload-page-${pageNum}`} id={`doc-page-${pageNum}`} className={styles.pageContainer}>
                      <canvas
                        ref={(el) => {
                          if (el) uploadedPdfContinuousRefs.current[pageNum] = el;
                        }}
                      />
                      <span className={styles.pageNumberBadge}>
                        Page {pageNum} of {totalPages}
                      </span>
                    </div>
                  ))
                )
              )}
            </div>
          )}
        </main>
      </div>

      {/* Loading Overlay */}
      {(isGeneratingPdf || isUploading) && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner} />
          <span>{isGeneratingPdf ? 'Compiling PDF Document...' : 'Loading PDF File...'}</span>
        </div>
      )}

      {/* Watermark & Settings Drawer */}
      {isOptionsOpen && (
        <div className={styles.optionsDrawer}>
          <div className={styles.optionsHeader}>
            <h4>
              <Sliders size={15} />
              Document View Options
            </h4>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => setIsOptionsOpen(false)}
            >
              <X size={15} />
            </button>
          </div>

          <label className={styles.checkboxOption}>
            <input
              type="checkbox"
              checked={showWatermark}
              onChange={(e) => setShowWatermark(e.target.checked)}
            />
            <span>Show Watermark</span>
          </label>

          {showWatermark && (
            <>
              <div className={styles.optionItem}>
                <label>Watermark Text</label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="e.g. CONFIDENTIAL, DRAFT"
                />
              </div>

              <div className={styles.optionItem}>
                <label>Watermark Opacity ({Math.round(watermarkOpacity * 100)}%)</label>
                <div className={styles.rangeWrapper}>
                  <input
                    type="range"
                    min="0.04"
                    max="0.40"
                    step="0.02"
                    value={watermarkOpacity}
                    onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                  />
                  <span>{Math.round(watermarkOpacity * 100)}%</span>
                </div>
              </div>
            </>
          )}

          <label className={styles.checkboxOption}>
            <input
              type="checkbox"
              checked={showHeader}
              onChange={(e) => setShowHeader(e.target.checked)}
            />
            <span>Show Top Header Rule</span>
          </label>

          <label className={styles.checkboxOption}>
            <input
              type="checkbox"
              checked={showFooter}
              onChange={(e) => setShowFooter(e.target.checked)}
            />
            <span>Show Bottom Footer with Page Numbers</span>
          </label>

          <button
            type="button"
            className={`${styles.actionBtn} ${styles.primary}`}
            style={{ width: '100%', justifyContent: 'center', marginTop: '6px' }}
            onClick={() => setIsOptionsOpen(false)}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
