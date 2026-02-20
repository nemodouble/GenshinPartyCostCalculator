import React from 'react';
import '../styles/TabNav.css';

interface TabNavProps {
  activeTab: 'character' | 'weapon';
  onTabChange?: (tab: 'character' | 'weapon') => void;
}

const TabNav: React.FC<TabNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="tab-nav">
      <button
        type="button"
        className={`tab-btn ${activeTab === 'character' ? 'active' : ''}`}
        onClick={() => onTabChange?.('character')}
      >
        캐릭터
      </button>
      <button
        type="button"
        className={`tab-btn ${activeTab === 'weapon' ? 'active' : ''}`}
        onClick={() => onTabChange?.('weapon')}
      >
        무기
      </button>
    </div>
  );
};

export default TabNav;
