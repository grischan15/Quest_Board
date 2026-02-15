import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// DEPLOY_TARGET steuert den base-Pfad:
//   - nicht gesetzt / 'github-pages' → /Quest_Board/ (GitHub Pages)
//   - 'allinkl'                      → /quest-board/ (apps.p3coaching.de)
//   - development                    → / (lokaler Dev-Server)
export default defineConfig(({ mode }) => {
  const target = process.env.DEPLOY_TARGET || 'github-pages'

  let base = '/'
  if (mode === 'production') {
    if (target === 'allinkl') {
      base = '/quest-board/'
    } else {
      base = '/Quest_Board/'
    }
  }

  return {
    plugins: [react()],
    base,
  }
})
