import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { BOOKS } from '../src/data/seedCatalog';

describe('/books & BookCard Component Readability and Integrity Audits', () => {
  const bookCardPath = path.resolve(__dirname, '../src/components/ui/BookCard.tsx');
  const booksPagePath = path.resolve(__dirname, '../src/app/books/page.tsx');

  it('enforces ZERO hardcoded hex color codes in BookCard.tsx (Grep Test)', () => {
    const content = fs.readFileSync(bookCardPath, 'utf-8');

    // Matches standard hex colors like #fff, #151515, #1D438A, etc.
    const hexColorRegex = /#([0-9a-fA-F]{3,8})\b/g;
    const matches = content.match(hexColorRegex);

    if (matches && matches.length > 0) {
      throw new Error(
        `Readability / Theme Violation: Found hardcoded hex colors in BookCard.tsx: ${matches.join(', ')}. Use CSS theme tokens instead (e.g., var(--text), var(--surface)).`
      );
    }

    expect(matches).toBeNull();
  });

  it('verifies BookCard uses theme tokens for titles, descriptions, surface, and takeaway', () => {
    const content = fs.readFileSync(bookCardPath, 'utf-8');

    expect(content).toContain('var(--text)');
    expect(content).toContain('var(--text-secondary)');
    expect(content).toContain('var(--surface)');
    expect(content).toContain('var(--border)');
    expect(content).toContain('var(--accent)');
    expect(content).toContain('var(--success)');
    expect(content).toContain('var(--surface-muted)');
  });

  it('verifies outbound affiliate book links contain rel="sponsored nofollow noopener"', () => {
    const content = fs.readFileSync(bookCardPath, 'utf-8');
    expect(content).toContain('rel="sponsored nofollow noopener"');
  });

  it('performs Seed-Data Audit: every book entry must have valid title, author, key learnings, and ASIN-verified cover image', () => {
    expect(BOOKS.length).toBeGreaterThan(0);

    for (const book of BOOKS) {
      // Basic completeness
      expect(book.title).toBeTruthy();
      expect(book.author).toBeTruthy();
      expect(book.price).toBeGreaterThan(0);
      expect(book.keyLearnings.length).toBeGreaterThan(0);
      expect(book.difficulty).toMatch(/^(Beginner|Comprehensive|Intermediate|Advanced)$/);

      // Verify no generic Unsplash stock photos are used as book covers
      expect(book.coverImage).not.toContain('unsplash.com');

      // For Amazon books, verify that the ASIN in affiliateUrl matches the ASIN in the official coverImage URL
      if (book.merchant === 'Amazon') {
        const asinMatch = book.affiliateUrl.match(/\/dp\/([A-Z0-9]{10})/i);
        expect(asinMatch).not.toBeNull();
        const asin = asinMatch![1];

        // The official Amazon image CDN must match the same ASIN
        expect(book.coverImage).toContain(asin);
        expect(book.coverImage).toMatch(/^https:\/\/images-na\.ssl-images-amazon\.com\/images\/P\/[A-Z0-9]{10}\.01\.LZZZZZZZ\.jpg$/);
      }
    }
  });

  it('verifies /books page contains no hardcoded dark text utilities on main headings', () => {
    const content = fs.readFileSync(booksPagePath, 'utf-8');

    // Headings must use var(--text), not text-neutral-900 or hardcoded dark hex
    expect(content).not.toContain('text-neutral-900');
    expect(content).not.toContain('#1D438A');
    expect(content).toContain('var(--text)');
  });
});
