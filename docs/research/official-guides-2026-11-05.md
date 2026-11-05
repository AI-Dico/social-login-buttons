# 공식 가이드 실측 (2026-11-05)

원본 페이지·공식 애셋 zip 을 내려받아 텍스트와 픽셀·SVG 값으로 쟀다. 가이드 본문과 공식 애셋이 다르면 둘 다 적고, 기본값은 **공식 애셋**을 따른다(실제로 배포되는 모양이므로).

## 출처

| 회사 | 가이드 | 공식 애셋 |
|---|---|---|
| 카카오 | https://developers.kakao.com/docs/latest/ko/kakaologin/design-guide | https://developers.kakao.com/tool/resource/login (`/tool/download/Kakao Login.zip`, SVG·PNG @1~4x) |
| 네이버 | https://developers.naver.com/docs/login/bi/bi.md | `NAVER_login_KR.zip`·`NAVER_login_EN.zip` (PNG @4x, Light/Dark × green/white × wide/narrow/center/icon × H48/H56) |
| Google | https://developers.google.com/identity/branding-guidelines (최종 갱신 2026-07-07) | `/static/identity/images/signin-assets.zip` (Android+Web·iOS × Light/Dark/Neutral × Square/Pill × 글자 유무, SVG·PNG) |
| Apple | https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple | Apple Design Resources(로고 파일). 시스템 버튼 = `ASAuthorizationAppleIDButton`·Sign in with Apple JS |

## 카카오

| 항목 | 가이드 본문 | 공식 애셋(SVG) |
|---|---|---|
| 배경 | #FEE500 | #FEE500 |
| 심볼 | #000000 | #191919 |
| 레이블 | #000000 85% | #191919 |
| 높이 | 90px(@2x 도식) | 46 |
| 모서리 | 12px | rx 8 (46 높이) · 심볼만 = 원(48, rx 24) |
| 너비 | — | small 112 · medium 224 · large 336 · xlarge 448 |
| 문구 | 완성형 「카카오 로그인」/「Login with Kakao」, 축약형 「로그인」/「Login」 | 같음 |
| 글꼴 | OS 기본 시스템 서체, 30pt(@2x 도식 기준) | — |

- 넓힐 때: 심볼·레이블 영역은 그대로, 좌우 확장. 심볼 좌측 정렬 또는 레이블과 가운데 정렬.
- 키울 때: 비율 유지, 레이블 높이 ≤ 컨테이너 높이 1/3. 작게 써야 하면 축약형.
- 금지: 색 변경, 심볼 생략, 카카오 CI 를 심볼로 사용.
- ⚠ 본문(#000000·12px)과 애셋(#191919·8px)이 다르다. 기본값 = 애셋, 문서에 둘 다 표기.
- 다크 테마 별도 규정 없음 → 다크에서도 노란 버튼 그대로.

## 네이버

| 항목 | 값 |
|---|---|
| 배경(라이트) | **#03A94D** (가이드 이미지 표기·애셋 픽셀 일치. 브랜드색 #03C75A 아님) |
| 배경(다크, 애셋) | #05AC4F |
| 흰 버튼 | 라이트: 배경 #FFFFFF·테두리 #D9D9D9·로고 #03A94D·레이블 #000000 / 다크: 배경 #1F1F1F·테두리 #414141 |
| 로고·레이블(초록 버튼) | #FFFFFF |
| 높이 | 48 · 56 |
| 너비(애셋) | wide 368 · narrow 210 · icon 48(원) |
| 모서리 | 8px (애셋 실측), 아이콘형 = 원 |
| N 로고 | 아이콘형 18px · 완성형 16px 이상 |
| 정렬 | 가운데(로고-레이블 간격 8px) 또는 왼쪽(로고 여백 20px, 레이블은 가운데 유지) |
| 문구 | 목적에 맞으면 변경 가능(「네이버 로그인」「네이버로 시작하기」「Log in with NAVER」 등) |

- 「꼭 필요한 경우 일부 변경 가능, 최대한 유지 권장」 — 모서리 범위는 명시 없음.

## Google

| 테마 | 배경 | 테두리 | 글자 |
|---|---|---|---|
| Light | #FFFFFF | #747775 1px inside | #1F1F1F |
| Dark | #131314 | #8E918F 1px inside | #E3E3E3 |
| Neutral | #F2F2F2 | 없음 | #1F1F1F |

| 항목 | Android·웹 | iOS |
|---|---|---|
| 높이 | 40 | 44 |
| 좌 여백 · 로고-글자 간격 · 우 여백 | 12 · 10 · 12 | 16 · 12 · 16 |
| G 로고 | 20×20 | 20×20 |
| 모서리 | Square = 4 · Pill = 높이/2 | 같음 |
| 글꼴 | Google Sans Medium 14/20 | 스펙 이미지는 Roboto Medium 14/20 (본문은 Google Sans) |

- 문구 권장: 「Sign in with Google」「Sign up with Google」「Continue with Google」, 현지화 허용·권장. 「Google」 단독 금지.
- G 로고: 크기·색 변경 금지, 표준 컬러(새 그라데이션 G), 흰 바탕 위. 단색 G 금지. 아이콘만 버튼 허용(Square/Pill).
- 다른 소셜 버튼과 비슷한 크기·무게로(덜 눈에 띄게 하면 안 됨).
- ⚠ 이전 메모의 「Roboto Medium」 은 옛 기준. 현재 본문은 Google Sans Medium.

## Apple

| 항목 | 값 |
|---|---|
| 스타일 | 검정(라이트 배경) · 흰색(다크 배경) · 흰색+외곽선(흰·밝은 배경, iOS·macOS·웹) |
| 문구 | 「Sign in with Apple」「Sign up with Apple」「Continue with Apple」만 (시스템 버튼은 기기 언어로 자동 번역) |
| 최소 크기 | 너비 140pt · 높이 30pt · 바깥 여백 높이의 1/10 |
| 권장 높이 | 44pt |
| 글자 크기 | 버튼 높이의 43% (높이 = 글자 × 2.33) |
| 우측 여백 | 버튼 너비의 8% 이상 |
| 모서리 | 앱의 다른 버튼에 맞춰 조정 가능 — 각진형·캡슐형 모두 허용(iOS·macOS·웹) |
| 로고 | Apple Design Resources 의 로고 파일만, 파일 높이 = 버튼 높이, 자르기·세로 여백 추가 금지 |
| 색 | 로고·글자는 둘 다 검정 또는 둘 다 흰색 |
| 아이콘만 | 1:1, 원·둥근 사각 마스크 가능 |

- 커스텀 버튼은 App Review 에서 심사. 다른 로그인 버튼보다 작게 만들면 안 됨.

## 모서리·로고 처리 (결정 2026-11-05 오후)

- 모서리: 고른 값을 모든 회사에 그대로 적용한다. 회사별 보정 없음. 공식 기본값(카카오 8 · 네이버 8 · Google 4 · Apple 6 내외 [확인 필요])과 다르면 정보 표시만 한다.
- 로고: Apple 만 재배포 금지(Apple Design Resources 라이선스 — 재배포·네트워크 공개 금지). 저장소·데모에 넣지 않고 「직접 받기」 자리표시와 다운로드 경로를 안내한다. 카카오·네이버·Google 로고는 포함한다.
