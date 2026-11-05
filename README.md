# social-login-buttons

카카오 · 네이버 · Apple · Google 로그인 버튼을 각 회사 공식 가이드에서 잰 값으로 그린 디자인 시스템.
모서리 · 언어 · 플랫폼(웹 / iOS / Android) · 형태 · 테마를 골라 같은 모양으로 맞춘다.

- 데모: https://ai-dico.github.io/social-login-buttons/
- 실측 값과 출처: [docs/research/official-guides-2026-11-05.md](docs/research/official-guides-2026-11-05.md)
- 결정 기록: [docs/decisions-2026-11-05.md](docs/decisions-2026-11-05.md)

## 쓰는 법 — AI 에게 프롬프트로

1. [데모](https://ai-dico.github.io/social-login-buttons/)에서 모서리 · 색 · 높이 · 문구 · 형태를 고른다.
2. 「대상 스택」을 고른다 — Flutter · 웹(HTML/CSS) · Svelte · React · SwiftUI · Compose · 자동.
3. 「AI 프롬프트 복사」를 눌러 Claude Code · Cursor · Lovable 같은 AI 코딩 도구에 붙여 넣는다.

데모를 거치지 않고 기본 모양으로 바로 쓰려면 아래를 붙여 넣는다.

```text
내 프로젝트에 소셜 로그인 버튼(카카오 → 네이버 → Apple → Google)을 넣어줘. 스택은 내 프로젝트에 맞게.
기준: https://github.com/AI-Dico/social-login-buttons
토큰 정본: https://raw.githubusercontent.com/AI-Dico/social-login-buttons/main/tokens.json 을 먼저 읽고 defaults 값을 따라줘.
로고: 저장소 assets/ 의 파일을 쓰고, Apple 로고는 재배포 금지라 자리만 만들어 두고 받는 곳을 나에게 알려줘.
이미 로그인 버튼이 있으면 동작은 그대로 두고 모양만 바꿔.
적용하다 공식 가이드와 다른 점이나 tokens.json 문제를 찾으면 마지막에 이슈 초안으로 정리해줘.
```

## 파일

- `tokens.json` — 토큰 정본(회사별 색 · 크기 · 문구 · 로고 · 옵션).
- `assets/` — 카카오 심볼 · 네이버 N(SVG), Google G(SVG · PNG @1x~@4x). Google SVG 는 브라우저용이고 Flutter · 네이티브는 PNG 를 쓴다.

## 고칠 점은 이슈로

공식 가이드와 다른 값, tokens.json 오류, 특정 스택에서 구현이 어려운 점을 찾으면 [이슈](https://github.com/AI-Dico/social-login-buttons/issues/new)로 알려 주세요. 화면 · 스택 · 고른 옵션 · 스크린샷을 함께 적어 주면 빠르게 고칠 수 있습니다.

## 로고

- 카카오 · 네이버 · Google 로고는 각 회사 공식 배포 자료에서 가져왔다.
- **Apple 로고는 포함하지 않는다.** Apple Design Resources 라이선스가 재배포를 금지한다.
  [Apple Design Resources](https://developer.apple.com/design/resources/#sign-in-with-apple) 에서 직접 받아 넣는다.
  데모에서는 🍎 이모지로 대신 보인다.

## 상표

Kakao, NAVER, Apple, Google 및 각 로고는 해당 회사의 상표다. 이 저장소는 각 회사와 관련이 없으며, 버튼은 각 회사 브랜드 가이드를 따르도록 만들었다.
