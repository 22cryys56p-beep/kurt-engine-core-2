/**
 * Lightweight, zero-dependency Markdown to HTML parser
 * Matches standard markdown output: headings (#, ##, ###), bold, italic, paragraphs, lists, links.
 */
export function markdownToHtml(markdown: string): string {
  const lines = markdown.split(/\r?\n/);
  const result: string[] = [];
  let inList = false;
  let paragraphBuffer: string[] = [];

  const flushParagraph = () => {
    if (paragraphBuffer.length > 0) {
      const text = paragraphBuffer.join(' ').trim();
      if (text) {
        result.push(`<p>${formatInline(text)}</p>`);
      }
      paragraphBuffer = [];
    }
  };

  const flushList = () => {
    if (inList) {
      result.push('</ul>');
      inList = false;
    }
  };

  function formatInline(text: string): string {
    return text
      // Bold **text**
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic *text*
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Links [text](url)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    // Headings
    if (line.startsWith('### ')) {
      flushParagraph();
      flushList();
      result.push(`<h3>${formatInline(line.slice(4))}</h3>`);
      continue;
    }
    if (line.startsWith('## ')) {
      flushParagraph();
      flushList();
      result.push(`<h2>${formatInline(line.slice(3))}</h2>`);
      continue;
    }
    if (line.startsWith('# ')) {
      flushParagraph();
      flushList();
      result.push(`<h1>${formatInline(line.slice(2))}</h1>`);
      continue;
    }

    // Unordered lists
    if (line.startsWith('- ') || line.startsWith('* ')) {
      flushParagraph();
      if (!inList) {
        result.push('<ul>');
        inList = true;
      }
      result.push(`<li>${formatInline(line.slice(2))}</li>`);
      continue;
    }

    flushList();
    paragraphBuffer.push(line);
  }

  flushParagraph();
  flushList();

  return result.join('\n');
}
