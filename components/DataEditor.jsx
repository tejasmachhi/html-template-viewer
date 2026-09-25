'use client';

import React from 'react';
import JsonEditor from './JsonEditor';
import FormEditor from './FormEditor';
import styles from '../app/styles/Editor.module.scss';
import toolbarStyles from '../app/styles/Toolbar.module.scss';
import { Braces, FormInput } from 'lucide-react';
import { validateJson } from '../utils/validateJson';

export default function DataEditor({
  jsonString,
  onChangeJsonString,
  dataSubTab,
  onChangeDataSubTab,
  htmlTemplate
}) {
  const parsed = validateJson(jsonString);
  const currentDataObj = parsed.isValid ? parsed.data : {};

  const handleFormDataChange = (updatedObj) => {
    try {
      const formatted = JSON.stringify(updatedObj, null, 2);
      onChangeJsonString(formatted);
    } catch (e) {
      console.error('Failed to serialize form data to JSON', e);
    }
  };

  return (
    <div className={styles.editorContainer}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '6px 16px',
        background: '#111c38',
        borderBottom: '1px solid #1e2e50'
      }}>
        <div className={toolbarStyles.editorTabs}>
          <button
            type="button"
            className={`${toolbarStyles.tabBtn} ${dataSubTab === 'json' ? toolbarStyles.active : ''}`}
            onClick={() => onChangeDataSubTab('json')}
          >
            <Braces size={13} />
            <span>JSON Editor</span>
          </button>

          <button
            type="button"
            className={`${toolbarStyles.tabBtn} ${dataSubTab === 'form' ? toolbarStyles.active : ''}`}
            onClick={() => onChangeDataSubTab('form')}
          >
            <FormInput size={13} />
            <span>Form Mode</span>
          </button>
        </div>

        <span style={{ fontSize: '11px', color: '#94a3b8' }}>
          {dataSubTab === 'form' && !parsed.isValid && (
            <span style={{ color: '#ef4444' }}>⚠ Fix JSON syntax errors to use Form mode</span>
          )}
        </span>
      </div>

      {dataSubTab === 'json' ? (
        <JsonEditor
          jsonString={jsonString}
          onChangeJsonString={onChangeJsonString}
        />
      ) : (
        <FormEditor
          dataObj={currentDataObj}
          htmlTemplate={htmlTemplate}
          onChangeDataObj={handleFormDataChange}
        />
      )}
    </div>
  );
}
