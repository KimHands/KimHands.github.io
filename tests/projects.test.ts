import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const srcDir = join(__dirname, '../src');
const projectDir = join(srcDir, 'content/projects');
const projectFiles = readdirSync(projectDir).filter((f) => f.endsWith('.md'));
const readProject = (file: string) => readFileSync(join(projectDir, file), 'utf8');

const expectedProjects = [
  'hype-checker', 'opsmith', 'bridge', 'sch-meet', 'clasp', 'hwpx-toolkit',
  'islab-platform', 'humanize-korean-formal', 'keylessplay',
  'hedgehog-webctf', 'classfileauto', 'likelion14-sch',
];

// Private or archived repos must never be linked.
const unlinkableRepos = new Set([
  'kimhands/labplatform-public', 'kimhands/labplatform', 'kimhands/ccpilot',
  'kimhands/classfileauto_web', 'kimhands/classfileauto-web', 'kimhands/classfileauto',
  'kimhands/hedgehog_webctf', 'kimhands/hedgehog-webctf',
  'kimhands/keylessplay', 'kimhands/keylessplay-thesis',
  'kimhands/islab-platform', 'isl-hedgehog/islab-platform',
  'kimhands/hype-checker-private',
]);
// Dead hosts, an unowned domain, and an internal service host.
const unlinkableHosts = new Set([
  'likelion-sch.com', 'www.likelion-sch.com', 'hedgehog-web-ctf.vercel.app',
]);

const siteSourceFiles = readdirSync(srcDir, { recursive: true, encoding: 'utf8' })
  .filter((f) => /\.(md|astro|ts)$/.test(f));
const urlsIn = (text: string) => [...text.matchAll(/https?:\/\/[^\s"'`<>)]+/g)].map((m) => new URL(m[0]));
const githubRepoOf = (url: URL) => url.pathname.split('/').slice(1, 3).join('/').toLowerCase();

describe('project content', () => {
  it('lists exactly the profile projects', () => {
    const slugs = projectFiles.map((f) => f.replace(/\.md$/, '')).sort();
    expect(slugs).toEqual([...expectedProjects].sort());
  });

  it('links no private repo, archived repo, or unowned domain anywhere in src/', () => {
    for (const file of siteSourceFiles) {
      for (const url of urlsIn(readFileSync(join(srcDir, file), 'utf8'))) {
        const host = url.hostname.toLowerCase();
        expect(unlinkableHosts.has(host), `${file}: ${url}`).toBe(false);
        if (host === 'github.com') expect(unlinkableRepos.has(githubRepoOf(url)), `${file}: ${url}`).toBe(false);
      }
    }
  });

  it('points every screenshot at a file in public/', () => {
    const shotPaths = projectFiles.flatMap((f) =>
      [...readProject(f).matchAll(/^\s+src:\s*["']?([^"'\n]+)["']?\s*$/gm)].map((m) => m[1]));
    for (const shotPath of shotPaths) {
      expect(existsSync(join(__dirname, '../public', shotPath)), shotPath).toBe(true);
    }
  });

  it('uses unique display order', () => {
    const orders = projectFiles.map((f) => readProject(f).match(/^order:\s*(\d+)/m)?.[1]);
    expect(new Set(orders).size).toBe(orders.length);
  });
});
