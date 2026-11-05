# 비슷한 오픈소스 조사 (2026-11-05, 1차 검색)

| 프로젝트 | 플랫폼 | 카카오·네이버 | 공식 가이드 준수 | 다크 | 메모 |
|---|---|---|---|---|---|
| k_auth (pub.dev, MIT, 2025-12~) | Flutter | 있음(카카오·네이버·구글·애플) | 「official design guideline buttons」 표방 | 미확인 | 가장 가까운 선례. 로그인 SDK 겸 버튼(LoginButtonGroup·아이콘형). 웹·SwiftUI·Compose 없음 |
| Yoon-Hae-Min/react-social-buttons-kr (2022) | React | 있음 | 가이드 링크만 | 미확인 | 갱신 멈춤으로 보임 |
| kitspace/react-social-login-buttons | React | 없음 | 아님 | 없음 | 글로벌 제공자만, 시각 컴포넌트 |
| ex-platform/vue-social-login (2021) | Vue | 있음 | 아님 | 없음 | 로그인 로직 포함 |
| SocialLogins (CocoaPods) | iOS | 없음 | 아님 | — | Apple·Google·Facebook |
| Tailgrids Social Button | React+Tailwind | 없음 | 아님 | — | 범용 모양만 |

공식 제공물: Google Identity Services 렌더 버튼(웹), Apple ASAuthorizationAppleIDButton(iOS)·Sign in with Apple JS — 쓸 수 있으면 공식 컴포넌트를 권하고, 이 저장소는 같은 모양의 토큰·대체 구현을 둔다.

카카오 공식(확인, developers.kakao.com/docs/ko/kakaologin/design-guide): 컨테이너 #FEE500 · 심볼 #000000 · 레이블 #000000 85% · 모서리 12px · OS 기본 글꼴 · 심볼 없는 버튼 금지.

차별점 후보: 한 토큰 정본에서 웹(CSS·Svelte·React)·SwiftUI·Compose 생성, 출처 URL 붙은 공식 값, 라이트/다크, 한국어·영어 공식 문구, 인증 로직과 분리, README 자동 스크린샷.
