import React from 'react';
import { getAssetPath } from '../utils/helpers';
import '../styles/ItemCard.css';

interface ItemCardProps {
  icon: string;
  name: string;
  isSelected?: boolean;
  isDisabled?: boolean;
  rarity?: number;
  onClick: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({
  icon,
  name,
  isSelected = false,
  isDisabled = false,
  rarity,
  onClick,
}) => {
  const rarityClass = rarity === 5 ? 'rarity-5' : rarity === 4 ? 'rarity-4' : rarity === 3 ? 'rarity-3' : '';

  return (
    <div
      className={`item-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
      onClick={() => !isDisabled && onClick()}
      title={name}
    >
      <div className={`item-icon-wrapper ${rarityClass}`}>
        <img
          src={getAssetPath(icon)}
          alt={name}
          className="item-icon"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getAssetPath('/placeholder.png');
          }}
        />
        {isSelected && <div className="selected-badge">✓</div>}
        {isDisabled && <div className="disabled-overlay"></div>}
      </div>
      <div className="item-name">{name}</div>
    </div>
  );
};

export default ItemCard;
