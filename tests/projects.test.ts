import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const projectDir = join(__dirname, '../src/content/projects');
const projectFiles = readdirSync(projectDir).filter((f) => f.endsWith('.md'));
const readProject = (file: string) => readFileSync(join(projectDir, file), 'utf8');

const expectedProjects = [
  'hype-checker', 'opsmith', 'bridge', 'sch-meet', 'clasp', 'hwpx-toolkit',
  'islab-platform', 'humanize-korean-formal', 'keylessplay',
  'hedgehog-webctf', 'classfileauto', 'likelion14-sch',
];

// Private repos, archived repos, dead hosts, and a domain the user does not own.
const forbiddenUrlParts = [
  'labplatform-public', 'ClassFileAuto_Web', 'classfileauto-web', 'Hedgehog_WebCTF',
  'hedgehog-webctf"', 'hedgehog-web-ctf.vercel.app', 'likelion-sch.com',
  'KimHands/keylessplay', 'KimHands/islab-platform', 'KimHands/ccpilot',
];

describe('project content', () => {
  it('lists exactly the profile projects', () => {
    const slugs = projectFiles.map((f) => f.replace(/\.md$/, '')).sort();
    expect(slugs).toEqual([...expectedProjects].sort());
  });

  it('links no private repo, archived repo, or unowned domain', () => {
    for (const file of projectFiles) {
      const text = readProject(file);
      for (const part of forbiddenUrlParts) {
        expect(text, `${file} contains ${part}`).not.toContain(part);
      }
    }
  });

  it('uses unique display order', () => {
    const orders = projectFiles.map((f) => readProject(f).match(/^order:\s*(\d+)/m)?.[1]);
    expect(new Set(orders).size).toBe(orders.length);
  });
});
