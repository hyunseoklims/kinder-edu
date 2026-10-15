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
      {
            "id": "photo-twinsweep",
            "name": "포토 트윈 스윕",
            "summary": "겹친 사진을 비교해 중복 사진을 정리해요.",
            "icon": "./assets/program-icons/photo-twinsweep.svg",
            "status": "사용 가능",
            "permissions": "fullscreen",
            "entry": "./programs/photo-twinsweep/index.html",
            "localEntry": "./programs/photo-twinsweep/index.html"
      },
      {
            "id": "hangeul-fontory",
            "name": "한글 제작 도구",
            "summary": "기본 자소를 직접 쓰고 손글씨 작업을 모아요.",
            "icon": "./assets/program-icons/hangeul-fontory.svg",
            "status": "사용 가능",
            "permissions": "fullscreen",
            "entry": "./programs/hangeul-fontory/index.html",
            "localEntry": "./programs/hangeul-fontory/index.html"
      },
      {
            "id": "image-crop-manager",
            "name": "이미지 크롭 작업실",
            "summary": "사진에서 필요한 영역을 골라 PNG로 저장해요.",
            "icon": "./assets/program-icons/image-crop-manager.svg",
            "status": "로컬 실행 가능 · 배포 준비 중",
            "permissions": "fullscreen",
            "entry": null,
            "localEntry": "./programs/image-crop-manager/index.html"
      },
      {
            "id": "photo-date-organizer",
            "name": "사진 날짜 정리",
            "summary": "촬영 날짜를 기준으로 사진 폴더를 정리해요.",
            "icon": "./assets/program-icons/photo-date-organizer.svg",
            "status": "사용 가능",
            "permissions": "fullscreen",
            "entry": "./programs/photo-date-organizer/index.html",
            "localEntry": "./programs/photo-date-organizer/index.html"
      },
      {
            "id": "body-mannequin-designer",
            "name": "마네킹 디자이너",
            "summary": "신체 수치와 체형을 조절하고 마네킹을 비교해요.",
            "icon": "./assets/program-icons/body-mannequin-designer.svg",
            "status": "사용 가능",
            "permissions": "fullscreen",
            "entry": "https://body-mannequin-designer.vercel.app/",
            "localEntry": "./programs/body-mannequin-designer/"
      },
      {
            "id": "playstory-photo-manager",
            "name": "놀이 사진 관리",
            "summary": "놀이 사진을 모아 기록을 준비하는 프로그램이에요.",
            "icon": "./assets/program-icons/playstory-photo-manager.svg",
            "status": "준비 중 · 프로그램 소스 연결 필요",
            "permissions": "fullscreen",
            "entry": null,
            "localEntry": null
      }
],
    games: [
      {
        id: 'acorn-collector',
        title: '다람쥐의 가을 준비',
        age: '만 3~5세',
        category: '수·과학',
        theme: '가을',
        time: '약 3분',
        description: '가을 숲속 낙엽 사이에서 도토리를 찾아 세며 다람쥐 바구니에 담는 놀이',
        entry: './games/autumn-preparation/index.html',
        thumbnail: './games/autumn-preparation/assets/concept.png',
        cover: './games/autumn-preparation/assets/concept.png',
        featured: true,
        teacherGuide: {
          nuriArea: '자연탐구 > 탐구하는 태도 기르기 > 주변 사물과 자연환경에 관심 갖기',
          coreCompetency: '자연물(도토리) 관찰력, 1:1 수 세기 기초 개념, 시지각 변별력',
          prompts: [
            '“도토리가 낙엽 속에 쏙 숨어있네! 바구니에는 지금 몇 개가 모였을까?”',
            '“도토리를 모은 다람쥐의 기분은 어떨까? 다람쥐 표정을 함께 살펴볼까?”',
            '“바람이 살랑 불어 낙엽이 흔들릴 때 도토리는 어디로 굴러갈까?”'
          ],
          offlineActivities: [
            '🍂 바깥놀이 시간에 유치원 마당이나 산책로에서 실제 도토리와 솔방울 찾아 크기별로 나열하기',
            '🐿️ 점토와 낙엽, 도토리 모자를 이용해 나만의 겨울잠 다람쥐 보금자리 만들기'
          ],
          worksheet: '도토리 숫자 짝맞추기 활동지'
        }
      },
      {
        id: 'fall-leaves-sort',
        title: '알록달록 낙엽 분류하기',
        age: '만 3~5세',
        category: '자연탐구',
        theme: '가을',
        time: '약 3분',
        description: '은행잎, 단풍잎, 참나무잎을 색깔과 모양에 맞는 바구니로 분류하는 감각 놀이',
        entry: './games/fall-leaves-sort/index.html',
        thumbnail: './assets/games/fall-leaves-sort/thumbnail.jpg',
        cover: './assets/games/fall-leaves-sort/cover.jpg',
        featured: false,
        teacherGuide: {
          nuriArea: '자연탐구 > 수학적 탐구하기 > 물체를 속성(모양, 색깔)에 따라 분류하기',
          coreCompetency: '색상과 잎맥 형태 변별력, 유목화 및 논리적 분류 사고력',
          prompts: [
            '“노란 부채 모양 잎사귀는 어떤 나무의 잎일까? 노란 바구니에 쏙 넣어볼까?”',
            '“단풍잎은 뾰족뾰족 몇 갈래로 나뉘어 있을까? 손가락으로 함께 짚어보자!”',
            '“갈색 둥근 참나무 잎을 만지면 어떤 소리가 바스락 날까?”'
          ],
          offlineActivities: [
            '🍁 교실에서 낙엽 프로타주(색연필 문지르기)로 다양한 잎맥 무늬 관찰하기',
            '🧺 낙엽을 색깔별(노랑, 빨강, 갈색)로 모아 야외 낙엽 만다라 원형 콜라주 꾸미기'
          ],
          worksheet: '알록달록 낙엽 속성 분류 활동지'
        }
      },
      {
        id: 'autumn-orchard',
        title: '가을 과수원 열매 수확',
        age: '만 4~6세',
        category: '신체운동',
        theme: '가을',
        time: '약 3분',
        description: '가을 햇살을 받고 탐스럽게 익은 사과와 감을 톡톡 수확 상자에 담는 놀이',
        entry: './games/autumn-orchard/index.html',
        thumbnail: './assets/games/autumn-orchard/thumbnail.jpg',
        cover: './assets/games/autumn-orchard/cover.jpg',
        featured: false,
        teacherGuide: {
          nuriArea: '신체운동·건강 > 신체활동 즐기기 > 소근육 조절 및 눈과 손의 협응',
          coreCompetency: '순발력, 시각-운동 협응 조절, 과일의 계절적 변화 이해',
          prompts: [
            '“사과가 나뭇가지에서 통통 튕기며 떨어지네! 어떤 소리가 났을까?”',
            '“가을이 되면 초록색이던 열매가 왜 빨갛고 주홍빛으로 물들까?”',
            '“수확한 과일을 친구들과 어떻게 맛있게 나누어 먹을 수 있을까?”'
          ],
          offlineActivities: [
            '🍎 사과와 단감을 반으로 잘라 씨앗의 모양과 단면 패턴 비교 관찰하기',
            '🎨 종이 접시와 한지를 이용해 입체 가을 과일 바구니 조형 만들기'
          ],
          worksheet: '과수원 수확 셈하기 및 관찰 일지'
        }
      },
      {
        id: 'scarecrow-memory',
        title: '허수아비 카드 짝맞추기',
        age: '만 4~6세',
        category: '의사소통',
        theme: '가을',
        time: '약 2분',
        description: '황금 들판 허수아비 옷에 걸린 가을 낱말 카드를 뒤집어 짝을 찾는 메모리 게임',
        entry: './games/scarecrow-memory/index.html',
        thumbnail: './assets/games/scarecrow-memory/thumbnail.jpg',
        cover: './assets/games/scarecrow-memory/cover.jpg',
        featured: false,
        teacherGuide: {
          nuriArea: '의사소통 > 책과 이야기 즐기기 > 가을 낱말과 그림 연결하기 / 공간 기억',
          coreCompetency: '작업 기억력(Working Memory), 위치 기억 및 시각적 집중에 대한 주의 지속력',
          prompts: [
            '“방금 전에 이 카드를 어디서 봤더라? 허수아비 아저씨 모자 옆이었나?”',
            '“도토리와 단풍잎 그림을 보며 우리 주변 가을 풍경을 이야기해볼까?”',
            '“허수아비는 논에서 어떤 일을 하고 있을까?”'
          ],
          offlineActivities: [
            '🌾 가을 낱말 그림 카드를 이용한 친구와 짝꿍 메모리 보드게임 진행',
            '🧥 버려진 옷감과 털실로 우리 반 지킴이 미니 허수아비 인형 만들기'
          ],
          worksheet: '가을 낱말 기억력 카드 오리기 세트'
        }
      },
      {
        id: 'autumn-night-music',
        title: '가을밤 풀벌레 음악대',
        age: '만 3~6세',
        category: '예술경험',
        theme: '가을',
        time: '약 3분',
        description: '보름달 아래 귀뚜라미와 방울벌레 친구들과 함께 나뭇잎 실로폰을 연주하는 리듬 놀이',
        entry: './games/autumn-night-music/index.html',
        thumbnail: './assets/games/autumn-night-music/thumbnail.jpg',
        cover: './assets/games/autumn-night-music/cover.jpg',
        featured: false,
        teacherGuide: {
          nuriArea: '예술경험 > 창의적으로 표현하기 > 음색과 멜로디 탐색 및 리듬 연주하기',
          coreCompetency: '음높이(피치) 감각, 청지각적 집중력, 가을 곤충 소리에 대한 심미감',
          prompts: [
            '“실로폰 건반이 길수록 높은 소리가 날까, 낮은 소리가 날까?”',
            '“귀뚜라미 바이올린 소리와 방울벌레 실로폰 소리는 어떻게 다를까?”',
            '“가을밤 창밖을 가만히 귀 기울이면 어떤 풀벌레 노랫소리가 들릴까?”'
          ],
          offlineActivities: [
            '🦗 물병에 물 높이를 다르게 채워 만든 천연 실로폰으로 가을 동요 연주하기',
            '🎶 가을밤 풀벌레 소리 오디오를 들으며 몸으로 곤충들의 움직임 표현해보기'
          ],
          worksheet: '8음 나뭇잎 실로폰 계이름 색칠 악보'
        }
      }
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
