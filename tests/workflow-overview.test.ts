import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(__dirname, '..');
const pagePath = join(root, 'src/pages/workflow-overview/index.astro');
const legacySkillsPath = join(root, 'public/workflow-overview/skills.html');

// Things that must never reach a public page about the private workflow.
const internalPatterns: [string, RegExp][] = [
  ['absolute home path', /\/Users\/|\/home\/[a-z]/],
  ['email address', /[\w.+-]+@[\w-]+\.[\w.]+/],
  ['tailnet host', /\.ts\.net/],
  ['IPv4 address', /\b(?!127\.0\.0\.1)\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/],
  ['private repo name', /keylessplay|llm-wiki|oci-server|lab-manage-server|career-roadmap/i],
  ['service host other than sch-meet', /(?<![\w-])(?!sch-meet\.)[a-z0-9-]+\.kimhands\.com/],
];

describe('workflow-overview page', () => {
  it('lives at the same path the old repo Pages used', () => {
    expect(existsSync(pagePath)).toBe(true);
  });

  it('keeps the old skills.html URL working', () => {
    expect(readFileSync(legacySkillsPath, 'utf8')).toContain('url=/workflow-overview/#tools');
  });

  it('leaks no internal details', () => {
    const page = readFileSync(pagePath, 'utf8');
    for (const [label, pattern] of internalPatterns) {
      expect(page.match(pattern)?.[0], label).toBeUndefined();
    }
  });
});
