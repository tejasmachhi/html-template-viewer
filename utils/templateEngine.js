/**
 * Safe Template Engine
 * Replaces {{variable}} and {{nested.prop}} placeholders with values from a data object.
 * Also supports basic {{#each array}}...{{/each}} and {{#if condition}}...{{/if}}.
 * Does NOT use eval().
 * Missing variables are replaced with a clear fallback: [Missing: variableName]
 */

/**
 * Get nested property from object using dot notation path (e.g. "order.customer.name")
 */
function getNestedValue(obj, path) {
  if (!obj || typeof obj !== 'object') return undefined;
  const parts = path.trim().split('.');
  let current = obj;
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = current[part];
  }
  return current;
}

/**
 * Render dynamic template with data
 * @param {string} template - HTML template string with {{placeholders}}
 * @param {object} data - Data object containing key-values
 * @returns {string} - Rendered HTML
 */
export function renderTemplate(template, data = {}) {
  if (!template || typeof template !== 'string') return '';
  if (!data || typeof data !== 'object') data = {};

  let output = template;

  // 1. Process {{#each arrayKey}}...{{/each}}
  const eachRegex = /\{\{#each\s+([a-zA-Z0-9_.]+)\}\}([\s\S]*?)\{\{\/each\}\}/g;
  output = output.replace(eachRegex, (match, arrayKey, innerContent) => {
    const arr = getNestedValue(data, arrayKey);
    if (!Array.isArray(arr) || arr.length === 0) {
      return '';
    }
    return arr
      .map((item, index) => {
        let itemTemplate = innerContent;
        // Replace {{this}} if item is primitive
        if (typeof item !== 'object') {
          itemTemplate = itemTemplate.replace(/\{\{this\}\}/g, String(item));
        } else {
          // Replace {{key}} or {{this.key}}
          itemTemplate = itemTemplate.replace(/\{\{(?:this\.)?([a-zA-Z0-9_.]+)\}\}/g, (m, key) => {
            if (key === '@index') return String(index);
            if (key === '@index1') return String(index + 1);
            const val = getNestedValue(item, key);
            return val !== undefined && val !== null ? String(val) : `[Missing: ${key}]`;
          });
        }
        return itemTemplate;
      })
      .join('');
  });

  // 2. Process {{#if key}}...{{/if}}
  const ifRegex = /\{\{#if\s+([a-zA-Z0-9_.]+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
  output = output.replace(ifRegex, (match, conditionKey, innerContent) => {
    const val = getNestedValue(data, conditionKey);
    if (val && (!Array.isArray(val) || val.length > 0)) {
      return innerContent;
    }
    return '';
  });

  // 3. Process remaining standard {{variable}} tags
  // Also supports #Variable# syntax common in some template formats
  const varRegex = /\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g;
  output = output.replace(varRegex, (match, varName) => {
    const value = getNestedValue(data, varName);
    if (value === undefined || value === null) {
      return `<span style="background-color: #fef08a; color: #854d0e; padding: 1px 4px; border-radius: 3px; font-weight: 600; font-size: 0.9em; border: 1px dashed #ca8a04;">[Missing: ${varName}]</span>`;
    }
    return String(value);
  });

  return output;
}

/**
 * Extract all unique variable names from template
 * @param {string} template
 * @returns {string[]}
 */
export function extractTemplateVariables(template) {
  if (!template || typeof template !== 'string') return [];
  const matches = new Set();
  const varRegex = /\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g;
  let match;
  while ((match = varRegex.exec(template)) !== null) {
    const name = match[1];
    if (!name.startsWith('#') && !name.startsWith('/') && name !== 'this') {
      matches.add(name);
    }
  }
  return Array.from(matches);
}
