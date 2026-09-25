/**
 * Formats a JSON string with 2-space indentation
 * @param {string} jsonStr
 * @returns {string}
 */
export function formatJson(jsonStr) {
  try {
    const parsed = JSON.parse(jsonStr);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return jsonStr;
  }
}

/**
 * Lightweight HTML formatter that indents nested tags nicely
 * @param {string} html
 * @returns {string}
 */
export function formatHtml(html) {
  if (!html) return '';
  let formatted = '';
  let indent = 0;
  const tab = '  ';

  // Normalize spaces around tags
  const tokens = html
    .replace(/>\s*</g, '><')
    .replace(/</g, '\n<')
    .split('\n')
    .filter(line => line.trim().length > 0);

  const voidElements = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr', '!doctype'
  ]);

  for (let line of tokens) {
    line = line.trim();
    if (!line) continue;

    const isClosing = line.startsWith('</');
    const isSelfClosing = line.endsWith('/>') || isVoidTag(line, voidElements);
    const isComment = line.startsWith('<!--') || line.startsWith('<!DOCTYPE');

    if (isClosing) {
      indent = Math.max(0, indent - 1);
    }

    formatted += tab.repeat(indent) + line + '\n';

    if (!isClosing && !isSelfClosing && !isComment && line.startsWith('<') && !line.includes('</')) {
      indent++;
    }
  }

  return formatted.trim();
}

function isVoidTag(tagLine, voidSet) {
  const match = tagLine.match(/<([a-zA-Z0-9!]+)/);
  if (!match) return false;
  return voidSet.has(match[1].toLowerCase());
}
