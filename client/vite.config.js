import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: "./postcss.config.js",
  },
  optimizeDeps: {},
  server: {
    proxy: {
      "/api": {
        target:
          process.env.NODE_ENV === "production"
            ? "https://refine.fly.dev"
            : "http://localhost:3000",
        changeOrigin: true,
        secure: true,
      },
    },
  },
  publicDir: "public",
});
