# Kinder Edu 홈페이지 메인 프로토타입 제작 방안

> 문서 버전: v1.0
> 작성일: 2026-09-24
> 프로젝트: 지니쌤의 킨더에듀 (`kinder-edu`)
> 목적: 3그리드 기반 메인 홈페이지의 시각·인터랙션 프로토타입 제작 기준 확정

## 1. 프로토타입 목표

홈페이지를 단순한 서비스 링크 모음이 아니라, 교사가 아이콘을 탐색하면서 각 서비스를 미리 경험하는 앱형 첫 화면으로 만든다.

- 브랜드: `JINNI / KINDER EDU`
- 주요 사용자: 30~40대 유치원·어린이집 교사
- 톤: 전문적인 교육 플랫폼 + 에디토리얼 편집 디자인 + 웹툰 캐릭터 IP
- 기본 배경: 따뜻한 아이보리·크림 계열
- 포인트 색상: 섹션별 파스텔 코랄, 라벤더, 하늘색, 옐로, 보라, 세이지 그린
- 이미지에 문구를 굽지 않고, 제목·설명·버튼은 HTML 텍스트로 처리한다.

## 2. 메인 화면 구조

화면은 세 개의 그리드로 나눈다.

### 확정된 데스크톱 비율 기준 (HOMEPAGE_UI.png)

- 시안에서 읽은 원래 수치는 전체 1672×941px, 앱 프레임 약 1607×874px, 사이드바 약 102px, 상단 바 약 64px, Grid 2 약 881×810px, Grid 3 약 624×810px이다. 이는 측정 근거이지 실제 제작 치수가 아니다.
- **실제 제작 치수는 모두 끝자리를 0으로 맞춘다.** 데스크톱 기준 화면 1680×940px, 앱 프레임 1600×870px로 확정한다. 브라우저 100% 확대에서 이 비율을 기준으로 삼되, 다른 화면에서는 찌그러뜨리지 않고 반응형으로 대응한다.
- 실제 Grid 2 배경은 **880×810px(약 1.09:1)**이다. 전체 화면 비율 16:9 또는 기존 4:3 배경을 Grid 2의 비율로 혼동하지 않는다.
- 실제 앱 프레임 가로 비율은 사이드바 100px + Grid 2 880px + Grid 3 620px = 1600px이다. 사이드바 제외 본문에서 Grid 2 / Grid 3은 약 58.7% / 41.3%다.
- 실제 앱 프레임 세로 비율은 상단 공통 창 바 60px + 콘텐츠 810px = 870px이다. 기준 화면의 프레임 바깥 여백은 좌우 40px, 위 30px, 아래 40px이다.
- 상단은 실제 창 바 영역이다. 전신 인물은 배경과 분리된 오버레이로 이 창 바 위까지 돌출한다. 하단은 별도 카드 그리드가 아니라 앱 프레임 바깥의 인물 돌출 여백이다. Grid 2의 `overflow:hidden`으로 머리나 다리를 자르지 않는다.

| 실제 화면 요소 | 표시 크기 | 세부 기준 |
|---|---:|---|
| Grid 1 사이드바 | 100×870px | 아이콘 클릭 영역 50×50px, 세로 간격 30px |
| 상단 공통 창 바 | 1500×60px | Grid 2와 Grid 3 위에 걸침; 검색 200×40px, 벨·프로필 각각 40×40px |
| Grid 2 배경 영역 | 880×810px | 전신 캐릭터를 별도 오버레이로 배치 |
| 인물 오버레이 표시 상자 | 600×900px | 상단 바 60px, 프레임 하단 30px까지 돌출 |
| Grid 3 독립 흰 창 | 620×810px | 카드 2열×3행 |
| 카드 그리드 내부 | 580×760px | 좌우 여백 20px, 위 20px, 아래 30px |
| 카드 1장 | 280×240px | 가로·세로 간격 각각 20px |
| 카드 그림 표시 영역 | 260×130px | 카드 내부 별도 텍스트 영역 확보 |
| hover 미리보기 창 | 500×360px | Grid 2 폭의 약 57% |

이미지 제작 원본은 표시 크기의 2배를 기준으로 한다: Grid 2 배경 1760×1620px, 투명 전신 인물 1200×1800px, 카드 그림 520×260px. 도면은 `assets/homepage-ui/HOMEPAGE_UI_DIMENSIONS.png`에 저장한다. 원본 시안은 카드 4장이지만 현재 확정 요구에 맞춰 6장으로 재계산했다.

