import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Obsahový model webu.
 *
 * Pole odpovídají tomu, co nabízí Pages CMS v souboru .pages.yml v kořeni repa.
 * Když sem přidáte nové pole, přidejte ho i tam (a naopak).
 */

// Textové stránky webu. Adresu určuje pole „slug" (o-oddile → /o-oddile).
const stranky = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/stranky' }),
	schema: z.object({
		titulek: z.string(),
		// Jen malá písmena bez diakritiky, číslice a pomlčky. Musí být na webu jedinečné.
		slug: z
			.string()
			.regex(/^[a-z0-9-]+$/, 'Slug smí obsahovat jen malá písmena bez diakritiky, číslice a pomlčky'),
		nazev_v_menu: z.string(),
		poradi_v_menu: z.number().default(99),
		zobrazit_v_menu: z.boolean().default(true),
		perex: z.string().optional(),
		popis_pro_vyhledavace: z.string().optional(),
		// Připojí pod text stránky automaticky generovaný blok.
		sekce: z.enum(['zadna', 'druzstva', 'kontakty']).default('zadna'),
	}),
});

// Jedno družstvo = jeden soubor. Výsledky a tabulky nedržíme, jen odkazujeme na svaz.
const druzstva = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/druzstva' }),
	schema: z.object({
		nazev: z.string(),
		soutez: z.string(),
		poradi: z.number().default(99),
		kapitan: z.string().optional(),
		hraci_den: z.string().optional(),
		odkaz_vysledky: z.url().optional(),
		odkaz_soupiska: z.url().optional(),
	}),
});

// Jedna kontaktní osoba = jeden soubor.
const kontakty = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/kontakty' }),
	schema: z.object({
		jmeno: z.string(),
		role: z.string(),
		email: z.string().optional(),
		telefon: z.string().optional(),
		poradi: z.number().default(99),
	}),
});

export const collections = { stranky, druzstva, kontakty };
