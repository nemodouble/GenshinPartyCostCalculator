# Rebuild costs.json using PowerShell (no Python required)
$ErrorActionPreference = 'Stop'

$root = "C:\Users\ehdud\RiderProjects\GenshinCostCalculator\genshin-cost-calculator"

function Read-Json($path) {
  Get-Content -Raw -Path $path | ConvertFrom-Json
}

$characters = (Read-Json (Join-Path $root 'public\data\characters.json')).characters
$charInfo = (Read-Json (Join-Path $root 'public\data\character-info.json')).characterInfo
$weaponInfo = (Read-Json (Join-Path $root 'public\data\weapon-info.json')).weaponInfo
$weapons = (Read-Json (Join-Path $root 'public\data\weapons.json')).weapons

$limitedBaseByVersion = @{ 1 = 1; 2 = 2; 3 = 3; 4 = 4; 5 = 5; 6 = 6 }
$limitedAddsOld = @(1, 1, 0.5, 1, 0.5, 1)   # v1~v4
$limitedAddsNew = @(2, 2, 0.7, 2, 0.7, 2)   # v5~v6
$standardAdds = @(0.7, 0.7, 0.3, 0.7, 0.3, 0.7)
$star4Adds = @(0.2, 0.2, 0.1, 0.2, 0.1, 0.2)

$star4Cost2 = @('bennett','illuga','aino','fischl')
$star4Cost1 = @('xiangling','chevreuse','gaming','xingqiu','shinobu','iansan','faruzan','sucrose')

$standard5Base = @{
  tighnari = 2
  mona = 2
  diluc = 1
  keqing = 1
  jean = 1
  yumemizuki_mizuki = 0
  qiqi = 0
}

$exception5Base = @{
  venti = 4
  klee = 3
  albedo = 2
}

function Cumulative($base, $adds) {
  $vals = @($base)
  $total = [double]$base
  foreach ($a in $adds) {
    $total = [Math]::Round(($total + [double]$a), 2)
    $vals += $total
  }
  return $vals
}

$characterCosts = @{}
foreach ($c in $characters) {
  $cid = $c.id
  $info = $null
  if ($charInfo.PSObject.Properties.Name -contains $cid) { $info = $charInfo.$cid }

  $rarity = if ($info) { $info.rarity } else { $null }

  if ($rarity -eq 5 -or $standard5Base.ContainsKey($cid) -or $exception5Base.ContainsKey($cid)) {
    if ($standard5Base.ContainsKey($cid) -or ($info -and $info.version -eq 'standardBanner')) {
      $base = if ($standard5Base.ContainsKey($cid)) { $standard5Base[$cid] } elseif ($info -and $info.PSObject.Properties.Name -contains 'baselineCost') { $info.baselineCost } else { 1 }
      $costs = Cumulative $base $standardAdds
    } else {
      if ($exception5Base.ContainsKey($cid)) {
        $base = $exception5Base[$cid]
        $adds = $limitedAddsOld
      } else {
        $ver = if ($info) { $info.version } else { 1 }
        if ($ver -is [int]) {
          $base = $limitedBaseByVersion[$ver]
          $adds = if ($ver -ge 5) { $limitedAddsNew } else { $limitedAddsOld }
        } else {
          $base = 1
          $adds = $limitedAddsOld
        }
      }
      $costs = Cumulative $base $adds
    }
  } else {
    if ($star4Cost2 -contains $cid) {
      $base = 2
    } elseif ($star4Cost1 -contains $cid) {
      $base = 1
    } else {
      $base = 0
    }
    $costs = Cumulative $base $star4Adds
  }

  $characterCosts[$cid] = @{ constellation = $costs }
}

$weaponCosts = @{}
foreach ($w in $weapons) {
  $wid = $w.id
  $wInfo = $null
  if ($weaponInfo.PSObject.Properties.Name -contains $wid) { $wInfo = $weaponInfo.$wid }

  if ($wInfo -and $wInfo.rarity -eq 5) {
    $base = if ($wInfo.type -eq 'standard') { 0 } else { 1 }
  } else {
    $base = 0
  }

  $refine = @()
  for ($i = 0; $i -le 5; $i++) {
    $refine += [Math]::Round($base + 0.3 * $i, 2)
  }
  $weaponCosts[$wid] = @{ refine = $refine }
}

$defaultCharacterCosts = @{ constellation = (Cumulative 0 $star4Adds) }
$defaultWeaponCosts = @{ refine = @(0, 0.3, 0.6, 0.9, 1.2, 1.5) }

$out = @{
  characters = $characterCosts
  weapons = $weaponCosts
  defaultCharacterCosts = $defaultCharacterCosts
  defaultWeaponCosts = $defaultWeaponCosts
}

$outPath = Join-Path $root 'public\data\costs.json'
($out | ConvertTo-Json -Depth 6) | Set-Content -Path $outPath -Encoding UTF8

Write-Host "wrote" $outPath
