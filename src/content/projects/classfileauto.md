---
title: "ClassFileAuto"
title_en: "ClassFileAuto"
role: "개인 · 운영 중"
role_en: "Solo · In service"
summary: "순천향대 Eclass 강의 자료를 브라우저에서 한 번에 내려받는 웹앱. 학번·비밀번호를 RSA로 암호화해 보내고 비밀번호는 서버와 세션 어디에도 저장하지 않는다. 학교 도메인 허용 목록으로 SSRF를 막고 로그인 시도 횟수를 제한."
summary_en: "A web app that bulk-downloads course materials from the campus LMS. Credentials are RSA-encrypted in transit and the password is never stored on the server or in the session; a campus-domain allow-list blocks SSRF and login attempts are rate-limited."
tech: ["Next.js","node-forge","iron-session","Vercel"]
liveUrl: "https://class-file-auto-web.vercel.app"
shot:
  src: "/shots/classfileauto.jpg"
  alt: "ClassFileAuto 로그인 화면과 개인정보 제공 동의 칸"
  alt_en: "ClassFileAuto sign-in screen with the data-sharing consent box"
  source: "live"
area: "security"
featured: true
order: 11
---
