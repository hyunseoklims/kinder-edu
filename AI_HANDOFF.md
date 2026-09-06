# 🌱 아이꿈터 (kinder-edu) 프로젝트 AI 인수인계 문서 (Handoff Note)

> 이 문서는 Antigravity AI 어시스턴트와 나눈 모든 대화, 기획 의도, 구현된 기능 및 향후 작업 계획을 VS Code(Copilot, Gemini Code Assist, Cursor 등)에서 그대로 이어받을 수 있도록 정리한 인수인계 가이드입니다.

---

## 1. 프로젝트 개요 및 기획 배경
* **프로젝트명**: 아이꿈터 (Kinder Edu Hub)
* **목적**: 유치원 교사인 아내분을 위한 맞춤형 교육자료 나눔터 및 원아(만 5세)들이 교실에서 직접 즐길 수 있는 교육 놀이터 웹사이트
* **핵심 컨셉**: **교사 & 어린이 듀얼 모드 포털 (Dual-Mode Portal)**
  - 👩‍🏫 **선생님 공간**: 수업 준비 자료실(활동지/도안 인쇄), 교실 도구(활동 타이머, 발표자 뽑기)
  - 🧒 **어린이 놀이터**: 만 5세 눈높이 햄버거 키오스크 주문 연습, 동물 소리 퀴즈(TTS 음성), 무지개 피아노, 칭찬 스티커판

---

## 2. 배포 및 개발 환경
* **작업 디렉터리**: `C:\Vibe-Antigravity\kinder-edu`
* **GitHub 원격 저장소**: `https://github.com/hyunseoklims/kinder-edu.git` (main 브랜치)
* **Vercel 실시간 배포 주소**: `https://kinder-edu.vercel.app`
* **로컬 서버**: `npx live-server` (포트 8080)
* **기술 스택**: Vanilla HTML5, Vanilla CSS3 (현대적 디자인 시스템), Vanilla JavaScript (Web Audio API 음향 합성, Web Speech API 한국어 TTS)

---

## 3. 파일별 역할 및 구현 내용

### 1) [index.html](index.html)
* **3대 뷰(View) 구조**:
  1. `#view-selector`: 첫 화면 역할 선택 대문 (선생님 공간 vs 어린이 놀이터 카드)
  2. `#view-teacher`: 교사 전용 공간 (활동 타이머, 랜덤 뽑기, 활동지 인쇄 목록)
  3. `#view-kids`: 어린이 놀이터 (버거랜드 키오스크 배너, 동물 퀴즈, 무지개 피아노, 칭찬 스티커판)
* **`#kiosk-modal`**:
  - 실제 패스트푸드점 키오스크를 모사한 4단계 시뮬레이터
  - 1단계: 장소 선택 (매장 vs 포장)
  - 2단계: 버거/사이드/음료 터치 담기 및 실시간 트레이
  - 3단계: 가상 신용카드 꽂기 인터랙션
  - 4단계: 🧑‍🍳 친절 크루 서빙 플래시 애니메이션 피날레

### 2) [style.css](style.css)
* **디자인 토큰**: 따뜻한 파스텔 킨더가든 팔레트 (`--primary-coral`, `--kids-mint`, `--secondary-yellow`)
* **애니메이션**: 카드 플로팅, 눈 깜빡임(`@keyframes blink`), 카드 슬라이드 삽입(`@keyframes cardSlideIn`), 크루 등장 및 트레이 서빙 바운스(`@keyframes crewWalkIn`, `@keyframes trayDeliver`)
* **반응형 미디어 쿼리**: 모바일, 태블릿, 에디터 분할 창 대응

### 3) [app.js](app.js)
* **뷰 전환**: `switchView('selector' | 'teacher' | 'kids')`
* **사운드 & 음성**:
  - Web Audio API를 활용한 효과음 합성 (`playChime`)
  - Web Speech API를 활용한 자연스러운 유아 맞춤형 한국어 TTS (`speakText`)
* **교실 도구 로직**: 타이머 카운트다운 (`startTimer`, `pauseTimer`, `setTimerPreset`), 학생 셔플 뽑기 (`pickRandomStudent`)
* **키오스크 상태 머신**: `openKiosk()`, `selectDining()`, `addToCart()`, `handleCardInsert()`, `startServingFinale()`

---

## 4. 마지막으로 합의한 다음 개선 과제 (Next Tasks)
오늘 세션을 마무리하며 도출한 3가지 UI/UX 최적화 작업:
1. **대문 상단 여백 축소 (Above the fold 최적화)**:
   - `#view-selector` 상단 타이틀의 padding을 줄여, 스크롤 없이 두 카드가 한눈에 쏙 들어오도록 개선
2. **분할 창 반응형 개선**:
   - 에디터 분할 창(너비 700px 이하)에서도 두 카드가 세로로 밀리지 않고 가로 2열로 예쁘게 배치되도록 최소 너비 조정
3. **어린이 놀이터 카드의 시각적 재미 강화**:
   - 아이들이 한눈에 반할 수 있도록 알록달록한 그라데이션 배경 및 스티커 효과 적용

---

## 5. VS Code AI에게 전달할 프롬프트 (그대로 복사해서 사용하세요!)

```text
안녕! 나는 방금 Antigravity에서 작업하던 유치원 교육 포털 '아이꿈터(kinder-edu)' 프로젝트를 VS Code로 가져왔어.
프로젝트 루트에 있는 'AI_HANDOFF.md' 파일을 먼저 읽고 전체 기획 배경과 구현 현황을 파악해줘.
그 후 '4. 마지막으로 합의한 다음 개선 과제'에 적힌 3가지 UI/UX 최적화 작업부터 이어서 진행하자!
```
