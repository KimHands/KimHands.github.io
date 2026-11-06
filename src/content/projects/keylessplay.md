---
title: "KeylessPlay"
title_en: "KeylessPlay"
role: "졸업작품 · 개인 · 비공개"
role_en: "Capstone · Solo · Private"
summary: "Widevine L3의 위협 모델을 참고해, 콘텐츠 키(CEK)를 Edge까지만 보내고 단말에는 전달하지 않도록 설계한 스트리밍 게이트웨이 참조 구현. 실제 Widevine CDM은 수정하거나 호출하지 않는다. 키 추출 자체를 막지는 않지만, 세션마다 재암호화해 추출된 키로 할 수 있는 일의 범위를 줄인다. Tamarin 형식 모델을 포함한 DRM 논문(CISC-S'26)의 구현."
summary_en: "A reference streaming gateway modeled on the Widevine L3 threat model: the content key (CEK) goes only as far as the edge, never to the client. It neither modifies nor calls the real Widevine CDM. It does not stop key extraction; per-session re-encryption narrows what an extracted key can do. Implements my DRM paper (CISC-S'26), with a Tamarin formal model."
tech: ["Python","FastAPI","DRM","Tamarin"]
area: "security"
featured: true
order: 9
---
