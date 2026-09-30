'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Toolbar from '../components/Toolbar';
import HtmlEditor from '../components/HtmlEditor';
import DataEditor from '../components/DataEditor';
import PreviewContainer from '../components/PreviewContainer';
import PrintModal from '../components/PrintModal';
import SendEmailModal from '../components/SendEmailModal';
import { renderTemplate } from '../utils/templateEngine';
import { validateJson } from '../utils/validateJson';
import { formatHtml, formatJson } from '../utils/formatters';
import { printDocument } from '../utils/printDocument';
import styles from './styles/Workspace.module.scss';
import { Code2, Database, Eye } from 'lucide-react';

const DEFAULT_EMPTY_HTML = `<!-- Paste your HTML template here -->\n`;
const DEFAULT_EMPTY_JSON = `{\n  \n}`;

export default function TemplateLabPage() {
  const [htmlTemplate, setHtmlTemplate] = useState(DEFAULT_EMPTY_HTML);
  const [jsonString, setJsonString] = useState(DEFAULT_EMPTY_JSON);

  // Light / Dark Theme state (Light by default)
  const [theme, setTheme] = useState('light');

  // Load saved theme on client mount or default to light
  useEffect(() => {
    const savedTheme = localStorage.getItem('doc_viewer_theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      setTheme('light');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const handleToggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const nextTheme = prevTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('doc_viewer_theme', nextTheme);
      document.documentElement.setAttribute('data-theme', nextTheme);
      return nextTheme;
    });
  }, []);

  // Editor and preview tabs
  const [activeEditorTab, setActiveEditorTab] = useState('html'); // 'html' | 'data'
  const [dataSubTab, setDataSubTab] = useState('json'); // 'json' | 'form'
  const [viewMode, setViewMode] = useState('email'); // 'email' | 'document' | 'mobile'

  // Mobile layout tab
  const [mobileTab, setMobileTab] = useState('editor'); // 'editor' | 'preview'

  // UI modal states
  const [isCopied, setIsCopied] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isSendEmailModalOpen, setIsSendEmailModalOpen] = useState(false);

  // Parse JSON data safely
  const parsedDataState = useMemo(() => {
    return validateJson(jsonString);
  }, [jsonString]);

  // Compute rendered HTML using template engine
  const renderedHtml = useMemo(() => {
    const data = parsedDataState.isValid ? parsedDataState.data : {};
    return renderTemplate(htmlTemplate, data);
  }, [htmlTemplate, parsedDataState]);

  // Extract template title from HTML or fallback
  const templateTitle = useMemo(() => {
    const match = htmlTemplate.match(/<title[^>]*>(.*?)<\/title>/i);
    return match ? match[1].trim() : 'Document Preview';
  }, [htmlTemplate]);

  // Extract recipient email from dynamic data
  const defaultRecipientEmail = useMemo(() => {
    const d = parsedDataState.data || {};
    return d.customerEmail || d.email || d.appleId || d.attendeeEmail || '';
  }, [parsedDataState.data]);

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

  // Reset to empty template
  const handleResetTemplate = useCallback(() => {
    setHtmlTemplate(DEFAULT_EMPTY_HTML);
    setJsonString(DEFAULT_EMPTY_JSON);
  }, []);

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
    printDocument(renderedHtml, templateTitle);
  }, [renderedHtml, templateTitle]);

  return (
    <div className={styles.workspaceContainer}>
      {/* Top Navbar */}
      <Navbar
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        onTriggerPrint={handleTriggerPrint}
        onOpenPdfModal={() => setIsPdfModalOpen(true)}
        onOpenSendEmailModal={() => setIsSendEmailModalOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
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
            templateTitle={templateTitle}
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

      {/* Save as PDF Modal */}
      <PrintModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        onConfirmPrint={handleTriggerPrint}
      />

      {/* Send Email Modal */}
      <SendEmailModal
        isOpen={isSendEmailModalOpen}
        onClose={() => setIsSendEmailModalOpen(false)}
        renderedHtml={renderedHtml}
        templateName={templateTitle}
        defaultRecipient={defaultRecipientEmail}
        defaultSubject={templateTitle}
      />
    </div>
  );
}