```text
┌────────────┬────────────────────────┬──────────────────────┐
│ Grid 1     │ Grid 2                 │ Grid 3               │
│ 아이콘만   │ 전신 캐릭터 + 배경      │ 6개 서비스 카드       │
│ 세로 사이드바│ hover 미리보기 창      │ 2열 × 3행             │
└────────────┴────────────────────────┴──────────────────────┘
```

### Grid 1: 사이드바

- 좁은 세로 레일
- 아이콘만 표시하며 아이콘 아래 텍스트를 넣지 않는다.
- 단색 얇은 라인 아이콘 사용
- hover 시 활성 배경, 약한 확대, 포인트 색상 변경
- click 시 실제 서비스 페이지로 이동
- 6개 순서: 프로그램, 놀자 매거진, 게임, 만들기, 웹툰, 블로그

### Grid 2: 캐릭터·미리보기 영역

- 평상시에는 테마 배경 위에 전신 캐릭터가 서 있는다.
- 캐릭터는 배경과 분리된 투명 PNG 레이어다.
- 캐릭터의 머리와 다리는 프레임을 약간 넘어가도록 배치해 입체감을 준다.
- hover 시 전신 캐릭터는 유지하고, 앞쪽에 2번 그리드 폭의 약 50~60%인 미리보기 창이 떠오른다.
- 미리보기 창 안의 제목·설명·대표 이미지·링크는 HTML/CSS로 만든다.

### Grid 3: 서비스 카드 영역

- 별도의 흰색 창처럼 보이는 패널
- 6개 카드를 2열 × 3행으로 배치
- 카드에는 아이콘을 넣지 않는다.
- 카드에는 대표 이미지, 텍스트, 이동 화살표만 사용한다.
- 카드 click은 해당 서비스 페이지로 이동한다.
- 카드 hover는 살짝 올라오고 대표 그림이 미세하게 움직인다.

## 3. 6개 서비스 정의

| 서비스 | 역할 | 카드·Grid 2 핵심 이미지 |
|---|---|---|
| 프로그램 | 교사 업무·교육 프로그램 허브 | 노트북, 교육 자료, 작업공간 |
| 놀자 매거진 | 주간 놀이 큐레이터·매거진 | 잡지, 계절 소품, 편집 공간 |
| 게임 | 유아용 게임 탐색 | 태블릿, 보드게임, 컬러 블록 |
| 만들기 | 이름표·카드·스티커 제작 | 종이, 가위, 스티커, 작업 테이블 |
| 웹툰 | 독립 콘텐츠·IP 축 | 콘티, 펜, 말풍선, 작화실 |
| 블로그 | 교사·브랜드 기록 콘텐츠 | 노트, 카메라, 메모, 책 |

`놀며자라`는 전체 브랜드명이 아니라 `놀자 매거진` 서비스로 표기한다. 웹툰은 교육자료의 하위 기능이 아니라 독립적인 콘텐츠/IP 축으로 유지한다.

## 4. Hover 미리보기 동작

hover는 페이지 이동이 아니라 미리보기 상태로 사용한다. click은 실제 페이지 이동으로 분리한다.

### 기본 상태

- Grid 2 배경과 전신 캐릭터가 선명하게 보인다.
- Grid 3의 6개 카드는 계속 노출된다.

### hover 상태

1. 아이콘 활성 스타일 적용
2. Grid 2 배경과 전신 캐릭터 주변이 약하게 디포커스된다.
3. 전신 캐릭터는 완전히 사라지지 않고 배경에 남는다.
4. 캐릭터 앞에 미리보기 창이 올라온다.
5. 미리보기 창은 선명하게 유지된다.
6. 제목·짧은 설명·대표 콘텐츠 2~3개가 나타난다.

### 전환 애니메이션

용어: `Background Blur + Preview Focus Transition` 또는 `Defocus Transition`.

```text
배경/인물 주변: blur(0) → blur(5~8px), opacity 약간 감소
미리보기 창: opacity 0 → 1
미리보기 창: translateY(24px) scale(.96) → translateY(0) scale(1)
캐릭터: translateX(0) → translateX(-10~16px), scale 1 → 1.015
배경: translateX(0) → translateX(2~4px), scale 1 → 1.01
duration: 380~700ms
easing: cubic-bezier(.22, 1, .36, 1)
```

전체 페이지가 좌우로 밀리는 전환은 사용하지 않는다. Grid 2 내부 레이어만 움직여 앱 화면의 안정감을 유지한다.

