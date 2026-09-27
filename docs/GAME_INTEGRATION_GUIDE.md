# Kinder Edu 게임 제작·연동 규격

> 목적: Gemini가 제작·관리하는 게임을 Kinder Edu Game Library와 Game Stage에 일관된 방식으로 연결한다.

## 1. 기준 화면

Kinder Edu 상세 Shell 기준:

- 전체 앱 프레임: `1600 × 870px`
- Header: `1576 × 70px`
- Main: `1576 × 692px`
- Footer: `1576 × 60px`
- 외곽과 패널 Gap: `12px`
- 게임 Accent: `#DFB64F`
- 게임 Hover: `#CA9F32`
- 게임 Soft Background: `#FAF4E5`

Play Mode에서는 `1576 × 692px` Main 전체를 Game Stage로 사용한다. Toolbar 높이를 제외한 나머지를 게임 실행 영역으로 사용한다.

개별 게임 권장 설계 기준:

- 기준 캔버스: `1000 × 660px`
- Launcher 호환 최대 Workspace: `1012 × 692px`
- 내부 안전 여백: 최소 `16px`
- 게임 썸네일과 Cover: `16:9`
- 모바일 높이 계산: `100dvh` 우선

고정 크기로 화면을 자르지 않는다. 게임은 기준 캔버스를 사용하되 부모 Stage 크기에 맞춰 `contain` 방식으로 축소한다.

## 2. 권장 구조

```text
games/
├─ registry.json
├─ shared/
│  ├─ game-bridge.js
│  └─ game-base.css
└─ game-id/
   ├─ manifest.json
   ├─ GAME_BRIEF.md
   ├─ index.html
   ├─ src/
   ├─ assets/
   └─ tests/
```

각 게임은 독립적으로 실행 가능해야 한다. 한 게임의 CSS, 전역 변수, 저장 데이터가 다른 게임이나 Kinder Edu 본체에 영향을 주면 안 된다.

## 3. Registry

Game Library 목록은 `games/registry.json` 또는 현재 프로젝트가 채택한 동일 역할의 데이터 파일에서 생성한다. 게임 카드 HTML을 직접 계속 추가하지 않는다.

예:

```json
{
  "games": [
    {
      "id": "acorn-collector",
      "title": "다람쥐의 도토리 모으기",
      "description": "수를 세며 도토리를 모으는 게임",
      "entry": "./games/acorn-collector/index.html",
      "manifest": "./games/acorn-collector/manifest.json",
      "thumbnail": "./games/acorn-collector/assets/thumbnail.webp",
      "category": ["자연탐구", "수·과학"],
      "age": [4, 5, 6],
      "status": "prototype"
    }
  ]
}
```

## 4. 게임 manifest

각 게임은 최소 다음 정보를 제공한다.

```json
{
  "id": "acorn-collector",
  "title": "다람쥐의 도토리 모으기",
  "description": "수를 세며 도토리를 모으는 게임",
  "entry": "./index.html",
  "thumbnail": "./assets/thumbnail.webp",
  "cover": "./assets/cover.webp",
  "category": ["자연탐구", "수·과학"],
  "age": [4, 5, 6],
  "playTimeMinutes": 3,
  "orientation": "any",
  "baseWidth": 1000,
  "baseHeight": 660,
  "fullscreen": true,
  "version": "0.1.0",
  "status": "prototype"
}
```

manifest는 `content/games/manifest.schema.json`과 호환되게 유지하며, 스키마를 확장할 때 기존 게임을 깨뜨리지 않는다.

## 5. Game Library 상태

Browse Mode에서 제공할 정보:

- 제목
- `16:9` thumbnail
- 대상 연령
- 교육 영역
- 짧은 설명
- 대략적인 플레이 시간

좋아요, 조회수, 별점, 인기순, 로그인 기반 추천은 만들지 않는다.

## 6. Game Stage 상태

게임 시작 시 새 창을 기본으로 열지 않는다. Main 전체를 다음 상태 중 하나로 전환한다.

- `library`
- `loading`
- `playing`
- `paused`
- `completed`
- `error`
- `fullscreen`

최소 Toolbar:

```text
[← 게임 목록] [게임명]                       [다시 시작] [음량] [전체화면]
```

게임별 UI가 달라져도 Game Stage 외곽 크기와 Toolbar 위치는 유지한다.

## 7. Embed와 보안 경계

독립 게임은 기본적으로 Game Stage 내부 `iframe` 또는 격리된 mount 지점에서 실행한다.

- 게임이 부모 DOM을 직접 수정하지 않는다.
- 게임이 부모 URL을 변경하지 않는다.
- 게임 CSS를 부모 문서에 주입하지 않는다.
- 외부 페이지로 자동 이동하지 않는다.
- 불필요한 팝업과 새 창을 열지 않는다.
- 메시지 수신 시 `source`, `gameId`, 가능한 경우 `origin`을 검증한다.

## 8. 부모 페이지 통신

메시지 형식:

