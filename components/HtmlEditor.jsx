'use client';

import React, { useRef, useMemo } from 'react';
import styles from '../app/styles/Editor.module.scss';
import { extractTemplateVariables } from '../utils/templateEngine';
import { Tag } from 'lucide-react';

export default function HtmlEditor({ html, onChangeHtml }) {
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  // Extract variables detected in template
  const variables = useMemo(() => {
    return extractTemplateVariables(html);
  }, [html]);

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

  const handleInsertVariable = (varName) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const insertion = `{{${varName}}}`;
    const newHtml = html.substring(0, start) + insertion + html.substring(end);
    onChangeHtml(newHtml);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + insertion.length, start + insertion.length);
    }, 10);
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.editorHeader}>
        <span>HTML Source Editor</span>
        <span>{lineCount} lines • {html.length} characters</span>
      </div>

      {variables.length > 0 && (
        <div className={styles.varChipsSection}>
          <Tag size={12} color="#94a3b8" />
          <span className={styles.chipLabel}>Detected Variables ({variables.length}):</span>
          {variables.map((varName) => (
            <span
              key={varName}
              className={styles.varChip}
              onClick={() => handleInsertVariable(varName)}
              title="Click to insert at cursor"
            >
              {`{{${varName}}}`}
            </span>
          ))}
        </div>
      )}

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
          placeholder="Paste or write your HTML template here..."
        />
      </div>
    </div>
  );
}
