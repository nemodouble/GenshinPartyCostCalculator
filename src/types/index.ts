export type WeaponType = 'sword' | 'claymore' | 'polearm' | 'bow' | 'catalyst';

export interface Character {
  id: string;
  name: string;
  icon: string;
  rarity?: number;
  weaponType?: WeaponType;
}

export interface Weapon {
  id: string;
  name: string;
  icon: string;
  rarity?: number;
  weaponType?: WeaponType;
}

export interface PartySlot {
  characterId?: string;
  constellationLevel: number;
  weaponId?: string;
  refineLevel: number;
}

export interface AppState {
  party1: PartySlot[];
  party2: PartySlot[];
}

export interface CostData {
  characterCosts: {
    constellation: number[];
  };
  weaponCosts: {
    refine: number[];
  };
}

export interface SelectionModalState {
  isOpen: boolean;
  slotIndex: number;
  partyNumber: number;
  selectionMode: 'character' | 'weapon';
}
