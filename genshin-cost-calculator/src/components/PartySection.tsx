import React, { useMemo } from 'react';
import type { PartySlot, Character, Weapon, CostData } from '../types.ts';
import { calculatePartyCost, formatCost } from '../utils/cost-calculator';
import PartySlotCard from './PartySlotCard';
import '../styles/PartySection.css';

interface PartySectionProps {
  partyNumber: number;
  slots: PartySlot[];
  characters: Character[];
  weapons: Weapon[];
  costs: CostData;
  costsRaw?: any;
}

const PartySection: React.FC<PartySectionProps> = ({
  partyNumber,
  slots,
  characters,
  weapons,
  costs,
  costsRaw,
}) => {
  const partyCost = useMemo(
    () => calculatePartyCost(slots, characters, weapons, costsRaw || costs),
    [slots, characters, weapons, costsRaw, costs]
  );

  return (
    <div className="party-section">
      <h2 className="party-title">파티 {partyNumber}</h2>
      
      <div className="party-slots-grid">
        {slots.map((slot, index) => (
          <PartySlotCard
            key={index}
            slot={slot}
            slotIndex={index}
            partyNumber={partyNumber}
            characters={characters}
            weapons={weapons}
            costs={costs}
            costsRaw={costsRaw}
          />
        ))}
      </div>

      <div className="party-cost-summary">
        <span className="party-cost-label">파티 {partyNumber} 코스트:</span>
        <span className="party-cost-value">{formatCost(partyCost)}</span>
      </div>
    </div>
  );
};

export default PartySection;
