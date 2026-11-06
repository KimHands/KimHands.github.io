---
title: "KeylessPlay"
title_en: "KeylessPlay"
role: "졸업작품 · 개인 · 비공개"
role_en: "Capstone · Solo · Private"
summary: "Widevine L3 환경에서 콘텐츠 키(CEK)를 Edge까지만 보내고 단말에는 전달하지 않는 스트리밍 게이트웨이. 키 추출 자체를 막지는 않지만, 세션마다 재암호화해 추출된 키로 할 수 있는 일의 범위를 줄인다. Tamarin 형식 모델을 포함한 DRM 논문(CISC-S'26)의 참조 구현."
summary_en: "A streaming gateway for Widevine L3 that sends the content key (CEK) only as far as the edge, never to the client. It does not stop key extraction; per-session re-encryption narrows what an extracted key can do. Reference implementation of my DRM paper (CISC-S'26), with a Tamarin formal model."
tech: ["Python","FastAPI","Widevine L3","Tamarin"]
area: "security"
featured: true
order: 9
---
