// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Statický web, žádné serverové funkce – výstup jde rovnou na Cloudflare Pages.
export default defineConfig({
	site: 'https://www.sachytynec.cz',
	output: 'static',
	integrations: [sitemap()],
	build: {
		// /o-oddile/index.html – hezké adresy bez .html
		format: 'directory',
	},
});
