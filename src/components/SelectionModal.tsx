﻿import React, { useState, useMemo, useEffect } from 'react';
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
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (modal.isOpen) {
      setActiveTab(modal.selectionMode);
      setSearchQuery(''); // 모달 열릴 때 검색어 초기화
    }
  }, [modal.isOpen, modal.selectionMode]);

  // 탭 변경 시 검색어 초기화
  useEffect(() => {
    setSearchQuery('');
  }, [activeTab]);

  const selectedCharacterIds = useMemo(() => getSelectedCharacterIds(state), [state]);

  // 검색 필터링
  const filteredItems = useMemo(() => {
    const items = activeTab === 'character' ? characters : weapons;
    if (!searchQuery.trim()) return items;
    
    const query = searchQuery.toLowerCase().trim();
    return items.filter(item => 
      item.name.toLowerCase().includes(query)
    );
  }, [activeTab, characters, weapons, searchQuery]);

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

        {/* 검색창 */}
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder={activeTab === 'character' ? '캐릭터 검색...' : '무기 검색...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          {searchQuery && (
            <button 
              className="search-clear" 
              onClick={() => setSearchQuery('')}
              type="button"
            >
              ×
            </button>
          )}
        </div>

        <div className="modal-grid-wrapper">
          <ItemGrid
            items={filteredItems}
            selectionMode={activeTab}
            selectedCharacterIds={selectedCharacterIds}
            onItemSelect={handleItemSelect}
          />
          {filteredItems.length === 0 && (
            <div className="no-results">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectionModal;

