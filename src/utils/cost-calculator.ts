import type { PartySlot, Character, Weapon } from '../types.ts';

/**
 * 슬롯 코스트 계산
 * @param slot - 파티 슬롯
 * @param characters - 모든 캐릭터 데이터
 * @param weapons - 모든 무기 데이터
 * @param costsRaw - 원본 코스트 데이터 (characterId -> constellation 배열)
 * @returns 슬롯의 총 코스트
 */
export const calculateSlotCost = (
  slot: PartySlot,
  _characters: unknown,
  _weapons: unknown,
  costsRaw: any
): number => {
  let totalCost = 0;

  // 캐릭터 코스트 계산
  const charactersCostMap = costsRaw?.characters;
  if (slot.characterId && charactersCostMap && typeof charactersCostMap === 'object') {
    const charCost = charactersCostMap[slot.characterId];
    const arr = charCost?.constellation;
    if (Array.isArray(arr)) {
      const cost = arr[slot.constellationLevel];
      if (typeof cost === 'number') totalCost += cost;
    }
  }

  // 무기 코스트 계산 (정련 1~5 -> 인덱스 0~4)
  const weaponsCostMap = costsRaw?.weapons;
  if (slot.weaponId && weaponsCostMap && typeof weaponsCostMap === 'object') {
    const weaponCost = weaponsCostMap[slot.weaponId];
    const arr = weaponCost?.refine;
    if (Array.isArray(arr)) {
      const refineIndex = slot.refineLevel - 1;
      const cost = arr[refineIndex];
      if (typeof cost === 'number') totalCost += cost;
    }
  }

  return totalCost;
};

/**
 * 파티 코스트 계산
 * @param party - 파티 슬롯 배열 (4개)
 * @param characters - 모든 캐릭터 데이터
 * @param weapons - 모든 무기 데이터
 * @param costsRaw - 원본 코스트 데이터
 * @returns 파티의 총 코스트
 */
export const calculatePartyCost = (
  party: PartySlot[],
  characters: Character[],
  weapons: Weapon[],
  costsRaw: any
): number => {
  return party.reduce((sum, slot) => {
    return sum + calculateSlotCost(slot, characters, weapons, costsRaw);
  }, 0);
};

/**
 * 전체 코스트 계산
 * @param party1 - 파티 1
 * @param party2 - 파티 2
 * @param characters - 모든 캐릭터 데이터
 * @param weapons - 모든 무기 데이터
 * @param costsRaw - 원본 코스트 데이터
 * @returns 전체 코스트
 */
export const calculateTotalCost = (
  party1: PartySlot[],
  party2: PartySlot[],
  characters: Character[],
  weapons: Weapon[],
  costsRaw: any
): number => {
  const party1Cost = calculatePartyCost(party1, characters, weapons, costsRaw);
  const party2Cost = calculatePartyCost(party2, characters, weapons, costsRaw);
  return party1Cost + party2Cost;
};

/**
 * 코스트를 보기 좋게 포맷팅 (천 단위 구분)
 * @param cost - 비용
 * @returns 포맷된 비용 문자열
 */
export const formatCost = (cost: number): string => {
  return cost.toLocaleString('ko-KR');
};
