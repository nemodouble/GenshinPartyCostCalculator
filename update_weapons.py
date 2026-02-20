import json
import os

# 사용 가능한 이미지 파일 확인
weapon_files = {f.lower(): f for f in os.listdir('public/images/weapons')}

print(f"Available files: {len(weapon_files)}\n")

# weapons.json 로드 및 수정
with open('public/data/weapons.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 각 무기의 icon을 실제 파일로 매핑
matched = 0
for weapon in data['weapons']:
    weapon_id = weapon['id']
    weapon_name = weapon['name']
    
    # weapon_id를 UI_EquipIcon_* 형태로 변환 (underscores 제거)
    if weapon_id.startswith('sword_'):
        base = weapon_id[6:]
        base_formatted = ''.join(word.capitalize() for word in base.split('_'))
        search_name = f"ui_equipicon_sword_{base_formatted.lower()}"
    elif weapon_id.startswith('claymore_'):
        base = weapon_id[9:]
        base_formatted = ''.join(word.capitalize() for word in base.split('_'))
        search_name = f"ui_equipicon_claymore_{base_formatted.lower()}"
    elif weapon_id.startswith('polearm_'):
        base = weapon_id[8:]
        base_formatted = ''.join(word.capitalize() for word in base.split('_'))
        search_name = f"ui_equipicon_pole_{base_formatted.lower()}"
    elif weapon_id.startswith('catalyst_'):
        base = weapon_id[9:]
        base_formatted = ''.join(word.capitalize() for word in base.split('_'))
        search_name = f"ui_equipicon_catalyst_{base_formatted.lower()}"
    else:
        base = weapon_id[4:]
        base_formatted = ''.join(word.capitalize() for word in base.split('_'))
        search_name = f"ui_equipicon_bow_{base_formatted.lower()}"
    
    # 파일 찾기
    found_file = None
    for file_lower, file_actual in weapon_files.items():
        if file_lower == search_name + '.png':
            found_file = file_actual
            break
    
    if found_file:
        weapon['icon'] = f'/images/weapons/{found_file}'
        print(f'[OK] {weapon_name}')
        matched += 1
    else:
        print(f'[MISSING] {weapon_name} (searching for {search_name}.png)')

# 저장
with open('public/data/weapons.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"\n✓ 완료! {matched}/{len(data['weapons'])} 매칭됨")

