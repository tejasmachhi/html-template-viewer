'use client';

import React, { useRef, useMemo } from 'react';
import styles from '../app/styles/Editor.module.scss';
import { validateJson } from '../utils/validateJson';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function JsonEditor({ jsonString, onChangeJsonString }) {
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  const validation = useMemo(() => {
    return validateJson(jsonString);
  }, [jsonString]);

  const lineCount = useMemo(() => {
    return (jsonString.match(/\n/g) || []).length + 1;
  }, [jsonString]);

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
        <span>JSON Data Payload</span>
        <span>{lineCount} lines</span>
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
          value={jsonString}
          onChange={(e) => onChangeJsonString(e.target.value)}
          onScroll={handleScroll}
          spellCheck="false"
          placeholder={`{\n  "customerName": "Tejas",\n  "total": "4500"\n}`}
        />
      </div>

      {!validation.isValid ? (
        <div className={styles.errorBanner}>
          <AlertCircle size={15} />
          <span>{validation.error}</span>
        </div>
      ) : (
        <div className={styles.successBanner}>
          <CheckCircle2 size={14} />
          <span>Valid JSON syntax • Template values synchronized</span>
        </div>
      )}
    </div>
  );
}
