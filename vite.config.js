import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command }) => ({
  plugins: [vue()],
  base: command === 'build' ? '/daart-onboarding-prototype/' : '/',
  server: {
    port: 3000
  }
}))
