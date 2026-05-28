# 포트폴리오 사이트 구현 계획 (Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 승인된 목업(`mockups/direction-doc.html`)을 Astro + Tailwind 정적 사이트로 구현해 `KimHands.github.io`에 배포한다 — 문서 미감, 모노크롬+액센트, 한/영·다크 토글, 데이터 기반 프로젝트, Cloudflare 분석.

**Architecture:** Astro 정적 사이트. 색·타이포·모션 토큰은 `src/styles/global.css`의 CSS 변수로 두고(라이트/다크 `[data-theme]` 스왑), 컴포넌트는 목업의 검증된 클래스를 그대로 사용. 프로젝트는 Astro 콘텐츠 컬렉션(파일 1개=카드 1개). i18n은 ko 기본(`/`) + en(`/en/`) 2페이지가 사전(`src/i18n/ui.ts`)을 공유. GitHub Actions로 Pages 배포.

**Tech Stack:** Astro 5, Tailwind(공식 integration), TypeScript, Vitest(i18n 사전 정합성 테스트), GitHub Actions, Cloudflare Web Analytics.

**검증 원칙:** 정적 UI라 단위 테스트는 i18n 사전 정합성 1건만 자동화하고, 나머지는 **`npm run build` 성공 + `npm run dev` 브라우저 확인**을 게이트로 삼는다. 커밋은 작업 단위로 자주.

**참조:** 디자인 토큰·규칙은 repo 루트 `DESIGN.md`, 범위는 `docs/superpowers/specs/2026-05-28-portfolio-site-design.md`. 정확한 마크업/CSS는 로컬 `mockups/direction-doc.html`(gitignore됨)가 캐노니컬 소스.

---

## 파일 구조

```
astro.config.mjs            # site URL, integrations(tailwind, sitemap)
tailwind.config.mjs         # DESIGN.md 토큰을 theme.extend에 매핑
package.json / tsconfig.json
.github/workflows/deploy.yml
public/                     # favicon, og-image.png, resume.pdf, robots.txt
src/
  styles/global.css         # CSS 변수(라이트/다크), 컴포넌트 클래스, 모션
  scripts/theme.ts          # 테마 초기화(FOUC 방지) — Base에 인라인
  scripts/reveal.ts         # IntersectionObserver 모션
  i18n/ui.ts                # ko/en 사전
  i18n/utils.ts             # t(), getLangFromUrl()
  content/config.ts         # projects 컬렉션 스키마(zod)
  content/projects/*.md     # 프로젝트 1개 = 파일 1개
  components/Nav.astro Hero.astro Terminal.astro Stack.astro
             ProjectCard.astro Work.astro Contact.astro Footer.astro
             ThemeToggle.astro LangToggle.astro
  layouts/Base.astro        # <head>, meta/OG, 테마 init, 분석, global.css
  pages/index.astro         # ko (기본)
  pages/en/index.astro      # en
tests/i18n.test.ts          # 사전 정합성
```

---

