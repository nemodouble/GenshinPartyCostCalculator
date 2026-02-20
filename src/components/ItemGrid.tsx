import React, { useMemo } from 'react';
import type { Character, Weapon } from '../types.ts';
import ItemCard from './ItemCard';
import '../styles/ItemGrid.css';

interface ItemGridProps {
  items: (Character | Weapon)[];
  selectionMode: 'character' | 'weapon';
  selectedCharacterIds: string[];
  onItemSelect: (itemId: string) => void;
}

const ItemGrid: React.FC<ItemGridProps> = ({
  items,
  selectionMode,
  selectedCharacterIds,
  onItemSelect,
}) => {
  // 캐릭터 선택 모드일 때만 중복 선택 방지
  const disabledIds = useMemo(() => {
    if (selectionMode === 'character') {
      return selectedCharacterIds;
    }
    return [];
  }, [selectionMode, selectedCharacterIds]);

  return (
    <div className="item-grid">
      {items.map(item => {
        const isDisabled = disabledIds.includes(item.id);
        return (
          <ItemCard
            key={item.id}
            icon={item.icon}
            name={item.name}
            rarity={item.rarity}
            isDisabled={isDisabled}
            onClick={() => onItemSelect(item.id)}
          />
        );
      })}
    </div>
  );
};

export default ItemGrid;
