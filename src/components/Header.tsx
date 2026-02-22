import React from 'react';
import { useAppContext } from '../context/AppContext';
import CaptureDownload from './CaptureDownload';
import type { PartySlot, Character, Weapon, CostData } from '../types';
import '../styles/Header.css';

interface HeaderProps {
  party1: PartySlot[];
  party2: PartySlot[];
  characters: Character[];
  weapons: Weapon[];
  costs: CostData;
  costsRaw?: any;
}

const Header: React.FC<HeaderProps> = ({
  party1,
  party2,
  characters,
  weapons,
  costs,
  costsRaw,
}) => {
  const { dispatch } = useAppContext();

  const handleResetAll = () => {
    if (window.confirm('모든 파티를 초기화하시겠습니까?')) {
      dispatch({ type: 'RESET_ALL' });
    }
  };

  return (
    <header className="header">
      <h1>원신 파티 코스트 계산기</h1>
      <div className="header-buttons">
        <CaptureDownload
          party1={party1}
          party2={party2}
          characters={characters}
          weapons={weapons}
          costs={costs}
          costsRaw={costsRaw}
        />
        <button className="reset-all-btn" onClick={handleResetAll}>
          전체 초기화
        </button>
      </div>
    </header>
  );
};

export default Header;