## Task 1: Astro + Tailwind 프로젝트 스캐폴드

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json` (CLI 생성)
- Note: repo에 이미 `README.md`, `DESIGN.md`, `docs/`, `.gitignore` 존재 — 덮어쓰지 말 것.

- [ ] **Step 1: 빈 Astro 프로젝트를 현재 디렉토리에 생성**

Run:
```bash
npm create astro@latest -- --template minimal --no-install --no-git --typescript strict --yes .
```
Expected: `src/pages/index.astro`, `astro.config.mjs`, `package.json`, `tsconfig.json` 생성. (기존 `README.md`/`DESIGN.md`/`docs/`는 유지)

- [ ] **Step 2: 의존성 설치 + 통합 추가**

Run:
```bash
npm install
npx astro add tailwind sitemap --yes
```
Expected: `@astrojs/tailwind`(또는 Tailwind vite 플러그인), `@astrojs/sitemap` 설치 및 `astro.config.mjs`에 자동 반영.

- [ ] **Step 3: 개발 서버로 기본 동작 확인**

Run: `npm run dev` (백그라운드) → `curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/`
Expected: `200`. 확인 후 dev 서버 종료.

- [ ] **Step 4: astro.config.mjs를 GitHub Pages용으로 설정**

`astro.config.mjs` 전체를 다음으로 교체:
```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://kimhands.github.io',
  integrations: [tailwind({ applyBaseStyles: false }), sitemap()],
});
```
(user site라 `base`는 기본 `/`. `applyBaseStyles:false`로 우리 global.css가 베이스를 담당.)

- [ ] **Step 5: 커밋**
```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json src/ public/
git commit -m "chore: scaffold Astro + Tailwind project"
```

---

## Task 2: 디자인 토큰 — global.css + tailwind.config

**Files:**
- Create: `src/styles/global.css`
- Modify: `tailwind.config.mjs`

- [ ] **Step 1: global.css 작성 (라이트/다크 토큰 + 컴포넌트 클래스 + 모션)**

`src/styles/global.css` 생성. DESIGN.md 토큰을 CSS 변수로, 목업의 클래스를 그대로 이식:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root{
  --canvas:#ffffff; --soft:#fafafa; --ink:#1d1d1f; --charcoal:#525252;
  --body:#737373; --mute:#a3a3a3; --hairline:#e5e5e5; --hairline-strong:#d4d4d4;
  --dark:#171717; --on-dark:#ffffff; --on-dark-mute:rgba(255,255,255,.66);
  --accent:#0066cc; --accent-soft:#eaf2fc;
  --sans:-apple-system,BlinkMacSystemFont,system-ui,"Inter","Segoe UI",sans-serif;
  --mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,"JetBrains Mono",monospace;
  --page:1080px; --measure:640px;
}
[data-theme="dark"]{
  --canvas:#0b0b0c; --soft:#161618; --ink:#f5f5f7; --charcoal:#c7c7cc;
  --body:#98989d; --mute:#6b6b70; --hairline:#2a2a2d; --hairline-strong:#3a3a3d;
  --dark:#1c1c1e; --on-dark:#ffffff; --on-dark-mute:rgba(255,255,255,.7);
  --accent:#2997ff; --accent-soft:#13233a;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:var(--sans);background:var(--canvas);color:var(--ink);
  font-size:17px;line-height:1.5;letter-spacing:-.01em;-webkit-font-smoothing:antialiased;
  transition:background .3s ease,color .3s ease}
.mono{font-family:var(--mono);letter-spacing:0}
a{color:inherit}
.page{max-width:var(--page);margin:0 auto;padding:0 40px}
.measure{max-width:var(--measure)}
section{padding:88px 0}
.seclabel{font-family:var(--mono);font-size:12px;letter-spacing:.06em;color:var(--mute);
  text-transform:uppercase;margin-bottom:30px;display:flex;justify-content:space-between;align-items:baseline}
.seclabel .dot{color:var(--accent)}
/* nav */
.nav{border-bottom:1px solid var(--hairline);position:sticky;top:0;
  background:color-mix(in srgb,var(--canvas) 85%,transparent);
  backdrop-filter:saturate(180%) blur(12px);z-index:5}
.nav .page{display:flex;align-items:center;justify-content:space-between;height:60px}
.brand{font-weight:600;font-size:16px}
.nright{display:flex;align-items:center;gap:20px}
.nright a{font-size:14px;font-weight:500;color:var(--charcoal);text-decoration:none;position:relative}
.nright a:hover{color:var(--ink)}
.nlink::after{content:"";position:absolute;left:0;right:0;bottom:-4px;height:1.5px;background:var(--ink);
  transform:scaleX(0);transform-origin:left;transition:transform .26s cubic-bezier(.2,.7,.2,1)}
.nlink:hover::after{transform:scaleX(1)}
.pill{background:var(--ink);color:var(--canvas);border-radius:9999px;padding:8px 18px;font-size:13px;
  font-weight:500;text-decoration:none}
.toggle{font-family:var(--mono);font-size:13px;color:var(--charcoal);background:none;border:none;
  cursor:pointer;padding:4px}
.toggle:hover{color:var(--ink)}
/* hero */
.hero{padding:104px 0 16px}
.hero .grid{display:grid;grid-template-columns:1.05fr .95fr;gap:60px;align-items:center}
.hero h1{font-size:60px;font-weight:600;letter-spacing:-.035em;line-height:1.02}
.lead{margin-top:26px;font-size:19px;color:var(--charcoal);line-height:1.62;max-width:520px}
.lead .hl{color:var(--accent);font-weight:600}
.herolinks{margin-top:34px;display:flex;gap:24px;align-items:center;font-size:15px}
.herolinks a.go{color:var(--accent);text-decoration:none;font-weight:500;border-bottom:1.5px solid var(--accent);padding-bottom:2px}
.herolinks a.muted{color:var(--charcoal);text-decoration:none;border-bottom:1.5px solid var(--hairline-strong);padding-bottom:2px}
/* terminal */
.term{border:1px solid var(--hairline);border-radius:14px;background:var(--canvas);overflow:hidden}
.term .bar{display:flex;gap:7px;align-items:center;padding:13px 16px;border-bottom:1px solid var(--hairline)}
.term .bar i{width:12px;height:12px;border-radius:9999px;display:inline-block}
.dot-r{background:#ff5f56}.dot-y{background:#ffbd2e}.dot-g{background:#27c93f}
.term .bar span{font-family:var(--mono);font-size:12px;color:var(--mute);margin-left:10px}
.term pre{font-family:var(--mono);font-size:14px;line-height:1.85;padding:22px;white-space:pre-wrap;color:var(--ink)}
.term .c{color:var(--accent)} .term .o{color:var(--charcoal)}
.cursor{display:inline-block;width:8px;height:1.02em;background:var(--accent);vertical-align:-2px;margin-left:3px;animation:blink 1.05s steps(1) infinite}
@keyframes blink{50%{opacity:0}}
/* stack */
.deflist{display:grid;grid-template-columns:140px 1fr;gap:18px 28px;max-width:780px}
.deflist dt{font-family:var(--mono);font-size:13px;color:var(--mute);padding-top:2px}
.deflist dd{font-size:16px;color:var(--charcoal)}
.deflist dd b{color:var(--ink);font-weight:500}
/* work */
.workgrid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.card{display:block;text-decoration:none;color:inherit;border:1px solid var(--hairline);
  border-radius:14px;padding:28px;transition:border-color .15s}
.card:hover{border-color:var(--ink)}
.card .rtop{display:flex;align-items:baseline;justify-content:space-between;gap:14px}
.card h3{font-size:21px;font-weight:600;letter-spacing:-.02em}
.card .meta{font-size:12.5px;color:var(--mute);white-space:nowrap}
.card p{margin-top:10px;font-size:15.5px;color:var(--charcoal);line-height:1.55}
.card .tech{margin-top:16px;font-family:var(--mono);font-size:12.5px;color:var(--body)}
.card .links{margin-top:18px;font-size:14px;display:flex;gap:18px;flex-wrap:wrap}
.card .links a.live{color:var(--accent);text-decoration:none;border-bottom:1px solid var(--accent);padding-bottom:1px}
.card .links a.src{color:var(--charcoal);text-decoration:none;border-bottom:1px solid var(--hairline-strong);padding-bottom:1px}
.card.slot{border-style:dashed;border-color:var(--hairline-strong);display:flex;align-items:center;
  justify-content:center;color:var(--mute);font-family:var(--mono);font-size:13px;text-align:center;min-height:150px}
/* contact + footer */
.contact{background:var(--dark);border-radius:18px;padding:56px 48px;color:var(--on-dark);
  display:grid;grid-template-columns:1fr auto;gap:32px;align-items:center}
.contact .k{font-family:var(--mono);font-size:13px;color:var(--accent);margin-bottom:16px}
.contact h2{font-size:30px;font-weight:600;letter-spacing:-.025em;line-height:1.1}
.contact p{margin-top:12px;color:var(--on-dark-mute);font-size:16px}
.contact .actions{display:flex;flex-direction:column;gap:12px;align-items:flex-start}
.contact .wpill{background:#fff;color:#1d1d1f;border-radius:9999px;padding:11px 22px;font-size:14px;font-weight:600;text-decoration:none;white-space:nowrap}
.contact .wlink{color:#fff;text-decoration:none;font-size:14px;border-bottom:1px solid rgba(255,255,255,.4);padding-bottom:1px}
.footer{border-top:1px solid var(--hairline);padding:32px 0;margin-top:32px}
.footer .page{display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px}
.footer a{font-family:var(--mono);font-size:12px;color:var(--body);text-decoration:none}
.footer .cp{font-family:var(--mono);font-size:12px;color:var(--mute)}
/* motion */
@media (prefers-reduced-motion: no-preference){
  .reveal{opacity:0;transform:translateY(16px);transition:opacity .7s cubic-bezier(.2,.7,.2,1),transform .7s cubic-bezier(.2,.7,.2,1)}
  .reveal.in{opacity:1;transform:none}
  .d1{transition-delay:.08s}.d2{transition-delay:.16s}.d3{transition-delay:.24s}
  .tl{opacity:0;transition:opacity .3s ease}.tl.in{opacity:1}
}
@media(max-width:880px){
  .hero{padding:64px 0 8px}.hero .grid{grid-template-columns:1fr;gap:40px}
  .hero h1{font-size:44px}.workgrid{grid-template-columns:1fr}
  .contact{grid-template-columns:1fr;padding:40px 28px}.contact .actions{flex-direction:row;flex-wrap:wrap}
  .page{padding:0 24px}section{padding:64px 0}
}
```

