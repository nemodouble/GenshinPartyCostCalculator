# 원신 파티 코스트 계산기 - 기획 문서

## 1️⃣ 핵심 목표 정리

**대상**: 원신 파티 코스트 계산기

### 기능
- **2파티** (각 4명)
- 캐릭터 선택
- 무기 선택
- 돌파 단계 선택 (캐릭터 0~6, 무기 0~5)
- 총 코스트 자동 계산
- **슬롯 초기화**
- **전체 초기화 버튼**

👉 전형적인 상태 기반 계산 앱

---

## 2️⃣ 화면 구조 (UI 설계)

### 메인 레이아웃
```
┌─────────────────────────────────────────┐
│        [전체 초기화 버튼]               │
├─────────────────────────────────────────┤
│         [ 파티 1 ]                      │
│  슬롯1    슬롯2    슬롯3    슬롯4       │
│                                         │
│         [ 파티 2 ]                      │
│  슬롯1    슬롯2    슬롯3    슬롯4       │
├─────────────────────────────────────────┤
│       [ 총 코스트 패널 ]                │
│  파티1 코스트 | 파티2 코스트 | 합계     │
└─────────────────────────────────────────┘
```

### 슬롯 UI 구성

#### 카드 상태: 비활성 (캐릭터 미선택)
```
┌──────────────┐
│              │
│  + 선택      │ ← 클릭 시 선택 모달 열림
│              │
└──────────────┘
```

#### 카드 상태: 활성 (캐릭터 선택됨)
```
┌───────────────────────┐
│ [캐릭터 아이콘]       │
│ 캐릭터 이름           │
│                       │
│ 돌파: [드롭다운 ▼]   │ (0~6)
│                       │
│ [무기 아이콘]         │
│ 무기 이름             │
│                       │
│ 무기돌파: [드롭다운 ▼] │ (0~5)
│                       │
│ 코스트: 9,999,999    │
│                       │
│ [초기화 버튼]        │ ← 슬롯만 비우기
└───────────────────────┘
```

#### 슬롯 클릭 시
- 비활성 슬롯: 선택 모달 열림
- 활성 슬롯: 캐릭터/무기 정보 표시, 돌파 조정 가능, 초기화 버튼으로만 비울 수 있음

---

## 3️⃣ 선택 모달 UI

### 모달 구조
```
┌────────────────────────────────┐
│  [캐릭터 탭]  [무기 탭]       │
├────────────────────────────────┤
│                                │
│ [그리드 레이아웃 - 반응형]    │
│  아이콘1  아이콘2  아이콘3    │
│  아이콘4  아이콘5  아이콘6    │
│  ...                           │
│                                │
│ 검색: [텍스트 입력] (차후 추가) │
│                                │
└────────────────────────────────┘
```

### 기능
- **탭 전환**: 캐릭터 ↔ 무기 탭 전환
- **그리드 레이아웃**: 반응형 설계 (모바일: 3개 열, 태블릿: 4개 열, 데스크톱: 5개 열)
- **선택 방식**: 아이콘 클릭 시 **즉시 반영** (선택 버튼 없음)
- **검색**: 현재 미포함, 차후 추가 고려하여 UI 구조 설계
- **중복 선택**: 불가능 (다른 파티/슬롯에 이미 선택된 캐릭터 비활성 처리)

---

## 4️⃣ 데이터 구조 설계

### Character
```typescript
type Character = {
  id: string          // 고유 ID
  name: string        // 캐릭터 이름
  icon: string        // 아이콘 URL 또는 경로
  constellation: number[] // 돌파 레벨별 코스트 [0~6]
}
```

### Weapon
```typescript
type Weapon = {
  id: string          // 고유 ID
  name: string        // 무기 이름
  icon: string        // 아이콘 URL 또는 경로
  refine: number[]    // 돌파 레벨별 코스트 [0~5]
}
```

