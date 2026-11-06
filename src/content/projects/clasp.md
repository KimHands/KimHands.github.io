---
title: "clasp"
title_en: "clasp"
role: "개인 · 오픈소스"
role_en: "Solo · Open source"
summary: "로컬 파일을 분류하고 마인드맵으로 보여 주는 프라이버시 우선 데스크톱 앱. 파일 내용은 루프백 LLM으로만 보내고, LLM 출력은 신뢰하지 않는 입력으로 다뤄 허용 목록과 신뢰도 상한을 건다. 파일을 덮어쓰는 경로가 없고, 파일을 옮기는 도구가 없는 읽기 전용 MCP 서버를 제공."
summary_en: "A privacy-first desktop app that classifies local files and shows them as a mind map. File contents go only to a loopback LLM, whose output is treated as untrusted (allow-list plus a confidence cap). No code path overwrites files, and it ships a read-only MCP server with no file-moving tools."
tech: ["Electron","React","FastAPI","SQLite","MCP"]
repoUrl: "https://github.com/KimHands/clasp"
area: "ai"
featured: true
order: 5
---
