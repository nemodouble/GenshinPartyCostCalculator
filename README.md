﻿# 원신 파티 코스트 계산기

2파티 (각 4명)의 캐릭터와 무기 돌파 코스트를 자동으로 계산해주는 웹 애플리케이션입니다.

## 🎯 주요 기능

- ✅ **2파티 관리**: 파티 1, 파티 2 각각 4명의 캐릭터 및 무기 선택
- ✅ **자동 코스트 계산**: 캐릭터 돌파 + 무기 돌파 코스트 자동 계산
- ✅ **돌파 레벨 선택**: 드롭다운으로 캐릭터(0~6), 무기(0~5) 돌파 레벨 설정
- ✅ **실시간 업데이트**: 선택/변경 시 즉시 코스트 반영
- ✅ **중복 선택 방지**: 이미 선택된 캐릭터는 다른 슬롯에서 선택 불가
- ✅ **슬롯 초기화**: 개별 슬롯 또는 전체 파티 초기화
- ✅ **반응형 디자인**: 데스크톱, 태블릿, 모바일 모두 지원

## 🚀 시작하기

### 필수 요구사항
- Node.js 20.19+ 또는 22.12+
- npm 또는 yarn

### 개발 서버 실행

#### 방법 1: 배치 파일 사용 (Windows)
```batch
start-dev.bat
```

#### 방법 2: 터미널에서 직접 실행
```bash
cd genshin-cost-calculator
npm install  # 처음 실행 시에만
npm run dev
```

**예상 출력:**
```
  VITE v7.3.1  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

브라우저에서 `http://localhost:5173/` 를 열어주세요.

### 프로덕션 빌드

```bash
cd genshin-cost-calculator
npm run build
```

빌드 결과는 `dist/` 폴더에 생성됩니다.

---

## 📚 사용 방법

### 1. 캐릭터 선택
1. 빈 슬롯(+) 버튼 클릭
2. "캐릭터" 탭에서 원하는 캐릭터 선택
3. 모달이 자동으로 닫히고 슬롯에 캐릭터가 표시됨

### 2. 무기 선택
1. 캐릭터를 선택한 슬롯에서 무기 영역 클릭 (또는 새 슬롯에서 "무기" 탭으로 이동)
2. "무기" 탭에서 원하는 무기 선택
3. 슬롯에 무기가 표시됨

### 3. 돌파 레벨 설정
1. 슬롯의 드롭다운에서 원하는 돌파 레벨 선택
   - 캐릭터: 0~6
   - 무기: 0~5
2. 코스트가 자동으로 계산됨

### 4. 초기화
- **슬롯 초기화**: 슬롯의 "초기화" 버튼 클릭
- **전체 초기화**: 헤더의 "전체 초기화" 버튼 클릭

---

## 📁 프로젝트 구조

```
GenshinCostCalculator/
├── genshin-cost-calculator/
│   ├── public/
│   │   ├── data/
│   │   │   ├── characters.json     # 캐릭터 데이터 (70+)
│   │   │   ├── weapons.json        # 무기 데이터 (1000+)
│   │   │   └── costs.json          # 코스트 데이터
│   │   └── vite.svg
│   ├── src/
│   │   ├── components/             # React 컴포넌트
│   │   ├── context/                # 상태 관리 (Context API)
│   │   ├── styles/                 # CSS 파일
│   │   ├── types/                  # TypeScript 타입
│   │   ├── utils/                  # 유틸리티 함수
│   │   ├── App.tsx                 # 메인 앱 컴포넌트
│   │   ├── main.tsx                # 엔트리 포인트
│   │   └── index.css               # 글로벌 스타일
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── index.html
├── DESIGN.md                        # 기획 문서
├── TEST_GUIDE.md                    # 테스트 가이드
└── start-dev.bat                    # 개발 서버 실행 스크립트
```

---

## 🛠️ 기술 스택

- **Framework**: React 18+ with TypeScript
- **State Management**: Context API
- **Styling**: CSS Modules + Global CSS
- **Build Tool**: Vite
- **Type Checking**: TypeScript

---

## 📊 코스트 데이터

### 캐릭터 돌파 코스트
| 돌파 | 비용 |
|------|------|
| 0 | 0 |
| 1 | 100 |
| 2 | 500 |
| 3 | 1500 |
| 4 | 3000 |
| 5 | 6000 |
| 6 | 10000 |

### 무기 돌파 코스트
| 돌파 | 비용 |
|------|------|
| 0 | 0 |
| 1 | 50 |
| 2 | 250 |
| 3 | 750 |
| 4 | 1500 |
| 5 | 3000 |

---

## 📋 테스트

자세한 테스트 가이드는 `TEST_GUIDE.md` 파일을 참고하세요.

주요 테스트 항목:
- [ ] 캐릭터/무기 선택
- [ ] 돌파 레벨 변경
- [ ] 코스트 자동 계산
- [ ] 중복 선택 방지
- [ ] 슬롯 및 전체 초기화
- [ ] 반응형 레이아웃 (모바일/태블릿/데스크톱)

---

## ⚠️ 알려진 제약사항

1. **아이콘 이미지**: 현재 플레이스홀더 경로 사용 중
   - 실제 이미지 경로로 업데이트 필요
   - `/data/characters/{id}.png`, `/data/weapons/{id}.png` 형식

2. **검색 기능**: 아직 미구현
   - 향후 버전에서 추가 예정

3. **저장/불러오기**: 미구현
   - 로컬스토리지 기반 구현 계획 중

4. **색상 테마**: 라이트 모드만 지원
   - 다크모드는 향후 추가

---

## 🎯 향후 기능 (Roadmap)

- [ ] 검색 기능
- [ ] 필터 기능 (직업, 원소, 무기 타입)
- [ ] 파티 스왑 기능
- [ ] 저장/불러오기 기능
- [ ] 공유 기능 (URL 기반)
- [ ] 다크모드
- [ ] 아이콘 이미지 업데이트
- [ ] PWA 지원

---

## 📝 개발 가이드

### 환경 변수 설정
현재 필요한 환경 변수 없음

### 빌드 명령어
```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview

# 타입 체크
npm run type-check

# Lint
npm run lint
```

---

## 🐛 버그 리포트

문제를 발견하면 다음을 확인해주세요:
1. 브라우저 DevTools Console 탭에서 오류 메시지 확인
2. `public/data/` 폴더의 JSON 파일이 존재하는지 확인
3. 최신 버전의 Node.js를 사용하고 있는지 확인

---

## 📄 라이선스

개인 프로젝트 - MIT License

---

## 👤 개발자

만든이: 사용자

생성일: 2026-02-20

---

## 🔗 관련 링크

- [Vite 공식 문서](https://vitejs.dev)
- [React 공식 문서](https://react.dev)
- [TypeScript 공식 문서](https://www.typescriptlang.org)

---

**문제가 있거나 개선 사항이 있으면 알려주세요!** 🎉

---

## ⚠️ 고지사항 (Disclaimer)

**원신 파티 코스트 계산기**는 HoYoverse와 연관이 없습니다.

Genshin Impact, 게임의 콘텐츠와 소재의 트레이드마크와 저작권은 HoYoverse에 있습니다.

