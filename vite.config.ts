import { defineConfig } from 'vite'
import path from 'path';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite()],
  build: {
    minify: "terser",
    cssMinify: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
