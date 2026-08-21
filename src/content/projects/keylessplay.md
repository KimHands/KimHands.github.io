---
title: "KeylessPlay"
title_en: "KeylessPlay"
role: "졸업작품 · 개인"
role_en: "Capstone · Solo"
summary: "Widevine L3 환경에서 콘텐츠 키(CEK)를 단말에 한 번도 전송하지 않고 재생되는 스트리밍 게이트웨이. Edge가 세션마다 재암호화해, 라이선스 한 번 탈취가 콘텐츠 전체·전 사용자에 대한 영구 재사용으로 직결되는 위험을 제거. DRM 논문(CISC-S'26·국가암호공모전)의 참조 구현 — 코드 2026-11 공개 예정."
summary_en: "A streaming gateway that plays under Widevine L3 without ever sending the content key (CEK) to the client. Per-session edge re-encryption removes the risk where one license theft cascades into permanent reuse across all content and users. Reference implementation of my DRM papers (CISC-S'26, national crypto competition) — code opening 2026-11."
tech: ["Python","Widevine L3","DRM","Applied Crypto"]
area: "security"
featured: true
order: 3
---
