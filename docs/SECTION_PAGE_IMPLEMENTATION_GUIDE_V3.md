# 섹션별 웹사이트 제작지침 — 구현 실행본 v3

> 프로젝트: **JINNI'S / 지니쌤의 킨더에듀 (`kinder-edu`)**
> 기준일: 2026-09-26
> 적용 범위: **놀며자라 매거진 / 프로그램 / 게임 / 만들기 / 웹툰 / 블로그**
> 문서 목적: 지금까지 확정한 시안·수정사항·프로젝트 운영방안을 하나로 통합하여, 홈페이지 프로젝트에서 즉시 기본 틀 제작을 시작할 수 있도록 하는 구현 기준서
> 상태: **기본 골격 구현용 확정 초안** — 픽셀 단위의 미세 정렬·아이콘 최종 모양·실제 에셋 교체는 구현 후 화면을 보며 수정한다.

---

# 0. 가장 중요한 구현 원칙

## 0.1 이번 단계의 목표

이번 단계는 기능을 많이 넣는 단계가 아니다. 우선 아래를 완성한다.

1. 공통 상세페이지 Shell
2. 6개 섹션의 서로 다른 Main 정보구조
3. 섹션 이동
4. 기본 스크롤·상태전환
5. 데이터 기반 콘텐츠 표시 구조
6. 이후 이미지·잡지·게임·블로그 글을 넣을 수 있는 콘텐츠 슬롯

즉, **예쁘고 안정적인 기본 틀을 먼저 만든다.**

## 0.2 최신 결정 우선순위

설계 충돌 시 다음 우선순위를 사용한다.

1. 사용자가 대화 중 직접 수정·확정한 최신 내용
2. 본 v3 문서
3. 기존 메인 홈페이지의 디자인 언어
4. 과거 인계서/v1/v2 지침
5. 구현자가 임의로 추가한 편의 기능

## 0.3 초기 버전에서 공통적으로 만들지 않는 것

다음은 모든 섹션에서 **초기 버전 제외**다.

- 좋아요
- 댓글
- 조회수
- 인기순 랭킹
- 별점
- 사용자 팔로우
- 알림
- 로그인/프로필 강제
- 복잡한 추천 알고리즘
- 섹션마다 별도 검색창을 무조건 배치하는 것
- 과도한 필터
- 과도한 애니메이션
- 과도한 글래스모피즘
- 패널 자유 리사이즈
- 불필요한 Zoom
- 초기 화면에서 기능이 없는 장식 버튼

시안 이미지에 위 기능이 들어가 있더라도 **구현 기준에는 포함하지 않는다.**

---

# 1. 사이트 전체 UX 방향

## 1.1 사용자

- 주 사용자: 유치원·어린이집 교사
- 핵심 사용 상황: 자료 탐색, 작업도구 사용, 유아용 게임 실행, 제작물 생성, 웹툰 읽기, 제작 기록 읽기

## 1.2 시각 방향

```text
Clean + Warm + Editorial + Character/IP
```

원칙:

- 깔끔하고 시인성이 좋아야 한다.
- 유아용 장난감 사이트처럼 지나치게 알록달록하게 만들지 않는다.
- 섹션별 색은 정체성을 주되, 본문 패널은 흰색 중심으로 유지한다.
- 캐릭터와 일러스트는 적극 활용할 수 있지만 기능을 가리지 않는다.
- 넓은 여백, 둥근 패널, 낮은 정보 밀도를 기본으로 한다.
- 같은 사이트라는 통일감은 Shell·간격·라운드·타이포에서 만들고, 각 섹션의 개성은 Main 구조에서 만든다.

---

# 2. 서비스 순서와 라우트

전역 순서는 고정한다.

1. 놀며자라 매거진
2. 프로그램
3. 게임
4. 만들기
5. 웹툰
6. 블로그

기존 경로는 현재 프로젝트와 충돌이 없다면 우선 유지한다.

| 섹션 | 기존 경로 | key |
|---|---|---|
| 놀며자라 매거진 | `play.html` | `magazine` |
| 프로그램 | `programs.html` | `programs` |
| 게임 | `games.html` | `games` |
| 만들기 | `create.html` | `making` |
| 웹툰 | `webtoon.html` | `webtoon` |
| 블로그 | `blog.html` | `blog` |

라우터를 이미 다른 방식으로 사용 중이라면 **라우팅 기술을 새로 갈아엎지 말고 현재 구조에 맞춰 연결**한다.

---

# 3. 전체 프로젝트 운영방안 — 반드시 준수

## 3.1 한 개의 거대한 프로젝트도, 6개의 완전 별도 사이트도 만들지 않는다

전체 구조는 세 층으로 관리한다.

```text
1. Kinder Edu Platform
   └─ 공통 Shell / Routing / Navigation / Footer / Section UI

2. Content Systems
   └─ Magazine / Making Templates / Webtoon / Blog

3. Independent Apps & Games
   └─ PlayStory / 이미지도구 / 게임별 프로젝트
```

핵심 문장:

> **공통 UI는 Kinder Edu에서 한 번만 관리하고, 콘텐츠는 데이터로 분리하며, 실행 로직이 큰 프로그램과 게임만 독립적으로 개발한다.**

## 3.2 권장 논리 구조

