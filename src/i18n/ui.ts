export const languages = { ko: '한국어', en: 'English' } as const;
export const defaultLang = 'ko';

export const ui = {
  ko: {
    'nav.work': 'Work', 'nav.about': 'About', 'nav.blog': 'Blog', 'nav.contact': 'Contact',
    'hero.lead.pre': '',
    'hero.lead.hl': 'AI 에이전트',
    'hero.lead.post': '와 그것을 안정적으로 운영하는 시스템을 만드는 개발자입니다.',
    'hero.work': '작업 보기 ↓', 'hero.resume': '이력서',
    'stack.label': 'Stack', 'stack.note': '실제 비중대로',
    'work.label': 'Selected Work',
    'contact.cmd': '$ contact', 'contact.title': '같이 일할 곳을 찾고 있습니다.',
    'contact.body': 'AI 에이전트를 제품으로 만들 개발자가 필요하시면 편하게 연락 주세요.',
    'contact.email': '이메일 보내기 →',
  },
  en: {
    'nav.work': 'Work', 'nav.about': 'About', 'nav.blog': 'Blog', 'nav.contact': 'Contact',
    'hero.lead.pre': 'A developer who builds ',
    'hero.lead.hl': 'AI agents',
    'hero.lead.post': ' and the systems that run them reliably.',
    'hero.work': 'See work ↓', 'hero.resume': 'Résumé',
    'stack.label': 'Stack', 'stack.note': 'by real usage',
    'work.label': 'Selected Work',
    'contact.cmd': '$ contact', 'contact.title': "Looking for a team to build with.",
    'contact.body': 'If you need a developer to turn AI agents into shipped products, reach out.',
    'contact.email': 'Send email →',
  },
} as const;
