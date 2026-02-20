﻿import React, { useState, useMemo, useEffect } from 'react';
import type { Character, Weapon } from '../types.ts';
import { useAppContext } from '../context/AppContext';
import { useSelectionModal } from '../context/SelectionModalContext';
import { getSelectedCharacterIds, findCharacter } from '../utils/helpers';
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
  // 모달 내에서 방금 선택한 캐릭터를 추적 (dispatch 비동기 문제 해결)
  const [localSelectedCharacter, setLocalSelectedCharacter] = useState<Character | null>(null);

  // 현재 슬롯에서 선택된 캐릭터 가져오기 (기존 선택된 캐릭터)
  const currentSlot = modal.partyNumber === 1 
    ? state.party1[modal.slotIndex] 
    : state.party2[modal.slotIndex];
  const existingCharacter = useMemo(
    () => findCharacter(currentSlot?.characterId, characters),
    [currentSlot?.characterId, characters]
  );

  // 실제 사용할 캐릭터: 로컬에서 방금 선택한 캐릭터 우선, 없으면 기존 선택된 캐릭터
  const selectedCharacter = localSelectedCharacter || existingCharacter;

  useEffect(() => {
    if (modal.isOpen) {
      setActiveTab(modal.selectionMode);
      setSearchQuery('');
      setLocalSelectedCharacter(null); // 모달 열릴 때 로컬 선택 초기화
    }
  }, [modal.isOpen, modal.selectionMode]);

  // 탭 변경 시 검색어 초기화
  useEffect(() => {
    setSearchQuery('');
  }, [activeTab]);

  const selectedCharacterIds = useMemo(() => getSelectedCharacterIds(state), [state]);

  // 무기 타입별 필터링 + 검색 필터링
  const filteredItems = useMemo(() => {
    let items: (Character | Weapon)[] = activeTab === 'character' ? characters : weapons;
    
    // 무기 탭일 때: 선택된 캐릭터의 무기 타입으로 필터링
    if (activeTab === 'weapon' && selectedCharacter?.weaponType) {
      items = (items as Weapon[]).filter(w => w.weaponType === selectedCharacter.weaponType);
    }
    
    // 검색어 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      items = items.filter(item => item.name.toLowerCase().includes(query));
    }
    
    return items;
  }, [activeTab, characters, weapons, searchQuery, selectedCharacter]);

  const handleItemSelect = (itemId: string) => {
    if (activeTab === 'character') {
      // 선택한 캐릭터를 로컬 state에 즉시 저장
      const selected = characters.find(c => c.id === itemId);
      if (selected) {
        setLocalSelectedCharacter(selected);
      }
      
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

  // 무기 타입 한글 이름
  const weaponTypeNames: Record<string, string> = {
    sword: '한손검',
    claymore: '대검',
    polearm: '장병기',
    bow: '활',
    catalyst: '법구',
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
          {activeTab === 'weapon' && selectedCharacter?.weaponType && (
            <span className="weapon-type-badge">
              {weaponTypeNames[selectedCharacter.weaponType] || selectedCharacter.weaponType}
            </span>
          )}
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