### 모바일·접근성

- 모바일에는 hover가 없으므로 첫 tap을 미리보기로 사용한다.
- 미리보기 안의 이동 버튼 또는 두 번째 tap으로 상세 페이지를 연다.
- `prefers-reduced-motion`에서는 blur·이동 효과를 줄이고 opacity 전환만 사용한다.

## 5. 배경·인물 에셋 제작 규칙

6개 서비스마다 배경 1장과 인물 1장을 제작한다. 총 12개 에셋이다.

```text
배경: Grid 2 표시 880×810px, 제작 원본 1760×1620px (약 1.09:1), PNG 또는 최종 웹 최적화 이미지
인물: 1200×1800px 기준, 투명 PNG
```

### 배경

- 사람과 캐릭터를 넣지 않는다.
- 중앙과 상단에 인물이 들어갈 여백을 확보한다.
- 책, 노트, 모니터, 잡지에는 글자·숫자·로고를 넣지 않는다.
- 실제 문구는 모두 HTML로 작성한다.
- 따뜻한 교육 공간을 기본으로 하고, 섹션별 소품·색상만 변경한다.
- 배경은 인물과 별도 레이어로 저장한다.

### 인물

- 동일한 여주 캐릭터의 얼굴·체형·작화 질감을 유지한다.
- SD·치비 스타일은 사용하지 않는다. 사용자가 별도로 요청한 경우에만 사용한다.
- 전신을 머리부터 신발까지 완전히 제작한다.
- 표정, 헤어스타일, 안경, 의상, 하의, 신발, 소품, 포즈를 섹션별로 바꾼다.
- 이미지 안에 글자·로고·워터마크를 넣지 않는다.
- 배경·바닥·캐스트 그림자는 포함하지 않는다.
- 최종 화면 크기는 CSS로 조정하고, 원본 에셋의 전신을 임의로 잘라서 저장하지 않는다.

### 전신 비율·배치

- 캐릭터 높이: 원본 캔버스의 약 90~95%
- 머리와 신발 주변에 안전 여백 확보
- Grid 2에서 화면 높이의 약 105~115%로 배치 가능
- 머리는 상단 창 밖으로, 다리는 하단 창 아래로 일부 나올 수 있다.
- 투명 영역을 기준으로 여백만 정리하며 손·머리카락·발을 자르지 않는다.

## 6. 섹션별 인물 방향

| 서비스 | 의상·소품 | 표정·포즈 |
|---|---|---|
| 프로그램 | 코랄 셔츠/니트 베스트, 스커트·청바지·팬츠 중 선택, 딸기 심볼 노트북 | 자신감 있는 미소, 노트북을 들고 미리보기 창을 안내 |
| 놀자 매거진 | 계절감 있는 니트·스커트, 잡지 | 호기심 있는 미소, 잡지를 펼쳐 보여줌 |
| 게임 | 캐주얼 셔츠·후드, 스니커즈, 태블릿 | 신나고 집중한 표정, 태블릿을 확인함 |
| 만들기 | 앞치마·가디건, 편한 하의, 작업용 신발 | 뿌듯한 미소, 카드·스티커를 만들거나 보여줌 |
| 웹툰 | 보라·딥핑크 계열 의상, 펜 | 재미있는 표정, 콘티·말풍선을 설명함 |
| 블로그 | 베이지 카디건, 안경, 편한 팬츠 | 차분한 미소, 노트에 기록하거나 카메라를 듦 |

프로그램 캐릭터는 메인 캐릭터의 흰색 기본 블라우스를 반복하지 않는다. 크림 니트 베스트, 코랄 칼라 셔츠, 플리츠스커트, 스타킹, 코랄 메리제인 슈즈처럼 교사·에디터 느낌을 준다.

## 7. 파일 구조·이름 규칙

```text
assets/homepage-ui/sections/
├─ programs-background.png
├─ programs-character.png
├─ magazine-background.png
├─ magazine-character.png
├─ games-background.png
├─ games-character.png
├─ making-background.png
├─ making-character.png
├─ webtoon-background.png
├─ webtoon-character.png
├─ blog-background.png
└─ blog-character.png
```

미리보기 창에 들어가는 대표 이미지와 텍스트는 별도 HTML 데이터 구조로 관리한다. 이미지에 문구를 합성하지 않는다.

## 8. 구현 순서

