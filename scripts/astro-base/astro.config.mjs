import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://antivirusines.lt',
  trailingSlash: 'always',
  output: 'static',
  build: {
    assets: '_assets',
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      cssMinify: true,
    },
  },
});
