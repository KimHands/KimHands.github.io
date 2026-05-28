# 포트폴리오 사이트 — 설계 스펙

- **날짜**: 2026-05-28
- **대상 저장소**: `KimHands/KimHands.github.io` (user GitHub Pages, root 배포)
- **상태**: 설계 확정, 구현 대기

## 1. 목표 · 대상

취업·이직용 포트폴리오 사이트. **채용 담당자/면접관**이 짧은 시간에 "이 사람 실력 있다 + 실제로 배포한다"를 판단할 수 있게 한다. GitHub README의 한계(마크다운 제약·정적·개발자 대상)를 넘어, 라이브 데모와 스토리텔링으로 차별화한다.

**한 줄 컨셉:** *"보안을 이해하는 풀스택 개발자 — 만든 건 실제로 배포한다."*

## 2. 비주얼 방향

`DESIGN.md`(repo 루트)가 디자인 단일 진실 소스. 요약:
- "문서/README" 미감 — Ollama + Apple에서 calibrate
- 모노크롬 + 액센트 1개(#0066cc), 시스템 폰트, 넓은 레이아웃(~1080px), 코드 1급(터미널 카드), 미묘한 모션
- 승인된 목업: `mockups/direction-doc.html`

## 3. 정보 설계 (MVP 섹션)

위 → 아래, 단일 문서 흐름:

1. **Nav** — 이름 / Work·About·**Blog**(Velog 외부)·Contact 링크 / GitHub pill / **한·영 토글 + 다크 모드 토글**
2. **Hero** — 이름 + 사실 기반 소개 + 터미널 카드(whoami/ls ~/now) + "작업 보기 / 이력서" 링크
3. **Stack** — 정의 목록(Frontend / Backend / Security / AI / Infra), 실제 비중대로(FastAPI 전면)
4. **Selected Work** — 데이터 기반 카드(3개 + 여분 슬롯, 3→6 확장)
5. **Contact** — 다크 반전 블록, 이메일 CTA(mailto)
6. **Footer** — 모노 소형 링크

**확장(추후, MVP 아님):** Activities(해커톤·아이디어톤·운영진·졸업작품), More Projects 그리드(분야 필터), 개별 프로젝트 케이스 스터디 페이지.

## 4. 콘텐츠 모델 — 프로젝트(데이터 기반)

Astro **콘텐츠 컬렉션**으로 관리. 프로젝트 1개 = 파일/엔트리 1개 → 카드 자동 생성(3→6 무리 없이).

필드:
- `title`, `slug`, `role`, `year`
- `summary` (한 줄 설명)
- `tech` (string[])
- `liveUrl`, `repoUrl` (선택)
- `area` (보안 / 풀스택 / AI 등 태그)
- `featured` (bool), `order` (정렬)

**확정 Featured 3개 (전부 라이브 데모):**
| 프로젝트 | 데모 | 비고 |
|---|---|---|
| ClassFileAuto_Web | class-file-auto-web.vercel.app | SSO RSA 보안 설계 |
| likelion14-sch | https://www.likelion-sch.com/ | React+Django, 커스텀 도메인 실서비스 |
| Hedgehog_WebCTF | hedgehog-web-ctf.vercel.app | 웹 CTF 직접 출제 |

여분 슬롯 후보: Hedgehog_Seminar(보안+AI), clasp, GrowthLens, DailyAlleyAI.

## 5. 다국어 (한 · 영 토글)

- 한국어 기본 + 영어 토글. 텍스트는 로케일별 사전/콘텐츠로 분리.
- 구현 방식(Astro i18n 라우팅 vs 단순 사전)은 구현 단계에서 확정. 구조는 처음부터 i18n 가능하게 설계.

## 6. 기술 스택 · 배포

- **Astro + Tailwind CSS** (정적 출력). 인터랙션 필요한 곳만 최소 스크립트(모션은 IntersectionObserver 수준).
- **배포**: GitHub Actions → GitHub Pages. user site라 root 경로(basePath 이슈 없음).
- 백엔드 없음. 연락은 `mailto:`. 이력서는 정적 PDF.

## 7. 모션 · 접근성

- 모션은 `DESIGN.md` 규정 따름(페이드업·터미널 순차·호버 밑줄). `prefers-reduced-motion` 존중.
- 시맨틱 HTML, 키보드 포커스 가시화(accent 포커스 링), 명도 대비 WCAG AA 이상, 이미지 alt.

## 8. SEO · 메타 (README가 못 하는 차별화)

- `<title>`, meta description, **OG 이미지**(링크 공유 시 카드), favicon, sitemap.
- 시맨틱 마크업으로 검색 노출.

## 9. 기능 범위

**포함:**
- **블로그**: 자체 구현 대신 외부 **Velog** 링크(nav·footer) → `https://velog.io/@kimhands`. 새 탭으로 염.
- **다크 모드**: 라이트/다크 토글(`DESIGN.md` 다크 토큰). `prefers-color-scheme` 초기값 + `localStorage`. 한·영 토글과 함께 nav에.
- **연락처**: 폼/서버 없이 **Gmail 주소 노출 + `mailto:`** (kimjonggun0206@gmail.com).
- **방문자 분석**: **Cloudflare Web Analytics**(확정) — 무료·쿠키리스·PII 미수집·GDPR 배너 불필요. 베타 스크립트 1줄 삽입. Cloudflare 계정 생성 후 사이트 토큰 발급 필요(§10).

**범위 밖 (YAGNI):**
- **CMS**(코드 없이 웹 관리자 UI로 콘텐츠 편집하는 도구, 예: WordPress/Contentful) — 콘텐츠는 repo 파일(콘텐츠 컬렉션)로 관리하므로 불필요.
- 연락 폼/백엔드 서버.

## 10. 구현하며 다듬을 항목 (사용자 합의)

세부 텍스트·디테일 디자인은 실제 구현하며 조정:
- 각 섹션 정확한 카피 + 영어 번역
- 프로젝트 스크린샷/요약 다듬기, 이력서 PDF 준비
- Activities 섹션 / 케이스 스터디 페이지 도입 여부
- 폰트 웹폴백(Inter/JetBrains Mono) 적용 범위

**필요한 입력(사용자):**
- **Cloudflare Web Analytics 사이트 토큰** (Cloudflare 계정 생성 후 발급 — 빌드 막바지에 삽입)
- (선택) 이력서 PDF 파일
