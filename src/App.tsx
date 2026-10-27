import React, { useState, useEffect } from 'react';
import { initialPages, parseMarkdown, PageData } from './data/pages';
import { markdownToHtml } from './utils/markdown';

export const App: React.FC = () => {
  const getSlugFromHash = (): string => {
    const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    const found = initialPages.find(
      (p) => p.slug === hash || p.filename.replace('.md', '') === hash
    );
    return found ? found.slug : 'home';
  };

  const [currentSlug, setCurrentSlug] = useState<string>(getSlugFromHash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentSlug(getSlugFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const currentPage: PageData =
    initialPages.find((p) => p.slug === currentSlug) || initialPages[0];

  const parsed = parseMarkdown(currentPage.rawMarkdown);
  const displayTitle = parsed.title || currentPage.title;
  const contentHtml = markdownToHtml(parsed.bodyMarkdown);

  useEffect(() => {
    document.title = `${displayTitle} | Kurt's English`;
  }, [displayTitle]);

  const handleNavClick = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = slug === 'home' ? '' : slug;
    setCurrentSlug(slug);
  };

  return (
    <div>
      <header>
        <h1>{displayTitle}</h1>
        <nav aria-label="Main Navigation">
          {initialPages.map((page) => {
            const isActive = page.slug === currentSlug;
            return (
              <a
                key={page.slug}
                href={page.slug === 'home' ? '#' : `#${page.slug}`}
                onClick={(e) => handleNavClick(page.slug, e)}
                className={isActive ? 'active' : ''}
              >
                {page.title}
              </a>
            );
          })}
        </nav>
      </header>

      <main dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </div>
  );
};

export default App;
