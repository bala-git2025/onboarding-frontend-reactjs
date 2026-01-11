import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import EnvironmentPlugin from "vite-plugin-environment";

export default defineConfig({
  plugins: [
    react(),
    EnvironmentPlugin(["VITE_API_BASE_URL", "VITE_ENV", "VITE_PORT"])
  ],
  server: {
    port: Number(process.env.VITE_PORT) || 3000,
    open: true
  },
  build: {
    outDir: "build",
    emptyOutDir: true,
    sourcemap: true
  },
  resolve: {
    alias: {
      "@": "/src"
    }
  }
});