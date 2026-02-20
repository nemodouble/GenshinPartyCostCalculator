import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  // GitHub Pages 배포 시 리포지토리 이름을 base로 설정
  // 예: https://username.github.io/GenshinCostCalculator/
  base: '/GenshinCostCalculator/',
})
