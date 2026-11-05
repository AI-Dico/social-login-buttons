# social-login-buttons

카카오 · 네이버 · Apple · Google 로그인 버튼을 각 회사 공식 가이드에서 잰 값으로 그린 디자인 시스템.
모서리 · 언어 · 플랫폼(웹 / iOS / Android) · 형태 · 테마를 골라 같은 모양으로 맞춘다.

- 데모: https://ai-dico.github.io/social-login-buttons/
- 실측 값과 출처: [docs/research/official-guides-2026-11-05.md](docs/research/official-guides-2026-11-05.md)
- 결정 기록: [docs/decisions-2026-11-05.md](docs/decisions-2026-11-05.md)

## 상태

1단계(공식 가이드 실측 · 미리보기) 완료. 다음 단계는 토큰 JSON → 웹 · SwiftUI · Compose 생성.

## 로고

- 카카오 · 네이버 · Google 로고는 각 회사 공식 배포 자료에서 가져왔다.
- **Apple 로고는 포함하지 않는다.** Apple Design Resources 라이선스가 재배포를 금지한다.
  [Apple Design Resources](https://developer.apple.com/design/resources/#sign-in-with-apple) 에서 직접 받아 넣는다.
  데모에서는 ⛔ 자리표시로 보인다.

## 상표

Kakao, NAVER, Apple, Google 및 각 로고는 해당 회사의 상표다. 이 저장소는 각 회사와 관련이 없으며, 버튼은 각 회사 브랜드 가이드를 따르도록 만들었다.
