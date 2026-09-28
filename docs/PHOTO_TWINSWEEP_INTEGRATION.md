# Photo TwinSweep integration

## 운영 구조

- 원본 프로젝트: `hyunseoklims/photo-twinsweep`
- 원본 배포: `https://photo-twinsweep.vercel.app/`
- Kinder Edu 내부 경로: `/programs/photo-twinsweep/`
- Kinder Edu 프로그램 데이터: `content/section-data.js`
- 연결 설정: 루트 `vercel.json`

Kinder Edu는 Photo TwinSweep의 빌드 파일을 저장소에 복사하지 않습니다.
Vercel external rewrite를 이용해 Kinder Edu 내부 경로에서 원본 배포를 역프록시합니다.
브라우저 주소 기준으로는 Kinder Edu와 동일한 origin이므로 프로그램 Workspace의 iframe 안에서도
Chrome/Edge의 로컬 폴더 선택 기능을 사용할 수 있는 구조를 유지합니다.

## 자동 반영 흐름

1. `photo-twinsweep` 저장소의 `main` 브랜치에 수정사항을 푸시합니다.
2. Photo TwinSweep Vercel 프로젝트가 자동으로 새 버전을 배포합니다.
3. 배포가 완료되는 즉시 Kinder Edu의 `/programs/photo-twinsweep/`도 최신 버전을 제공합니다.
4. 이 과정에서 `kinder-edu` 저장소를 다시 빌드하거나 푸시할 필요가 없습니다.

## 변경 금지 사항

- 자동 연동을 위해 Kinder Edu 메인페이지의 `index.html`, `app.js`, `style.css`를 수정하지 않습니다.
- Photo TwinSweep의 `vite.config.ts`에 있는 상대 경로 설정 `base: './'`을 제거하지 않습니다.
- 프로그램 진입 경로 `/programs/photo-twinsweep/index.html`과 rewrite prefix를 서로 다르게 변경하지 않습니다.

## 장애 확인

프로그램이 열리지 않으면 다음 순서로 확인합니다.

1. `https://photo-twinsweep.vercel.app/`의 최신 배포가 정상인지 확인합니다.
2. `https://kinder-edu.vercel.app/programs/photo-twinsweep/`가 같은 버전을 표시하는지 확인합니다.
3. 브라우저 개발자 도구에서 JS, CSS, Worker 요청 경로가 `/programs/photo-twinsweep/` 아래인지 확인합니다.
