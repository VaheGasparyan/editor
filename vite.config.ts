import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"
import copy from "rollup-plugin-copy"

export default defineConfig({
  // Set base path to match subdirectory deployment
  base: "/editor/",

  plugins: [
    react(),
    tsconfigPaths(),

    // Copy fonts to final dist folder for serving
    copy({
      targets: [{ src: "src/fonts", dest: "dist" }],
      hook: "writeBundle",
    }),
  ],

  build: {
    // Disable code splitting to make deployment simpler
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    sourcemap: false,

    // Optional: Set output dir if using custom CI3 folders
    outDir: "dist", // or 'public/editor' if you want to directly move to CI3's public folder
    assetsDir: "assets", // put fonts/images/css in /editor/assets/
  },
})