```js
window.parent.postMessage({
  source: 'kinder-edu-game',
  type: 'GAME_READY',
  gameId: 'acorn-collector',
  payload: {}
}, window.location.origin);
```

기본 이벤트:

- `GAME_READY`
- `GAME_START`
- `GAME_PAUSE`
- `GAME_RESUME`
- `GAME_RESTART`
- `GAME_COMPLETE`
- `GAME_ERROR`
- `REQUEST_FULLSCREEN`
- `EXIT_GAME`

부모가 게임으로 보내는 기본 명령:

- `HOST_PAUSE`
- `HOST_RESUME`
- `HOST_RESTART`
- `HOST_SET_MUTED`
- `HOST_EXIT`

메시지 payload는 JSON 직렬화 가능한 값만 사용한다.

## 9. 반응형 규칙

### Desktop `1201px 이상`

- Game Stage Main 전체 사용
- 게임 기준 캔버스를 중앙 정렬
- 남는 공간은 Soft Background로 처리
- 게임 화면을 확대 크롭하지 않는다.

### Tablet `601~1200px`

- Game Stage 전체 폭 사용
- Toolbar는 필요한 경우 두 줄 허용
- Library 카드는 화면 폭에 맞춰 재배치

### Mobile `600px 이하`

- 가로 스크롤 금지
- 모바일 세로와 가로 방향 모두 지원
- 중요한 조작을 한 화면에서 찾을 수 있게 한다.
- hover 전용 인터랙션 금지
- 안전 영역은 `env(safe-area-inset-*)`를 고려한다.
- 전체화면 API를 지원하지 않는 브라우저에서도 게임 진행이 가능해야 한다.

## 10. 오디오와 접근성

- 사용자 조작 전 자동 재생 금지
- 음소거 상태를 명확히 표시
- 핵심 정보는 색상만으로 전달하지 않는다.
- 키보드 focus를 표시한다.
- 가능한 경우 키보드와 터치를 모두 지원한다.
- 지나치게 빠른 깜빡임과 강한 화면 흔들림을 사용하지 않는다.
- 정답·오답 피드백은 시각 요소와 텍스트 또는 소리를 조합한다.

## 11. 데이터와 저장

- 초기 버전은 로그인 없이 작동해야 한다.
- 단순 설정은 게임별 namespace를 사용해 `localStorage`에 저장할 수 있다.
- 키 예: `kinder-edu:game:acorn-collector:settings`
- 개인정보를 저장하지 않는다.
- API 키와 비밀정보를 클라이언트 코드에 포함하지 않는다.

## 12. 에셋 규격

- Library thumbnail: `16:9`, 권장 `1280 × 720px`
- Cover/Hero: `16:9`, 권장 `1600 × 900px`
- 투명 캐릭터: 원본 비율 유지
- UI 텍스트를 이미지에 합성하지 않는다.
- 저작권과 사용 권한이 확인된 에셋만 사용한다.
- Placeholder는 파일명과 manifest에 명시한다.
- 메인 홈페이지 에셋을 수정하거나 덮어쓰지 않는다.

## 13. 오류 처리

게임은 다음 상황을 처리한다.

- manifest 로딩 실패
- entry 로딩 실패
- `GAME_READY` 시간 초과
- 지원하지 않는 화면 방향
- 오디오 로딩 실패
- Fullscreen API 미지원

기술 오류 원문을 사용자 화면에 그대로 노출하지 않고 `다시 시도`와 `게임 목록으로`를 제공한다.

## 14. 완료 검증

- [ ] 독립 URL에서 게임이 실행되는가
- [ ] Kinder Edu Game Stage 내부에서 실행되는가
- [ ] `1000 × 660px` 기준 화면이 정상인가
- [ ] Desktop에서 잘림이 없는가
- [ ] `390 × 844px` 모바일 세로에서 가로 스크롤이 없는가
- [ ] 모바일 가로에서 핵심 조작이 가능한가
- [ ] 마우스와 터치가 모두 작동하는가
- [ ] 시작·재시작·완료·종료가 가능한가
- [ ] 음소거가 작동하는가
- [ ] Fullscreen 진입과 종료가 가능한가
- [ ] Fullscreen 미지원 환경에서도 플레이 가능한가
- [ ] 새로고침 후 초기 상태가 정상인가
- [ ] 콘솔 오류가 없는가
- [ ] 메인 홈페이지 파일이 변경되지 않았는가
- [ ] 다른 섹션 동작에 영향이 없는가

## 15. 통합 완료 보고

Gemini는 게임을 연결한 뒤 다음을 보고한다.

1. Registry 항목
2. manifest 경로와 버전
3. 게임 entry 경로
4. Launcher 연결 방식
5. 사용한 실제 에셋과 Placeholder
6. 검증한 viewport와 브라우저
7. 남은 오류와 미구현 기능
8. 메인 홈페이지 변경 여부
9. 커밋에 포함된 파일 목록
10. 푸시한 브랜치
