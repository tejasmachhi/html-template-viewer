'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Settings,
  RefreshCw,
  Sliders,
  PanelLeftClose,
  PanelLeft,
  Maximize2,
  FileCheck,
  Sparkles,
  Layers,
  X
} from 'lucide-react';
import {
  createSampleIronPdfDocument,
  convertHtmlToPdfBytes
} from '../utils/ironPdfEngine';
import styles from '../app/styles/IronPdfViewer.module.scss';

export default function IronPdfViewer({
  htmlContent,
  templateTitle = 'Document Preview'
}) {
  // Document state
  const [pdfBytes, setPdfBytes] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [docName, setDocName] = useState('IronPDF_Contract_Agreement.pdf');
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('Initializing IronPDF Engine...');

  // Navigation & Zoom state
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [viewLayout, setViewLayout] = useState('single'); // 'single' | 'continuous'
  const [isThumbnailsOpen, setIsThumbnailsOpen] = useState(true);

  // IronPDF Customization Options State
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [showWatermark, setShowWatermark] = useState(true);
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.12);
  const [watermarkColor, setWatermarkColor] = useState('#0071e3');
  const [showHeader, setShowHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);

  // References
  const mainCanvasRef = useRef(null);
  const thumbnailCanvasRefs = useRef({});
  const continuousCanvasRefs = useRef({});
  const fileInputRef = useRef(null);
  const viewportAreaRef = useRef(null);
  const renderTaskRef = useRef(null);

  // Initialize with sample IronPDF document
  useEffect(() => {
    let isMounted = true;

    async function loadInitialDoc() {
      try {
        setIsLoading(true);
        setStatusMessage('Compiling IronPDF Document...');
        const initialBytes = await createSampleIronPdfDocument('agreement', {
          watermarkText,
          showWatermark,
          watermarkOpacity,
          watermarkColor,
          showHeader,
          showFooter,
          rotation: 0,
        });

        if (isMounted) {
          setPdfBytes(initialBytes);
          setDocName('IronPDF_Agreement_Specification.pdf');
        }
      } catch (err) {
        console.error('Failed to generate initial IronPDF doc:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadInitialDoc();
    return () => {
      isMounted = false;
    };
  }, []);

  // Load PDF with pdfjs-dist whenever pdfBytes changes
  useEffect(() => {
    if (!pdfBytes) return;

    let isCancelled = false;

    async function parsePdf() {
      try {
        setIsLoading(true);
        setStatusMessage('Rendering Vector PDF Pages...');

        // Dynamically import pdfjs-dist
        const pdfjs = await import('pdfjs-dist/build/pdf.mjs');
        
        // Configure worker via reliable CDN matching generic build
        if (!pdfjs.GlobalWorkerOptions.workerSrc) {
          pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version || '4.3.136'}/build/pdf.worker.min.mjs`;
        }

        const loadingTask = pdfjs.getDocument({
          data: pdfBytes.slice(),
          cMapUrl: 'https://unpkg.com/pdfjs-dist/cmaps/',
          cMapPacked: true,
        });

        const doc = await loadingTask.promise;
        if (isCancelled) return;

        setPdfDoc(doc);
        setTotalPages(doc.numPages);
        setCurrentPage(1);
      } catch (err) {
        console.warn('PDF.js worker parse warning, retrying direct:', err);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    parsePdf();

    return () => {
      isCancelled = true;
    };
  }, [pdfBytes]);

  // Render main page canvas (Single Page View)
  useEffect(() => {
    if (!pdfDoc || viewLayout !== 'single') return;

    let isCancelled = false;

    async function renderSinglePage() {
      try {
        const page = await pdfDoc.getPage(currentPage);
        if (isCancelled) return;

        const canvas = mainCanvasRef.current;
        if (!canvas) return;

        // Cancel previous render task if any
        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch (e) {
            // Safe ignore
          }
        }

        const dpr = window.devicePixelRatio || 1;
        const totalRotation = (page.rotate + rotation) % 360;
        const scale = (zoomLevel / 100) * 1.5; // Baseline high-DPI scaling

        const viewport = page.getViewport({ scale: scale * dpr, rotation: totalRotation });
        const cssViewport = page.getViewport({ scale: scale, rotation: totalRotation });

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = `${Math.floor(cssViewport.width)}px`;
        canvas.style.height = `${Math.floor(cssViewport.height)}px`;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;
        await renderTask.promise;
      } catch (err) {
        if (err?.name !== 'RenderingCancelledException') {
          console.error('Error rendering page:', err);
        }
      }
    }

    renderSinglePage();

    return () => {
      isCancelled = true;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch (e) {}
      }
    };
  }, [pdfDoc, currentPage, zoomLevel, rotation, viewLayout]);

  // Render continuous scroll pages
  useEffect(() => {
    if (!pdfDoc || viewLayout !== 'continuous') return;

    let isCancelled = false;

    async function renderAllContinuousPages() {
      for (let pNum = 1; pNum <= pdfDoc.numPages; pNum++) {
        if (isCancelled) break;
        try {
          const page = await pdfDoc.getPage(pNum);
          const canvas = continuousCanvasRefs.current[pNum];
          if (!canvas) continue;

          const dpr = window.devicePixelRatio || 1;
          const totalRotation = (page.rotate + rotation) % 360;
          const scale = (zoomLevel / 100) * 1.5;

          const viewport = page.getViewport({ scale: scale * dpr, rotation: totalRotation });
          const cssViewport = page.getViewport({ scale: scale, rotation: totalRotation });

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
        } catch (e) {
          // ignore
        }
      }
    }

    renderAllContinuousPages();

    return () => {
      isCancelled = true;
    };
  }, [pdfDoc, zoomLevel, rotation, viewLayout]);

  // Render Thumbnails in Sidebar
  useEffect(() => {
    if (!pdfDoc || !isThumbnailsOpen) return;

    let isCancelled = false;

    async function renderThumbnails() {
      for (let pNum = 1; pNum <= pdfDoc.numPages; pNum++) {
        if (isCancelled) break;
        try {
          const page = await pdfDoc.getPage(pNum);
          const canvas = thumbnailCanvasRefs.current[pNum];
          if (!canvas) continue;

          const dpr = window.devicePixelRatio || 1;
          const thumbScale = 0.28 * dpr;
          const totalRotation = (page.rotate + rotation) % 360;
          const viewport = page.getViewport({ scale: thumbScale, rotation: totalRotation });

          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);

          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          await page.render({
            canvasContext: ctx,
            viewport: viewport,
          }).promise;
        } catch (e) {
          // Thumbnail error fallback
        }
      }
    }

    renderThumbnails();

    return () => {
      isCancelled = true;
    };
  }, [pdfDoc, isThumbnailsOpen, rotation]);

  // Action: Convert Current Live HTML Template to PDF
  const handleCompileCurrentHtml = useCallback(async () => {
    if (!htmlContent) return;
    try {
      setIsLoading(true);
      setStatusMessage('Converting HTML Template to IronPDF...');
      
      const newPdfBytes = await convertHtmlToPdfBytes(htmlContent, {
        documentTitle: templateTitle || 'Template Document',
        showWatermark,
        watermarkText,
        watermarkOpacity,
        watermarkColor,
        showHeader,
        showFooter,
        rotation,
      });

      setPdfBytes(newPdfBytes);
      setDocName(`${(templateTitle || 'Document').replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`);
    } catch (err) {
      console.error('Failed to convert HTML to PDF:', err);
    } finally {
      setIsLoading(false);
    }
  }, [htmlContent, templateTitle, showWatermark, watermarkText, watermarkOpacity, watermarkColor, showHeader, showFooter, rotation]);

  // Action: Apply IronPDF Options & Re-stamp
  const handleApplyOptions = useCallback(async () => {
    setIsOptionsOpen(false);
    await handleCompileCurrentHtml();
  }, [handleCompileCurrentHtml]);

  // Action: Upload Any PDF File
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please select a valid PDF document.');
      return;
    }

    setIsLoading(true);
    setStatusMessage(`Opening ${file.name}...`);

    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      setPdfBytes(new Uint8Array(arrayBuffer));
      setDocName(file.name);
      setRotation(0);
      setIsLoading(false);
    };
    reader.readAsArrayBuffer(file);
  };

  // Action: Rotate 90 degrees Clockwise
  const handleRotateCw = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Action: Rotate 90 degrees Counter-Clockwise
  const handleRotateCcw = () => {
    setRotation((prev) => (prev - 90 + 360) % 360);
  };

  // Action: Zoom In
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 15, 300));
  };

  // Action: Zoom Out
  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 15, 40));
  };

  // Action: Fit Width
  const handleFitWidth = () => {
    setZoomLevel(110);
  };

  // Action: Fit Page
  const handleFitPage = () => {
    setZoomLevel(85);
  };

  // Action: Jump to Page
  const handleJumpToPage = (pageNum) => {
    const p = Math.max(1, Math.min(pageNum, totalPages));
    setCurrentPage(p);
  };

  // Action: Download PDF
  const handleDownloadPdf = () => {
    if (!pdfBytes) return;
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = docName || 'IronPDF_Export.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Action: Print PDF
  const handlePrintPdf = () => {
    if (!pdfBytes) return;
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.addEventListener('load', () => {
        printWindow.print();
      });
    }
  };

  return (
    <div className={styles.pdfViewerRoot}>
      {/* IronPDF Studio Top Navigation Toolbar */}
      <header className={styles.studioToolbar}>
        {/* Left Section: Thumbnail Toggle & Title */}
        <div className={styles.leftControls}>
          <button
            type="button"
            className={`${styles.sidebarToggleBtn} ${isThumbnailsOpen ? styles.active : ''}`}
            onClick={() => setIsThumbnailsOpen(!isThumbnailsOpen)}
            title={isThumbnailsOpen ? 'Collapse Page Thumbnails' : 'Expand Page Thumbnails'}
          >
            {isThumbnailsOpen ? <PanelLeftClose size={16} /> : <PanelLeft size={16} />}
          </button>

          <div className={styles.docTitleArea}>
            <span className={styles.docTitle} title={docName}>{docName}</span>
            <span className={styles.engineBadge}>
              <FileCheck size={11} />
              IronPDF
            </span>
          </div>
        </div>

        {/* Center Section: Page Navigation, Zoom, Rotate, Layout */}
        <div className={styles.centerControls}>
          {/* Page Navigation */}
          <div className={styles.controlGroup}>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => handleJumpToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              title="Previous Page"
            >
              <ChevronLeft size={16} />
            </button>

            <div className={styles.pageIndicator}>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={currentPage}
                onChange={(e) => handleJumpToPage(parseInt(e.target.value) || 1)}
              />
              <span className={styles.totalPages}>/ {totalPages}</span>
            </div>

            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => handleJumpToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              title="Next Page"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className={styles.controlGroup}>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={handleZoomOut}
              disabled={zoomLevel <= 40}
              title="Zoom Out (-15%)"
            >
              <ZoomOut size={14} />
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
              <option value="200">200%</option>
              <option value="fit-width">Fit Width</option>
              <option value="fit-page">Fit Page</option>
            </select>

            <button
              type="button"
              className={styles.iconBtn}
              onClick={handleZoomIn}
              disabled={zoomLevel >= 300}
              title="Zoom In (+15%)"
            >
              <ZoomIn size={14} />
            </button>
          </div>

          {/* Page Rotation Controls */}
          <div className={styles.controlGroup}>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={handleRotateCcw}
              title="Rotate 90° Counter-Clockwise"
            >
              <RotateCcw size={14} />
            </button>

            <button
              type="button"
              className={styles.iconBtn}
              onClick={handleRotateCw}
              title="Rotate 90° Clockwise"
            >
              <RotateCw size={14} />
            </button>
          </div>

          {/* Layout Mode (Single vs Continuous) */}
          <div className={styles.controlGroup}>
            <button
              type="button"
              className={`${styles.iconBtn} ${viewLayout === 'single' ? styles.active : ''}`}
              onClick={() => setViewLayout('single')}
              title="Single Page Mode"
            >
              <FileText size={14} />
            </button>

            <button
              type="button"
              className={`${styles.iconBtn} ${viewLayout === 'continuous' ? styles.active : ''}`}
              onClick={() => setViewLayout('continuous')}
              title="Continuous Scroll Mode"
            >
              <Layers size={14} />
            </button>
          </div>
        </div>

        {/* Right Section: Actions (HTML Sync, Upload, Options, Print, Download) */}
        <div className={styles.rightControls}>
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.accent}`}
            onClick={handleCompileCurrentHtml}
            title="Compile & Render Current HTML Editor Template into IronPDF"
          >
            <Sparkles size={13} />
            <span>Render HTML</span>
          </button>

          <button
            type="button"
            className={styles.actionBtn}
            onClick={() => fileInputRef.current?.click()}
            title="Open & View any local PDF from your computer"
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
            title="IronPDF Watermark & Header/Footer Settings"
          >
            <Sliders size={13} />
          </button>

          <button
            type="button"
            className={styles.actionBtn}
            onClick={handlePrintPdf}
            title="Print PDF Document"
          >
            <Printer size={13} />
          </button>

          <button
            type="button"
            className={`${styles.actionBtn} ${styles.primary}`}
            onClick={handleDownloadPdf}
            title="Download PDF file"
          >
            <Download size={13} />
            <span>Save PDF</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Stage */}
      <div className={styles.mainStage}>
        {/* Left Page Thumbnails Sidebar */}
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
                  <canvas
                    ref={(el) => {
                      if (el) thumbnailCanvasRefs.current[pageNum] = el;
                    }}
                  />
                </div>
                <span className={styles.thumbnailBadge}>Page {pageNum}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Center / Right Canvas Viewport Area */}
        <main className={styles.viewportArea} ref={viewportAreaRef}>
          <div className={styles.canvasStage}>
            {viewLayout === 'single' ? (
              // Single Page Mode
              <div className={styles.pageContainer}>
                <canvas ref={mainCanvasRef} />
                <span className={styles.pageNumberBadge}>
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            ) : (
              // Continuous Vertical Scroll Mode
              Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <div key={`page-${pageNum}`} className={styles.pageContainer}>
                  <canvas
                    ref={(el) => {
                      if (el) continuousCanvasRefs.current[pageNum] = el;
                    }}
                  />
                  <span className={styles.pageNumberBadge}>
                    Page {pageNum} of {totalPages}
                  </span>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner} />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* IronPDF Studio Options Popover */}
      {isOptionsOpen && (
        <div className={styles.optionsDrawer}>
          <div className={styles.optionsHeader}>
            <h4>
              <Sliders size={15} />
              IronPDF Engine Controls
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
            <span>Stamp IronPDF Watermark</span>
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
                    max="0.35"
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
            <span>Top Header Rule &amp; Document Name</span>
          </label>

          <label className={styles.checkboxOption}>
            <input
              type="checkbox"
              checked={showFooter}
              onChange={(e) => setShowFooter(e.target.checked)}
            />
            <span>Bottom Footer with "Page X of Y"</span>
          </label>

          <button
            type="button"
            className={`${styles.actionBtn} ${styles.primary}`}
            style={{ width: '100%', justifyContent: 'center', marginTop: '6px' }}
            onClick={handleApplyOptions}
          >
            Apply &amp; Re-render PDF
          </button>
        </div>
      )}
    </div>
  );
}
