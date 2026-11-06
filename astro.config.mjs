import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://kimhands.github.io',
  integrations: [sitemap()],
});
