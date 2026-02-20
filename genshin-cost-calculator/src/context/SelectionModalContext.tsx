import React, { createContext, useContext, useState, type ReactNode } from 'react';

/**
 * 선택 모달 상태
 */
export interface SelectionModalState {
  isOpen: boolean;
  partyNumber: number; // 1 또는 2
  slotIndex: number; // 0~3
  selectionMode: 'character' | 'weapon'; // 캐릭터 선택인지 무기 선택인지
}

interface SelectionModalContextType {
  modal: SelectionModalState;
  openCharacterSelection: (partyNumber: number, slotIndex: number) => void;
  openWeaponSelection: (partyNumber: number, slotIndex: number) => void;
  closeModal: () => void;
}

const SelectionModalContext = createContext<SelectionModalContextType | undefined>(undefined);

const INITIAL_STATE: SelectionModalState = {
  isOpen: false,
  partyNumber: 1,
  slotIndex: 0,
  selectionMode: 'character',
};

/**
 * SelectionModalProvider 컴포넌트
 */
export const SelectionModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modal, setModal] = useState<SelectionModalState>(INITIAL_STATE);

  const openCharacterSelection = (partyNumber: number, slotIndex: number) => {
    setModal({
      isOpen: true,
      partyNumber,
      slotIndex,
      selectionMode: 'character',
    });
  };

  const openWeaponSelection = (partyNumber: number, slotIndex: number) => {
    setModal({
      isOpen: true,
      partyNumber,
      slotIndex,
      selectionMode: 'weapon',
    });
  };

  const closeModal = () => {
    setModal(INITIAL_STATE);
  };

  return (
    <SelectionModalContext.Provider
      value={{ modal, openCharacterSelection, openWeaponSelection, closeModal }}
    >
      {children}
    </SelectionModalContext.Provider>
  );
};

/**
 * SelectionModalContext 사용 커스텀 훅
 */
export const useSelectionModal = () => {
  const context = useContext(SelectionModalContext);
  if (!context) {
    throw new Error('useSelectionModal must be used within SelectionModalProvider');
  }
  return context;
};
