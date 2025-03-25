import { defineConfig } from "vite";
import commonjs from '@rollup/plugin-commonjs';

// https://vitejs.dev/config
export default defineConfig({
  build: {
    outDir: "dist/build",
    rollupOptions: {
      // 如果您的主进程需要使用native模块，请在这里添加
      external: [],
      plugins: [
        commonjs({
          dynamicRequireTargets: []
        })
      ]
    }
  },
}); 