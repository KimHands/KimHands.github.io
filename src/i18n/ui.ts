export const languages = { ko: '한국어', en: 'English' } as const;
export const defaultLang = 'ko';

export const ui = {
  ko: {
    'nav.work': 'Work', 'nav.about': 'About', 'nav.blog': 'Blog', 'nav.contact': 'Contact',
    'hero.lead.pre': '',
    'hero.lead.hl': '보안·풀스택·AI가 겹치는 지점',
    'hero.lead.post': '에서 실제로 배포되는 도구를 만드는 개발자입니다.',
    'hero.work': '작업 보기 ↓', 'hero.resume': '이력서',
    'stack.label': 'Stack', 'stack.note': '실제 비중대로',
    'work.label': 'Selected Work',
    'work.slot': '+ 추가 예정\\nHedgehog Seminar · clasp · GrowthLens',
    'contact.cmd': '$ contact', 'contact.title': '같이 일할 곳을 찾고 있습니다.',
    'contact.body': '보안을 이해하는 풀스택 개발자가 필요하시면 편하게 연락 주세요.',
    'contact.email': '이메일 보내기 →',
  },
  en: {
    'nav.work': 'Work', 'nav.about': 'About', 'nav.blog': 'Blog', 'nav.contact': 'Contact',
    'hero.lead.pre': 'A developer who builds shipped tools at the intersection of ',
    'hero.lead.hl': 'security, fullstack, and AI',
    'hero.lead.post': '.',
    'hero.work': 'See work ↓', 'hero.resume': 'Résumé',
    'stack.label': 'Stack', 'stack.note': 'by real usage',
    'work.label': 'Selected Work',
    'work.slot': '+ coming soon\\nHedgehog Seminar · clasp · GrowthLens',
    'contact.cmd': '$ contact', 'contact.title': "Looking for a team to build with.",
    'contact.body': 'If you need a fullstack developer who understands security, reach out.',
    'contact.email': 'Send email →',
  },
} as const;