```text
kinder-edu/
├─ web/
│  ├─ shared/
│  ├─ magazine/
│  ├─ programs/
│  ├─ games/
│  ├─ making/
│  ├─ webtoon/
│  └─ blog/
│
├─ content/
│  ├─ magazine/
│  ├─ templates/
│  ├─ webtoon/
│  └─ blog/
│
├─ apps/
│  ├─ playstory/
│  ├─ image-cropper/
│  └─ ...
│
└─ games/
   ├─ acorn-collector/
   ├─ fruit-match/
   └─ ...
```

실제 저장소를 당장 물리적으로 분리할 필요는 없다. 그러나 **책임 경계는 위 구조로 유지**한다.

## 3.3 섹션별 관리 방식

| 섹션 | 운영 방식 | Kinder Edu의 책임 | 별도 관리 대상 |
|---|---|---|---|
| 놀며자라 | Content System | Magazine Reader / Archive / Resource Panel | 월호별 issue 데이터·페이지·자료 |
| 프로그램 | Independent Apps | 목록 / Context / Workspace Launcher | 프로그램별 실제 앱 |
| 게임 | Game별 Independent Project | Game Library / Game Stage Launcher | 게임별 로직·에셋·사운드 |
| 만들기 | Shared Engine + Templates | 공통 Editor Engine | 템플릿 schema·이미지 |
| 웹툰 | Content System | Series Home / Reader | 작품·회차·캐릭터 데이터 |
| 블로그 | Content System | Feed / Article Reader | Markdown 게시물·썸네일 |

## 3.4 공통 Shell은 복제 금지

다음은 하나의 Source of Truth로 관리한다.

- Global Navigation
- Utility Footer
- 섹션 색상 token
- 앱 프레임
- `12px` Gap 시스템
- Radius
- Typography
- 공통 Loading / Empty / Error
- Responsive breakpoint

각 섹션에서 Header/Footer를 복사해 따로 수정하지 않는다.

---

# 4. 데스크톱 공통 프레임 — 확정

## 4.1 기준

- 기준 브라우저 뷰포트: `1680 × 940px`
- 상세 앱 프레임 기준 비율: `1600 × 870px`
- 앱 외곽 Radius: `26px`

`1600 × 870px`은 기준 설계 크기이며 데스크톱의 하드 최대값이 아니다. 실제 표시 크기는 메인페이지와 동일하게 `width: min(100%, 170.213vh)` 및 `aspect-ratio: 1600 / 870`으로 계산한다. 큰 화면에서는 메인페이지와 상세페이지가 같은 크기로 함께 확대되어야 하며, 상세페이지만 `max-width: 1600px` 또는 `max-height: 870px`로 제한하지 않는다.

## 4.2 세로 규격

```text
870px
├─ 12px  상단 외곽 여백
├─ 70px  Global Navigation
├─ 12px  Gap
├─ 692px Main Workspace
├─ 12px  Gap
├─ 60px  Utility Footer
└─ 12px  하단 외곽 여백
```

## 4.3 가로 규격

```text
1600px
├─ 12px
├─ 1576px 실제 창 영역
└─ 12px
```

좌표 기준:

- Header: `x 12 / y 12 / 1576 × 70`
- Main: `x 12 / y 94 / 1576 × 692`
- Footer: `x 12 / y 798 / 1576 × 60`

## 4.4 공통 패널

- 주요 패널 Radius: `20px`
- 패널 사이 Gap: `12px`
- Border: 기본 없음
- Shadow: 매우 약한 소프트 섀도
- 기본 Panel background: `#FFFFFF`
- 패널 간 경계는 선이 아니라 **Soft Background가 보이는 12px 틈**으로 만든다.

---

# 5. 색상 시스템 — 최신 확정

| 섹션 | Accent | Hover | Soft Background 기준 |
|---|---|---|---|
| 놀며자라 | `#79B4D3` | `#609EBF` | `#EBF4F8` |
| 프로그램 | `#D88991` | `#C86F7A` | `#F9EDEE` |
| 게임 | `#DFB64F` | `#CA9F32` | `#FAF4E5` |
| 만들기 | `#7DBB91` | `#63A879` | `#ECF5EE` |
| 웹툰 | `#A492D2` | `#8D7ABE` | `#F1EFF8` |
| 블로그 | `#C7A06E` | `#B28A58` | `#F7F1E9` |

Soft Background는 **섹션색 10~20% 농도**, 시작값은 약 15%로 한다.

중립색:

- 본문: `#2E2E2E`
- 보조: `#7E7872`
- 약한 선: `#E8DDD5`
- Panel: `#FFFFFF`
- 작업 Stage: `#F7F7F7`
- Footer: `#FFFFFF`

주의:

- 과거 `30%` 배경 지침은 폐기한다.
- Footer는 섹션색으로 바꾸지 않는다.

---

# 6. Global Navigation — 기본 틀만 구현

## 6.1 구조

```text
[홈] [놀며자라] [프로그램] [게임] [만들기] [웹툰] [블로그]              [JINNI'S 로고]
```

## 6.2 규칙

- `1576 × 70px`
- 배경: 현재 섹션 Accent
- Radius `20px`
- 현재 섹션은 흰색 계열 Active capsule
- 섹션 이동 시 모든 메뉴의 위치는 고정
- 홈은 메인으로 직접 이동
- 상세페이지 간 이동은 미리보기 없이 직접 이동
- 아이콘 + 짧은 텍스트 사용 가능

## 6.3 초기 버전에서 Header에 넣지 않는다

