import type { Character, Weapon, AppState } from '../types.ts';

/**
 * 이미지 경로에 BASE_URL 적용
 * @param path - 원본 경로 (예: /images/characters/...)
 * @returns BASE_URL이 적용된 경로
 */
export const getAssetPath = (path: string | undefined): string => {
  if (!path) return '';
  const base = import.meta.env.BASE_URL;
  // 경로가 /로 시작하면 제거 후 base와 결합
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${cleanPath}`;
};

/**
 * 캐릭터 ID로 캐릭터 객체 찾기
 * @param characterId - 캐릭터 ID
 * @param characters - 모든 캐릭터 배열
 * @returns 찾은 캐릭터 또는 undefined
 */
export const findCharacter = (
  characterId: string | undefined,
  characters: Character[]
): Character | undefined => {
  if (!characterId) return undefined;
  return characters.find(c => c.id === characterId);
};

/**
 * 무기 ID로 무기 객체 찾기
 * @param weaponId - 무기 ID
 * @param weapons - 모든 무기 배열
 * @returns 찾은 무기 또는 undefined
 */
export const findWeapon = (
  weaponId: string | undefined,
  weapons: Weapon[]
): Weapon | undefined => {
  if (!weaponId) return undefined;
  return weapons.find(w => w.id === weaponId);
};

/**
 * 현재 선택된 모든 캐릭터 ID 조회
 * @param state - 앱 상태
 * @returns 선택된 캐릭터 ID 배열
 */
export const getSelectedCharacterIds = (state: AppState): string[] => {
  const ids: string[] = [];
  
  [...state.party1, ...state.party2].forEach(slot => {
    if (slot.characterId) {
      ids.push(slot.characterId);
    }
  });
  
  return ids;
};

/**
 * 특정 캐릭터가 이미 선택되었는지 확인
 * @param characterId - 확인할 캐릭터 ID
 * @param state - 앱 상태
 * @param currentPartyNumber - 현재 파티 번호 (1 또는 2)
 * @param currentSlotIndex - 현재 슬롯 인덱스
 * @returns 이미 선택된 경우 true
 */
export const isCharacterAlreadySelected = (
  characterId: string,
  state: AppState,
  currentPartyNumber: number,
  currentSlotIndex: number
): boolean => {
  // 전체 파티에서 확인
  const allSlots = [...state.party1, ...state.party2];

  // 현재 슬롯 제외하고 확인
  let slotCount = 0;
  for (const slot of allSlots) {
    const isCurrentSlot =
      (currentPartyNumber === 1 && slotCount === currentSlotIndex) ||
      (currentPartyNumber === 2 && slotCount === 4 + currentSlotIndex);

    if (!isCurrentSlot && slot.characterId === characterId) {
      return true;
    }
    slotCount++;
  }

  return false;
};

/**
 * 현재 선택된 모든 무기 ID 조회
 * @param state - 앱 상태
 * @returns 선택된 무기 ID 배열
 */
export const getSelectedWeaponIds = (state: AppState): string[] => {
  const ids: string[] = [];
  
  [...state.party1, ...state.party2].forEach(slot => {
    if (slot.weaponId) {
      ids.push(slot.weaponId);
    }
  });
  
  return ids;
};

/**
 * 특정 무기가 이미 선택되었는지 확인
 * @param weaponId - 확인할 무기 ID
 * @param state - 앱 상태
 * @returns 이미 선택된 경우 true
 */
export const isWeaponAlreadySelected = (
  weaponId: string,
  state: AppState
): boolean => {
  const allSlots = [...state.party1, ...state.party2];
  return allSlots.some(slot => slot.weaponId === weaponId);
};

/**
 * 초기 파티 슬롯 배열 생성 (4개 슬롯)
 * @returns 초기 슬롯 배열
 */
export const createEmptyParty = () => {
  return Array(4).fill(null).map(() => ({
    characterId: undefined,
    constellationLevel: 0,
    weaponId: undefined,
    refineLevel: 1,
  }));
};

/**
 * 초기 앱 상태 생성
 * @returns 초기 상태
 */
export const createInitialAppState = (): AppState => {
  return {
    party1: createEmptyParty(),
    party2: createEmptyParty(),
  };
};
