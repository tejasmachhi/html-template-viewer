'use client';

import React from 'react';
import styles from '../app/styles/Editor.module.scss';
import { extractTemplateVariables } from '../utils/templateEngine';

function formatLabel(camelCaseStr) {
  const result = camelCaseStr.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export default function FormEditor({
  dataObj,
  htmlTemplate,
  onChangeDataObj
}) {
  // Extract all keys from current dataObj and also any template variables
  const templateVars = extractTemplateVariables(htmlTemplate);
  const dataKeys = Object.keys(dataObj || {});

  // Merge keys preserving order
  const allFieldKeys = Array.from(new Set([...dataKeys, ...templateVars]));

  const handleFieldChange = (key, value) => {
    const updated = {
      ...(dataObj || {}),
      [key]: value
    };
    onChangeDataObj(updated);
  };

  const handleArrayItemChange = (arrayKey, index, itemKey, value) => {
    const arr = [...(dataObj[arrayKey] || [])];
    arr[index] = {
      ...arr[index],
      [itemKey]: value
    };
    onChangeDataObj({
      ...(dataObj || {}),
      [arrayKey]: arr
    });
  };

  return (
    <div className={styles.formScrollContainer}>
      <div className={styles.formGrid}>
        {allFieldKeys.map((key) => {
          const val = dataObj ? dataObj[key] : undefined;

          // If field is an array of objects (e.g. items / products)
          if (Array.isArray(val)) {
            return (
              <div key={key} className={styles.subformSection}>
                <div className={styles.sectionTitle}>
                  <span>{formatLabel(key)} ({val.length} entries)</span>
                  <span className={styles.keyBadge}>{`{{#each ${key}}}`}</span>
                </div>

                {val.map((item, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      background: 'rgba(11, 19, 43, 0.5)', 
                      padding: '12px', 
                      borderRadius: '6px', 
                      marginBottom: '10px',
                      border: '1px solid #1e2e50'
                    }}
                  >
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>
                      Item #{idx + 1}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
                      {typeof item === 'object' && item !== null ? (
                        Object.keys(item).map((subKey) => (
                          <div key={subKey} className={styles.formGroup}>
                            <label style={{ fontSize: '11px' }}>
                              {formatLabel(subKey)}
                            </label>
                            <input
                              type="text"
                              value={item[subKey] !== undefined ? item[subKey] : ''}
                              onChange={(e) => handleArrayItemChange(key, idx, subKey, e.target.value)}
                            />
                          </div>
                        ))
                      ) : (
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => {
                            const newArr = [...val];
                            newArr[idx] = e.target.value;
                            onChangeDataObj({ ...dataObj, [key]: newArr });
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          }

          // Long text fields use textarea
          const isLongText = typeof val === 'string' && (val.length > 50 || val.includes('\n') || key.toLowerCase().includes('address') || key.toLowerCase().includes('notes'));

          return (
            <div key={key} className={styles.formGroup}>
              <label>
                <span>{formatLabel(key)}</span>
                <span className={styles.keyBadge}>{`{{${key}}}`}</span>
              </label>

              {isLongText ? (
                <textarea
                  value={val !== undefined ? val : ''}
                  onChange={(e) => handleFieldChange(key, e.target.value)}
                  placeholder={`Enter ${formatLabel(key)}...`}
                />
              ) : (
                <input
                  type="text"
                  value={val !== undefined ? val : ''}
                  onChange={(e) => handleFieldChange(key, e.target.value)}
                  placeholder={`Enter ${formatLabel(key)}...`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
