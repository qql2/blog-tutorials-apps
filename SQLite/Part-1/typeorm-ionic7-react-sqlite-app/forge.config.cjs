const path = require('path');

/** @type {import('@electron-forge/shared-types').ForgeConfig} */
module.exports = {
  packagerConfig: {
    asar: false,
    ignore: [
      '/src',
      '/private',
      '/.vite',
      '^/dist/(?!build|renderer).*'
    ],
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-vite',
      config: {
        // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
        build: [
          {
            // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
            entry: 'electron/main.ts',
            config: 'vite.main.config.ts',
            target: "main",
          },
          {
            entry: 'electron/preload.ts',
            config: 'vite.preload.config.ts',
            target: "preload",
          },
        ],
        renderer: [
          {
            name: 'main_window',
            config: 'vite.renderer.config.ts',
          },
        ],
      },
    },
    {
      name: '@electron-forge/plugin-fuses',
      config: {
        version: 1,
        // Options below are all the defaults
        'run-as-node': false,
        'enable-cookie-encryption': true,
        'enable-node-options-environment-variable': false,
        'enable-node-cli-inspect-arguments': false,
        'enable-embedded-asar-integrity-validation': true,
        'only-load-app-from-asar': true,
      }
    }
  ],
}; 