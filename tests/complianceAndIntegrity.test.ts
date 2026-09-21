import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Master Prompt §10 & §13: Affiliate Compliance & Truth in Commerce Integrity', () => {
  const srcDir = path.resolve(__dirname, '../src');

  function getAllFiles(dir: string, extList: string[]): string[] {
    const files: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...getAllFiles(fullPath, extList));
      } else if (extList.some(ext => entry.name.endsWith(ext))) {
        files.push(fullPath);
      }
    }
    return files;
  }

  it('verifies all outbound affiliate merchant anchors enforce rel="sponsored nofollow noopener"', () => {
    const tsxFiles = getAllFiles(srcDir, ['.tsx']);
    let affiliateAnchorsFound = 0;

    for (const file of tsxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      // Match <a> tags that have target="_blank" or external affiliate links
      const anchorRegex = /<a[^>]*href=\{[^}]*(?:affiliateUrl|offer\.affiliateUrl|\/api\/go\/)[^>]*>/g;
      let match;
      while ((match = anchorRegex.exec(content)) !== null) {
        affiliateAnchorsFound++;
        const tag = match[0];
        expect(tag).toContain('rel="sponsored nofollow noopener"');
      }
    }

    expect(affiliateAnchorsFound).toBeGreaterThan(0);
  });

  it('verifies that no fake reviews, artificial stock urgency, or deceptive countdowns exist', () => {
    const codeFiles = getAllFiles(srcDir, ['.ts', '.tsx']);

    // Deceptive patterns strictly forbidden by EveryAge Digital editorial guidelines
    const deceptivePatterns = [
      /verified purchase review/i,
      /only \d+ left in stock!/i,
      /hurry, sale ends in/i,
      /fake review/i,
      /5 stars based on 1[0-9,]+ reviews/i,
      /claimed their discount today/i,
      /someone from .* just bought/i
    ];

    for (const file of codeFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      for (const pattern of deceptivePatterns) {
        const found = pattern.test(content);
        if (found) {
          throw new Error(`Integrity Violation: Found deceptive marketing pattern "${pattern}" in ${file}`);
        }
        expect(found).toBe(false);
      }
    }
  });

  it('verifies Amazon Associate disclosure statement is present in the codebase', () => {
    const disclaimerPath = path.resolve(srcDir, 'components/ui/AffiliateDisclosure.tsx');
    const content = fs.readFileSync(disclaimerPath, 'utf-8');
    expect(content).toContain('As an Amazon Associate I earn from qualifying purchases.');
  });
});
