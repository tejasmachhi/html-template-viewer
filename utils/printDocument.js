/**
 * Print utility for HTML documents
 * Uses an isolated hidden iframe to guarantee clean printing without application UI
 * @param {string} htmlContent - Processed HTML string with variables replaced
 * @param {string} title - Document title for the print / PDF output
 */
export function printDocument(htmlContent, title = 'Document') {
  if (typeof window === 'undefined') return;

  // Remove existing print frame if any
  const existingFrame = document.getElementById('template-lab-print-frame');
  if (existingFrame) {
    existingFrame.remove();
  }

  // Create an invisible iframe for isolated printing
  const iframe = document.createElement('iframe');
  iframe.id = 'template-lab-print-frame';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.visibility = 'hidden';

  document.body.appendChild(iframe);

  const doc = iframe.contentWindow || iframe.contentDocument;
  const frameDoc = iframe.contentDocument || iframe.contentWindow.document;

  // Prepare print-enhanced HTML with A4 print rules and background graphics enabled
  const printEnhancement = `
    <style>
      @page {
        size: A4 portrait;
        margin: 15mm;
      }
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        box-sizing: border-box;
      }
      html, body {
        background-color: #ffffff !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      @media print {
        body {
          width: 100% !important;
        }
      }
    </style>
  `;

  let finalHtml = htmlContent;
  if (finalHtml.includes('</head>')) {
    finalHtml = finalHtml.replace('</head>', `${printEnhancement}</head>`);
  } else {
    finalHtml = `${printEnhancement}${finalHtml}`;
  }

  frameDoc.open();
  frameDoc.write(finalHtml);
  frameDoc.close();

  // Set page title for PDF default filename
  if (iframe.contentWindow.document) {
    iframe.contentWindow.document.title = title;
  }

  // Allow styles and fonts to finish rendering before triggering print
  setTimeout(() => {
    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } catch (e) {
      console.error('Error invoking print:', e);
      window.print();
    }
  }, 350);
}