- [ ] **Step 2: tailwind.config.mjs에 토큰 매핑(유틸 사용 대비)**

`tailwind.config.mjs`의 `theme.extend`를 다음으로 설정:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts,jsx,tsx,md,mdx}'],
  theme: { extend: {
    colors: {
      canvas:'var(--canvas)', soft:'var(--soft)', ink:'var(--ink)',
      charcoal:'var(--charcoal)', body:'var(--body)', mute:'var(--mute)',
      hairline:'var(--hairline)', accent:'var(--accent)',
    },
    maxWidth: { page:'1080px', measure:'640px' },
  }},
  plugins: [],
};
```

- [ ] **Step 3: 빌드로 CSS 처리 검증**

Run: `npm run build`
Expected: 성공(에러 없음). global.css가 번들에 포함.

- [ ] **Step 4: 커밋**
```bash
git add src/styles/global.css tailwind.config.mjs
git commit -m "feat: design tokens (light/dark) and component styles"
```

---

## Task 3: Base 레이아웃 (head, meta/OG, 테마 init, 분석)

**Files:**
- Create: `src/layouts/Base.astro`, `src/scripts/theme.ts`

- [ ] **Step 1: 테마 초기화 스크립트 (FOUC 방지, head 인라인용)**

`src/scripts/theme.ts` 생성:
```ts
// 인라인으로 <head>에서 실행 — 페인트 전에 테마 결정
export const themeInit = `
(function(){
  try{
    var s = localStorage.getItem('theme');
    var d = s ? s === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    if(d) document.documentElement.setAttribute('data-theme','dark');
  }catch(e){}
})();
`;
```

- [ ] **Step 2: Base.astro 작성 (head, OG, 분석 플레이스홀더, global.css import)**

`src/layouts/Base.astro` 생성:
```astro
---
import '../styles/global.css';
import { themeInit } from '../scripts/theme';
interface Props { title: string; description: string; lang?: string; }
const { title, description, lang = 'ko' } = Astro.props;
const og = new URL('/og-image.png', Astro.site);
const CF_TOKEN = ''; // Task 15에서 Cloudflare 토큰 삽입
---
<!doctype html>
<html lang={lang}>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="website" />
  <meta property="og:image" content={og} />
  <meta name="twitter:card" content="summary_large_image" />
  <script is:inline set:html={themeInit} />
</head>
<body>
  <slot />
  {CF_TOKEN && (
    <script is:inline defer src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={`{"token": "${CF_TOKEN}"}`} />
  )}