- 검색
- 알림
- 설정
- 로그인/프로필
- 임의의 마스코트 메시지

시안 이미지에 보이더라도 제거한다.

---

# 7. Utility Footer — 확정

## 7.1 구조

```text
[JINNI'S / ©]        [이용안내 · 콘텐츠/저작권 안내 · 개인정보 관련 링크]        [Blog · Instagram · YouTube]
```

## 7.2 규칙

- `1576 × 60px`
- 항상 흰색
- Radius `20px`
- 섹션 이동 시 동일
- 외부 SNS는 실제 계정이 확정된 것만 연결
- 링크 수는 최소화
- 정책 전문은 별도 페이지에서 표시

초기에는 링크 대상이 준비되지 않은 항목은 비활성 또는 숨김 처리한다.

---

# 8. 공통 타이포·인터랙션

## 8.1 글꼴

- UI / 본문 / Navigation: Pretendard
- 웹툰 대사/캐릭터 말풍선: Poor Story 가능
- 손글씨 포인트: Nanum Pen Script, 제한적으로만
- 영문 보조: Manrope

## 8.2 권장 크기

- Panel 큰 제목: `24~30px`
- 내부 제목: `20~24px`
- 카드 제목: `16~18px`
- 본문: `15~17px`
- 설명: `13~14px`
- Metadata: `12~13px`

## 8.3 인터랙션

- Hover: `140~180ms`
- Drawer/Panel: `180~240ms`
- 터치 Hit area: 최소 `44×44px`
- Keyboard focus 표시
- 색상만으로 Active를 구분하지 않는다.

---

# 9. 이미지·콘텐츠 제작 공통 원칙

## 9.1 캐릭터

기존 캐릭터 에셋을 사용할 경우:

- 기본 캔버스 `1024 × 1536`
- 투명 PNG
- 머리/손/발 임의 크롭 금지
- 원본 캐릭터 비율 유지
- UI에 넣을 때 CSS 크기·위치로 맞춘다.

## 9.2 썸네일

- 게임: `16:9`
- 웹툰 회차: `16:9`
- 블로그: `16:9`, 권장 `1280×720`
- 웹툰 작품 Cover: `2:3`
- 매거진 페이지: 잡지 자체 비율 유지
- 만들기 Template: Template 실제 출력비율 유지 + 썸네일 박스 안에서 `contain`

## 9.3 이미지와 텍스트

- UI 제목·설명·버튼을 이미지에 합성하지 않는다.
- 잡지의 실제 완성 페이지나 웹툰 컷처럼 **콘텐츠 자체가 이미지인 경우**는 예외다.

---

# 10. 놀며자라 매거진 — 최종 기본 구조

## 10.1 정체성

일반 카드형 콘텐츠 페이지가 아니다.

> **실제 디지털 잡지를 읽고, 잡지에서 선택한 항목의 활용자료를 우측에서 확인하는 공간**

## 10.2 Desktop Main

```text
1576px
├─ Magazine Reader 1040px
├─ Gap 12px
└─ Resource Panel 524px
```

높이 `692px`.

## 10.3 LEFT — Magazine Reader

필수 상태:

1. 표지
2. 목차
3. 내용 페이지
4. 페이지 넘김

권장 잡지 호 구성:

- 표지
- 이번 호 소개
- 목차
- 계절놀이
- 자연탐구
- 미술·만들기
- 언어
- 신체
- 사회관계
- 교사 팁
- 활용자료 모음
- 다음 호 예고

잡지는 가능한 한 **실제 책을 펼친 듯한 시각적 Stage**로 만든다.

## 10.4 페이지 이동

- 좌/우 버튼
- 마우스 휠 또는 트랙패드
- 터치 스와이프
- 페이지 번호
- 키보드 ← → 선택 지원 가능

3D page curl은 과하지 않게 한다. 짧은 slide/fade 또는 가벼운 page-turn 정도만.

## 10.5 RIGHT — Resource Panel

좌측 잡지에서 활용자료가 연결된 항목을 선택하면 **좌측은 그대로 유지하고 우측만 변경**한다.

우측 기본 흐름:

```text
[현재 장/활용자료 목록]
        ↓ 항목 선택
[상세정보]
- 제목
- 대상 연령
- 교육 영역
- 준비물
- 활동 방법
- 교사 팁
- 확장 놀이
- 다운로드 파일
- 관련 만들기/게임/프로그램
```

상세에서 `← 자료 목록`으로 복귀할 수 있게 한다.

RIGHT만 필요 시 세로 스크롤.

## 10.6 전회차 Floating Archive — 확정

기본 화면에는 연도/월 목록을 계속 노출하지 않는다.

Magazine Reader 좌측 가장자리에 작은 **전회차 아이콘**만 띄운다.

Desktop:

- Hover 또는 Focus → Archive Panel open
- 연도 Accordion + 월 목록
- 현재 호 Active
- 최신 연도 기본 open
- 포인터 이탈 후 약 `300~450ms` 지연 닫힘
- `Esc` 닫기

예:

```text
2027 ▼
  01월호
  02월호

2026 ▼
  09월호
  10월호 ← 현재
  11월호
  12월호
```

월호 선택 시:

- 해당 호의 표지로 이동
- Resource Panel은 기본 상태로 초기화
- issue ID를 URL/state에 남겨 새로고침 시 복원 가능

Mobile:

- Hover 금지
- 아이콘 Tap → Drawer/Popover

