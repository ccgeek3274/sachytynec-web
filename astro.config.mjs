// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { odlozeneObrazky } from './src/utils/markdown.ts';

// Statický web, žádné serverové funkce – výstup jde rovnou na Cloudflare Pages.
export default defineConfig({
	site: 'https://www.sachytynec.cz',
	output: 'static',
	integrations: [sitemap()],
	markdown: {
		// Stejné zpracování jako u aktualit – obrázky se načítají odloženě.
		processor: satteri({ hastPlugins: [odlozeneObrazky] }),
	},
	build: {
		// /o-oddile/index.html – hezké adresy bez .html
		format: 'directory',
	},
});
