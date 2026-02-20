import json

# character-info.json 로드
with open('public/data/character-info.json', 'r', encoding='utf-8') as f:
    char_info = json.load(f)['characterInfo']

# 계산 규칙 정의
def calculate_character_cost(char_id, char_data):
    """캐릭터의 기본 코스트와 돌파별 보너스 계산"""
    
    # 기본 코스트 결정
    if 'baselineCost' in char_data:
        baseline = char_data['baselineCost']
    elif char_data['rarity'] == 5:
        # 5성 한정캐: 버전에 따라 결정
        version = char_data.get('version')
        if version == 1:  # 몬드
            baseline = 1
        elif version == 2:  # 리월
            baseline = 2
        elif version == 3:  # 이나즈마
            baseline = 3
        elif version == 4:  # 수메르
            baseline = 4
        elif version == 5:  # 폰타인
            baseline = 4
        elif version == 6:  # 나타/노드크라이
            baseline = 5
        else:
            baseline = 1
    else:  # 4성
        baseline = 0
    
    # 돌파 보너스 결정
    version = char_data.get('version')
    is_recent = version in [5, 6]  # 나타, 노드크라이
    
    if is_recent:
        bonus_pattern = [0, 2, 2, 0.7, 2, 0.7, 2]  # 0,1,2,3,4,5,6돌
    else:
        bonus_pattern = [0, 1, 1, 0.5, 1, 0.5, 1]  # 0,1,2,3,4,5,6돌
    
    # 각 돌파 레벨별 코스트 계산
    constellation_costs = []
    for i in range(7):
        cost = baseline + bonus_pattern[i]
        constellation_costs.append(cost)
    
    return constellation_costs

# 모든 캐릭터의 코스트 계산
costs = {"characters": {}}

for char_id, info in char_info.items():
    costs["characters"][char_id] = {
        "constellation": calculate_character_cost(char_id, info)
    }

# 무기 코스트 (상시)
costs["weapons"] = {
    "default": {
        "refine": [0, 1, 1.3, 1.6, 1.9, 2.2]  # 상시 5성, 4성은 0
    }
}

# 기본값
costs["defaultCharacterCosts"] = {"constellation": [0, 1, 1, 0.5, 1, 0.5, 1]}
costs["defaultWeaponCosts"] = {"refine": [0, 1, 1.3, 1.6, 1.9, 2.2]}

# 저장
with open('public/data/costs.json', 'w', encoding='utf-8') as f:
    json.dump(costs, f, ensure_ascii=False, indent=2)

print("✅ costs.json 자동 계산 완료!")
print(f"   - 캐릭터 {len(costs['characters'])}명 처리됨")
print("\n샘플 결과:")
print(f"  venti (4코스트, 몬드): {costs['characters']['venti']['constellation']}")
print(f"  klee (3코스트, 몬드): {costs['characters']['klee']['constellation']}")
print(f"  albedo (2코스트, 몬드): {costs['characters']['albedo']['constellation']}")
print(f"  tartaglia (1코스트, 리월): {costs['characters']['tartaglia']['constellation']}")
print(f"  mona (2코스트, 상시): {costs['characters']['mona']['constellation']}")