## 10.7 Magazine 데이터

```text
content/magazine/
└─ 2026-10/
   ├─ issue.json
   ├─ cover.webp
   ├─ pages/
   └─ resources/
```

권장 issue metadata:

- id
- year
- month
- title
- subtitle
- cover
- publishDate
- pages
- resources

새 월호 추가 시 Reader UI를 새로 코딩하지 않는다.

## 10.8 초기 제작에 필요한 매거진 에셋

첫 구현 검증용으로 최소 다음을 준비한다.

- 표지 1장
- 목차/소개 Spread 1개
- 내용 페이지 2~3개
- 활용자료 샘플 3개
- Archive에 표시할 월호 metadata 2~3개

실제 완성 자료가 없으면 동일한 레이아웃의 Placeholder 이미지로 시작한다.

---

# 11. 프로그램 — 확정 구조

## 11.1 Desktop Main

```text
220px  Program Navigator
12px   Gap
1012px Workspace
12px   Gap
320px  Context Panel
```

높이 `692px`.

## 11.2 LEFT — Program Navigator

- 현재 프로그램 수가 적으므로 세로 목록
- 항목 높이 권장 `58~64px`
- 아이콘 + 프로그램명
- 복잡한 검색/필터 초기 제외

## 11.3 Hover / Click 규칙 — 중요

- Hover: CENTER 변경 금지
- Hover: RIGHT의 설명/캐릭터만 변경
- Click: CENTER에서 실제 프로그램 실행
- Click 이후 RIGHT는 해당 프로그램 도움말/상태/설명으로 전환 가능

> `Hover = 탐색 / Click = 실행`

## 11.4 CENTER — Workspace

- 실제 웹 프로그램이 열리는 가장 큰 영역
- 앱별로 embed/mount
- 앱이 독립 프로젝트라면 Kinder Edu가 launcher 역할
- 앱을 새 창으로 강제하지 않는다.

## 11.5 RIGHT — Context

가능한 내용:

- 프로그램 한 줄 설명
- 캐릭터 Guide
- 사용법
- 상태/주의사항
- 선택된 앱의 간단 도움말

초기에는 한 화면에 너무 많은 설명을 넣지 않는다.

## 11.6 필요한 에셋

- 프로그램 아이콘
- 프로그램별 대표 캐릭터 또는 Context 이미지
- 실제 프로그램 screenshot이 필요하다면 최소 1장

가짜 프로그램을 많이 만들지 말고 **현재 실제로 존재하거나 개발 중인 프로그램만 등록**한다.

---

# 12. 게임 — Game Library → Game Stage

## 12.1 운영 원칙

게임은 **게임별 독립 프로젝트**로 개발한다.

Kinder Edu는:

- 게임 목록
- 메타데이터
- 게임 소개
- 실행
- Game Stage

를 담당한다.

## 12.2 Browse Mode

Main 외곽은 하나의 큰 흰색 Panel로 유지한다.

내부 구성 권장:

1. Category/age chips
2. Featured Game
3. Featured Game 정보
4. 추천 게임 Thumbnail row/grid

게임 Library가 지나치게 복잡한 좌측 Sidebar를 항상 점유하지 않게 한다. 초기에는 상단 Chip 방식 또는 매우 얇은 Browse filter를 우선한다.

필수 metadata:

- 제목
- thumbnail
- 대상 연령
- 교육 영역
- 짧은 설명
- 대략적인 플레이 시간

좋아요·조회수·평점은 표시하지 않는다.

## 12.3 Play Mode — 확정

게임 시작 시 **새 창을 기본으로 열지 않는다.**

Main `1576×692` 전체를 Game Stage로 전환한다.

Browse에 있던 카드/Filter/소개 영역은 사라진다.

최소 Toolbar:

```text
[← 게임 목록] [게임명]                        [다시 시작] [음량] [전체화면]
```

게임 본체는 Toolbar 아래의 남은 영역을 최대한 사용한다.

## 12.4 Fullscreen

- 기본 = Kinder Edu Main 내부 실행
- 사용자가 선택할 때만 Fullscreen
- Fullscreen 종료 → Kinder Edu Game Stage로 복귀

## 12.5 게임별 프로젝트 규약

권장 manifest:

```json
{
  "id": "acorn-collector",
  "title": "다람쥐의 도토리 모으기",
  "thumbnail": "...",
  "age": [4],
  "category": ["자연탐구", "수·과학"],
  "description": "...",
  "orientation": "landscape",
  "entry": "...",
  "version": "0.1.0"
}
```

게임이 완성되면 Kinder Edu는 manifest를 읽어 Library에 표시한다.

## 12.6 첫 구현용 게임

첫 게임은 기존 기획과 연결되는 **다람쥐 도토리 모으기**를 대표 Prototype으로 사용 가능.

필요 에셋:

- Library thumbnail `16:9`
- Game cover/hero `16:9`
- 캐릭터/배경/오브젝트 실제 게임 asset
- 시작/빈 상태용 일러스트

---

# 13. 만들기 — Template Studio

## 13.1 핵심 철학

> Canva를 복제하지 않는다. **교사가 디자인을 잘하지 않아도 템플릿을 골라 필요한 값만 입력하면 결과물이 완성되는 Controlled Editor**로 만든다.

## 13.2 Desktop Main

```text
260px Template Library
12px
970px Canvas
12px
322px Inspector
```

