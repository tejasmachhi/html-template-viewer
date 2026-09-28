'use client';

import React from 'react';
import { 
  Code2, 
  RotateCcw, 
  Trash2, 
  Wand2,
  Copy,
  Check
} from 'lucide-react';
import styles from '../app/styles/Toolbar.module.scss';

export default function Toolbar({
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
          <div className={`${styles.tabBtn} ${styles.active}`}>
            <Code2 size={14} />
            <span>HTML Editor</span>
          </div>
        </div>
      </div>

      <div className={styles.rightGroup}>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={onFormatCode}
          title="Auto-format HTML indentation"
        >
          <Wand2 size={13} color="#0071e3" />
          <span>Format HTML</span>
        </button>

        <button
          type="button"
          className={styles.actionBtn}
          onClick={onCopyRenderedHtml}
          title="Copy HTML to clipboard"
        >
          {isCopied ? <Check size={13} color="#28cd41" /> : <Copy size={13} />}
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
          title="Clear editor content"
        >
          <Trash2 size={13} />
          <span>Clear</span>
        </button>
      </div>
    </div>
  );
}