</body>
</html>
```

- [ ] **Step 3: 빌드 검증**

Run: `npm run build`
Expected: 성공. `dist/index.html`에 `<title>`, og 메타, 테마 인라인 스크립트 포함.

- [ ] **Step 4: 커밋**
```bash
git add src/layouts/Base.astro src/scripts/theme.ts
git commit -m "feat: base layout with meta/OG, theme init, analytics slot"
```

---

## Task 4: i18n 사전 + 헬퍼 (+ 정합성 테스트)

**Files:**
- Create: `src/i18n/ui.ts`, `src/i18n/utils.ts`, `tests/i18n.test.ts`
- Modify: `package.json` (vitest)

- [ ] **Step 1: 사전 작성**

`src/i18n/ui.ts` 생성:
```ts
export const languages = { ko: '한국어', en: 'English' } as const;
export const defaultLang = 'ko';

export const ui = {
  ko: {
    'nav.work': 'Work', 'nav.about': 'About', 'nav.blog': 'Blog', 'nav.contact': 'Contact',
    'hero.lead.pre': '순천향대에서 컴퓨터소프트웨어공학을 공부하고, 멋쟁이사자처럼 풀스택 트랙을 운영하며 정보보호 연구실에서 일합니다. ',
    'hero.lead.hl': '보안·풀스택·AI가 겹치는 지점',
    'hero.lead.post': '에서 실제로 배포되는 도구를 만듭니다.',
    'hero.work': '작업 보기 ↓', 'hero.resume': '이력서 (PDF) ↗',
    'stack.label': 'Stack', 'stack.note': '실제 비중대로',
    'work.label': 'Selected Work',
    'work.slot': '+ 추가 예정\\nHedgehog Seminar · clasp · GrowthLens',
    'contact.cmd': '$ contact', 'contact.title': '같이 일할 곳을 찾고 있습니다.',
    'contact.body': '보안을 이해하는 풀스택 개발자가 필요하시면 편하게 연락 주세요.',
    'contact.email': '이메일 보내기 →',
  },
  en: {
    'nav.work': 'Work', 'nav.about': 'About', 'nav.blog': 'Blog', 'nav.contact': 'Contact',
    'hero.lead.pre': 'I study Computer Software Engineering at Soonchunhyang University, lead the LikeLion fullstack track, and work in an information-security lab. I build ',
    'hero.lead.hl': 'tools at the intersection of security, fullstack, and AI',
    'hero.lead.post': ' — and actually ship them.',
    'hero.work': 'See work ↓', 'hero.resume': 'Résumé (PDF) ↗',
    'stack.label': 'Stack', 'stack.note': 'by real usage',
    'work.label': 'Selected Work',
    'work.slot': '+ coming soon\\nHedgehog Seminar · clasp · GrowthLens',
    'contact.cmd': '$ contact', 'contact.title': "Looking for a team to build with.",
    'contact.body': 'If you need a fullstack developer who understands security, reach out.',
    'contact.email': 'Send email →',
  },
} as const;
```

- [ ] **Step 2: 헬퍼 작성**

`src/i18n/utils.ts` 생성:
```ts
import { ui, defaultLang } from './ui';
export type Lang = keyof typeof ui;
export function useTranslations(lang: Lang) {
  return function t(key: keyof typeof ui['ko']): string {
    return (ui[lang] as Record<string,string>)[key] ?? (ui[defaultLang] as Record<string,string>)[key];
  };
}
```

- [ ] **Step 3: 사전 정합성 테스트 작성 (실패 확인용)**

`tests/i18n.test.ts` 생성:
```ts
import { describe, it, expect } from 'vitest';
import { ui } from '../src/i18n/ui';
describe('i18n dictionaries', () => {
  it('en has every key that ko has', () => {
    const koKeys = Object.keys(ui.ko).sort();
    const enKeys = Object.keys(ui.en).sort();
    expect(enKeys).toEqual(koKeys);
  });
});
```

- [ ] **Step 4: vitest 설치 + 스크립트 추가**

Run: `npm install -D vitest`
그리고 `package.json`의 `scripts`에 추가: `"test": "vitest run"`

- [ ] **Step 5: 테스트 실행 → 통과 확인**

Run: `npm test`
Expected: PASS (1 test). 만약 키 불일치면 사전을 맞춰 통과시킨다.

- [ ] **Step 6: 커밋**
```bash
git add src/i18n/ tests/i18n.test.ts package.json package-lock.json
git commit -m "feat: i18n dictionaries (ko/en) with parity test"
```

---

## Task 5: 프로젝트 콘텐츠 컬렉션

**Files:**
- Create: `src/content/config.ts`, `src/content/projects/{classfileauto,likelion-sch,hedgehog-webctf}.md`

- [ ] **Step 1: 컬렉션 스키마 작성**

`src/content/config.ts` 생성:
```ts
import { defineCollection, z } from 'astro:content';
const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    title_en: z.string(),
    role: z.string(),
    role_en: z.string(),
    summary: z.string(),
    summary_en: z.string(),
    tech: z.array(z.string()),
    liveUrl: z.string().url().optional(),
    repoUrl: z.string().url().optional(),
    area: z.enum(['security','fullstack','ai']),
    featured: z.boolean().default(false),
    order: z.number().default(99),
  }),
});
export const collections = { projects };
```

- [ ] **Step 2: 프로젝트 3개 엔트리 작성**

`src/content/projects/classfileauto.md`:
```md
---
title: "ClassFileAuto"
title_en: "ClassFileAuto"
role: "개인 · 2025"
role_en: "Solo · 2025"
summary: "교내 Eclass 강의자료 다운로더. 학번·비밀번호를 RSA로 암호화하고 자격증명을 저장하지 않도록 설계 — 편의성과 보안을 동시에."
summary_en: "A course-material downloader for the campus LMS. Encrypts student credentials with RSA and never stores them — convenience without compromising security."
tech: ["Next.js","node-forge","iron-session"]
liveUrl: "https://class-file-auto-web.vercel.app"
repoUrl: "https://github.com/KimHands/ClassFileAuto_Web"
area: "security"
featured: true
order: 1
---
```

`src/content/projects/likelion-sch.md`:
```md
---
title: "멋사 SCH 운영 플랫폼"
title_en: "LikeLion SCH Platform"
role: "운영진"
role_en: "Organizer"
summary: "동아리 모집·심사·교육·운영을 한 곳에서. 커스텀 도메인으로 운영 중인 실서비스."
summary_en: "Recruiting, screening, education, and operations for a campus dev club — a real service running on a custom domain."
tech: ["React","Django","Docker","PostgreSQL"]
liveUrl: "https://www.likelion-sch.com/"
repoUrl: "https://github.com/KimHands/likelion14-sch"
area: "fullstack"
featured: true
order: 2
---
```

`src/content/projects/hedgehog-webctf.md`:
```md
---
title: "Hedgehog WebCTF"
title_en: "Hedgehog WebCTF"
role: "출제·운영"
role_en: "Author · Operator"
summary: "교내 행사 체험용 웹 해킹 문제를 직접 출제한 CTF 플랫폼. SQLi·HTTP 헤더·난독화 등 6문제 + 운영자 풀이."
summary_en: "A hands-on web-CTF platform with six challenges I authored myself (SQLi, HTTP headers, obfuscation) plus operator write-ups."
tech: ["Next.js","Web Security"]
liveUrl: "https://hedgehog-web-ctf.vercel.app"
repoUrl: "https://github.com/KimHands/Hedgehog_WebCTF"
area: "security"
featured: true
order: 3
---
```

- [ ] **Step 3: 빌드로 스키마 검증**

Run: `npm run build`
Expected: 성공. 스키마 위반 시 빌드가 실패하므로 통과 = 데이터 유효.

- [ ] **Step 4: 커밋**
```bash
git add src/content/
git commit -m "feat: projects content collection with 3 featured entries"
```

---

## Task 6: Nav + 토글 컴포넌트

**Files:**
- Create: `src/components/Nav.astro`, `src/components/ThemeToggle.astro`, `src/components/LangToggle.astro`

- [ ] **Step 1: ThemeToggle 작성**

`src/components/ThemeToggle.astro`:
```astro
<button id="theme-toggle" class="toggle" aria-label="테마 전환">☾</button>
<script is:inline>
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', dark ? 'light' : 'dark');
    try { localStorage.setItem('theme', dark ? 'light' : 'dark'); } catch (e) {}
  });
