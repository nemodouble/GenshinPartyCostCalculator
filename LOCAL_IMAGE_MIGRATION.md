# 📋 로컬 저장 방식 마이그레이션 가이드

## 🎯 변경 사항

외부 CDN 링크에서 **로컬 저장 방식**으로 변경했습니다.

### 변경 전:
```json
{ "icon": "https://gi.yatta.moe/assets/UI/UI_AvatarIcon_Zibai.png" }
```

### 변경 후:
```json
{ "icon": "/images/characters/zibai.png" }
```

---

## 📁 폴더 구조

```
public/
├── data/
│   ├── characters.json  (✅ 로컬 경로로 업데이트됨)
│   ├── weapons.json     (✅ 로컬 경로로 업데이트됨)
│   └── costs.json
├── images/
│   ├── characters/      (📥 이미지 다운로드 필요)
│   │   ├── zibai.png
│   │   ├── illuga.png
│   │   └── ... (113개 캐릭터)
│   └── weapons/         (📥 이미지 다운로드 필요)
│       ├── sword_aquila.png
│       └── ... (70개 무기)
```

---

## 🚀 이미지 다운로드 방법

### **방법 1️⃣: 자동 다운로드 스크립트 (권장)**

```bash
npm run download-images
```

**소요 시간:** 5~10분 (180개 이미지)

### **방법 2️⃣: 수동 다운로드**

#### 캐릭터 이미지 (113개)

```bash
# PowerShell 또는 Bash에��

# 캐릭터 폴더 생성
mkdir -p public/images/characters

# 캐릭터 다운로드 (예시)
$ids = @("zibai", "illuga", "columbina", ...)
foreach ($id in $ids) {
    $url = "https://gi.yatta.moe/assets/UI/UI_AvatarIcon_$(($id -replace '_' , '_').substring(0,1).toupper() + ($id -replace '_' , '_').substring(1)).png"
    Invoke-WebRequest -Uri $url -OutFile "public/images/characters/$id.png"
}
```

#### 무기 이미지 (70개)

```bash
mkdir -p public/images/weapons

# 무기 다운로드 (예시)
wget "https://gi.yatta.moe/assets/UI/UI_EquipIcon_Sword_Aquila.png" -O "public/images/weapons/sword_aquila.png"
```

### **방법 3️⃣: 온라인 이미지 다운로더 사용**

- [Bulk Image Downloader](https://www.bulkimagedownloader.com/)
- [Image Downloader](https://chrome.google.com/webstore/detail/image-downloader/cnpniohnfphhjciadnkmbigalohdmnpg)

---

## ⚡ 빠른 테스트 (이미지 없이)

이미지가 없어도 앱은 정상 작동합니다:

```bash
npm run dev
```

**결과:**
- ✅ 모든 기능 작동
- ⚠️ 이미지 자리에 "이미지 오류" 아이콘 표시

---

## 📦 GitHub Pages 배포

### **Step 1: 이미지 다운로드 완료**
```bash
npm run download-images
```

### **Step 2: 빌드**
```bash
npm run build
```

**결과:** `dist/` 폴더에 이미지 포함

### **Step 3: 배포**

#### GitHub Pages 설정 (package.json)
```json
{
  "homepage": "https://[username].github.io/GenshinCostCalculator/"
}
```

#### vite.config.ts (GitHub Pages용)
```typescript
export default defineConfig({
  base: '/GenshinCostCalculator/',
  // ...
})
```

#### 배포 명령어
```bash
npm install --save-dev gh-pages
npm run deploy
```

---

## 🎯 장점

| 항목 | 이전 (CDN) | 현재 (로컬) |
|------|-----------|-----------|
| **안정성** | CDN 의존 | 완전 자체 관리 ✅ |
| **속도** | 외부 요청 | 빠른 로딩 ✅ |
| **리포지토리** | 작음 | 약 50-100MB |
| **GitHub Pages** | 호환 ✅ | 호환 ✅ |
| **오프라인** | 불가 | 가능 ✅ |

---

## 📝 주의사항

1. **이미지 라이선스**: 원신 이미지는 miHoYo의 지적재산입니다. 개인 프로젝트용으로만 사용하세요.

2. **리포지토리 크기**: 이미지가 포함되면 약 50-100MB 증가합니다. 

3. **다운로드 시간**: 180개 이미지는 인터넷 속도에 따라 5~10분 걸립니다.

---

## 🔄 되돌리기 (CDN으로 복원)

만약 CDN 방식으로 되돌리고 싶다면:

```json
{ "icon": "https://gi.yatta.moe/assets/UI/UI_AvatarIcon_[캐릭터명].png" }
```

---

## ✅ 체크리스트

- [ ] 이미지 다운로드 완료
- [ ] `public/images/` 폴더 확인
- [ ] `npm run build` 성공
- [ ] 로컬에서 테스트 (`npm run dev`)
- [ ] GitHub Pages 배포 (선택사항)

---

**다음 단계**: `npm run download-images` 실행 후 `npm run dev`로 테스트하세요!
