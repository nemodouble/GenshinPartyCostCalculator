import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  publicDir: 'public',
  // 개발 모드에서는 /, 프로덕션(GitHub Pages)에서는 /GenshinPartyCostCalculator/
  base: mode === 'production' ? '/GenshinPartyCostCalculator/' : '/',
}))
