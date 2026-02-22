import { useEffect, useState } from 'react';
import type { Character, Weapon, CostData } from './types.ts';
import { AppProvider, useAppContext } from './context/AppContext';
import { SelectionModalProvider } from './context/SelectionModalContext';
import Header from './components/Header';
import PartySection from './components/PartySection';
import TotalCostPanel from './components/TotalCostPanel';
import SelectionModal from './components/SelectionModal';
import './App.css';

// 원신 파티 코스트 계산기 v1.0

const AppContent = () => {
  const { state } = useAppContext();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [costs, setCosts] = useState<CostData | null>(null);
  const [costsRaw, setCostsRaw] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const base = import.meta.env.BASE_URL;
        const [charactersRes, weaponsRes, costsRes, charInfoRes, weaponInfoRes] = await Promise.all([
          fetch(`${base}data/characters.json`),
          fetch(`${base}data/weapons.json`),
          fetch(`${base}data/costs.json`),
          fetch(`${base}data/character-info.json`),
          fetch(`${base}data/weapon-info.json`),
        ]);

        if (!charactersRes.ok || !weaponsRes.ok || !costsRes.ok || !charInfoRes.ok || !weaponInfoRes.ok) {
          throw new Error('Failed to load data files');
        }

        const charactersData = await charactersRes.json();
        const weaponsData = await weaponsRes.json();
        const costsRawData = await costsRes.json();
        const charInfoData = await charInfoRes.json();
        const weaponInfoData = await weaponInfoRes.json();

        const characterInfo = charInfoData.characterInfo || {};
        const weaponInfo = weaponInfoData.weaponInfo || {};

        // 무기 ID에서 weaponType 추출하는 헬퍼 함수
        const getWeaponTypeFromId = (id: string): string | undefined => {
          if (id.startsWith('sword_')) return 'sword';
          if (id.startsWith('claymore_')) return 'claymore';
          if (id.startsWith('polearm_')) return 'polearm';
          if (id.startsWith('catalyst_')) return 'catalyst';
          if (id.startsWith('bow_')) return 'bow';
          return undefined;
        };

        const charactersWithRarity = (charactersData.characters || []).map((c: Character) => ({
          ...c,
          rarity: characterInfo[c.id]?.rarity,
          weaponType: characterInfo[c.id]?.weaponType,
        }));

        const weaponsWithRarity = (weaponsData.weapons || []).map((w: Weapon) => ({
          ...w,
          rarity: weaponInfo[w.id]?.rarity,
          weaponType: getWeaponTypeFromId(w.id),
        }));

        // 비용 데이터 변환
        const transformedCosts: CostData = {
          characterCosts: {
            constellation: [0, 0, 0, 0, 0, 0, 0],
          },
          weaponCosts: {
            refine: costsRawData.weapons || [0, 0.3, 0.3, 0.3, 0.3],
          },
        };

        setCharacters(charactersWithRarity);
        setWeapons(weaponsWithRarity);
        setCosts(transformedCosts);
        setCostsRaw(costsRawData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="loading">데이터를 로딩 중입니다...</div>;
  }

  if (error) {
    return <div className="error">오류: {error}</div>;
  }

  if (!costs) {
    return <div className="error">코스트 데이터를 불러올 수 없습니다</div>;
  }

  return (
    <div className="app">
      <Header 
        party1={state.party1}
        party2={state.party2}
        characters={characters}
        weapons={weapons}
        costs={costs}
        costsRaw={costsRaw}
      />
      <main className="app-main">
        <PartySection
          partyNumber={1}
          slots={state.party1}
          characters={characters}
          weapons={weapons}
          costs={costs}
          costsRaw={costsRaw}
        />
        <PartySection
          partyNumber={2}
          slots={state.party2}
          characters={characters}
          weapons={weapons}
          costs={costs}
          costsRaw={costsRaw}
        />
        <TotalCostPanel
          party1={state.party1}
          party2={state.party2}
          characters={characters}
          weapons={weapons}
          costs={costs}
          costsRaw={costsRaw}
        />
      </main>
      <SelectionModal characters={characters} weapons={weapons} />
      <footer className="app-footer">
        <p className="disclaimer">
          본 프로젝트는 HoYoverse와 연관이 없습니다.<br />
          Genshin Impact, 게임의 콘텐츠와 소재의 트레이드마크와 저작권은 HoYoverse에 있습니다.
        </p>
      </footer>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <SelectionModalProvider>
        <AppContent />
      </SelectionModalProvider>
    </AppProvider>
  );
}

export default App;
