(function () {
  window.KINDER_SECTION_DATA = {
    sections: {
      magazine: { label: '놀며자라', path: './play.html', accent: '#79B4D3', hover: '#609EBF', soft: '#EBF4F8' },
      programs: { label: '프로그램', path: './programs.html', accent: '#D88991', hover: '#C86F7A', soft: '#F9EDEE' },
      games: { label: '게임', path: './games.html', accent: '#DFB64F', hover: '#CA9F32', soft: '#FAF4E5' },
      making: { label: '만들기', path: './create.html', accent: '#7DBB91', hover: '#63A879', soft: '#ECF5EE' },
      webtoon: { label: '웹툰', path: './webtoon.html', accent: '#A492D2', hover: '#8D7ABE', soft: '#F1EFF8' },
      blog: { label: '블로그', path: './blog.html', accent: '#C7A06E', hover: '#B28A58', soft: '#F7F1E9' }
    },
    magazine: {
      issues: [
        { id: '2026-10', year: '2026', month: '10월호', current: true },
        { id: '2026-09', year: '2026', month: '09월호' }
      ],
      pages: [
        { type: 'cover', eyebrow: '2026 · 10', title: '놀며자라', copy: '표지 이미지가 들어갈 자리입니다.' },
        { type: 'contents', eyebrow: 'CONTENTS', title: '이번 호 목차', copy: '계절놀이 · 자연탐구 · 미술과 만들기 · 교사 팁' },
        { type: 'story', eyebrow: 'SEASON PLAY', title: '내용 페이지', copy: '실제 잡지 페이지 이미지로 교체할 콘텐츠 슬롯입니다.', resource: 'season-play' },
        { type: 'story', eyebrow: 'TEACHER TIP', title: '교사 팁', copy: '활용자료를 선택해도 이 페이지 위치는 유지됩니다.', resource: 'teacher-tip' }
      ],
      resources: [
        { id: 'season-play', title: '계절놀이 활용자료', age: '연령 정보 준비 중', area: '교육 영역 준비 중', body: '준비물과 활동 방법이 연결될 자료 슬롯입니다.' },
        { id: 'teacher-tip', title: '교사 팁 자료', age: '대상 정보 준비 중', area: '교사 지원', body: '실제 자료 파일과 교체할 수 있도록 분리된 상세 영역입니다.' }
      ]
    },
    programs: [
      { id: 'photo-tools', name: '사진 정리 도구', summary: '교실 사진을 정리하는 프로그램 연결 슬롯', status: '프로그램 연결 준비 중' },
      { id: 'font-tools', name: '한글 제작 도구', summary: '한글 결과물을 만드는 프로그램 연결 슬롯', status: '프로그램 연결 준비 중' },
      { id: 'play-tools', name: '놀이 기록 도구', summary: '놀이 기록 프로그램 연결 슬롯', status: '프로그램 연결 준비 중' }
    ],
    games: [
      { id: 'acorn-collector', title: '다람쥐 도토리 모으기', age: '대상 연령 준비 중', category: '자연탐구', time: '플레이 시간 준비 중', description: 'Game Launcher와 독립 게임 프로젝트 연결을 검증하는 대표 슬롯입니다.' },
      { id: 'game-slot-02', title: '게임 슬롯 02', age: '준비 중', category: '준비 중', time: '준비 중', description: '실제 게임 manifest로 교체할 자리입니다.' }
    ],
    templates: [
      { id: 'name-tag', category: '이름표', title: '기본 이름표', ratio: '4 / 3', fields: [{ key: 'name', label: '이름', type: 'text', value: '이름 입력' }, { key: 'color', label: '포인트 색', type: 'color', value: '#7DBB91' }] },
      { id: 'birthday-card', category: '카드', title: '생일 카드', ratio: '3 / 4', fields: [{ key: 'name', label: '이름', type: 'text', value: '이름 입력' }, { key: 'message', label: '메시지', type: 'text', value: '축하 메시지' }] },
      { id: 'worksheet', category: '활동지', title: '기본 활동지', ratio: '210 / 297', fields: [{ key: 'title', label: '제목', type: 'text', value: '활동지 제목' }] }
    ],
    webtoon: {
      title: '공무가',
      cover: './assets/webtoon/pilot-01.png',
      episodes: [
        { id: 'sample-01', number: 'EP. 01', title: '회차 제목 준비 중', thumbnail: './assets/webtoon/pilot-03.png', images: ['./assets/webtoon/pilot-03.png', './assets/webtoon/pilot-05.png', './assets/webtoon/pilot-07.png'] },
        { id: 'sample-02', number: 'EP. 02', title: '회차 제목 준비 중', thumbnail: './assets/webtoon/pilot-05.png', images: ['./assets/webtoon/pilot-05.png', './assets/webtoon/pilot-07.png'] }
      ]
    },
    blog: {
      categories: ['전체 글', '웹툰', '학습자료', '코딩', '일상'],
      posts: [
        { id: 'homepage-process', title: '킨더에듀 홈페이지를 만드는 과정', date: '2026-09-26', category: '코딩', summary: '공통 프레임과 여섯 개 섹션을 하나의 플랫폼으로 정리하는 과정을 기록합니다.', thumbnail: './assets/brand/cards/programs-laptop-transparent.png', markdown: './content/blog/homepage-process.md' },
        { id: 'webtoon-workflow', title: '웹툰 제작 흐름을 정리하는 방법', date: '2026-09-25', category: '웹툰', summary: '작품 홈과 회차 리더를 분리하고 콘텐츠를 데이터로 관리하는 기준을 정리합니다.', thumbnail: './assets/brand/cards/webtoon-card-art-v2.png', markdown: './content/blog/webtoon-workflow.md' },
        { id: 'classroom-materials', title: '교실 자료를 템플릿으로 준비하기', date: '2026-09-24', category: '학습자료', summary: '자유편집 대신 필요한 값만 바꾸는 템플릿형 제작 방식의 기본 구조를 살펴봅니다.', thumbnail: './assets/brand/cards/making-card-art-v2.png', markdown: './content/blog/classroom-materials.md' }
      ]
    }
  };
})();
