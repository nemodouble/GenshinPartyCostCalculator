# Add 4-star weapons to weapon-info.json
$ErrorActionPreference = 'Stop'

$root = "C:\Users\ehdud\RiderProjects\GenshinCostCalculator\genshin-cost-calculator"
$weaponsPath = Join-Path $root 'public\data\weapons.json'
$infoPath = Join-Path $root 'public\data\weapon-info.json'

$weaponsJson = Get-Content -Raw $weaponsPath | ConvertFrom-Json
$infoJson = Get-Content -Raw $infoPath | ConvertFrom-Json

# 5성 무기 ID 목록 (weapon-info.json에 이미 있는 것들)
$fiveStarIds = $infoJson.weaponInfo.PSObject.Properties.Name

# weapons.json에 있는 모든 무기 ID
$allWeaponIds = $weaponsJson.weapons | ForEach-Object { $_.id }

# 5성에 없는 무기 = 4성 이하
foreach ($wid in $allWeaponIds) {
    if ($fiveStarIds -notcontains $wid) {
        # 4성으로 추가 (3성 이하도 있지만 대부분 4성으로 처리)
        $infoJson.weaponInfo | Add-Member -NotePropertyName $wid -NotePropertyValue @{
            rarity = 4
            type = "standard"
        } -Force
    }
}

# 3성 이하 무기 ID 목록 (특별히 분류)
$threeStarOrLess = @(
    'sword_cold_blade', 'sword_dawn', 'sword_traveler', 'sword_darker', 'sword_sashimi', 'sword_mitsurugi',
    'claymore_glaive', 'claymore_siegfry', 'claymore_tin', 'claymore_reasoning', 'claymore_mitsurugi',
    'polearm_ruby', 'polearm_halberd', 'polearm_noire',
    'catalyst_intro', 'catalyst_pulpfic', 'catalyst_lightnov', 'catalyst_jade', 'catalyst_phoney',
    'bow_crowfeather', 'bow_arjuna', 'bow_curve', 'bow_sling', 'bow_msg',
    'sword_silver', 'claymore_oyaji', 'polearm_rod', 'catalyst_pocket', 'bow_old',
    'sword_blunt', 'claymore_aniki', 'polearm_gewalt', 'catalyst_apprentice', 'bow_hunters'
)

# 3성 이하는 rarity를 3으로 설정
foreach ($wid in $threeStarOrLess) {
    if ($infoJson.weaponInfo.PSObject.Properties.Name -contains $wid) {
        $infoJson.weaponInfo.$wid.rarity = 3
    }
}

# Save
$infoJson | ConvertTo-Json -Depth 6 | Set-Content -Encoding UTF8 $infoPath
Write-Host "Updated weapon-info.json with 4-star weapons"

