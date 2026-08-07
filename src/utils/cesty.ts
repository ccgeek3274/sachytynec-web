/**
 * Adresu stránky určuje pole „slug" ve frontmatteru, ne název souboru –
 * díky tomu jde adresa měnit přímo v Pages CMS.
 * Výjimka: stránka se slugem „domu" je domovská stránka na „/".
 */
export const DOMOVSKA_STRANKA = 'domu';

export function cestaKeStrance(slug: string): string {
	return slug === DOMOVSKA_STRANKA ? '/' : `/${slug}`;
}