## 13.3 LEFT — Template Library

초기 카테고리 예:

- 이름표
- 카드
- 스티커
- 안내문
- 활동지
- 게시판 자료

자료가 적으면 검색은 생략.

카테고리 선택 후 작은 Template thumbnail grid.

## 13.4 CENTER — Canvas

가장 중요한 영역.

- 선택 Template의 실제 결과물 Preview
- 종이/출력 영역이 중앙에 위치
- `Fit / 75 / 100 / 125%` 정도의 Zoom만 허용
- Canvas가 공간보다 크면 중앙 Panel 내부 스크롤

초기 Toolbar 최소안:

```text
[템플릿명]                      [Fit/Zoom] [미리보기] [내보내기]
```

Undo/Redo, Layer, 자유 Drag 등은 초기 필수 아님.

## 13.5 RIGHT — Inspector

템플릿 schema에 따라 필요한 값만 노출.

이름표 예:

- 이름 입력
- 여러 명 이름 한 번에 입력
- 글꼴 선택
- 포인트 색
- 캐릭터 선택
- 간단 배경 옵션
- 출력 옵션

## 13.6 우리 학급 연계

향후 또는 데이터가 이미 준비되어 있다면:

`우리 학급 불러오기 → 전체 이름 선택 → 자동 배치`

이 기능을 만들기 엔진의 강점으로 설계하되, **초기 Shell 구현을 막지 않게 한다.**

## 13.7 Template 관리

템플릿마다 Editor를 새로 만들지 않는다.

```text
Making Engine + Template Schema + Assets
```

권장:

```text
content/templates/
├─ name-tag/
├─ birthday-card/
└─ worksheet/
```

Template schema가 정의하는 것:

- editable fields
- default values
- font options
- color options
- image/character slot
- printable area

## 13.8 초기 제외 기능

- Layer panel
- 자유 좌표 편집
- 자유 회전
- Illustrator급 Path 편집
- 복잡한 Undo history
- 실시간 협업

## 13.9 첫 구현용 에셋

- 이름표 Template 3종
- 카드 Template 2종
- 활동지 Template 1종
- Template thumbnail
- UI 안내 캐릭터 1종 또는 기존 만들기 캐릭터

---

# 14. 웹툰 — Series Home + Reader

## 14.1 작품 홈 Desktop

```text
520px Series Hero
12px
1044px Series Content
```

## 14.2 LEFT — Series Hero

내용:

- 작품 대표 Cover/일러스트
- 작품명 `공무가`
- 아주 짧은 소개
- `최신화 보기`
- `작품 소개` 또는 현재 tab 이동

초기에는 좋아요·조회수·연재 통계 같은 가짜 수치를 넣지 않는다.

## 14.3 RIGHT — Series Content

기본 Tab:

- 회차
- 등장인물
- 세계관

첫 화면은 `회차`.

회차 화면:

- 최신화 Feature
- 최근 회차 card/list
- 전체 회차 열기

등장인물:

- 캐릭터 portrait + 이름 + 한 줄 설명

세계관:

- 작품 배경/기관/관계 등 짧은 소개

데이터가 아직 없으면 Tab 자체는 구현하되 Placeholder로 둔다.

## 14.4 웹툰 Reader — 최신 시안 반영

회차를 클릭하면 **Main 전체가 단일 Reader Panel로 전환**된다.

중앙 Reader 폭:

- 권장 `760px`
- 허용 `720~820px`
- 중앙 정렬

Reader 내부 세로 스크롤.

## 14.5 Reader Toolbar — 초기 최소안

상단 sticky toolbar:

```text
[← 작품으로] [공무가] [Ep. 제목]                  [이전화] [회차목록] [다음화]
```

시안에 있던 다음 기능은 초기 제거:

- 좋아요
- 조회수
- 댓글
- Zoom +/-
- 밝기/다크모드
- 알림

필요성이 생기면 나중에 추가한다.

## 14.6 Reader 콘텐츠

- 웹툰 이미지 중앙 정렬
- 원본보다 과도하게 확대하지 않음
- 긴 회차 Lazy Loading
- 이미지 사이 불필요한 큰 공백 금지
- 회차 끝에만 간단한 Navigation:

```text
[이전화] [회차목록] [다음화]
```

## 14.7 웹툰 Content System

```text
content/webtoon/
├─ series/
├─ episodes/
└─ characters/
```

Episode metadata 권장:

- id
- episodeNumber
- title
- date
- thumbnail
- images

화면에 작성일/게시일을 표시할지는 가능하지만, 조회수/좋아요는 저장·표시하지 않는다.

## 14.8 첫 구현용 에셋

- 공무가 Cover 1장
- 최신화 Feature image 1장
- 회차 thumbnail 최소 4~6장
- Reader 테스트용 세로 컷/페이지 5~8장
- 주요 등장인물 portrait 4~6장

실제 최종 컷이 없으면 Placeholder를 사용하되, **가짜 캐릭터 설정이나 가짜 통계를 콘텐츠로 확정하지 않는다.**

---

# 15. 블로그 — Navigator + Feed/Article

## 15.1 Desktop Main — 확정

```text
260px Blog Navigator
12px
1304px Feed / Article
```

## 15.2 LEFT — 고정

초기 카테고리:

- 전체 글
- 웹툰
- 학습자료
- 코딩
- 일상

글이 적은 단계에서는 검색과 복잡한 태그 Filter를 넣지 않는다.

