export type Record = {
  date: string;
  title: string;
  title_en: string;
  kind: string;
  kind_en: string;
  href: string;
  href_en?: string;
};

export const records: Record[] = [
  {
    date: '2026-11', kind: '글', kind_en: 'Write-up',
    title: 'HyperChecker — 설계·가드레일·평가 기록',
    title_en: 'HyperChecker — design, guardrails, evaluation',
    href: '/work/hype-checker/', href_en: '/en/work/hype-checker/',
  },
  {
    date: '2026-11', kind: '문서', kind_en: 'Doc (Korean)',
    title: '운용 체계 — Claude Code 위 개인 운용 계층',
    title_en: 'Workflow — my operating layer on top of Claude Code',
    href: '/workflow-overview/',
  },
  {
    date: '2026', kind: 'PDF', kind_en: 'PDF',
    title: "DRM 보안 논문 (Tamarin 형식 검증) — CISC-S'26 채택",
    title_en: "DRM security paper (Tamarin formal verification) — CISC-S'26",
    href: '/evidence/cisc-s26-paper.pdf',
  },
  {
    date: '2025', kind: '목록', kind_en: 'List',
    title: 'KISIA 융합보안 교육 수료증 12개',
    title_en: 'KISIA convergence-security course certificates (12)',
    href: '/evidence/kisia/',
  },
];