### PartySlot
```typescript
type PartySlot = {
  characterId?: string     // 선택된 캐릭터 ID (선택 안 함: undefined)
  constellationLevel: number // 캐릭터 돌파 레벨 (0~6)
  weaponId?: string        // 선택된 무기 ID (선택 안 함: undefined)
  refineLevel: number      // 무기 돌파 레벨 (0~5)
}
```

### AppState
```typescript
type AppState = {
  party1: PartySlot[]  // 파티1: 4개 슬롯
  party2: PartySlot[]  // 파티2: 4개 슬롯
}
```

---

## 5️⃣ 데이터 파일 구조 (JSON)

### 저장 위치
```
public/data/
  ├── characters.json    // 모든 캐릭터 메타데이터
  ├── weapons.json       // 모든 무기 메타데이터
  └── costs.json         // 돌파 코스트 데이터 (이후 제공)
```

### characters.json 예시
```json
{
  "characters": [
    {
      "id": "hutao",
      "name": "호두",
      "icon": "/data/characters/hutao.png"
    },
    {
      "id": "ganyu",
      "name": "감우",
      "icon": "/data/characters/ganyu.png"
    }
    // ... 모든 캐릭터
  ]
}
```

### weapons.json 예시
```json
{
  "weapons": [
    {
      "id": "primordial_jade_cutter",
      "name": "원시옥 칼",
      "icon": "/data/weapons/primordial_jade_cutter.png"
    },
    // ... 모든 무기
  ]
}
```

### costs.json 예시 (이후 제공)
```json
{
  "characterCosts": {
    "constellation": [0, 100, 500, 1500, 3000, 6000, 10000]
  },
  "weaponCosts": {
    "refine": [0, 50, 250, 750, 1500, 3000]
  }
}
```

---

## 6️⃣ 코스트 계산 로직

### 코스트 구성 (가상 코스트 - 실제 게임과 무관)
```
슬롯 코스트 = 캐릭터 코스트 + 무기 코스트

캐릭터 코스트 = constellation[level]
무기 코스트 = refine[level]
```

### 계산 함수
```typescript
// 슬롯 코스트 계산
calculateSlotCost(slot: PartySlot, characters: Character[], weapons: Weapon[], costs: CostData): number
  → 캐릭터 미선택: 0
  → 캐릭터 선택됨: costs.characterCosts.constellation[slot.constellationLevel]
  → 무기 선택됨: + costs.weaponCosts.refine[slot.refineLevel]

// 파티 코스트 계산
calculatePartyCost(party: PartySlot[], ...): number
  → sum of all slots

// 전체 코스트 계산
calculateTotalCost(state: AppState, ...): number
  → calculatePartyCost(party1) + calculatePartyCost(party2)
```

---

## 7️⃣ 컴포넌트 구조

```
App
 ├── Header
 │   └── [전체 초기화 버튼]
 │
 ├── PartySection (Party1)
 │   ├── PartyTitle
 │   └── PartySlots
 │       ├── PartySlotCard (4개)
 │       │   ├── SlotContent (비활성 / 활성 상태)
 │       │   ├── ConstellationSelect (드롭다운)
 │       │   ├── RefineSelect (드롭다운)
 │       │   └── [초기화 버튼]
 │       └── PartyCostSummary
 │
 ├── PartySection (Party2)
 │   └── (Party1과 동일 구조)
 │
 ├── TotalCostPanel
 │   ├── Party1 코스트
 │   ├── Party2 코스트
 │   └── 합계
 │
 └── SelectionModal
     ├── TabNav
     │   ├── [캐릭터 탭]
     │   └── [무기 탭]
     ├── SearchBar (선택적, 차후 추가)
     └── ItemGrid (반응형)
         ├── ItemCard (아이콘)
         ├── ItemCard (아이콘)
         └── ... (반응형으로 렌더링)
```

---

## 8️⃣ 개발 단계 로드맵