태그 자체는 게시물 데이터에 저장 가능.

## 15.3 RIGHT — Feed

우측만 세로 스크롤.

구성:

1. Featured 최신 글
2. 2열 카드 Grid

기본 정렬: 작성일 최신순.

## 15.4 일반 카드

- Thumbnail source `16:9`
- 권장 원본 `1280×720`
- Radius `20px`
- Category badge 1개
- 제목 최대 2줄
- 요약 최대 2줄
- 작성일 1줄

화면에 표시하지 않는 것:

- 작성자
- 좋아요
- 댓글
- 조회수

## 15.5 요약 규칙

게시물마다 목록용 summary를 별도 저장한다.

- 권장 `55~80자`
- 최대 약 `100자`
- 본문 첫 문장을 무조건 잘라 쓰지 않는다.
- Markdown 문법 제거

Featured는 요약 최대 3줄, 약 `80~120자`.

## 15.6 Article Reader

카드 클릭 시 RIGHT만 Article Reader로 전환.

LEFT는 고정.

- 글 상세 진입 → 우측 scroll top
- 목록 복귀 → 이전 Feed scroll 위치 복원 권장
- 본문 최대 폭 `840~860px`- 이미지 `max-width:100%`
- 이미지 클릭 확대 초기 제외

## 15.7 Blog 데이터

```text
content/blog/
├─ 2026-09-26-title.md
└─ ...
```

Front matter:

```yaml
---
title: "공무가 캐릭터 턴어라운드를 만들어봤다"
date: "2026-09-26"
category: "웹툰"
thumbnail: "/blog/gongmuga-turnaround.webp"
summary: "캐릭터 일관성을 잡기 위해 턴어라운드를 제작한 과정을 정리했다."
tags:
  - 공무가
  - 웹툰제작
---
```

개별 글마다 React/HTML 페이지를 새로 코딩하지 않는다.

## 15.8 첫 구현용 블로그 콘텐츠

레이아웃 검증용으로 실제 톤에 맞는 샘플 글을 3~5개 준비한다.

추천 주제:

1. `공무가 캐릭터 턴어라운드를 만들어봤다`
2. `PlayStory 사진 분류 프로그램을 만들기 시작했다`
3. `가을 유아 게임을 웹으로 만들어보기`
4. `유치원 자료를 자동으로 만들 수 있을까`
5. `킨더에듀 홈페이지를 만드는 과정`

각 글에 필요한 것:

- 제목
- 날짜
- 카테고리
- 55~100자 summary
- 16:9 thumbnail
- 본문
- 본문 이미지 1~3장 선택

**샘플 글은 레이아웃용이어도 실제 블로그 문체에 맞춰 작성**하고, Lorem Ipsum을 사용하지 않는다.

---

# 16. 공통 Responsive

## 16.1 Desktop `1201px 이상`

- 공통 Shell 유지
- 최대 `1600×870`
- 섹션별 Desktop 분할 유지

## 16.2 Tablet `601~1200px`

- 고정 870px 높이 해제
- 메인페이지와 동일하게 화면 전체 폭 사용
- 상세 Shell의 외곽 좌우 padding 제거
- Header sticky 가능
- Footer auto-height 허용
- 3분할 페이지는 Side panel을 Drawer로 전환

Program:
- CENTER 우선
- LEFT는 Drawer 또는 좁은 rail
- RIGHT Context는 Drawer/Overlay

Making:
- Canvas 우선
- Template = Drawer
- Inspector = Drawer/Bottom sheet

Magazine:
- Reader 우선
- Resource Panel은 우측 Sheet 또는 아래 Panel

Blog:
- Navigator Drawer
- Feed/Article가 본문 전체 사용

Webtoon:
- Series Hero stack 가능
- Reader 단일 유지

Game:
- Browse stack
- Play Stage 전체 폭

## 16.3 Mobile `600px 이하`

- 1열 우선
- 메인페이지와 동일하게 화면 전체 폭 사용
- 상세 Shell의 외곽 좌우 padding 제거
- Sidebar 상시 점유 금지
- Drawer/Sheet 사용
- Header는 압축 또는 가로스크롤
- Footer 2행 허용
- 작업형 섹션은 Desktop 모든 기능을 억지로 제공하지 않아도 됨

---

# 17. Loading / Empty / Error

각 섹션에 최소 다음 상태를 만든다.

## Loading

- 카드형: Skeleton
- 앱/게임: 중앙 loading 문구 또는 간단 indicator

## Empty

- 무엇이 없는지 설명
- 다음 행동 1개
- 필요 시 캐릭터 일러스트

## Error

- 기술 오류 원문 노출 금지
- `다시 시도` 또는 `목록으로` 제공

---

# 18. 공통 컴포넌트 권장

공통:

- `SectionShell`
- `GlobalNav`
- `UtilityFooter`
- `Panel`
- `EmptyState`
- `LoadingState`
- `CategoryChip`
- `Drawer`

전용:

- `MagazineReader`
- `MagazineArchive`
- `ResourcePanel`
- `ProgramNavigator`
- `ProgramWorkspace`
- `ProgramContext`
- `GameLibrary`
- `GameStage`
- `TemplateLibrary`
- `TemplateCanvas`
- `TemplateInspector`
- `WebtoonSeriesHome`
- `WebtoonReader`
- `BlogNavigator`
- `BlogFeed`
- `ArticleReader`

