/**
 * Validates a JSON string and provides descriptive error details
 * @param {string} jsonString
 * @returns {{ isValid: boolean, data: any, error: string | null, line: number | null }}
 */
export function validateJson(jsonString) {
  if (!jsonString || typeof jsonString !== 'string') {
    return { isValid: false, data: null, error: 'JSON string is empty', line: null };
  }

  try {
    const data = JSON.parse(jsonString);
    return { isValid: true, data, error: null, line: null };
  } catch (err) {
    let errorMsg = err.message || 'Invalid JSON syntax';
    let line = null;

    // Try to extract line and column from error message
    const lineMatch = errorMsg.match(/at position (\d+)/i) || errorMsg.match(/line (\d+) column (\d+)/i);
    if (lineMatch) {
      if (lineMatch[1] && !lineMatch[2]) {
        // Character position
        const pos = parseInt(lineMatch[1], 10);
        const upToPos = jsonString.substring(0, pos);
        line = upToPos.split('\n').length;
        errorMsg = `${errorMsg} (approx line ${line})`;
      } else if (lineMatch[1] && lineMatch[2]) {
        line = parseInt(lineMatch[1], 10);
      }
    }

    return { isValid: false, data: null, error: errorMsg, line };
  }
}
