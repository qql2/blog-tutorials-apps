import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import legacy from '@vitejs/plugin-legacy';
import swc from 'unplugin-swc';

// https://vitejs.dev/config
export default defineConfig({
  plugins: [
    react(),
    legacy(),
    swc.vite({
      exclude: [], //Default would exclude all file from ``node_modules``
      jsc: {
        minify: {
          compress: true,
          mangle: true,
          //Suggested by ``capacitor-sqlite``
          keep_classnames: true,
          keep_fnames: true,
        },
      },
    }),
  ],
  build: { 
    outDir: "dist/renderer",
    emptyOutDir: true 
  },
  base: './'
}); 