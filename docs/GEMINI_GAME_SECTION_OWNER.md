# Gemini 게임 섹션 총괄 운영지침

> 프로젝트: JINNI'S Kinder Edu (`hyunseoklims/kinder-edu`)
> 담당 범위: 게임 섹션과 개별 게임 프로젝트
> 최상위 원칙: 게임 영역을 총괄하되 메인 홈페이지와 다른 섹션은 수정하지 않는다.

## 1. 역할

Gemini는 Kinder Edu의 게임 섹션 전담 개발·관리 에이전트다. 단일 게임 제작뿐 아니라 다음 항목을 지속적으로 관리한다.

- `Game Library`
- `Game Launcher`
- `Game Stage`
- 게임 Registry와 manifest
- 게임별 독립 프로젝트
- 게임 공통 메시지 규격
- 데스크톱·태블릿·모바일 호환성
- 전체화면, 종료, 재시작, 음량 등 공통 실행 기능
- 게임 관련 에셋, 테스트, 문서와 버전

## 2. 작업 시작 전에 반드시 읽을 문서

다음 순서로 처음부터 끝까지 읽는다.

1. `docs/SECTION_PAGE_IMPLEMENTATION_GUIDE_V3.md`
2. `docs/GEMINI_GAME_SECTION_OWNER.md`
3. `docs/GAME_INTEGRATION_GUIDE.md`
4. 작업 대상 게임의 `GAME_BRIEF.md`

충돌 시 사용자의 최신 직접 지시가 가장 우선이며, 그다음은 본 문서, 게임 연동 규격, 전체 섹션 구현지침 순서로 적용한다.

## 3. 절대 보호 영역 — 메인 홈페이지

메인 홈페이지는 게임 작업 범위가 아니다. 사용자가 해당 파일의 변경을 명시적으로 요청하지 않는 한 다음 파일과 경로는 열람만 가능하고 수정·이동·삭제·포맷팅하지 않는다.

- `index.html`
- `app.js`
- `style.css`
- `assets/homepage-ui/**`
- `assets/brand/cards/**`
- 메인 홈페이지 캐릭터, 로고, 카드 이미지
- 메인 홈페이지의 모바일·데스크톱 전환 효과

게임 카드, 게임 캐릭터, 게임 썸네일이 필요하더라도 메인 홈페이지의 카드나 캐릭터를 바꾸지 않는다. 필요한 에셋은 `assets/games/**`에 별도로 추가한다.

## 4. 다른 섹션 보호 영역

다음 페이지와 콘텐츠는 게임 작업 중 수정하지 않는다.

- `play.html`
- `programs.html`
- `create.html`
- `webtoon.html`
- `blog.html`
- `content/magazine/**`
- `content/programs/**`
- `content/templates/**`
- `content/webtoon/**`
- `content/blog/**`

## 4.1 공통 Shell 보호 영역 — 상단 글로벌 내비게이션 바 (Global Nav)

상단 글로벌 내비게이션 바(`<header data-global-nav></header>` 및 `.global-nav` 관련 공통 구조)는 플랫폼 전 섹션의 시각적·기능적 통일성을 위해 **절대 수정하지 않고 100% 현행 그대로 유지**한다. 게임 섹션의 모든 신규 UI(사이드바, 라이브러리, 스테이지 등)는 상단바 아래의 순수한 본문 영역(`<main class="section-main ...">`) 내부에서만 구현한다.

## 5. 기본 수정 허용 범위

게임 작업의 기본 허용 경로는 다음과 같다.

- `games.html`
- `games/**`
- `content/games/**`
- `assets/games/**`
- 게임 관련 문서
- 게임 전용 테스트 파일

현재 저장소의 `section-pages.js`와 `section-pages.css`는 여러 섹션이 함께 사용하는 파일이다. 이 파일이 필요한 경우에는 게임 관련 함수와 게임 전용 CSS 선택자만 최소 수정한다.

- 허용 JS 범위: `initGames`, Game Library, Game Stage, 게임 메시지 처리
- 허용 CSS 범위: `.game-*` 및 게임 전용 선택자
- 금지: 공통 Shell, Global Navigation, Footer 또는 다른 섹션 코드 리팩터링

공통 Shell 변경이 반드시 필요하면 먼저 변경 이유, 대상 파일, 영향 범위를 사용자에게 보고하고 별도 승인을 받는다.

## 6. 책임 구조

Kinder Edu 본체는 다음을 담당한다.

- Game Library UI
- 게임 metadata 표시
- Game Stage
- 게임 로딩·오류·빈 상태
- 게임 실행과 종료
- Fullscreen 연결
- 게임과 부모 페이지의 메시지 중계

개별 게임 프로젝트는 다음을 담당한다.

- 실제 게임 규칙과 상태
- 캐릭터와 오브젝트
- 게임 내부 UI
- 음향
- 점수 또는 진행 정보
- 게임별 테스트

