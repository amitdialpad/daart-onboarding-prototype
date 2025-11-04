import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command }) => ({
  plugins: [vue()],
  base: command === 'build' ? '/daart-onboarding-prototype-v2/' : '/',
  server: {
    port: 3000
  }
}))