### 단계 1 — 데이터 + 타입 정의
- ✔ TypeScript 타입 정의
- ✔ JSON 데이터 파일 생성 (characters.json, weapons.json)
- ✔ 더미 코스트 데이터 (costs.json)

### 단계 2 — 계산 로직
- ✔ 비용 계산 함수 구현
- ✔ 유틸리티 함수 (선택된 캐릭터 조회 등)

### 단계 3 — 상태 관리
- ✔ Context API 또는 useState로 전역 상태 관리
- ✔ 초기화, 선택, 돌파 레벨 변경 액션

### 단계 4 — 기본 UI
- ✔ PartySection 컴포넌트
- ✔ PartySlotCard (비활성/활성 상태)
- ✔ TotalCostPanel
- ✔ 레이아웃 스타일링

### 단계 5 — 선택 모달
- ✔ 모달 열기/닫기 상태 관리
- ✔ 캐릭터 탭 + 그리드 렌더링
- ✔ 무기 탭 + 그리드 렌더링
- ✔ 아이콘 클릭 → 즉시 슬롯에 반영
- ✔ 중복 선택 방지

### 단계 6 — 드롭다운 UI
- ✔ ConstellationSelect (0~6)
- ✔ RefineSelect (0~5)
- ✔ 선택 불가 상태 처리 (비활성 슬롯)

### 단계 7 — 반응형 + 폴리시
- ✔ 모바일 반응형 레이아웃
- ✔ 슬롯 초기화 버튼
- ✔ 전체 초기화 버튼
- ✔ 시각적 피드백 (선택됨/미선택)

### 단계 8 — 차후 기능 (예약)
- ⏳ 검색 기능
- ⏳ 필터 기능 (직업, 원소 등)
- ⏳ 파티 스왑 기능
- ⏳ 저장/불러오기 기능

---

## 9️⃣ 기술 스택

| 항목 | 선택 |
|------|------|
| 프레임워크 | React + TypeScript |
| 상태 관리 | Context API |
| 스타일링 | CSS Modules / Tailwind (TBD) |
| 빌드 도구 | Vite |
| 배포 | GitHub Pages |

---

## 🔟 주요 결정사항 정리

| 항목 | 결정 | 사유 |
|------|------|------|
| 데이터 소스 | JSON 하드코딩 | 안정성 최고, 유지보수 용이 |
| 캐릭터/무기 범위 | 모두 포함 | 완전한 계산기 제공 |
| 비용 데이터 | JSON 별도 저장 (이후 제공) | 유연한 업데이트 |
| 슬롯 초기화 | 가능 | 사용자 경험 향상 |
| 전체 초기화 | 있음 | 빠른 초기화 |
| 검색 기능 | 차후 추가 고려 | MVP 우선순위 낮음 |
| 그리드 반응형 | 예 | 모바일 대응 필요 |
| 선택 버튼 | 없음 (즉시반영) | UX 간결화 |
| 돌파 선택 UI | 드롭다운 | 직관적 선택 |
| 비활성 슬롯 | 드롭다운 미활성 | UX 명확성 |
| 중복 선택 | 불가능 | 게임 규칙 준수 |
| 파티 스왑 | 차후 고려 | MVP 범위 외 |
| 비용 체계 | 가상 코스트 | 실제 게임과 무관 |

---

## 다음 단계

1. **JSON 데이터 파일 생성**
   - `public/data/characters.json` (모든 원신 캐릭터)
   - `public/data/weapons.json` (모든 원신 무기)
   - `public/data/costs.json` (가상 코스트 - 이후 제공)

2. **TypeScript 타입 정의**
   - `src/types/index.ts`

3. **계산 로직 구현**
   - `src/utils/cost-calculator.ts`

4. **단계별 컴포넌트 개발**
   - 순서: 기본 UI → 상태 관리 → 선택 모달 → 드롭다운 → 반응형

---

**작성일**: 2026-02-20  
**상태**: 기획 확정, 개발 준비 중