---

# 19. CSS Token 시작안

```css
:root {
  --app-width: 1600px;
  --app-height: 870px;
  --shell-pad: 12px;
  --shell-gap: 12px;
  --header-height: 70px;
  --main-height: 692px;
  --footer-height: 60px;
  --app-radius: 26px;
  --panel-radius: 20px;
  --panel-bg: #fff;
  --text-main: #2E2E2E;
  --text-sub: #7E7872;
}
```

Section config에서:

- `accent`
- `hover`
- `softBackground`

만 바꿔 공통 Shell을 재사용한다.

---

# 20. 구현 순서 — 홈페이지 프로젝트에 적용

## Phase 1 — 공통 Shell

1. `1600×870` 상세 Shell
2. `12px` 시스템
3. Global Navigation
4. White Footer
5. 6개 Section color config
6. 공통 Panel

## Phase 2 — 정적 골격 6개

실제 기능보다 먼저 각 섹션의 기본 레이아웃을 구현한다.

1. Program 3분할
2. Magazine 2분할 + Reader placeholder
3. Game Browse / Play state shell
4. Making 3분할
5. Webtoon Series Home / Reader state shell
6. Blog 2분할

## Phase 3 — 데이터 연결

- Magazine issue data
- Program manifest/list
- Game manifest/list
- Template data
- Webtoon series/episode data
- Blog Markdown

## Phase 4 — 실제 에셋

Placeholder를 실제 이미지로 교체.

## Phase 5 — Responsive

Desktop이 안정된 뒤 Tablet/Mobile.

---

# 21. 이미지·콘텐츠 제작 목록

구현 후 실제 디자인 완성도를 올리기 위해 별도 제작해야 할 항목이다.

## 공통

- 최종 JINNI'S 로고
- 6개 Section icon
- Footer SNS icon

## 놀며자라

- 월호 Cover
- 목차/본문 페이지
- 활용자료 thumbnail
- 계절별 작은 장식 일러스트

## 프로그램

- 실제 프로그램 icon
- Program Context용 캐릭터/illustration

## 게임

- 게임별 `16:9` thumbnail
- Game hero/cover
- 게임 내부 asset

## 만들기

- Template thumbnail
- 실제 Template 배경/캐릭터/장식 asset

## 웹툰

- 작품 Cover
- 회차 thumbnail
- 등장인물 portrait
- 실제 Reader용 웹툰 이미지

## 블로그

- 게시물별 `1280×720` thumbnail
- 본문 삽입 이미지
- 실제 Blog 글

원칙:

> **UI 구현은 이미지 제작 완료를 기다리지 않는다. 먼저 정확한 슬롯과 데이터 구조를 만든 뒤 이미지를 교체한다.**

---

# 22. 삭제·제외 체크리스트

시안 이미지에서 아래가 보이더라도 초기 코드에 넣지 않는다.

- [ ] 좋아요
- [ ] 댓글
- [ ] 조회수
- [ ] 별점
- [ ] 알림 bell
- [ ] 로그인 avatar
- [ ] 불필요한 검색창
- [ ] 웹툰 Reader zoom +/-
- [ ] 웹툰 Reader dark toggle
- [ ] 게임 인기순
- [ ] 복잡한 만들기 Layer UI
- [ ] 기능 없는 장식 button

---

# 23. Desktop QA 체크리스트

## 공통

- [ ] 1600×870 기준인가
- [ ] 외곽 12px인가
- [ ] Header 70 / Main 692 / Footer 60인가
- [ ] Header/Main/Footer 사이 12px인가
- [ ] Footer가 흰색인가
- [ ] Section Soft Background가 10~20%로 연한가
- [ ] Panel Radius 20인가
- [ ] Panel 사이 border 대신 12px gap인가
- [ ] 섹션 전환 시 Header 메뉴 위치가 고정인가

## Magazine

- [ ] 1040 / 524 구조인가
- [ ] 실제 잡지 Reader가 주인공인가
- [ ] Floating Archive가 평소 최소 노출인가
- [ ] 잡지 항목 선택 시 좌측 위치는 유지되는가
- [ ] 우측만 Resource Detail로 바뀌는가

## Program

- [ ] 220 / 1012 / 320인가
- [ ] Hover는 RIGHT만 바꾸는가
- [ ] Click 시 CENTER에서 실행되는가

## Game

- [ ] Browse와 Play가 상태 전환되는가
- [ ] Play 시 Sidebar/Library가 사라지는가
- [ ] 새 창이 기본 동작이 아닌가
- [ ] Fullscreen은 선택 기능인가

## Making

- [ ] 260 / 970 / 322인가
- [ ] Canvas가 가장 큰가
- [ ] 자유편집 기능이 과도하지 않은가
- [ ] Template schema로 옵션이 바뀌는가

## Webtoon

- [ ] Home 520 / 1044인가
- [ ] Reader는 Main 단일 Panel인가
- [ ] Reader 폭 720~820인가
- [ ] 댓글/좋아요/조회수 없는가
- [ ] 회차목록이 상시 Sidebar가 아닌가

## Blog

- [ ] 260 / 1304인가
- [ ] LEFT 고정, RIGHT scroll인가
- [ ] 2열 카드인가
- [ ] 제목 2줄, summary 2줄인가
- [ ] 작성일만 노출되는가
- [ ] Markdown 데이터로 자동 표시되는가

---

