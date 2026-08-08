/**
 * Adresu stránky určuje pole „slug" ve frontmatteru, ne název souboru –
 * díky tomu jde adresa měnit přímo v Pages CMS.
 * Výjimka: stránka se slugem „domu" je domovská stránka na „/".
 */
export const DOMOVSKA_STRANKA = 'domu';

/**
 * Odkazy končí lomítkem záměrně: Astro generuje /trenink/index.html a hosting
 * by adresu bez lomítka jen přesměrovával. Takhle se na nic neproklikáváte dvakrát.
 */
export function cestaKeStrance(slug: string): string {
	return slug === DOMOVSKA_STRANKA ? '/' : `/${slug}/`;
}

/** Sjednotí tvar adresy pro porovnávání (/trenink/ i /trenink → /trenink). */
export function normalizovanaCesta(cesta: string): string {
	return cesta.replace(/\/+$/, '') || '/';
}