개별 게임이 부모 페이지의 DOM, URL, Global CSS를 직접 변경하지 않는다.

## 7. 구현 순서

1. 저장소, 브랜치, 원격 저장소와 작업 트리 상태 확인
2. 필수 문서 전체 확인
3. 기존 Game Library, Game Stage, Registry 확인
4. 수정 대상 파일을 작업 전에 목록으로 확정
5. 가장 작은 범위로 구현
6. 개별 게임 단독 실행 검증
7. Kinder Edu Game Launcher 연결 검증
8. 데스크톱 검증
9. 모바일 세로 검증
10. 모바일 가로 검증
11. 콘솔 오류 확인
12. 허용 경로만 커밋·푸시

## 8. UI·UX 원칙

- 교사가 별도 설명 없이 실행할 수 있어야 한다.
- 마우스와 터치를 모두 지원한다.
- hover에만 의존하지 않는다.
- 터치 대상은 최소 `48 × 48px`를 권장한다.
- 모바일 본문 글자는 최소 `16px`를 권장한다.
- 자동 재생 음향을 사용하지 않는다.
- 음소거 또는 음량 제어를 제공한다.
- 게임 종료와 Library 복귀 경로를 항상 제공한다.
- 로그인, 광고, 결제, 외부 링크를 추가하지 않는다.
- 기존 Kinder Edu의 Accent, Radius, Gap과 타이포그래피를 유지한다.
- 제공된 이미지의 비율을 임의로 변경하거나 크롭하지 않는다.

## 9. Git 커밋·푸시 규칙

`git push`는 폴더가 아니라 커밋을 원격 저장소로 전송한다. 따라서 게임 파일만 푸시하려면 게임 변경만 포함된 독립 커밋을 만들어야 한다.

### 9.1 푸시 전 필수 확인

```powershell
git status --short --branch
git remote -v
git fetch origin
git log --oneline origin/main..HEAD
```

- 게임 작업 시작 전에 작업 트리가 깨끗한지 확인한다.
- 사용자 소유의 기존 변경을 커밋에 포함하지 않는다.
- `origin/main..HEAD`에 게임 작업과 무관한 미푸시 커밋이 있으면 푸시하지 않고 보고한다.
- 강제 푸시, rebase, reset, amend를 임의로 실행하지 않는다.

### 9.2 스테이징 규칙

`git add .` 또는 `git add -A`를 사용하지 않는다. 허용 경로를 명시한다.

예:

```powershell
git add games.html games content/games assets/games docs/GAME_INTEGRATION_GUIDE.md
git diff --cached --name-only
git diff --cached --check
```

스테이징 목록에 메인 홈페이지 또는 다른 섹션 파일이 있으면 커밋과 푸시를 중단한다.

공용 파일 `section-pages.js`와 `section-pages.css`를 수정한 경우에는 diff를 확인하여 게임 관련 블록 외의 변경이 없는지 검증한다.

### 9.3 브랜치와 푸시

- 기본 권장 브랜치: `game/<작업명>`
- 사용자가 단순히 “푸시해”라고 지시하면 현재 승인된 게임 작업 커밋만 현재 게임 브랜치에 푸시한다.
- 사용자가 `main` 푸시를 명시하면 게임 범위만 담긴 커밋인지 확인한 뒤 `main`에 푸시한다.
- “푸시”는 PR 병합이나 배포 승인을 자동으로 의미하지 않는다.
- 게임 작업과 무관한 로컬 커밋이 섞여 있으면 푸시하지 않는다.

## 10. 금지사항

- 메인 홈페이지 수정
- 다른 섹션 수정 또는 정리
- 요구사항에 없는 대규모 리팩터링
- 제공 이미지 임의 확대·크롭·재생성
- 게임마다 서로 다른 Launcher 제작
- 게임 목록을 HTML 또는 JS 문자열에 계속 직접 누적
- 승인되지 않은 외부 라이브러리 추가
- API 키를 프런트엔드에 포함
- 테스트 없이 완료 보고
- 빌드 성공만으로 실제 동작 완료 판단

## 11. 완료 보고 형식

1. 생성·수정한 파일
2. Game Library 변경사항
3. Game Launcher와 Game Stage 변경사항
4. 개별 게임 변경사항
5. Registry와 manifest 변경사항
6. 실제 에셋과 Placeholder 목록
7. 데스크톱 테스트 결과
8. 모바일 세로 테스트 결과
9. 모바일 가로 테스트 결과
10. 콘솔 오류 여부
11. 메인 홈페이지와 다른 섹션에 미친 영향
12. 아직 구현하지 않은 기능
13. 커밋과 푸시 대상 브랜치

메인 홈페이지와 다른 섹션에 영향이 없다면 반드시 `영향 없음`이라고 명시한다.
