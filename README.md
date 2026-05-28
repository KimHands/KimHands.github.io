# 김종건 포트폴리오

> 보안을 이해하는 풀스택·AI 개발자 **김종건**의 개인 포트폴리오 사이트
> 한국어/영어 이중 언어, 다크·라이트 테마를 지원하는 Astro 정적 사이트

[![Astro](https://img.shields.io/badge/Astro-4-BC52EE?logo=astro&logoColor=white)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-배포-222222?logo=github&logoColor=white)](https://kimhands.github.io)

| 항목 | 내용 |
|---|---|
| 형태 | 개인 포트폴리오 정적 사이트 (한·영 이중 언어) |
| 주소 | [kimhands.github.io](https://kimhands.github.io) |
| 배포 | GitHub Pages — `main` push 시 GitHub Actions 자동 빌드·배포 |
| 본인 담당 | 단독 개발 (설계 · 디자인 · 구현 · 배포) |

---

## 프로젝트 소개

취업용 포트폴리오로, 경력·자격·프로젝트·연락처를 한 페이지에 담았습니다. 보안·풀스택·AI가 겹치는 지점에서 **실제로 배포한 결과물**을 중심으로 구성했고, 수료증·논문·발표자료 등 증빙은 PDF로 직접 열람할 수 있습니다.

- 한국어(`/`)와 영어(`/en`) 페이지를 분리하고 토글로 전환
- 다크 / 라이트 테마 토글 (시스템 설정 자동 감지 + 수동 전환)
- 스크롤 등장 애니메이션 등 가벼운 인터랙션
- Open Graph / Twitter 카드 · 사이트맵으로 SEO·공유 대응

---

## 기술 스택

| 분류 | 사용 기술 |
|---|---|
| 프레임워크 | Astro 4 (정적 사이트 생성) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS 3 |
| 콘텐츠 | Astro Content Collections (프로젝트 글 관리) |
| 다국어 | 자체 i18n (`src/i18n`) — 한국어 / 영어 |
| 테스트 | Vitest |
| SEO | `@astrojs/sitemap` · Open Graph / Twitter 메타 |
| 분석 | Cloudflare Web Analytics |
| 배포 | GitHub Pages + GitHub Actions (`withastro/action`) |

---

## 주요 기능

- **이중 언어** — 한국어/영어 페이지 분리 및 상단 토글 전환
- **테마 토글** — 다크·라이트 전환, 새로고침 시 깜빡임 없는 초기화
- **콘텐츠 컬렉션** — 대표 프로젝트를 마크다운으로 관리해 카드로 노출
- **증빙 자료** — KISIA 수료(12개 과정)·아이디어톤 등 상세 페이지와 PDF 링크
- **자동 배포** — `main` 브랜치에 push하면 Actions가 빌드 후 Pages로 배포

---

## 프로젝트 구조

```
KimHands.github.io/
├── src/
│   ├── components/      Nav · Hero · Career · Stack · Work · Contact · Footer · Toggle 등
│   ├── content/         프로젝트 콘텐츠 컬렉션 (projects/*.md)
│   ├── i18n/            한·영 다국어 문자열·유틸 (ui.ts · utils.ts)
│   ├── layouts/         Base.astro — 공통 레이아웃 · 메타 · 테마 초기화
│   ├── pages/           index.astro(ko) · en/(en) · evidence/(증빙 상세)
│   ├── scripts/         theme.ts(다크모드) · reveal.ts(스크롤 등장)
│   └── styles/          global.css
├── public/              정적 자산 (favicon · og-image · evidence/*.pdf)
├── astro.config.mjs     Astro 설정 (site · sitemap · tailwind)
├── tailwind.config.mjs
└── .github/workflows/   deploy.yml — GitHub Pages 자동 배포
```

---

## 로컬 개발

```bash
npm install        # 의존성 설치
npm run dev        # 개발 서버 (http://localhost:4321)
npm run build      # 정적 빌드 → dist/
npm run preview    # 빌드 결과 미리보기
npm test           # Vitest 실행
```

---

## 배포

`main` 브랜치에 push하면 [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)이 자동으로 빌드 후 GitHub Pages에 배포합니다. 별도 수동 배포 과정은 필요 없습니다.
