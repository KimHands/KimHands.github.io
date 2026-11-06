import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { records } from '../src/data/records';

const root = join(__dirname, '..');

// "/work/x/" → src/pages/work/x.astro or …/index.astro; "/a.pdf" → public/a.pdf
const sourceExists = (href: string) => {
  const path = href.replace(/^\/|\/$/g, '');
  return [
    join(root, 'public', path),
    join(root, 'src/pages', `${path}.astro`),
    join(root, 'src/pages', path, 'index.astro'),
  ].some(existsSync);
};

describe('records list', () => {
  it('links the workflow overview and the HyperChecker write-up', () => {
    const hrefs = records.map((r) => r.href);
    expect(hrefs).toContain('/workflow-overview/');
    expect(hrefs).toContain('/work/hype-checker/');
  });

  it('points every entry at a page or file that exists', () => {
    for (const r of records) expect(sourceExists(r.href), r.href).toBe(true);
  });

  it('has ko and en text for every entry', () => {
    for (const r of records) {
      expect(r.title.length, r.href).toBeGreaterThan(0);
      expect(r.title_en.length, r.href).toBeGreaterThan(0);
    }
  });
});