</script>
```

- [ ] **Step 2: LangToggle 작성 (ko ↔ en 경로 전환)**

`src/components/LangToggle.astro`:
```astro
---
const { lang } = Astro.props as { lang: 'ko' | 'en' };
const to = lang === 'ko' ? '/en/' : '/';
const labelActiveKo = lang === 'ko';
---
<a class="toggle mono" href={to} aria-label="언어 전환">
  <span style={labelActiveKo ? 'color:var(--ink)' : ''}>KO</span>
  /
  <span style={!labelActiveKo ? 'color:var(--ink)' : ''}>EN</span>
</a>
```

- [ ] **Step 3: Nav 작성**

`src/components/Nav.astro`:
```astro
---
import ThemeToggle from './ThemeToggle.astro';
import LangToggle from './LangToggle.astro';
import { useTranslations, type Lang } from '../i18n/utils';
const { lang } = Astro.props as { lang: Lang };
const t = useTranslations(lang);
const blog = 'https://velog.io/@kimhands';
---
<nav class="nav"><div class="page">
  <div class="brand">김종건</div>
  <div class="nright">
    <a class="nlink" href="#work">{t('nav.work')}</a>
    <a class="nlink" href="#about">{t('nav.about')}</a>
    <a class="nlink" href={blog} target="_blank" rel="noopener">{t('nav.blog')} ↗</a>
    <a class="nlink" href="#contact">{t('nav.contact')}</a>
    <LangToggle lang={lang} />
    <ThemeToggle />
    <a class="pill" href="https://github.com/KimHands" target="_blank" rel="noopener">GitHub ↗</a>
  </div>
</div></nav>
```

- [ ] **Step 4: 빌드 검증**

Run: `npm run build`
Expected: 성공.

- [ ] **Step 5: 커밋**
```bash
git add src/components/Nav.astro src/components/ThemeToggle.astro src/components/LangToggle.astro
git commit -m "feat: nav with language and theme toggles"
```

---

## Task 7: Hero + Terminal

**Files:**
- Create: `src/components/Terminal.astro`, `src/components/Hero.astro`

- [ ] **Step 1: Terminal 작성**

`src/components/Terminal.astro`:
```astro
<div class="term reveal d2">
  <div class="bar"><i class="dot-r"></i><i class="dot-y"></i><i class="dot-g"></i><span>~ kimjonggun</span></div>
