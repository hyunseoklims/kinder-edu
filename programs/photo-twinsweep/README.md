# Photo TwinSweep embedded build

이 폴더는 독립 저장소 `hyunseoklims/photo-twinsweep`의 배포용 빌드 결과입니다.
킨더에듀 프로그램 섹션은 같은 도메인의 이 경로를 `iframe`으로 불러옵니다.

## Source

- Repository: `https://github.com/hyunseoklims/photo-twinsweep`
- Integrated source commit: `b9146b064c5da755a4fc0fdae4e7de8ac0cdde2a`

## Update

Photo TwinSweep 원본 저장소에서 다음 명령으로 빌드한 뒤 `dist` 내용을 이 폴더에 교체합니다.

```powershell
npm run build -- --base=/programs/photo-twinsweep/
```

메인 홈페이지 파일인 `index.html`, `app.js`, `style.css`는 이 업데이트 과정에서 수정하지 않습니다.
