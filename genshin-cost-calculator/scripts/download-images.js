const fs = require('fs');
const path = require('path');
const https = require('https');

// 이미지를 다운로드하고 저장하는 함수
function downloadImage(url, filePath) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(filePath);
    
    // 디렉토리가 없으면 생성
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const file = fs.createWriteStream(filePath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // 실패 시 파일 삭제
      reject(err);
    });
  });
}

// 캐릭터 이미지 다운로드
async function downloadCharacterImages() {
  const charactersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/data/characters.json'), 'utf8'));
  
  console.log('캐릭터 이미지 다운로드 중...');
  
  for (const character of charactersData.characters) {
    const fileName = character.id + '.png';
    const filePath = path.join(__dirname, '../public/images/characters', fileName);
    
    // 이미지 URL에서 캐릭터 ID 추출
    const urlParts = character.icon.split('_');
    const characterName = urlParts[urlParts.length - 1].replace('.png', '');
    const imageUrl = `https://gi.yatta.moe/assets/UI/UI_AvatarIcon_${characterName}.png`;
    
    try {
      await downloadImage(imageUrl, filePath);
      console.log(`✓ ${character.name} (${fileName})`);
    } catch (err) {
      console.error(`✗ ${character.name}: ${err.message}`);
    }
  }
  
  console.log('캐릭터 이미지 다운로드 완료!');
}

// 무기 이미지 다운로드
async function downloadWeaponImages() {
  const weaponsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/data/weapons.json'), 'utf8'));
  
  console.log('무기 이미지 다운로드 중...');
  
  for (const weapon of weaponsData.weapons) {
    const fileName = weapon.id + '.png';
    const filePath = path.join(__dirname, '../public/images/weapons', fileName);
    
    // 무기 이미지 URL 생성
    const urlMatch = weapon.icon.match(/UI_EquipIcon_(.+?)\.png/);
    if (urlMatch) {
      const imageUrl = `https://gi.yatta.moe/assets/UI/UI_EquipIcon_${urlMatch[1]}.png`;
      
      try {
        await downloadImage(imageUrl, filePath);
        console.log(`✓ ${weapon.name} (${fileName})`);
      } catch (err) {
        console.error(`✗ ${weapon.name}: ${err.message}`);
      }
    }
  }
  
  console.log('무기 이미지 다운로드 완료!');
}

// 메인 함수
async function main() {
  try {
    await downloadCharacterImages();
    await downloadWeaponImages();
    console.log('\n✅ 모든 이미지 다운로드 완료!');
  } catch (err) {
    console.error('에러:', err);
    process.exit(1);
  }
}

main();
