import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// No TailwindCSS import here!

export default defineConfig({
  plugins: [react(),tailwindcss()],
})
