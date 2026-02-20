import React, { useMemo } from 'react';
import type { Character, Weapon, CostData, PartySlot } from '../types.ts';
import { calculateTotalCost, formatCost } from '../utils/cost-calculator';
import '../styles/TotalCostPanel.css';

interface TotalCostPanelProps {
  party1: PartySlot[];
  party2: PartySlot[];
  characters: Character[];
  weapons: Weapon[];
  costs: CostData;
  costsRaw?: any;
}

const TotalCostPanel: React.FC<TotalCostPanelProps> = ({
  party1,
  party2,
  characters,
  weapons,
  costs,
  costsRaw,
}) => {
  const totalCost = useMemo(
    () => calculateTotalCost(party1, party2, characters, weapons, costsRaw || costs),
    [party1, party2, characters, weapons, costsRaw, costs]
  );

  return (
    <div className="total-cost-panel">
      <h2>총 코스트</h2>
      <div className="total-cost-value">{formatCost(totalCost)}</div>
    </div>
  );
};

export default TotalCostPanel;
