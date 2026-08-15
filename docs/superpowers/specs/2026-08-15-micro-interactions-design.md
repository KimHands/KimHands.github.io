# 마이크로 인터랙션 강화 — 설계

날짜: 2026-08-15
레퍼런스: hwchoi.com (three.js tubes 커서 등) — 강도는 **의도적으로 낮춰** 절제된 마이크로 인터랙션만 채택.

## 목표
포트폴리오 사이트의 완성도를 인터랙션으로 끌어올린다. 화려한 장식(WebGL 커서 등)은
AGENTS.md의 "장식 트로프 지양 / AI 티 거부" 규칙과 충돌하므로 배제한다.

## 원칙
- 새 런타임 의존성 0개. 순수 CSS + `requestAnimationFrame` / pointer 이벤트.
- 모든 효과는 `(pointer: fine)` + `prefers-reduced-motion: no-preference`에서만 동작.
  모바일·모션축소 사용자에겐 자동 비활성(진입 시 상태는 정상 표시).
- 각 효과는 독립 init 함수. 하나가 실패해도 나머지에 영향 없음.

## 구조
- 신규 `src/scripts/interactions.ts` — scrollspy · magnetic · card-spotlight 3개 init 함수.
- 두 진입 페이지(`src/pages/index.astro`, `src/pages/en/index.astro`)에 `<script>` 한 줄 추가.
- reveal 곡선/방향 개선은 대부분 `src/styles/global.css` 튜닝 + 소수 클래스 추가.

## 기능 4종

### 1. 스크롤스파이 nav
IntersectionObserver로 현재 뷰포트 섹션(`#about`/`#career`/`#work`/`#contact`) 감지 →
href가 일치하는 `.nlink`에 `.is-active` 부여. Career는 nav 링크가 없으므로 매칭 대상 제외.
CSS: 활성 링크는 밑줄 `::after`를 `scaleX(1)`로 켜고 색을 `--ink`로. 모션이 아니므로
축소모드에서도 유지(즉시 전환).

### 2. 자석(magnetic) 버튼
`[data-magnetic]` 요소(GitHub `.pill`, Contact 주요 CTA)가 커서 근접 시 최대 ~6px만
부드럽게 끌려오고 벗어나면 복귀. pointermove는 rAF로 스로틀.

### 3. 카드 스포트라이트 + 리프트
`.card` hover 시 커서 좌표를 `--mx`/`--my` CSS 변수로 전달 → 은은한 radial glow가
커서를 따라옴 + `translateY(-2px)` 리프트. 기존 border-color hover 위에 얹음.

### 4. reveal 곡선/방향 개선
cubic-bezier를 더 자연스러운 곡선으로, 이동 거리 축소, 섹션별 방향성
(`reveal-l`/`reveal-r`) 옵션 추가. 기존 스태거(d1/d2/d3) 유지.

## 검증
- `npm run build` 통과.
- dev 서버 + gstack로 데스크톱 hover 인터랙션 동작 및 모바일 뷰포트 비활성 확인.

## 비목표(YAGNI)
- WebGL/three.js 커서, 커스텀 커서, 파티클, 패럴럭스 — 채택하지 않음.
- 이펙트 on/off 토글 UI — 현 단계에서 불필요(reduced-motion으로 충분).
