'use client';

import React, { useRef, useMemo } from 'react';
import styles from '../app/styles/Editor.module.scss';

export default function HtmlEditor({ html, onChangeHtml }) {
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  // Compute line count
  const lineCount = useMemo(() => {
    return (html.match(/\n/g) || []).length + 1;
  }, [html]);

  const lineNumbersArray = useMemo(() => {
    return Array.from({ length: Math.max(lineCount, 25) }, (_, i) => i + 1);
  }, [lineCount]);

  const handleScroll = (e) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.target.scrollTop;
    }
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.editorHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 600 }}>HTML Source</span>
          <span style={{ fontSize: '11px', color: 'var(--accent-color)', background: 'var(--accent-color-light)', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>
            Paste your template here
          </span>
        </div>
        <span>{lineCount} lines • {html.length} characters</span>
      </div>

      <div className={styles.codeAreaWrapper}>
        <div className={styles.lineNumbers} ref={lineNumbersRef}>
          {lineNumbersArray.map((num) => (
            <div key={num}>{num}</div>
          ))}
        </div>

        <textarea
          ref={textareaRef}
          className={styles.codeTextarea}
          value={html}
          onChange={(e) => onChangeHtml(e.target.value)}
          onScroll={handleScroll}
          spellCheck="false"
          placeholder="<!-- Paste your HTML template here -->"
        />
      </div>
    </div>
  );
}
