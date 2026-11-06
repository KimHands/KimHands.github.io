import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { problems } from '../src/data/problems';

const pagesDir = join(__dirname, '../src/pages');

// "/work/x/#id" → the page source must exist and declare id="id"
const anchorExists = (href: string) => {
  const [path, anchor] = href.split('#');
  const slug = path.replace(/^\/|\/$/g, '');
  const source = [join(pagesDir, `${slug}.astro`), join(pagesDir, slug, 'index.astro')].find(existsSync);
  if (!source) return false;
  return !anchor || readFileSync(source, 'utf8').includes(`id="${anchor}"`);
};

describe('problems list', () => {
  it('has four to six cases', () => {
    expect(problems.length).toBeGreaterThanOrEqual(4);
    expect(problems.length).toBeLessThanOrEqual(6);
  });

  it('fills every field in ko and en', () => {
    for (const p of problems) {
      for (const key of ['project', 'problem', 'problem_en', 'cause', 'cause_en', 'fix', 'fix_en'] as const) {
        expect(p[key].length, `${p.href} ${key}`).toBeGreaterThan(0);
      }
    }
  });

  it('links each case to an anchor that exists on a site page', () => {
    for (const p of problems) {
      expect(anchorExists(p.href), p.href).toBe(true);
      if (p.href_en) expect(anchorExists(p.href_en), p.href_en).toBe(true);
    }
  });
});
