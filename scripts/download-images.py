import json
import os
import urllib.request
from pathlib import Path

# 데이터 파일 로드
with open('public/data/characters.json', 'r', encoding='utf-8') as f:
    characters_data = json.load(f)

with open('public/data/weapons.json', 'r', encoding='utf-8') as f:
    weapons_data = json.load(f)

# 이미지 폴더 생성
os.makedirs('public/images/characters', exist_ok=True)
os.makedirs('public/images/weapons', exist_ok=True)

# 캐릭터 이미지 다운로드
print("캐릭터 이미지 다운로드 중...")
for character in characters_data['characters']:
    char_id = character['id']
    char_name = character['name']
    
    # 캐릭터 ID에서 URL용 이름 생성 (첫 글자만 대문자)
    url_name = ''.join(word.capitalize() for word in char_id.split('_'))
    image_url = f"https://gi.yatta.moe/assets/UI/UI_AvatarIcon_{url_name}.png"
    file_path = f"public/images/characters/{char_id}.png"
    
    try:
        if not os.path.exists(file_path):
            urllib.request.urlretrieve(image_url, file_path)
            print(f"✓ {char_name} ({char_id})")
        else:
            print(f"⊘ {char_name} (이미 존재함)")
    except Exception as e:
        print(f"✗ {char_name}: {str(e)}")

# 무기 이미지 다운로드
print("\n무기 이미지 다운로드 중...")
for weapon in weapons_data['weapons']:
    weapon_id = weapon['id']
    weapon_name = weapon['name']
    
    # 무기 ID에서 URL용 이름 생성
    url_name = '_'.join(part.capitalize() for part in weapon_id.replace('sword_', '').replace('claymore_', '').replace('polearm_', '').replace('catalyst_', '').replace('bow_', '').split('_'))
    
    # 무기 타입 추가
    if weapon_id.startswith('sword_'):
        weapon_type = 'Sword'
        base_name = weapon_id.replace('sword_', '')
    elif weapon_id.startswith('claymore_'):
        weapon_type = 'Claymore'
        base_name = weapon_id.replace('claymore_', '')
    elif weapon_id.startswith('polearm_'):
        weapon_type = 'Pole'
        base_name = weapon_id.replace('polearm_', '')
    elif weapon_id.startswith('catalyst_'):
        weapon_type = 'Catalyst'
        base_name = weapon_id.replace('catalyst_', '')
    else:  # bow
        weapon_type = 'Bow'
        base_name = weapon_id.replace('bow_', '')
    
    # URL 이름 생성 (camelCase → CamelCase)
    url_name = ''.join(word.capitalize() for word in base_name.split('_'))
    
    # gi.yatta.moe URL 패턴 추측 (정확하지 않을 수 있음)
    image_url = f"https://gi.yatta.moe/assets/UI/UI_EquipIcon_{weapon_type}_{url_name}.png"
    file_path = f"public/images/weapons/{weapon_id}.png"
    
    try:
        if not os.path.exists(file_path):
            urllib.request.urlretrieve(image_url, file_path)
            print(f"✓ {weapon_name} ({weapon_id})")
        else:
            print(f"⊘ {weapon_name} (이미 존재함)")
    except Exception as e:
        print(f"✗ {weapon_name}: {str(e)}")

print("\n✅ 다운로드 완료!")