1. `index.html`에 3그리드 골격과 6개 아이콘·카드를 구성한다.
2. Grid 2 기본 상태에 메인 배경과 메인 전신 캐릭터를 연결한다. 프로그램용 배경·캐릭터를 홈 기본 상태로 대체하지 않는다.
3. 아이콘 hover/focus 상태와 Grid 2 미리보기 데이터 교체를 구현한다.
4. blur·focus·parallax 애니메이션을 CSS로 추가한다.
5. 프로그램 미리보기와 `programs.html` 이동을 먼저 검증한다.
6. 나머지 5개 섹션은 동일한 데이터 구조로 확장한다.
7. 모바일 tap 동작과 `prefers-reduced-motion`을 추가한다.
8. 실제 브라우저에서 데스크톱·태블릿·모바일을 확인한다.

## 9. 완료 기준

- 6개 아이콘과 6개 카드가 모두 보인다.
- 아이콘 hover/focus 시 Grid 2가 해당 서비스 미리보기로 전환된다.
- 미리보기 창은 선명하고 주변부는 디포커스된다.
- 전신 캐릭터와 배경이 레이어로 분리되어 자연스럽게 움직인다.
- click 시 각 페이지로 이동한다.
- 카드에는 아이콘이 없고 대표 이미지·텍스트·화살표만 있다.
- 이미지 안의 텍스트가 깨지거나 잘못 생성되지 않는다.
- 100% 확대에서 가로 스크롤과 주요 컨트롤 잘림이 없다.
- 모바일에서 tap으로 미리보기를 사용할 수 있다.
- 기존 `programs.html` 등 상세 페이지 기능을 불필요하게 훼손하지 않는다.
- 코드 수정 후 로컬 브라우저 확인 → commit/push → Vercel 실제 배포 → production 브라우저 확인까지 진행한다.

## 10. 현재 제작 상태

- 로컬 홈 기본 화면은 메인용 배경 `assets/homepage-ui/homepage-grid-2-background-v2.png` (1760×1620)과 메인용 투명 전신 인물 `assets/homepage-ui/homepage-grid-2-character-bright.png`을 별도 레이어로 사용한다. 프로그램용 에셋은 홈 기본 상태에서 제거했다.
- 로컬 레이아웃은 1680×940 기준의 100/880/620 가로 구획, 60/810 세로 구획을 비율로 구현했다. 인물은 상단 창 바와 하단 프레임 밖으로 돌출한다. 6개 카드는 2열×3행으로 배치한다.
- 현재 변경은 로컬 작업본이며 아직 Git push/Vercel 배포 상태를 뜻하지 않는다.
- 프로그램용 배경: `assets/homepage-ui/sections/programs-background.png` (1448×1086, 4:3)
- 프로그램용 투명 전신 캐릭터: `assets/homepage-ui/sections/programs-character.png` (1024×1536, 2:3). 바깥 픽셀의 알파값 0 확인.
- `index.html`, `style.css`, `app.js`에 3그리드, 6개 카드, hover 미리보기와 블러 전환을 구현했다.
- 블로그는 글을 지어내지 않은 준비 중 페이지로 연결한다.
- 나머지 5개 섹션의 배경·인물 에셋은 아직 제작하지 않았다. 현재 미리보기는 공통 프로그램 배경·인물 위에서 카테고리별 콘텐츠만 바뀐다.
- 폭 1024px 이상은 3그리드, 그 이하는 읽기 쉬운 세로 배치로 전환한다.

### 2026-09-24 homepage refinement

- Grid 1 home control uses a simple house line icon; the standalone `J` is removed.
- Direction 1 logo is placed at the upper-right of the desktop frame and in the mobile rail. The previous `JINNI / KINDER EDU` text is removed.
- Program hover crossfades the main character into `assets/homepage-ui/sections/programs-character.png`; both character layers use the same 1024×1536 frame, and the program layer is clipped at the lower edge for a knee-up composition. Leaving hover clears the active section and restores the main character.
- New transparent 1774×887 card illustrations are saved in `assets/brand/cards/*-card-art-v2.png`. The six cards place the HTML title/copy on the left and art on the right with a diagonal clip; each uses its established pastel color. The magazine artwork uses the existing SD heroine as the cover model.
- `index.html`, `app.js`, and `style.css` point to the Direction 1 logo and six v2 artworks and implement the updated layout/transitions.
- Browser appearance and pointer-motion check remain pending. These changes are local and are not a commit or deployment.
- Programs artwork uses the user-provided single-laptop reference `assets/brand/cards/programs-laptop-reference.jpg`; the previous `programs-card-art-v3.png` remains preserved but is no longer referenced.
