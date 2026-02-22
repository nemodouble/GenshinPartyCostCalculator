import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import type { PartySlot, Character, Weapon, CostData } from '../types';
import { findCharacter, findWeapon, getAssetPath } from '../utils/helpers';
import { calculatePartyCost, calculateTotalCost, formatCost } from '../utils/cost-calculator';
import '../styles/CaptureDownload.css';

// 캐릭터 코스트만 계산
const getCharacterCost = (slot: PartySlot, costsRaw: any): number => {
  const charactersCostMap = costsRaw?.characters;
  if (slot.characterId && charactersCostMap && typeof charactersCostMap === 'object') {
    const charCost = charactersCostMap[slot.characterId];
    const arr = charCost?.constellation;
    if (Array.isArray(arr)) {
      const cost = arr[slot.constellationLevel];
      if (typeof cost === 'number') return cost;
    }
  }
  return 0;
};

// 무기 코스트만 계산
const getWeaponCost = (slot: PartySlot, costsRaw: any): number => {
  const weaponsCostMap = costsRaw?.weapons;
  if (slot.weaponId && weaponsCostMap && typeof weaponsCostMap === 'object') {
    const weaponCost = weaponsCostMap[slot.weaponId];
    const arr = weaponCost?.refine;
    if (Array.isArray(arr)) {
      const refineIndex = slot.refineLevel - 1;
      const cost = arr[refineIndex];
      if (typeof cost === 'number') return cost;
    }
  }
  return 0;
};

interface CaptureDownloadProps {
  party1: PartySlot[];
  party2: PartySlot[];
  characters: Character[];
  weapons: Weapon[];
  costs: CostData;
  costsRaw?: any;
}

// 이미지를 Base64로 변환하는 함수
const loadImageAsBase64 = async (url: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(url); // 실패시 원본 URL 반환
    img.src = url;
  });
};