<pre><span class="tl"><span class="c">$</span> whoami</span>
<span class="tl">김종건 — fullstack · security · AI</span>
<span class="tl"><span class="c">$</span> ls ~/now</span>
<span class="tl o">취업준비중/   멋사_FS트랙_운영/</span>
<span class="tl o">정보보호연구실_Hedgehog/</span>
<span class="tl"><span class="c">$</span> cat shipped.txt</span>
<span class="tl o"># 토이가 아니라 실제로 배포된 것들</span>
<span class="tl o">3개 라이브 서비스 · 커스텀 도메인 운영</span>
<span class="tl o">해커톤 2회<span class="cursor"></span></span></pre>
</div>
```

- [ ] **Step 2: Hero 작성**

`src/components/Hero.astro`:
```astro
---
import Terminal from './Terminal.astro';
import { useTranslations, type Lang } from '../i18n/utils';
const { lang } = Astro.props as { lang: Lang };
const t = useTranslations(lang);
---
<header class="hero"><div class="page">
  <div class="grid">
    <div>
      <h1 class="reveal">김종건</h1>
      <p class="lead reveal d1">{t('hero.lead.pre')}<span class="hl">{t('hero.lead.hl')}</span>{t('hero.lead.post')}</p>
      <div class="herolinks reveal d2">
        <a class="go" href="#work">{t('hero.work')}</a>
        <a class="muted" href="/resume.pdf" target="_blank" rel="noopener">{t('hero.resume')}</a>
      </div>
    </div>
    <Terminal />
  </div>
</div></header>
```

- [ ] **Step 3: 빌드 검증** — Run: `npm run build` → Expected: 성공.

- [ ] **Step 4: 커밋**
```bash
git add src/components/Hero.astro src/components/Terminal.astro
git commit -m "feat: hero with terminal card"
```

---

## Task 8: Stack 섹션

**Files:**
- Create: `src/components/Stack.astro`

- [ ] **Step 1: Stack 작성**

`src/components/Stack.astro`:
```astro
---
import { useTranslations, type Lang } from '../i18n/utils';
const { lang } = Astro.props as { lang: Lang };
const t = useTranslations(lang);
const rows: [string,string][] = [
  ['Frontend','<b>React</b> · Next.js · TypeScript · Tailwind'],
  ['Backend','<b>FastAPI</b> · Django · PostgreSQL · Supabase'],
  ['Security','RSA · JWT · SSO · 세션 설계 · CTF 출제'],
  ['AI','Gemini · OpenAI · 임베딩 분류 · 자동화 워크플로우'],
  ['Infra','Docker · Vercel · AWS · 자체 서버 운영'],
];
---
<section id="about"><div class="page">
  <div class="seclabel reveal"><span><span class="dot">#</span> {t('stack.label')}</span><span>{t('stack.note')}</span></div>
  <dl class="deflist reveal d1">
    {rows.map(([k,v]) => (<><dt>{k}</dt><dd set:html={v} /></>))}
  </dl>
