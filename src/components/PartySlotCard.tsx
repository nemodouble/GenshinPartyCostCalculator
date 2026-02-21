import React, { useMemo } from 'react';
import type { PartySlot, Character, Weapon, CostData } from '../types.ts';
import { findCharacter, findWeapon, getAssetPath } from '../utils/helpers';
import { calculateSlotCost, formatCost } from '../utils/cost-calculator';
import { useAppContext } from '../context/AppContext';
import { useSelectionModal } from '../context/SelectionModalContext';
import '../styles/PartySlotCard.css';

interface PartySlotCardProps {
  slot: PartySlot;
  slotIndex: number;
  partyNumber: number;
  characters: Character[];
  weapons: Weapon[];
  costs: CostData;
  costsRaw?: any;
}

const PartySlotCard: React.FC<PartySlotCardProps> = ({
  slot,
  slotIndex,
  partyNumber,
  characters,
  weapons,
  costs,
  costsRaw,
}) => {
  const { dispatch } = useAppContext();
  const { openCharacterSelection } = useSelectionModal();
  const character = useMemo(
    () => findCharacter(slot.characterId, characters),
    [slot.characterId, characters]
  );
  const weapon = useMemo(
    () => findWeapon(slot.weaponId, weapons),
    [slot.weaponId, weapons]
  );
  const slotCost = useMemo(
    () => calculateSlotCost(slot, characters, weapons, costsRaw || costs),
    [slot, characters, weapons, costsRaw, costs]
  );

  const isActive = !!character;

  const characterRarityClass = character?.rarity === 5 ? 'rarity-5' : character?.rarity === 4 ? 'rarity-4' : character?.rarity === 3 ? 'rarity-3' : '';
  const weaponRarityClass = weapon?.rarity === 5 ? 'rarity-5' : weapon?.rarity === 4 ? 'rarity-4' : weapon?.rarity === 3 ? 'rarity-3' : '';

  const handleConstellationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: 'SET_CONSTELLATION_LEVEL',
      partyNumber,
      slotIndex,
      level: parseInt(e.target.value),
    });
  };

  const handleRefineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: 'SET_REFINE_LEVEL',
      partyNumber,
      slotIndex,
      level: parseInt(e.target.value),
    });
  };

  const handleReset = () => {
    dispatch({
      type: 'RESET_SLOT',
      partyNumber,
      slotIndex,
    });
  };

  return (
    <div className={`party-slot-card ${isActive ? 'active' : 'inactive'}`}>
      {!isActive ? (
        <div
          className="slot-content-empty"
          onClick={() => openCharacterSelection(partyNumber, slotIndex)}
        >
          <div className="empty-icon">+</div>
          <div className="empty-text">선택</div>
        </div>
      ) : (
        <div className="slot-content-active">
          {/* 캐릭터 정보 */}
          <div className="character-section">
            <img
              src={getAssetPath(character?.icon)}
              alt={character?.name}
              className={`character-icon ${characterRarityClass}`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = getAssetPath('/placeholder.png');
              }}
            />
            <div className="character-info">
              <h4 className="character-name">{character?.name}</h4>
              <div className="control-group">
                <label>돌파:</label>
                <select
                  value={slot.constellationLevel}
                  onChange={handleConstellationChange}
                  className="select-dropdown"
                >
                  {[0, 1, 2, 3, 4, 5, 6].map(level => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 무기 정보 */}
          <div className="weapon-section">
            <img
              src={getAssetPath(weapon?.icon)}
              alt={weapon?.name}
              className={`weapon-icon ${weaponRarityClass}`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = getAssetPath('/placeholder.png');
              }}
            />
            <div className="weapon-info">
              <h5 className="weapon-name">{weapon?.name || '무기 선택 안 함'}</h5>
              {weapon && (
                <div className="control-group">
                  <label>무기돌파:</label>
                  <select
                    value={slot.refineLevel}
                    onChange={handleRefineChange}
                    className="select-dropdown"
                  >
                    {[1, 2, 3, 4, 5].map(level => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* 코스트 및 초기화 */}
          <div className="cost-section">
            <div className="cost-display">
              코스트: <span className="cost-value">{formatCost(slotCost)}</span>
            </div>
            <button className="reset-slot-btn" onClick={handleReset}>
              초기화
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartySlotCard;
