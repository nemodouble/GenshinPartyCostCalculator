import React from 'react';
import { useAppContext } from '../context/AppContext';
import '../styles/Header.css';

const Header: React.FC = () => {
  const { dispatch } = useAppContext();

  const handleResetAll = () => {
    if (window.confirm('모든 파티를 초기화하시겠습니까?')) {
      dispatch({ type: 'RESET_ALL' });
    }
  };

  return (
    <header className="header">
      <h1>원신 파티 코스트 계산기</h1>
      <button className="reset-all-btn" onClick={handleResetAll}>
        전체 초기화
      </button>
    </header>
  );
};

export default Header;
