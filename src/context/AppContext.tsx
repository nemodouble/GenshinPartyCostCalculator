﻿﻿import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AppState } from '../types.ts';
import { createInitialAppState } from '../utils/helpers';

const STORAGE_KEY = 'genshin-party-calculator-state';

/**
 * localStorage에서 상태 불러오기
 */
const loadStateFromStorage = (): AppState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.party1 && parsed.party2 && 
          Array.isArray(parsed.party1) && Array.isArray(parsed.party2) &&
          parsed.party1.length === 4 && parsed.party2.length === 4) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('저장된 파티 데이터를 불러오는데 실패했습니다:', e);
  }
  return createInitialAppState();
};

/**
 * localStorage에 상태 저장
 */
const saveStateToStorage = (state: AppState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('파티 데이터 저장에 실패했습니다:', e);
  }
};

/**
 * 액션 타입 정의
 */
export type AppAction =
  | { type: 'SELECT_CHARACTER'; partyNumber: number; slotIndex: number; characterId: string }
  | { type: 'SELECT_WEAPON'; partyNumber: number; slotIndex: number; weaponId: string }
  | { type: 'SET_CONSTELLATION_LEVEL'; partyNumber: number; slotIndex: number; level: number }
  | { type: 'SET_REFINE_LEVEL'; partyNumber: number; slotIndex: number; level: number }
  | { type: 'RESET_SLOT'; partyNumber: number; slotIndex: number }
  | { type: 'RESET_ALL' };

/**
 * 리듀서 함수
 */
const appReducer = (state: AppState, action: AppAction): AppState => {
  const party = action.type !== 'RESET_ALL' && 'partyNumber' in action
    ? action.partyNumber === 1 ? [...state.party1] : [...state.party2]
    : null;
  
  switch (action.type) {
    case 'SELECT_CHARACTER': {
      const newParty = party!;
      newParty[action.slotIndex] = {
        ...newParty[action.slotIndex],
        characterId: action.characterId,
        constellationLevel: 0, // 캐릭터 선택 시 돌파 레벨 초기화
      };
      return action.partyNumber === 1
        ? { ...state, party1: newParty }
        : { ...state, party2: newParty };
    }

    case 'SELECT_WEAPON': {
      const newParty = party!;
      newParty[action.slotIndex] = {
        ...newParty[action.slotIndex],
        weaponId: action.weaponId,
        refineLevel: 1, // 무기 선택 시 정련 레벨 1로 초기화 (무기는 1재~5재)
      };
      return action.partyNumber === 1
        ? { ...state, party1: newParty }
        : { ...state, party2: newParty };
    }

    case 'SET_CONSTELLATION_LEVEL': {
      const newParty = party!;
      newParty[action.slotIndex] = {
        ...newParty[action.slotIndex],
        constellationLevel: action.level,
      };
      return action.partyNumber === 1
        ? { ...state, party1: newParty }
        : { ...state, party2: newParty };
    }

    case 'SET_REFINE_LEVEL': {
      const newParty = party!;
      newParty[action.slotIndex] = {
        ...newParty[action.slotIndex],
        refineLevel: action.level,
      };
      return action.partyNumber === 1
        ? { ...state, party1: newParty }
        : { ...state, party2: newParty };
    }

    case 'RESET_SLOT': {
      const newParty = party!;
      newParty[action.slotIndex] = {
        characterId: undefined,
        constellationLevel: 0,
        weaponId: undefined,
        refineLevel: 1,
      };
      return action.partyNumber === 1
        ? { ...state, party1: newParty }
        : { ...state, party2: newParty };
    }

    case 'RESET_ALL': {
      return createInitialAppState();
    }

    default:
      return state;
  }
};

/**
 * Context 타입
 */
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

/**
 * AppContext 생성
 */
const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * AppProvider 컴포넌트
 */
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, null, loadStateFromStorage);

  // 상태가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    saveStateToStorage(state);
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

/**
 * AppContext 사용 커스텀 훅
 */
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
