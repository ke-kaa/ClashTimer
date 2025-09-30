import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'my-dev-machine.local', 'animalistically-overboastful-lavenia.ngrok-free.dev'];

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: [
      ...ALLOWED_HOSTS
    ]
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