</div></section>
```

- [ ] **Step 2: 빌드 검증** — Run: `npm run build` → Expected: 성공.

- [ ] **Step 3: 커밋**
```bash
git add src/components/Stack.astro
git commit -m "feat: stack section"
```

---

## Task 9: Work + ProjectCard (데이터 기반)

**Files:**
- Create: `src/components/ProjectCard.astro`, `src/components/Work.astro`

- [ ] **Step 1: ProjectCard 작성**

`src/components/ProjectCard.astro`:
```astro
---
import type { CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/utils';
const { project, lang, delay } = Astro.props as
  { project: CollectionEntry<'projects'>; lang: Lang; delay: string };
const d = project.data;
const title = lang === 'en' ? d.title_en : d.title;
const role = lang === 'en' ? d.role_en : d.role;
const summary = lang === 'en' ? d.summary_en : d.summary;
const liveLabel = d.liveUrl ? d.liveUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') : null;
---
<a class={`card reveal ${delay}`} href={d.repoUrl ?? d.liveUrl ?? '#'} target="_blank" rel="noopener">
  <div class="rtop"><h3>{title}</h3><span class="meta">{role}</span></div>
  <p>{summary}</p>
  <div class="tech">{d.tech.join(' · ')}</div>
  <div class="links">
    {d.liveUrl && <span class="live">{liveLabel} ↗</span>}
    {d.repoUrl && <span class="src">{lang === 'en' ? 'Code ↗' : '코드 ↗'}</span>}
  </div>
</a>
```

- [ ] **Step 2: Work 작성 (featured 정렬 + 여분 슬롯)**

`src/components/Work.astro`:
```astro
---
import { getCollection } from 'astro:content';
import ProjectCard from './ProjectCard.astro';
import { useTranslations, type Lang } from '../i18n/utils';
const { lang } = Astro.props as { lang: Lang };
const t = useTranslations(lang);
const projects = (await getCollection('projects', (p) => p.data.featured))
  .sort((a, b) => a.data.order - b.data.order);
const delays = ['', 'd1', 'd2', 'd3'];
const slot = t('work.slot').replace('\\n', '<br>');
---
<section id="work"><div class="page">
  <div class="seclabel reveal"><span><span class="dot">#</span> {t('work.label')}</span><span>{`0${projects.length} / 06`}</span></div>
  <div class="workgrid">
    {projects.map((p, i) => <ProjectCard project={p} lang={lang} delay={delays[i] ?? ''} />)}
    <div class="card slot reveal d3" set:html={slot} />
  </div>
</div></section>
```

- [ ] **Step 3: 빌드 검증** — Run: `npm run build` → Expected: 성공, 카드 3개 + 슬롯 렌더.

- [ ] **Step 4: 커밋**
```bash
git add src/components/Work.astro src/components/ProjectCard.astro
git commit -m "feat: data-driven work section with project cards"
```

---

## Task 10: Contact + Footer

**Files:**
- Create: `src/components/Contact.astro`, `src/components/Footer.astro`

- [ ] **Step 1: Contact 작성**

`src/components/Contact.astro`:
```astro
---
import { useTranslations, type Lang } from '../i18n/utils';
const { lang } = Astro.props as { lang: Lang };
const t = useTranslations(lang);
const email = 'kimjonggun0206@gmail.com';
---
<section id="contact"><div class="page">
  <div class="contact reveal">
    <div>
      <div class="k mono">{t('contact.cmd')}</div>
      <h2>{t('contact.title')}</h2>
      <p>{t('contact.body')}</p>
    </div>
    <div class="actions">
      <a class="wpill" href={`mailto:${email}`}>{t('contact.email')}</a>
      <a class="wlink" href="https://github.com/KimHands" target="_blank" rel="noopener">GitHub ↗</a>
      <a class="wlink" href="/resume.pdf" target="_blank" rel="noopener">{lang === 'en' ? 'Résumé PDF ↗' : '이력서 PDF ↗'}</a>
    </div>
  </div>
</div></section>
```

- [ ] **Step 2: Footer 작성**

`src/components/Footer.astro`:
```astro
---
const email = 'kimjonggun0206@gmail.com';
---
<footer class="footer"><div class="page">
  <div>
    <a href="https://github.com/KimHands" target="_blank" rel="noopener">GitHub</a> &nbsp;
    <a href="https://velog.io/@kimhands" target="_blank" rel="noopener">Velog</a> &nbsp;
    <a href={`mailto:${email}`}>Email</a>
  </div>
  <div class="cp">© 2026 김종건 · Jonggun Kim</div>
</div></footer>
```

- [ ] **Step 3: 빌드 검증** — Run: `npm run build` → Expected: 성공.

- [ ] **Step 4: 커밋**
```bash
git add src/components/Contact.astro src/components/Footer.astro
git commit -m "feat: contact block and footer"
```

---

## Task 11: 모션 스크립트 (스크롤 reveal + 터미널 순차)

**Files:**
- Create: `src/scripts/reveal.ts`

- [ ] **Step 1: reveal 스크립트 작성**

`src/scripts/reveal.ts`:
```ts
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveals = document.querySelectorAll<HTMLElement>('.reveal');
const tls = document.querySelectorAll<HTMLElement>('.tl');
if (reduce || !('IntersectionObserver' in window)) {
  reveals.forEach((e) => e.classList.add('in'));
  tls.forEach((e) => e.classList.add('in'));
} else {
  let termStarted = false;
  const revealTerm = () => {
    if (termStarted) return; termStarted = true;
    tls.forEach((l, i) => setTimeout(() => l.classList.add('in'), 260 + i * 210));
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        io.unobserve(en.target);
        if (en.target.classList.contains('term')) revealTerm();
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
  reveals.forEach((e) => io.observe(e));
}
```

- [ ] **Step 2: (Task 12에서 페이지가 이 스크립트를 import)** — 본 태스크는 파일 생성까지. 커밋:
```bash
git add src/scripts/reveal.ts
git commit -m "feat: scroll-reveal and terminal motion script"
```

---

## Task 12: 페이지 조립 (ko + en)

**Files:**
- Create/Overwrite: `src/pages/index.astro`
- Create: `src/pages/en/index.astro`

- [ ] **Step 1: ko 페이지 작성 (기존 minimal index 덮어쓰기)**

`src/pages/index.astro`:
```astro
---
import Base from '../layouts/Base.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import Stack from '../components/Stack.astro';
import Work from '../components/Work.astro';
import Contact from '../components/Contact.astro';
import Footer from '../components/Footer.astro';
const lang = 'ko' as const;
---
<Base title="김종건 — 보안을 이해하는 풀스택 개발자" description="보안·풀스택·AI가 겹치는 지점에서 실제로 배포되는 도구를 만드는 개발자 김종건의 포트폴리오." lang={lang}>
  <Nav lang={lang} />
  <Hero lang={lang} />
  <Stack lang={lang} />
  <Work lang={lang} />
  <Contact lang={lang} />
  <Footer />
</Base>
<script src="../scripts/reveal.ts"></script>
```

- [ ] **Step 2: en 페이지 작성**

`src/pages/en/index.astro`:
```astro
---
import Base from '../../layouts/Base.astro';
import Nav from '../../components/Nav.astro';
import Hero from '../../components/Hero.astro';
import Stack from '../../components/Stack.astro';
import Work from '../../components/Work.astro';
import Contact from '../../components/Contact.astro';
import Footer from '../../components/Footer.astro';
const lang = 'en' as const;
---
<Base title="Jonggun Kim — Fullstack developer who understands security" description="Portfolio of Jonggun Kim — a developer building shipped tools at the intersection of security, fullstack, and AI." lang={lang}>
  <Nav lang={lang} />
  <Hero lang={lang} />
  <Stack lang={lang} />
  <Work lang={lang} />
  <Contact lang={lang} />
  <Footer />
</Base>
<script src="../../scripts/reveal.ts"></script>
```

- [ ] **Step 3: dev 서버로 두 페이지 브라우저 확인**

Run: `npm run dev` (백그라운드). 브라우저에서 `http://localhost:4321/` 와 `http://localhost:4321/en/` 확인:
- 히어로 로드 모션, 터미널 순차 등장, 스크롤 reveal 동작
- 다크 토글 → 색 스왑 + 새로고침해도 유지(localStorage)
- 언어 토글 → ko ↔ en 이동, 텍스트 전환
- 프로젝트 카드 3개 + 데모 링크, 슬롯 1개
확인 후 dev 종료.

- [ ] **Step 4: 빌드 + 커밋**
```bash
npm run build
git add src/pages/
git commit -m "feat: assemble ko and en pages"
```

---

## Task 13: SEO/정적 자산 (favicon, OG, robots, resume placeholder)

**Files:**
- Create: `public/favicon.svg`, `public/og-image.png`, `public/robots.txt`, `public/resume.pdf`(플레이스홀더)

- [ ] **Step 1: favicon (이니셜 SVG)**

`public/favicon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#1d1d1f"/><text x="16" y="22" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="600" fill="#fff" text-anchor="middle">K</text></svg>
```

- [ ] **Step 2: robots.txt**

`public/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://kimhands.github.io/sitemap-index.xml
```

- [ ] **Step 3: OG 이미지 & 이력서 플레이스홀더**

- `public/og-image.png` — 1200×630 임시 이미지(추후 교체). 임시로 단색+이름 텍스트 PNG를 둔다.
- `public/resume.pdf` — 빈 PDF 플레이스홀더(사용자가 실제 파일로 교체 예정).
- (둘 다 §"필요한 입력"으로 추적; 없으면 링크는 404이므로 최소 플레이스홀더 필수.)

- [ ] **Step 4: 빌드 검증 + 커밋**
```bash
npm run build
git add public/
git commit -m "feat: SEO assets (favicon, OG, robots) and resume placeholder"
```

---

## Task 14: GitHub Actions → Pages 배포

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: 워크플로우 작성**

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages
on:
  push: { branches: [main] }
  workflow_dispatch:
permissions: { contents: read, pages: write, id-token: write }
concurrency: { group: pages, cancel-in-progress: true }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v3
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: '${{ steps.deployment.outputs.page_url }}' }
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: 커밋 + 푸시 (사용자 확인 후)**
```bash
git add .github/workflows/deploy.yml
git commit -m "ci: deploy to GitHub Pages via Actions"
```
**푸시는 사용자 확인 후 진행.** GitHub repo Settings → Pages → Source를 "GitHub Actions"로 설정해야 함(사용자 작업).

- [ ] **Step 3: 배포 검증**

푸시 후 Actions 탭에서 워크플로우 성공 확인 → `https://kimhands.github.io/` 접속해 라이트/다크·ko/en·링크 동작 확인.

---

## Task 15: Cloudflare 분석 토큰 삽입 + 최종 점검

**Files:**
- Modify: `src/layouts/Base.astro:CF_TOKEN`

- [ ] **Step 1: 토큰 삽입**

사용자가 Cloudflare 대시보드(Web Analytics → 사이트 추가 `kimhands.github.io`)에서 발급한 토큰을 `Base.astro`의 `const CF_TOKEN = ''`에 채운다.

- [ ] **Step 2: 최종 빌드 + 배포 + 검증**
```bash
npm run build
git add src/layouts/Base.astro
git commit -m "feat: enable Cloudflare Web Analytics"
```
푸시 후 Cloudflare 대시보드에 트래픽 집계 시작 확인.

- [ ] **Step 3: 목업 정리(선택)** — 방향 확정·구현 완료이므로 로컬 `mockups/` 폴더와 `localhost:8765` 서버를 정리한다.

---

## Self-Review (스펙 대비)

- **스펙 §3 IA**: Nav/Hero/Stack/Work/Contact/Footer → Task 6/7/8/9/10/12 ✅
- **§4 콘텐츠 모델**: 컬렉션 스키마 + 3엔트리, featured/order/area → Task 5, Work 정렬 Task 9 ✅
- **§5 i18n(ko/en)**: 사전+헬퍼+2페이지 → Task 4/12 ✅
- **§6 기술/배포**: Astro+Tailwind, Actions→Pages → Task 1/14 ✅
- **§7 모션·접근성**: reveal+reduced-motion, 포커스/대비 → Task 11, global.css ✅
- **§8 SEO/OG**: meta/OG/sitemap/favicon/robots → Task 3/13 ✅
- **§9 기능**: 블로그(Velog 링크) Task 6, 다크모드 Task 2/3/6, 연락 mailto Task 10, 분석 Task 15 ✅
- **다크 토큰**: DESIGN.md 다크 표 → global.css `[data-theme=dark]` Task 2 ✅
- **Placeholder 스캔**: OG/이력서는 의도된 플레이스홀더(§필요한 입력으로 추적), Cloudflare 토큰은 Task 15 입력. 그 외 모든 step에 실제 코드 포함.
- **타입 정합성**: `useTranslations`/`Lang`/`CollectionEntry<'projects'>`, 필드명(title_en/summary_en/order/featured) Task 4·5·9에서 일관.