# 24. 홈페이지 프로젝트에 전달할 실행 프롬프트

아래 프롬프트와 이 문서를 함께 전달한다.

```text
첨부한 「섹션별 웹사이트 제작지침 — 구현 실행본 v3」를 이번 작업의 최상위 구현 기준으로 사용해줘.

목표는 현재 kinder-edu 홈페이지에서 6개 상세 섹션의 기본 틀을 실제 코드로 구현하는 것이다.
이번 단계에서는 기능을 많이 추가하지 말고, 문서에 정의된 공통 Shell과 각 섹션별 정보구조를 정확하게 구현하는 것을 우선한다.

중요한 작업 원칙:

1. 기존 메인 홈페이지를 먼저 분석하고 기존 스타일·에셋·라우팅을 최대한 보존한다.
2. 현재 정상 작동하는 메인 홈페이지를 불필요하게 재작성하지 않는다.
3. 상세페이지 공통 Shell은 1600×870 기준, 외곽/패널 Gap 12px, Header 70px, Main 692px, Footer 60px 규격을 따른다.
4. Header는 [홈]-[놀며자라]-[프로그램]-[게임]-[만들기]-[웹툰]-[블로그]-[로고]의 공통 Global Navigation으로 만들고, 현재 섹션의 Accent와 Active 상태만 바뀌게 한다.
5. Footer는 모든 섹션에서 흰색으로 통일한다.
6. Main의 패널들은 border로 나누지 말고 12px의 Soft Background gap으로 분리한다.
7. 섹션 배경은 각 Accent의 10~20% 수준으로 매우 연하게 사용한다.
8. 좋아요, 댓글, 조회수, 별점, 알림, 로그인/프로필, 불필요한 검색과 추천 기능은 이번 단계에서 만들지 않는다.
9. 시안 이미지에 들어간 임의의 텍스트·캐릭터 이름·통계 수치를 실제 서비스 데이터로 확정하지 않는다.
10. 콘텐츠는 UI 코드에 직접 누적하지 말고 문서의 운영지침에 맞게 데이터/manifest/Markdown/schema 기반으로 연결할 수 있게 만든다.

섹션 구조:

- 놀며자라: 1040px Magazine Reader + 524px Resource Panel. 실제 잡지처럼 표지/목차/내용 페이지를 넘긴다. 전회차는 Floating Archive 아이콘 hover/focus로 연도·월 목록을 연다. 잡지의 활용 항목 선택 시 좌측 페이지는 유지하고 우측만 변경한다.
- 프로그램: 220 / 1012 / 320. Hover는 우측 설명만, Click은 중앙 앱 실행.
- 게임: Game Library와 Game Stage 상태전환. 게임은 Main 내부에서 실행하고 선택적으로 Fullscreen. 게임별 실제 로직은 독립 프로젝트로 관리할 수 있게 한다.
- 만들기: 260 / 970 / 322. Template Library / Canvas / Inspector. Canva식 자유편집기가 아니라 Template Schema 기반 Controlled Editor로 만든다.
- 웹툰: Home 520 / 1044. 회차 클릭 시 Main 전체를 Reader로 전환하고 중앙 약 760px 폭으로 세로 스크롤한다. Reader에는 작품복귀/회차/이전화/목록/다음화 정도만 둔다.
- 블로그: 260 / 1304. 좌측 Navigator 고정, 우측 Feed/Article만 스크롤. Markdown 기반 자동 게시, 16:9 thumbnail, 제목 2줄, summary 2줄, 작성일만 노출.

구현 순서:

A. 기존 프로젝트 구조 및 사용 기술 확인
B. 공통 SectionShell / GlobalNav / Footer / Panel / section color config 제작
C. 6개 섹션의 Desktop 기본 골격 제작
D. Placeholder 데이터와 이미지로 화면이 정상적으로 작동하는지 확인
E. 섹션별 상태전환과 내부 스크롤 구현
F. 콘텐츠 데이터 구조 연결
G. 마지막에 Tablet/Mobile 반응형 적용

이미지나 실제 콘텐츠가 아직 없는 부분은 임시 Placeholder를 사용하되, 나중에 같은 규격의 실제 이미지·잡지·블로그 글·웹툰 컷으로 교체할 수 있도록 슬롯과 데이터 구조를 먼저 정확히 만든다.

작업 중 문서와 현재 코드가 충돌하면 최신 문서의 사용자 확정사항을 우선하되, 기존 기능을 깨뜨리는 변경은 최소화한다.
구현이 끝나면 섹션별로 변경 파일, 구현 내용, 아직 Placeholder인 항목, 다음에 필요한 에셋 목록을 정리해서 보고해줘.
```

---

# 25. 최종 원칙

이 홈페이지는 6개의 서로 다른 사이트를 억지로 한 화면에 붙인 것이 아니라,

> **하나의 일관된 Kinder Edu 플랫폼 안에서, 각 콘텐츠의 성격에 맞는 서로 다른 작업공간을 제공하는 구조**

로 만든다.

통일감은 `Shell / Navigation / Footer / Gap / Radius / Typography / Color System`에서 만들고,
개성은 `Magazine Reader / Program Workspace / Game Stage / Template Canvas / Webtoon Reader / Blog Article`에서 만든다.

초기 구현에서는 무엇보다 **깔끔함, 시인성, 안정적인 기본 틀, 향후 콘텐츠 추가 용이성**을 우선한다.
