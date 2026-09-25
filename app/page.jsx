'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Toolbar from '../components/Toolbar';
import HtmlEditor from '../components/HtmlEditor';
import DataEditor from '../components/DataEditor';
import PreviewContainer from '../components/PreviewContainer';
import PrintModal from '../components/PrintModal';
import { SAMPLE_TEMPLATES } from '../utils/sampleTemplates';
import { renderTemplate } from '../utils/templateEngine';
import { validateJson } from '../utils/validateJson';
import { formatHtml, formatJson } from '../utils/formatters';
import { printDocument } from '../utils/printDocument';
import styles from './styles/Workspace.module.scss';
import { Code2, Database, Eye } from 'lucide-react';

export default function TemplateLabPage() {
  const initialPreset = SAMPLE_TEMPLATES[0];

  const [selectedTemplateId, setSelectedTemplateId] = useState(initialPreset.id);
  const [htmlTemplate, setHtmlTemplate] = useState(initialPreset.html);
  const [jsonString, setJsonString] = useState(JSON.stringify(initialPreset.data, null, 2));

  // Editor and preview tabs
  const [activeEditorTab, setActiveEditorTab] = useState('html'); // 'html' | 'data'
  const [dataSubTab, setDataSubTab] = useState('json'); // 'json' | 'form'
  const [viewMode, setViewMode] = useState('email'); // 'email' | 'document' | 'mobile'

  // Mobile layout tab
  const [mobileTab, setMobileTab] = useState('editor'); // 'editor' | 'preview'

  // UI state
  const [isCopied, setIsCopied] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Parse JSON data safely
  const parsedDataState = useMemo(() => {
    return validateJson(jsonString);
  }, [jsonString]);

  // Compute rendered HTML using template engine
  const renderedHtml = useMemo(() => {
    const data = parsedDataState.isValid ? parsedDataState.data : {};
    return renderTemplate(htmlTemplate, data);
  }, [htmlTemplate, parsedDataState]);

  // Handle template selection
  const handleSelectTemplate = useCallback((templateId) => {
    const found = SAMPLE_TEMPLATES.find((t) => t.id === templateId);
    if (found) {
      setSelectedTemplateId(found.id);
      setHtmlTemplate(found.html);
      setJsonString(JSON.stringify(found.data, null, 2));
      // Adjust view mode based on template recommendation
      if (found.category === 'Document') {
        setViewMode('document');
      } else {
        setViewMode('email');
      }
    }
  }, []);

  // Format code (HTML or JSON)
  const handleFormatCode = useCallback(() => {
    if (activeEditorTab === 'html') {
      const formatted = formatHtml(htmlTemplate);
      setHtmlTemplate(formatted);
    } else {
      const formatted = formatJson(jsonString);
      setJsonString(formatted);
    }
  }, [activeEditorTab, htmlTemplate, jsonString]);

  // Reset to original preset
  const handleResetTemplate = useCallback(() => {
    const found = SAMPLE_TEMPLATES.find((t) => t.id === selectedTemplateId) || SAMPLE_TEMPLATES[0];
    setHtmlTemplate(found.html);
    setJsonString(JSON.stringify(found.data, null, 2));
  }, [selectedTemplateId]);

  // Clear current input
  const handleClearInput = useCallback(() => {
    if (activeEditorTab === 'html') {
      setHtmlTemplate('');
    } else {
      setJsonString('{}');
    }
  }, [activeEditorTab]);

  // Copy rendered HTML
  const handleCopyRenderedHtml = useCallback(() => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(renderedHtml).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  }, [renderedHtml]);

  // Direct print trigger
  const handleTriggerPrint = useCallback(() => {
    const title = SAMPLE_TEMPLATES.find((t) => t.id === selectedTemplateId)?.name || 'Document';
    printDocument(renderedHtml, title);
  }, [renderedHtml, selectedTemplateId]);

  return (
    <div className={styles.workspaceContainer}>
      {/* Top Navbar */}
      <Navbar
        selectedTemplateId={selectedTemplateId}
        onSelectTemplate={handleSelectTemplate}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        onTriggerPrint={handleTriggerPrint}
        onOpenPdfModal={() => setIsPdfModalOpen(true)}
      />

      {/* Main Split-Pane Workspace */}
      <div className={styles.mainContent}>
        {/* Left Side: Editor Pane */}
        <section 
          className={`${styles.leftPane} ${mobileTab === 'editor' ? styles.mobileActive : ''}`}
          aria-label="Editor Section"
        >
          <Toolbar
            activeEditorTab={activeEditorTab}
            onChangeEditorTab={setActiveEditorTab}
            dataSubTab={dataSubTab}
            onChangeDataSubTab={setDataSubTab}
            onFormatCode={handleFormatCode}
            onResetTemplate={handleResetTemplate}
            onClearInput={handleClearInput}
            onCopyRenderedHtml={handleCopyRenderedHtml}
            isCopied={isCopied}
          />

          {activeEditorTab === 'html' ? (
            <HtmlEditor
              html={htmlTemplate}
              onChangeHtml={setHtmlTemplate}
            />
          ) : (
            <DataEditor
              jsonString={jsonString}
              onChangeJsonString={setJsonString}
              dataSubTab={dataSubTab}
              onChangeDataSubTab={setDataSubTab}
              htmlTemplate={htmlTemplate}
            />
          )}
        </section>

        {/* Right Side: Live Preview Pane */}
        <section 
          className={`${styles.rightPane} ${mobileTab === 'preview' ? styles.mobileActive : ''}`}
          aria-label="Live Preview Section"
        >
          <PreviewContainer
            viewMode={viewMode}
            renderedHtml={renderedHtml}
          />
        </section>
      </div>

      {/* Mobile Bottom Navigation Tabs */}
      <div className={styles.mobileNavTabs}>
        <button
          type="button"
          className={`${styles.mobileTabBtn} ${mobileTab === 'editor' && activeEditorTab === 'html' ? styles.active : ''}`}
          onClick={() => {
            setMobileTab('editor');
            setActiveEditorTab('html');
          }}
        >
          <Code2 size={16} />
          <span>HTML</span>
        </button>

        <button
          type="button"
          className={`${styles.mobileTabBtn} ${mobileTab === 'editor' && activeEditorTab === 'data' ? styles.active : ''}`}
          onClick={() => {
            setMobileTab('editor');
            setActiveEditorTab('data');
          }}
        >
          <Database size={16} />
          <span>DATA</span>
        </button>

        <button
          type="button"
          className={`${styles.mobileTabBtn} ${mobileTab === 'preview' ? styles.active : ''}`}
          onClick={() => setMobileTab('preview')}
        >
          <Eye size={16} />
          <span>PREVIEW</span>
        </button>
      </div>

      {/* Save as PDF Helper Modal */}
      <PrintModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        onConfirmPrint={handleTriggerPrint}
      />
    </div>
  );
}
