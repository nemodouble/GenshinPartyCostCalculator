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
        const [charactersRes, weaponsRes, costsRes, charInfoRes, weaponInfoRes] = await Promise.all([
          fetch('/data/characters.json'),
          fetch('/data/weapons.json'),
          fetch('/data/costs.json'),
          fetch('/data/character-info.json'),
          fetch('/data/weapon-info.json'),
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

        const charactersWithRarity = (charactersData.characters || []).map((c: Character) => ({
          ...c,
          rarity: characterInfo[c.id]?.rarity,
        }));

        const weaponsWithRarity = (weaponsData.weapons || []).map((w: Weapon) => ({
          ...w,
          rarity: weaponInfo[w.id]?.rarity,
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
      <Header />
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
