import React, { useState, useMemo, useEffect } from 'react';
import type { Character, Weapon } from '../types.ts';
import { useAppContext } from '../context/AppContext';
import { useSelectionModal } from '../context/SelectionModalContext';
import { getSelectedCharacterIds } from '../utils/helpers';
import TabNav from './TabNav';
import ItemGrid from './ItemGrid';
import '../styles/SelectionModal.css';

interface SelectionModalProps {
  characters: Character[];
  weapons: Weapon[];
}

const SelectionModal: React.FC<SelectionModalProps> = ({ characters, weapons }) => {
  const { state, dispatch } = useAppContext();
  const { modal, closeModal } = useSelectionModal();
  const [activeTab, setActiveTab] = useState<'character' | 'weapon'>(modal.selectionMode);

  useEffect(() => {
    if (modal.isOpen) {
      setActiveTab(modal.selectionMode);
    }
  }, [modal.isOpen, modal.selectionMode]);

  const selectedCharacterIds = useMemo(() => getSelectedCharacterIds(state), [state]);

  const handleItemSelect = (itemId: string) => {
    if (activeTab === 'character') {
      dispatch({
        type: 'SELECT_CHARACTER',
        partyNumber: modal.partyNumber,
        slotIndex: modal.slotIndex,
        characterId: itemId,
      });
      // 캐릭터 선택 후 무기 탭으로 이동(모달 유지)
      setActiveTab('weapon');
      return;
    }

    dispatch({
      type: 'SELECT_WEAPON',
      partyNumber: modal.partyNumber,
      slotIndex: modal.slotIndex,
      weaponId: itemId,
    });
    closeModal();
  };

  const handleTabChange = (tab: 'character' | 'weapon') => {
    setActiveTab(tab);
  };

  const itemsToDisplay = activeTab === 'character' ? characters : weapons;

  if (!modal.isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={closeModal}>×</button>

        <h2 className="modal-title">
          {activeTab === 'character' ? '캐릭터 선택' : '무기 선택'}
        </h2>

        <TabNav activeTab={activeTab} onTabChange={handleTabChange} />

        <div className="modal-grid-wrapper">
          <ItemGrid
            items={itemsToDisplay}
            selectionMode={activeTab}
            selectedCharacterIds={selectedCharacterIds}
            onItemSelect={handleItemSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default SelectionModal;

