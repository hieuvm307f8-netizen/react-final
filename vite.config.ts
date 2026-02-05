import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"
import tailwindcss from "@tailwindcss/vite"


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Khi bạn gọi tới /api, Vite sẽ chuyển hướng tới server F8
      '/api': {
        target: 'https://instagram.f8team.dev',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
