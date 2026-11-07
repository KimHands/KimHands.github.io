export type Problem = {
  project: string;
  problem: string;
  problem_en: string;
  cause: string;
  cause_en: string;
  fix: string;
  fix_en: string;
  href: string;
  href_en?: string;
};

export const problems: Problem[] = [
  {
    project: 'HyperChecker',
    problem: '공개 후 👍 판정이 한 번도 나오지 않음. 주장 42개 중 일치 3개',
    problem_en: 'No 👍 verdict ever after launch; only 3 of 42 claims matched',
    cause: 'Claude가 맞다고 한 20건 중 9건을 코드가 표기 차이([3] 표기, 마크다운)로 제외함',
    cause_en: 'Code rejected 9 of the 20 claims Claude confirmed over formatting ([3] markers, Markdown)',
    fix: '표기를 정규화하되, 인용이 실제 문단에 있어야 한다는 검증 규칙은 유지',
    fix_en: 'Normalize formatting but keep the rule that the quote must be in the paragraph',
    href: '/work/hype-checker/#fixes', href_en: '/en/work/hype-checker/#fixes',
  },
  {
    project: 'HyperChecker',
    problem: '스타 0개 레포와 7천 개 레포가 동일하게 5점',
    problem_en: 'A 0-star repo and a 7,000-star repo both scored 5',
    cause: '소유자 혼자 커밋해도 받는 활동 가산점',
    cause_en: "An activity bonus earned by the owner's own commits",
    fix: '사용자가 적으면 가산하지 않고 감점을 강화',
    fix_en: 'No bonus with few users, and a stronger penalty',
    href: '/work/hype-checker/#fixes', href_en: '/en/work/hype-checker/#fixes',
  },
  {
    project: 'HyperChecker',
    problem: '첫 실행 전에 고정한 검증셋에서 도구 식별이 9/36',
    problem_en: 'Tool identification was 9/36 on a validation set frozen before the first run',
    cause: '틀린 27건 중 24건은 정답이 상위 3위 안에 있었지만 이름이 같은 복제·사칭 레포 때문에 하나로 확정하지 못함',
    cause_en: 'In 24 of the 27 misses the right repo was in the top 3, but same-name clones and impersonators blocked a decision',
    fix: '"같은 점수 중 가장 오래되고 스타 10배 이상이면 원본" 규칙 추가. 확정한 식별은 보정 전후 모두 전부 정답',
    fix_en: 'Added an "oldest with 10x the stars is the original" rule; every confirmed identification was correct before and after',
    href: '/work/hype-checker/#eval', href_en: '/en/work/hype-checker/#eval',
  },
  {
    project: 'HyperChecker',
    problem: '스타 조작 탐지에 공개 도구 Starguard(★500)를 포크해 쓸지 결정',
    problem_en: 'Whether to fork Starguard (★500) for star-manipulation detection',
    cause: '코드를 읽어 보니 오류 때 부분 데이터를 성공처럼 반환하고, 핵심 신호 2개에 버그가 있고, 자동 테스트가 없음',
    cause_en: 'Reading the code showed partial data returned as success, bugs in two key signals, and no automated tests',
    fix: '포크하지 않고 판정 기준만 출처를 밝혀 다시 구현',
    fix_en: 'Did not fork; reimplemented only the criteria, with attribution',
    href: '/work/hype-checker/#decision', href_en: '/en/work/hype-checker/#decision',
  },
  {
    project: '운용 체계',
    problem: '비대화형으로 실행한 Codex 검증이 멈춤. 규칙을 만든 뒤에도 세 번 재발',
    problem_en: 'Non-interactive Codex verification hung; it recurred three times even after a rule was written',
    cause: '방치된 표준 입력(stdin)을 계속 기다림',
    cause_en: 'It kept waiting on an unattended stdin',
    fix: '규칙을 더 쓰는 대신, 방치된 입력을 자동으로 닫는 래퍼로 근본 차단',
    fix_en: 'Instead of another rule, a wrapper now closes unattended input automatically',
    href: '/workflow-overview/#verification',
  },
];