const CaptureDownload: React.FC<CaptureDownloadProps> = ({
  party1,
  party2,
  characters,
  weapons,
  costs,
  costsRaw,
}) => {
  const captureRef = useRef<HTMLDivElement>(null);
  const modalBodyRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [imageCache, setImageCache] = useState<Record<string, string>>({});
  const [previewScale, setPreviewScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState<number | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [pendingAction, setPendingAction] = useState<'copy' | 'save' | null>(null);

  const party1Cost = calculatePartyCost(party1, characters, weapons, costsRaw || costs);
  const party2Cost = calculatePartyCost(party2, characters, weapons, costsRaw || costs);
  const totalCost = calculateTotalCost(party1, party2, characters, weapons, costsRaw || costs);

  // 미리보기 scale 계산
  useEffect(() => {
    if (!showPreview) {
      setPreviewScale(1);
      setScaledHeight(null);
      return;
    }

    const calculateScale = () => {
      if (!captureRef.current || !modalBodyRef.current) return;
      
      // 원본 크기를 얻기 위해 일시적으로 scale 제거
      captureRef.current.style.transform = 'scale(1)';
      
      const contentWidth = captureRef.current.offsetWidth;
      const contentHeight = captureRef.current.offsetHeight;
      const containerWidth = modalBodyRef.current.clientWidth;
      const padding = 30;
      
      if (contentWidth > 0 && containerWidth > 0) {
        const availableWidth = containerWidth - padding;
        const newScale = Math.min(1, availableWidth / contentWidth);
        setPreviewScale(newScale);
        setScaledHeight(contentHeight * newScale);
      }
    };
    
    // 초기 계산
    const timer = setTimeout(calculateScale, 50);
    
    // 리사이즈 이벤트
    window.addEventListener('resize', calculateScale);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateScale);
    };
  }, [showPreview]);

  // pendingAction 처리 - 모달이 열리고 DOM이 준비되면 동작 수행
  useEffect(() => {
    if (showPreview && pendingAction && captureRef.current) {
      const timer = setTimeout(async () => {
        if (pendingAction === 'copy') {
          await handleCopyToClipboard();
        } else if (pendingAction === 'save') {
          await handleSaveImage();
        }
        setPendingAction(null);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [showPreview, pendingAction]);

  // 파티에 사용된 이미지들을 미리 캐싱
  useEffect(() => {
    const loadImages = async () => {
      const allSlots = [...party1, ...party2];
      const urls: string[] = [];
      
      allSlots.forEach(slot => {
        const char = findCharacter(slot.characterId, characters);
        const weap = findWeapon(slot.weaponId, weapons);
        if (char?.icon) urls.push(getAssetPath(char.icon));
        if (weap?.icon) urls.push(getAssetPath(weap.icon));
      });

      const newCache: Record<string, string> = {};
      for (const url of urls) {
        if (!imageCache[url]) {
          newCache[url] = await loadImageAsBase64(url);
        }
      }
      
      if (Object.keys(newCache).length > 0) {
        setImageCache(prev => ({ ...prev, ...newCache }));
      }
    };

    loadImages();
  }, [party1, party2, characters, weapons]);

  // 미리보기 모달 열기
  const handleOpenPreview = () => {
    setIsCopied(false);
    setIsSaved(false);
    setPendingAction(null);
    setShowPreview(true);
  };

  // 클립보드 복사 버튼 클릭 - 모달 열고 바로 복사
  const handleOpenAndCopy = () => {
    setIsCopied(false);
    setIsSaved(false);
    setPendingAction('copy');
    setShowPreview(true);
  };

  // 이미지 저장 버튼 클릭 - 모달 열고 바로 저장
  const handleOpenAndSave = () => {
    setIsCopied(false);
    setIsSaved(false);
    setPendingAction('save');
    setShowPreview(true);
  };

  // 미리보기 모달 닫기
  const handleClosePreview = () => {
    setShowPreview(false);
    setIsCopied(false);
    setIsSaved(false);
    setPendingAction(null);
  };

  // 이미지 저장
  const handleSaveImage = async () => {
    if (!captureRef.current) return;

    setIsGenerating(true);

    // DOM이 렌더링될 때까지 대기
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: '#1a1a2e',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `genshin-party-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setIsSaved(true);
    } catch (error) {
      console.error('캡처 실패:', error);
      alert('이미지 생성에 실패했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  // 클립보드에 복사
  const handleCopyToClipboard = async () => {
    if (!captureRef.current) return;

    setIsGenerating(true);

    // DOM이 렌더링될 때까지 대기
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: '#1a1a2e',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            setIsCopied(true);
          } catch (clipboardError) {
            console.error('클립보드 복사 실패:', clipboardError);
            alert('클립보드 복사에 실패했습니다. 브라우저 권한을 확인해주세요.');
          }
        }
        setIsGenerating(false);
      }, 'image/png');
    } catch (error) {
      console.error('캡처 실패:', error);
      alert('이미지 생성에 실패했습니다.');
      setIsGenerating(false);
    }
  };

  // 모달 배경 클릭시 닫기
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClosePreview();
    }
  };

  // 캐시된 이미지 URL 가져오기
  const getCachedImage = (iconPath: string | undefined): string => {
    if (!iconPath) return '';
    const url = getAssetPath(iconPath);
    return imageCache[url] || url;
  };

  const renderSlot = (slot: PartySlot, index: number) => {
    const character = findCharacter(slot.characterId, characters);
    const weapon = findWeapon(slot.weaponId, weapons);

    if (!character) {
      return (
        <div key={index} className="capture-slot empty">
          <div className="capture-slot-empty">빈 슬롯</div>
        </div>
      );
    }

    const charRarityClass = character.rarity === 5 ? 'rarity-5' : character.rarity === 4 ? 'rarity-4' : '';
    const weaponRarityClass = weapon?.rarity === 5 ? 'rarity-5' : weapon?.rarity === 4 ? 'rarity-4' : '';
    const charCost = getCharacterCost(slot, costsRaw || costs);
    const weapCost = getWeaponCost(slot, costsRaw || costs);

    return (
      <div key={index} className="capture-slot">
        <div className="capture-character">
          <div className="capture-icon-wrapper">
            <img
              src={getCachedImage(character.icon)}
              alt={character.name}
              className={`capture-char-icon ${charRarityClass}`}
            />
            <span className="capture-constellation">C{slot.constellationLevel}</span>
            <span className="capture-char-cost">{formatCost(charCost)}</span>
          </div>
          <span className="capture-char-name">{character.name}</span>
        </div>
        {weapon && (
          <div className="capture-weapon">
            <div className="capture-icon-wrapper">
              <img
                src={getCachedImage(weapon.icon)}
                alt={weapon.name}
                className={`capture-weapon-icon ${weaponRarityClass}`}
              />
              <span className="capture-refine">R{slot.refineLevel}</span>
              <span className="capture-weapon-cost">{formatCost(weapCost)}</span>
            </div>
            <span className="capture-weapon-name">{weapon.name}</span>
          </div>
        )}
      </div>
    );
  };

  const renderParty = (slots: PartySlot[], partyNumber: number, partyCost: number) => (
    <div className="capture-party">
      <div className="capture-party-header">
        <span className="capture-party-title">파티 {partyNumber}</span>
        <span className="capture-party-cost">{formatCost(partyCost)}</span>
      </div>
      <div className="capture-slots">
        {slots.map((slot, index) => renderSlot(slot, index))}
      </div>
    </div>
  );

  return (
    <>
      <div className="capture-buttons-group">
        <button 
          className="capture-download-btn capture-preview-btn" 
          onClick={handleOpenPreview}
        >
          👁️ 미리보기
        </button>
        <button 
          className={`capture-download-btn capture-copy-btn ${isCopied ? 'completed' : ''}`}
          onClick={handleOpenAndCopy}
          disabled={isGenerating}
        >
          {isCopied ? '✓ 복사 완료' : '📋 클립보드 복사'}
        </button>
        <button 
          className={`capture-download-btn capture-save-btn ${isSaved ? 'completed' : ''}`}
          onClick={handleOpenAndSave}
          disabled={isGenerating}
        >
          {isSaved ? '✓ 저장 완료' : '💾 이미지 저장'}
        </button>
      </div>

      {/* 미리보기 모달 */}
      {showPreview && (
        <div className="capture-modal-overlay" onClick={handleOverlayClick}>
          <div className="capture-modal">
            <div className="capture-modal-header">
              <h3>이미지 미리보기</h3>
              <button className="capture-modal-close" onClick={handleClosePreview}>
                ✕
              </button>
            </div>
            
            <div 
              className="capture-modal-body" 
              ref={modalBodyRef}
              style={{ height: scaledHeight ? scaledHeight + 30 : 'auto' }}
            >
              <div 
                className="capture-content-wrapper"
                style={{ 
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <div 
                  ref={captureRef} 
                  className="capture-content"
                  style={{ 
                    transform: `scale(${previewScale})`, 
                    transformOrigin: 'top center'
                  }}
                >
                  <div className="capture-parties">
                    {renderParty(party1, 1, party1Cost)}
                    {renderParty(party2, 2, party2Cost)}
                  </div>

                  <div className="capture-total">
                    <span className="capture-total-label">총 코스트</span>
                    <span className="capture-total-value">{formatCost(totalCost)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="capture-modal-footer">
              <button 
                className="capture-modal-cancel" 
                onClick={handleClosePreview}
              >
                닫기
              </button>
              <button 
                className={`capture-modal-copy ${isCopied ? 'completed' : ''}`}
                onClick={handleCopyToClipboard}
                disabled={isGenerating}
              >
                {isGenerating ? '복사 중...' : isCopied ? '✓ 복사 완료' : '📋 클립보드 복사'}
              </button>
              <button 
                className={`capture-modal-save ${isSaved ? 'completed' : ''}`}
                onClick={handleSaveImage}
                disabled={isGenerating}
              >
                {isGenerating ? '저장 중...' : isSaved ? '✓ 저장 완료' : '💾 이미지 저장'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CaptureDownload;



