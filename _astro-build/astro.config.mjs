
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://antivirusines.lt',
  trailingSlash: 'always',
  output: 'static',
  integrations: [tailwind()],
  build: {
    assets: '_assets',
    inlineStylesheets: 'auto',
  },
});
