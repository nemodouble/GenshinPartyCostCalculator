import json

# character-info.json 로드
with open('public/data/character-info.json', 'r', encoding='utf-8') as f:
    char_info = json.load(f)['characterInfo']

def calculate_character_cost(char_id, char_data):
    """
    캐릭터 코스트 계산
    
    규칙:
    5성 한정캐:
    - 몬드 (v1): 1
    - 리월 (v2): 2
    - 이나즈마 (v3): 3
    - 수메르 (v4): 4
    - 폰타인 (v5): 4
    - 나타 (v6): 5
    - 노드크라이 (v6): 6
    예외: 벤티(4), 클레(3), 알베도(2)
    
    5성 상시:
    - 타이나리, 모나: 2
    - 다이루크, 각청, 진: 1
    - 미즈키, 치치: 0
    
    4성:
    - 베넷, 일루가, 아이노, 피슬: 2
    - 향릉, 슈브르즈, 가밍, 행추, 시노부, 연비, 파루잔, 설탕: 1
    - 나머지: 0
    
    돌파 보너스:
    - 나타/노드크라이 5성: 1,2,4,6돌 +2 / 3,5돌 +0.7
    - 나머지 5성: 1,2,4,6돌 +1 / 3,5돌 +0.5
    - 4성: 1,2,4,6돌 +0.2 / 3,5돌 +0.1
    """
    
    rarity = char_data['rarity']
    
    # 기본 코스트 결정
    if 'baselineCost' in char_data:
        baseline = char_data['baselineCost']
    elif rarity == 5:
        version = char_data.get('version')
        if version == 1:
            baseline = 1
        elif version == 2:
            baseline = 2
        elif version == 3:
            baseline = 3
        elif version == 4:
            baseline = 4
        elif version == 5:
            baseline = 4
        elif version == 6:
            baseline = 5  # 나타는 5
        else:
            baseline = 1
    else:  # 4성
        baseline = 0
    
    # 돌파 보너스 패턴
    is_recent_5star = char_data.get('version') == 6  # 나타/노드크라이
    
    if rarity == 5:
        if is_recent_5star:
            bonus_pattern = [0, 2, 2, 0.7, 2, 0.7, 2]
        else:
            bonus_pattern = [0, 1, 1, 0.5, 1, 0.5, 1]
    else:  # 4성
        bonus_pattern = [0, 0.2, 0.2, 0.1, 0.2, 0.1, 0.2]
    
    # 각 돌파별 코스트 계산
    constellation_costs = []
    for i in range(7):
        cost = baseline + bonus_pattern[i]
        # 반올림하여 정수 또는 소수점 1자리
        cost = round(cost, 1)
        constellation_costs.append(cost)
    
    return constellation_costs

# 모든 캐릭터의 코스트 계산
costs = {"characters": {}}

for char_id, info in char_info.items():
    costs["characters"][char_id] = {
        "constellation": calculate_character_cost(char_id, info)
    }

# 무기 코스트
costs["weapons"] = {
    "default": {
        "refine": [0, 1, 1.3, 1.6, 1.9, 2.2]
    }
}

# 기본값
costs["defaultCharacterCosts"] = {"constellation": [0, 0.2, 0.2, 0.1, 0.2, 0.1, 0.2]}
costs["defaultWeaponCosts"] = {"refine": [0, 1, 1.3, 1.6, 1.9, 2.2]}

# 저장
with open('public/data/costs.json', 'w', encoding='utf-8') as f:
    json.dump(costs, f, ensure_ascii=False, indent=2)

print("✅ costs.json 재조정 완료!")
print(f"\n샘플 결과:")
print(f"  venti (4코스트, 몬드): {costs['characters']['venti']['constellation']}")
print(f"  klee (3코스트, 몬드): {costs['characters']['klee']['constellation']}")
print(f"  albedo (2코스트, 몬드): {costs['characters']['albedo']['constellation']}")
print(f"  tartaglia (1코스트, 리월): {costs['characters']['tartaglia']['constellation']}")
print(f"  mona (2코스트, 상시): {costs['characters']['mona']['constellation']}")
print(f"  keqing (1코스트, 상시): {costs['characters']['keqing']['constellation']}")
print(f"  qiqi (0코스트, 상시): {costs['characters']['qiqi']['constellation']}")
print(f"  bennett (2코스트, 4성): {costs['characters']['bennett']['constellation']}")
print(f"  noelle (0코스트, 4성): {costs['characters']['noelle']['constellation']}")
