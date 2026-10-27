export interface PageData {
  slug: string;
  filename: string;
  title: string;
  rawMarkdown: string;
}

export const initialPages: PageData[] = [
  {
    slug: 'home',
    filename: 'home.md',
    title: 'Aloha',
    rawMarkdown: `---
title: Aloha
---

# Hi! I'm Kurt

Welcome to Kurt's English.`,
  },
  {
    slug: 'who',
    filename: 'who.md',
    title: 'Who Am I?',
    rawMarkdown: `---
title: Who Am I?
---

# About Kurt

This is the second page.

Eventually this page will describe the history of Kurt's English.`,
  },
  {
    slug: 'classes',
    filename: 'classes.md',
    title: 'Classes',
    rawMarkdown: `---
title: Classes
---

# Classes

This page will describe the classes currently offered.`,
  },
  {
    slug: 'prices',
    filename: 'prices.md',
    title: 'Prices',
    rawMarkdown: `---
title: Prices
---

# Prices

This page will contain tuition information.`,
  },
  {
    slug: 'contact',
    filename: 'contact.md',
    title: 'Contact',
    rawMarkdown: `---
title: Contact
---

# Contact

This page will contain contact information.`,
  },
];

export function parseMarkdown(raw: string): { title: string; bodyMarkdown: string } {
  const parts = raw.split('---');
  if (parts.length >= 3) {
    const metaRaw = parts[1];
    const bodyMarkdown = parts.slice(2).join('---').trim();
    let title = 'Untitled';
    for (const line of metaRaw.split('\n')) {
      if (line.trim().startsWith('title:')) {
        title = line.split(':', 2)[1].trim();
        break;
      }
    }
    return { title, bodyMarkdown };
  }
  return { title: 'Untitled', bodyMarkdown: raw.trim() };
}
