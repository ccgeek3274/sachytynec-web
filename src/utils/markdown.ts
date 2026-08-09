import { satteri } from '@astrojs/markdown-satteri';

/**
 * Obrázkům doplní odložené načítání, ať dlouhá stránka s fotkami
 * nestahuje všechno naráz. Používá se pro texty stránek i pro aktuality.
 */
export const odlozeneObrazky = {
	name: 'odlozene-obrazky',
	element: {
		filter: ['img'],
		visit(node: any) {
			return {
				...node,
				properties: { ...node.properties, loading: 'lazy', decoding: 'async' },
			};
		},
	},
};

// Renderer se vytvoří jednou a sdílí se v celém buildu.
let renderer: Promise<{ render: (s: string) => Promise<{ code: string }> }> | undefined;

function ziskatRenderer() {
	renderer ??= satteri({ hastPlugins: [odlozeneObrazky] }).createRenderer({});
	return renderer;
}

/**
 * Vykreslí Markdown uložený ve frontmatteru (např. text aktuality) na HTML.
 * Astro samo renderuje jen tělo souboru, jednotlivá pole si musíme přeložit sami.
 */
export async function markdownNaHtml(text: string): Promise<string> {
	if (!text?.trim()) return '';
	const { code } = await (await ziskatRenderer()).render(text);
	return code;
}
