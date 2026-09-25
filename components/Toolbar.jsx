'use client';

import React from 'react';
import { 
  Code2, 
  Database, 
  RotateCcw, 
  Trash2, 
  Wand2,
  Copy,
  Check
} from 'lucide-react';
import styles from '../app/styles/Toolbar.module.scss';

export default function Toolbar({
  activeEditorTab,
  onChangeEditorTab,
  dataSubTab,
  onChangeDataSubTab,
  onFormatCode,
  onResetTemplate,
  onClearInput,
  onCopyRenderedHtml,
  isCopied
}) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.leftGroup}>
        <div className={styles.editorTabs}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeEditorTab === 'html' ? styles.active : ''}`}
            onClick={() => onChangeEditorTab('html')}
          >
            <Code2 size={14} />
            <span>HTML Template</span>
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeEditorTab === 'data' ? styles.active : ''}`}
            onClick={() => onChangeEditorTab('data')}
          >
            <Database size={14} />
            <span>Dynamic Data</span>
            <span className={styles.subTabBadge}>{dataSubTab.toUpperCase()}</span>
          </button>
        </div>
      </div>

      <div className={styles.rightGroup}>
        {activeEditorTab === 'html' ? (
          <button
            type="button"
            className={styles.actionBtn}
            onClick={onFormatCode}
            title="Auto-format HTML indentation"
          >
            <Wand2 size={13} color="#10b981" />
            <span>Format HTML</span>
          </button>
        ) : (
          <button
            type="button"
            className={styles.actionBtn}
            onClick={onFormatCode}
            title="Auto-format JSON structure"
          >
            <Wand2 size={13} color="#10b981" />
            <span>Format JSON</span>
          </button>
        )}

        <button
          type="button"
          className={styles.actionBtn}
          onClick={onCopyRenderedHtml}
          title="Copy processed HTML to clipboard"
        >
          {isCopied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
          <span>{isCopied ? 'Copied!' : 'Copy HTML'}</span>
        </button>

        <button
          type="button"
          className={styles.actionBtn}
          onClick={onResetTemplate}
          title="Reset to default template"
        >
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>

        <button
          type="button"
          className={`${styles.actionBtn} ${styles.dangerBtn}`}
          onClick={onClearInput}
          title="Clear current editor content"
        >
          <Trash2 size={13} />
          <span>Clear</span>
        </button>
      </div>
    </div>
  );
}
