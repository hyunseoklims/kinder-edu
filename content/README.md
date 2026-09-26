# Section content contracts

상세 페이지 UI와 콘텐츠를 분리하기 위한 초기 계약입니다.

- `section-data.js`: 현재 정적 사이트가 직접 읽는 런타임 seed data
- `magazine/issue.schema.json`: 월호와 페이지·활용자료 구조
- `programs/manifest.schema.json`: 독립 프로그램 launcher 구조
- `games/manifest.schema.json`: 독립 게임 launcher 구조
- `templates/template.schema.json`: Controlled Editor 입력 구조
- `webtoon/episode.schema.json`: 작품 회차와 Reader 이미지 구조
- `blog/*.md`: 블로그 Article 원문

실제 콘텐츠가 준비되면 UI HTML을 수정하지 않고 같은 필드의 manifest와 Markdown을 교체합니다.
