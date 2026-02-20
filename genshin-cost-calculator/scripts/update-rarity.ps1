# Update character rarity based on provided 5★/4★ lists (PowerShell 5.1 compatible)
$ErrorActionPreference = 'Stop'

$root = "C:\Users\ehdud\RiderProjects\GenshinCostCalculator\genshin-cost-calculator"
$path = Join-Path $root 'public\data\character-info.json'

$json = Get-Content -Raw $path | ConvertFrom-Json
$info = $json.characterInfo

# 5성 목록(요청 기준)
$five = @(
  'traveler_boy','traveler_girl','aloy','alhaitham','albedo','arlecchino','ayaka','ayato','itto','eula','yoimiya',
  'raiden_shogun','yae_miko','kokomi','kazuha','klee','tartaglia','diluc','mona','qiqi','keqing','venti','zhongli',
  'nahida','nilou','cyno','dehya','baizhu','lyney','neuvillette','furina','navia','clorinde','sigewinne','chiori',
  'ganyu','hutao','tighnari','mavuika','mualani','xilonen','chasca','kinich','durin','skirk','columbina','zibai',
  'varesa','aino'
)

# 4성 목록(요청 기준)
$four = @(
  'amber','kaeya','lisa','barbara','razor','bennett','noelle','fischl','sucrose','xingqiu','chongyun','xiangling','xinyan',
  'yun_jin','yanfei','rosaria','diona','sayu','thoma','sara','gorou','heizou','kirara','kaveh','faruzan','yaoyao','mika',
  'collei','dori','candace','lynette','freminet','chevreuse','gaming','sethos','ororon','lan_yan','iansan','jahoda'
)

# Apply updates
foreach ($id in $five) {
  if ($info.PSObject.Properties.Name -contains $id) {
    $info.$id.rarity = 5
  }
}

foreach ($id in $four) {
  if ($info.PSObject.Properties.Name -contains $id) {
    $info.$id.rarity = 4
  }
}

# Traveler version safeguard (if 0 -> 1)
if ($info.PSObject.Properties.Name -contains 'traveler_boy') {
  if ($info.traveler_boy.version -eq 0) { $info.traveler_boy.version = 1 }
}
if ($info.PSObject.Properties.Name -contains 'traveler_girl') {
  if ($info.traveler_girl.version -eq 0) { $info.traveler_girl.version = 1 }
}

# Save
$json | ConvertTo-Json -Depth 6 | Set-Content -Encoding UTF8 $path
Write-Host "Updated rarity in" $path

