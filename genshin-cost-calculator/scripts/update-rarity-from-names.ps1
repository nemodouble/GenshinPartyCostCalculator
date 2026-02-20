# Update character rarity based on Korean name lists (PowerShell 5.1 compatible)
$ErrorActionPreference = 'Stop'

$root = "C:\Users\ehdud\RiderProjects\GenshinCostCalculator\genshin-cost-calculator"
$charsPath = Join-Path $root 'public\data\characters.json'
$infoPath = Join-Path $root 'public\data\character-info.json'

$charsJson = Get-Content -Raw $charsPath | ConvertFrom-Json
$infoJson = Get-Content -Raw $infoPath | ConvertFrom-Json
$info = $infoJson.characterInfo

# Build name->id map from characters.json (skip duplicated "여행자")
$nameToId = @{}
foreach ($c in $charsJson.characters) {
  if ($c.name -and $c.name -ne '여행자' -and -not $nameToId.ContainsKey($c.name)) {
    $nameToId[$c.name] = $c.id
  }
}

# Overrides for typos/aliases in the provided list
$overrides = @{
  '지벡' = 'zibai'
  '듀린' = 'durin'
  '마부이카' = 'mavuika'
  '바이주' = 'baizhu'
  '프리나' = 'furina'
  '산코노미야 코코미' = 'kokomi'
  '무알라니' = 'mualani'
  '실로넨' = 'xilonen'
  '오로룬' = 'ororon'
  '안토니(이파)' = 'ifa'
  '남연' = 'lan_yan'
  '헤이조' = 'heizou'
  '다알리아' = 'dahlia'
  '자호다' = 'jahoda'
  '이안산' = 'iansan'
}

# 5-star list (Korean names as provided)
$fiveNames = @(
  '감우','각청','나히다','나비아','느비예트','닐루','다이루크','데히야','듀린',
  '라이덴 쇼군','라이오슬리','리니','마부이카','모나','무알라니','바레사','바르카','바이주','방랑자','벤티',
  '사이노','산코노미야 코코미','실로넨','시그윈','신학','아를레키노','아라타키 이토','아이노','알베도','알하이탐',
  '에일로이','야란','야에 미코','요이미야','유라','지벡','차스카','치오리','치치','카에데하라 카즈하','카미사토 아야카',
  '카미사토 아야토','키니치','타이나리','타르탈리아','프리나','호두'
)

# 4-star list (Korean names as provided)
$fourNames = @(
  '가명','고로','남연','노엘','다알리아','디오나','도리','레이저','레일라','로자리아','리넷','리사','미카',
  '바바라','베넷','북두','사유','설탕','세토스','슈브르즈','안토니(이파)','엠버','연비','오로룬','요요','운근','응광',
  '이안산','자호다','중운','카베','카치나','케이아','쿠죠 사라','쿠키 시노부','키라라','토마','파루잔','프레미네','피슬','향릉','행추','헤이조'
)

function Resolve-Id($name) {
  if ($overrides.ContainsKey($name)) { return $overrides[$name] }
  if ($nameToId.ContainsKey($name)) { return $nameToId[$name] }
  return $null
}

$unknown = @()

foreach ($n in $fiveNames) {
  $id = Resolve-Id $n
  if ($id -and $info.PSObject.Properties.Name -contains $id) {
    $info.$id.rarity = 5
  } else {
    $unknown += $n
  }
}

foreach ($n in $fourNames) {
  $id = Resolve-Id $n
  if ($id -and $info.PSObject.Properties.Name -contains $id) {
    $info.$id.rarity = 4
  } else {
    $unknown += $n
  }
}

# Traveler rarity (explicitly 5-star from previous requirement)
if ($info.PSObject.Properties.Name -contains 'traveler_boy') { $info.traveler_boy.rarity = 5 }
if ($info.PSObject.Properties.Name -contains 'traveler_girl') { $info.traveler_girl.rarity = 5 }

# Save
$infoJson | ConvertTo-Json -Depth 6 | Set-Content -Encoding UTF8 $infoPath

if ($unknown.Count -gt 0) {
  Write-Host "UNKNOWN:" -ForegroundColor Yellow
  $unknown | Sort-Object | Get-Unique | ForEach-Object { Write-Host "- $_" }
} else {
  Write-Host "OK: all names matched"
}

